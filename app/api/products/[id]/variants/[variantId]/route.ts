import { supabaseAdmin } from "@/lib/supabase/server";
import { updateVariantSchema } from "@/lib/validators";
import { ok, fail, handleError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string; variantId: string }> };

// PUT /api/products/:id/variants/:variantId
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id, variantId } = await params;
    const body = await request.json();
    const validated = updateVariantSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("product_variants")
      .update(validated)
      .eq("id", variantId)
      .eq("product_id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") return fail("Biến thể không tồn tại", 404);
      if (error.code === "23505") return fail("SKU đã tồn tại", 409);
      return fail(error.message, 500);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/products/:id/variants/:variantId
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id, variantId } = await params;

    const { error } = await supabaseAdmin
      .from("product_variants")
      .delete()
      .eq("id", variantId)
      .eq("product_id", id);

    if (error) return fail(error.message, 500);

    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
