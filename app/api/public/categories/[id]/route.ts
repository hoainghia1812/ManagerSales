import { supabasePublic } from "@/lib/supabase/public-server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { updateCategorySchema } from "@/lib/validators";
import { generateSlug } from "@/lib/api-helpers";
import { publicJson, publicOptions } from "@/lib/public-api";

type Params = { params: Promise<{ id: string }> };

export async function OPTIONS() {
  return publicOptions();
}

// Public GET /api/public/categories/:id
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const { data, error } = await supabasePublic()
      .from("categories")
      .select("id,name,slug,description,created_at")
      .eq("id", id)
      .single();

    if (error) {
      const status = error.code === "PGRST116" ? 404 : 500;
      return publicJson({ error: status === 404 ? "Danh mục không tồn tại" : error.message }, { status });
    }

    return publicJson({ data });
  } catch {
    return publicJson({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

// Public PUT /api/public/categories/:id
export async function PUT(request: Request, { params }: Params) {
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
      .select("id,name,slug,description,created_at")
      .single();

    if (error) {
      const status =
        error.code === "PGRST116" ? 404 : error.code === "23505" ? 409 : 500;
      return publicJson(
        {
          error:
            status === 404
              ? "Danh mục không tồn tại"
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

// Public DELETE /api/public/categories/:id
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
    if (error) {
      return publicJson({ error: error.message }, { status: 500 });
    }

    return publicJson({ deleted: true });
  } catch {
    return publicJson({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

