import { supabaseAdmin } from "@/lib/supabase/server";
import { createPaymentSchema } from "@/lib/validators";
import { ok, paginated, fail, handleError, parsePagination, toRange, buildPaginationMeta } from "@/lib/api-helpers";

// GET /api/payments — List payments with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parsePagination(searchParams);
    const { from, to } = toRange(params);
    const orderId = searchParams.get("order_id");

    let query = supabaseAdmin
      .from("payments")
      .select("*, orders(order_code, customer_id, customers(full_name))", { count: "exact" })
      .order(params.sort, { ascending: params.order === "asc" })
      .range(from, to);

    if (orderId) {
      query = query.eq("order_id", orderId);
    }

    const { data, count, error } = await query;

    if (error) return fail(error.message, 500);

    return paginated(data ?? [], buildPaginationMeta(count ?? 0, params));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/payments — Record a payment + update order payment_status
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createPaymentSchema.parse(body);

    // Verify order exists and get current total
    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .select("id, total_amount, payment_status")
      .eq("id", validated.order_id)
      .single();

    if (oErr || !order) return fail("Đơn hàng không tồn tại", 404);

    // Create payment
    const { data: payment, error: pErr } = await supabaseAdmin
      .from("payments")
      .insert({
        ...validated,
        status: "completed",
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (pErr) return fail(pErr.message, 500);

    // Calculate total paid for this order
    const { data: allPayments } = await supabaseAdmin
      .from("payments")
      .select("amount")
      .eq("order_id", validated.order_id)
      .eq("status", "completed");

    const totalPaid = (allPayments ?? []).reduce(
      (sum, p) => sum + (p.amount ?? 0),
      0
    );

    // Auto-update order payment_status
    const newPaymentStatus =
      totalPaid >= order.total_amount
        ? "paid"
        : totalPaid > 0
          ? "partial"
          : "unpaid";

    await supabaseAdmin
      .from("orders")
      .update({ payment_status: newPaymentStatus })
      .eq("id", validated.order_id);

    return ok({ ...payment, order_payment_status: newPaymentStatus }, 201);
  } catch (error) {
    return handleError(error);
  }
}
