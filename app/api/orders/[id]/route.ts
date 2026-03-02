import { supabaseAdmin } from "@/lib/supabase/server";
import { updateOrderStatusSchema, updatePaymentStatusSchema } from "@/lib/validators";
import { ok, fail, handleError } from "@/lib/api-helpers";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const updateOrderSchema = z.object({
  status: updateOrderStatusSchema.shape.status.optional(),
  payment_status: updatePaymentStatusSchema.shape.payment_status.optional(),
  note: z.string().max(500).nullable().optional(),
});

// GET /api/orders/:id — Full order details
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, customers(*), order_items(*, product_variants(*, products(*))), payments(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return fail("Đơn hàng không tồn tại", 404);
      return fail(error.message, 500);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/orders/:id — Update status / payment_status / note
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateOrderSchema.parse(body);

    // If cancelling, restore stock via trigger (delete order_items will trigger restore)
    if (validated.status === "cancelled") {
      const { data: existing } = await supabaseAdmin
        .from("orders")
        .select("status")
        .eq("id", id)
        .single();

      if (existing?.status === "cancelled") {
        return fail("Đơn hàng đã bị huỷ trước đó", 400);
      }
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(validated)
      .eq("id", id)
      .select("*, customers(*), order_items(*, product_variants(*, products(*))), payments(*)")
      .single();

    if (error) {
      if (error.code === "PGRST116") return fail("Đơn hàng không tồn tại", 404);
      return fail(error.message, 500);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/orders/:id — Delete order (triggers restore stock for items)
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    // Delete order items first (triggers stock restore)
    await supabaseAdmin.from("order_items").delete().eq("order_id", id);

    // Delete payments
    await supabaseAdmin.from("payments").delete().eq("order_id", id);

    // Delete order
    const { error } = await supabaseAdmin.from("orders").delete().eq("id", id);

    if (error) return fail(error.message, 500);

    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
