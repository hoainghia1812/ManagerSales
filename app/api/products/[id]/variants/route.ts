import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createVariantSchema } from "@/lib/validators";
import { ok, fail, handleError } from "@/lib/api-helpers";

type Params = { params: Promise<{ id: string }> };

// GET /api/products/:id/variants — List variants of a product
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("product_variants")
      .select("*")
      .eq("product_id", id)
      .order("created_at", { ascending: true });

    if (error) return fail(error.message, 500);

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/products/:id/variants — Add variant to product
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = createVariantSchema.parse(body);

    // Verify product exists
    const { error: pErr } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (pErr) return fail("Sản phẩm không tồn tại", 404);

    const { data, error } = await supabaseAdmin
      .from("product_variants")
      .insert({ ...validated, product_id: id })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return fail("SKU đã tồn tại", 409);
      return fail(error.message, 500);
    }

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}
