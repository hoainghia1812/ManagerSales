import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { updateCustomerSchema } from "@/lib/validators";
import { ok, fail, handleError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

// GET /api/customers/:id — Get customer with order stats
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("customers")
      .select("*, orders(id, order_code, total_amount, status, created_at)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return fail("Khách hàng không tồn tại", 404);
      return fail(error.message, 500);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/customers/:id
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateCustomerSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("customers")
      .update(validated)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") return fail("Khách hàng không tồn tại", 404);
      return fail(error.message, 500);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/customers/:id
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) return fail(error.message, 500);

    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
