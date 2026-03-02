import { supabasePublic } from "@/lib/supabase/public-server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createProductSchema } from "@/lib/validators";
import { generateSlug } from "@/lib/api-helpers";
import { parsePagination, toRange, buildPaginationMeta } from "@/lib/api-helpers";
import { publicJson, publicOptions } from "@/lib/public-api";

export async function OPTIONS() {
  return publicOptions();
}

// Public GET /api/public/products
// Supports: search, category_id, is_active
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parsePagination(searchParams);
    const { from, to } = toRange(params);

    const categoryId = searchParams.get("category_id");
    const isActive = searchParams.get("is_active");

    let query = supabasePublic()
      .from("products")
      .select(
        `
        id,name,slug,description,category_id,base_price,is_active,created_at,updated_at,
        categories(id,name,slug),
        product_variants(id,sku,color,size,price,image_url,created_at)
      `,
        { count: "exact" }
      )
      .order(params.sort, { ascending: params.order === "asc" })
      .range(from, to);

    if (params.search) {
      query = query.or(
        `name.ilike.%${params.search}%,slug.ilike.%${params.search}%`
      );
    }
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }
    if (isActive !== null && isActive !== undefined) {
      query = query.eq("is_active", isActive === "true");
    }

    const { data, count, error } = await query;

    if (error) {
      return publicJson({ error: error.message }, { status: 500 });
    }

    return publicJson({
      data: data ?? [],
      pagination: buildPaginationMeta(count ?? 0, params),
    });
  } catch {
    return publicJson({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

// Public POST /api/public/products
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createProductSchema.parse(body);

    const { variants, ...productData } = validated;
    const slug = productData.slug || generateSlug(productData.name);

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .insert({ ...productData, slug })
      .select("*, categories(*), product_variants(*)")
      .single();

    if (productError || !product) {
      const status = productError?.code === "23505" ? 409 : 500;
      return publicJson(
        { error: status === 409 ? "Slug sản phẩm đã tồn tại" : (productError?.message ?? "Không thể tạo sản phẩm") },
        { status }
      );
    }

    let createdVariants: unknown[] = [];
    if (variants && variants.length > 0) {
      const rows = variants.map((v) => ({ ...v, product_id: product.id }));
      const { data: vData, error: vError } = await supabaseAdmin
        .from("product_variants")
        .insert(rows)
        .select();

      if (vError) {
        await supabaseAdmin.from("products").delete().eq("id", product.id);
        const status = vError.code === "23505" ? 409 : 500;
        return publicJson(
          { error: status === 409 ? "SKU biến thể bị trùng" : vError.message },
          { status }
        );
      }

      createdVariants = vData ?? [];
    }

    return publicJson(
      { data: { ...product, product_variants: createdVariants } },
      { status: 201 }
    );
  } catch {
    return publicJson({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

