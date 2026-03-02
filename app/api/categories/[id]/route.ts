import { supabaseAdmin } from "@/lib/supabase/server";
import { updateCategorySchema } from "@/lib/validators";
import { ok, fail, handleError, generateSlug } from "@/lib/api-helpers";

type CategoryParams = { params: Promise<{ id: string }> };

// GET /api/categories/:id
export async function GET(
  _request: Request,
  { params }: CategoryParams
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return fail("Danh mục không tồn tại", 404);
      }
      return fail(error.message, 500);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/categories/:id
export async function PUT(
  request: Request,
  { params }: CategoryParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateCategorySchema.parse(body);

    if (validated.name && !validated.slug) {
      validated.slug = generateSlug(validated.name);
    }

    const { data, error } = await supabaseAdmin
      .from("categories")
      .update(validated)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return fail("Danh mục không tồn tại", 404);
      }
      if (error.code === "23505") {
        return fail("Slug đã tồn tại", 409);
      }
      return fail(error.message, 500);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/categories/:id
export async function DELETE(
  _request: Request,
  { params }: CategoryParams
) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) return fail(error.message, 500);

    return ok({ deleted: true });
  } catch (error) {
    return handleError(error);
  }
}