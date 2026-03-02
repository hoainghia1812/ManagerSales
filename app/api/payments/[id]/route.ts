import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { updatePaymentSchema } from "@/lib/validators";
import { ok, fail, handleError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

// GET /api/payments/:id
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("payments")
      .select("*, orders(order_code, customers(full_name))")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return fail("Thanh toán không tồn tại", 404);
      return fail(error.message, 500);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/payments/:id — Update payment status
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updatePaymentSchema.parse(body);

    const updateData: Record<string, unknown> = { status: validated.status };
    if (validated.status === "completed") {
      updateData.paid_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("payments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") return fail("Thanh toán không tồn tại", 404);
      return fail(error.message, 500);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
