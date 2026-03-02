import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createOrderSchema } from "@/lib/validators";
import { ok, paginated, fail, handleError, parsePagination, toRange, buildPaginationMeta } from "@/lib/api-helpers";

// GET /api/orders — List orders with customer + items + payments
export async function GET(request: NextRequest) {
  try {
    const params = parsePagination(request.nextUrl.searchParams);
    const { from, to } = toRange(params);
    const status = request.nextUrl.searchParams.get("status");
    const paymentStatus = request.nextUrl.searchParams.get("payment_status");

    let query = supabaseAdmin
      .from("orders")
      .select(
        "*, customers(*), order_items(*, product_variants(*, products(*))), payments(*)",
        { count: "exact" }
      )
      .order(params.sort, { ascending: params.order === "asc" })
      .range(from, to);

    if (params.search) {
      query = query.or(`order_code.ilike.%${params.search}%`);
    }
    if (status) {
      query = query.eq("status", status);
    }
    if (paymentStatus) {
      query = query.eq("payment_status", paymentStatus);
    }

    const { data, count, error } = await query;

    if (error) return fail(error.message, 500);

    return paginated(data ?? [], buildPaginationMeta(count ?? 0, params));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/orders — Create order with items via RPC (atomic transaction)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    // Call the RPC function for atomic order creation
    const { data: orderId, error: rpcError } = await supabaseAdmin.rpc(
      "create_order_with_items",
      {
        p_customer_id: validated.customer_id,
        p_note: validated.note ?? "",
        p_items: validated.items,
      }
    );

    if (rpcError) {
      // Parse specific errors from the RPC function
      const msg = rpcError.message;
      if (msg.includes("Not enough stock")) {
        return fail("Không đủ tồn kho", 409, msg);
      }
      if (msg.includes("not found")) {
        return fail("Biến thể sản phẩm không tồn tại", 404, msg);
      }
      return fail("Không thể tạo đơn hàng", 500, msg);
    }

    // Fetch the created order with all relations
    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*, customers(*), order_items(*, product_variants(*, products(*))), payments(*)")
      .eq("id", orderId)
      .single();

    if (fetchError) return fail(fetchError.message, 500);

    return ok(order, 201);
  } catch (error) {
    return handleError(error);
  }
}
