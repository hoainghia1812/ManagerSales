import { supabasePublic } from "@/lib/supabase/public-server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createCategorySchema } from "@/lib/validators";
import { generateSlug, parsePagination, toRange, buildPaginationMeta } from "@/lib/api-helpers";
import { publicJson, publicOptions } from "@/lib/public-api";

export async function OPTIONS() {
  return publicOptions();
}

// Public GET /api/public/categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parsePagination(searchParams);
    const { from, to } = toRange(params);

    let query = supabasePublic()
      .from("categories")
      .select("id,name,slug,description,created_at", { count: "exact" })
      .order(params.sort, { ascending: params.order === "asc" })
      .range(from, to);

    if (params.search) {
      query = query.ilike("name", `%${params.search}%`);
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

// Public POST /api/public/categories
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createCategorySchema.parse(body);
    const slug = validated.slug || generateSlug(validated.name);

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert({ ...validated, slug })
      .select("id,name,slug,description,created_at")
      .single();

    if (error) {
      const status = error.code === "23505" ? 409 : 500;
      return publicJson(
        { error: status === 409 ? "Slug đã tồn tại" : error.message },
        { status }
      );
    }

    return publicJson({ data }, { status: 201 });
  } catch {
    return publicJson({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

