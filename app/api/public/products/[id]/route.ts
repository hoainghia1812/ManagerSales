import { supabasePublic } from "@/lib/supabase/public-server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { updateProductSchema } from "@/lib/validators";
import { generateSlug } from "@/lib/api-helpers";
import { publicJson, publicOptions } from "@/lib/public-api";

type Params = { params: Promise<{ id: string }> };

export async function OPTIONS() {
  return publicOptions();
}

// Public GET /api/public/products/:id
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const { data, error } = await supabasePublic()
      .from("products")
      .select(
        `
        id,name,slug,description,category_id,base_price,is_active,created_at,updated_at,
        categories(id,name,slug),
        product_variants(id,sku,color,size,price,image_url,created_at)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      const status = error.code === "PGRST116" ? 404 : 500;
      return publicJson(
        { error: status === 404 ? "Sản phẩm không tồn tại" : error.message },
        { status }
      );
    }

    return publicJson({ data });
  } catch {
    return publicJson({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

// Public PUT /api/public/products/:id
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
      .select(
        `
        id,name,slug,description,category_id,base_price,is_active,created_at,updated_at,
        categories(id,name,slug),
        product_variants(id,sku,color,size,price,image_url,created_at)
      `
      )
      .single();

    if (error) {
      const status =
        error.code === "PGRST116" ? 404 : error.code === "23505" ? 409 : 500;
      return publicJson(
        {
          error:
            status === 404
              ? "Sản phẩm không tồn tại"
              : status === 409
                ? "Slug đã tồn tại"
                : error.message,
        },
        { status }
      );
    }

    return publicJson({ data });
  } catch {
    return publicJson({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

// Public DELETE /api/public/products/:id
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) {
      return publicJson({ error: error.message }, { status: 500 });
    }

    return publicJson({ deleted: true });
  } catch {
    return publicJson({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

