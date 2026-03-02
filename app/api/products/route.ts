import { supabaseAdmin } from "@/lib/supabase/server";
import { createProductSchema } from "@/lib/validators";
import { ok, paginated, fail, handleError, parsePagination, toRange, buildPaginationMeta, generateSlug } from "@/lib/api-helpers";

// GET /api/products — List products with variants + category, paginated
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parsePagination(searchParams);
    const { from, to } = toRange(params);
    const categoryId = searchParams.get("category_id");
    const isActive = searchParams.get("is_active");

    let query = supabaseAdmin
      .from("products")
      .select("*, categories(*), product_variants(*)", { count: "exact" })
      .order(params.sort, { ascending: params.order === "asc" })
      .range(from, to);

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,slug.ilike.%${params.search}%`);
    }
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }
    if (isActive !== null && isActive !== undefined) {
      query = query.eq("is_active", isActive === "true");
    }

    const { data, count, error } = await query;

    if (error) return fail(error.message, 500);

    return paginated(data ?? [], buildPaginationMeta(count ?? 0, params));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/products — Create product with optional variants
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createProductSchema.parse(body);

    const { variants, ...productData } = validated;
    const slug = productData.slug || generateSlug(productData.name);

    // Insert product
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .insert({ ...productData, slug })
      .select()
      .single();

    if (productError) {
      if (productError.code === "23505") return fail("Slug sản phẩm đã tồn tại", 409);
      return fail(productError.message, 500);
    }

    // Insert variants if provided
    let createdVariants = null;
    if (variants && variants.length > 0) {
      const variantRows = variants.map((v) => ({
        ...v,
        product_id: product.id,
      }));

      const { data: vData, error: vError } = await supabaseAdmin
        .from("product_variants")
        .insert(variantRows)
        .select();

      if (vError) {
        // Rollback product if variants fail
        await supabaseAdmin.from("products").delete().eq("id", product.id);
        if (vError.code === "23505") return fail("SKU biến thể bị trùng", 409);
        return fail(vError.message, 500);
      }

      createdVariants = vData;
    }

    return ok({ ...product, product_variants: createdVariants ?? [] }, 201);
  } catch (error) {
    return handleError(error);
  }
}
