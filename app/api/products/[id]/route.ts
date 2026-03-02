import { supabaseAdmin } from "@/lib/supabase/server";
import { updateProductSchema } from "@/lib/validators";
import { ok, fail, handleError, generateSlug } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

// GET /api/products/:id — Get product with category + variants
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, categories(*), product_variants(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return fail("Sản phẩm không tồn tại", 404);
      return fail(error.message, 500);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/products/:id — Update product fields (not variants)
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateProductSchema.parse(body);

    if (validated.name && !validated.slug) {
      validated.slug = generateSlug(validated.name);
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .update({ ...validated, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*, categories(*), product_variants(*)")
      .single();

    if (error) {
      if (error.code === "PGRST116") return fail("Sản phẩm không tồn tại", 404);
      if (error.code === "23505") return fail("Slug đã tồn tại", 409);
      return fail(error.message, 500);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/products/:id — Cascade deletes variants
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (error) return fail(error.message, 500);

    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}
