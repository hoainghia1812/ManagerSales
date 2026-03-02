import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createCategorySchema } from "@/lib/validators";
import { ok, paginated, fail, handleError, parsePagination, toRange, buildPaginationMeta, generateSlug } from "@/lib/api-helpers";

// GET /api/categories — List categories with pagination
export async function GET(request: NextRequest) {
  try {
    const params = parsePagination(request.nextUrl.searchParams);
    const { from, to } = toRange(params);

    let query = supabaseAdmin
      .from("categories")
      .select("*", { count: "exact" })
      .order(params.sort, { ascending: params.order === "asc" })
      .range(from, to);

    if (params.search) {
      query = query.ilike("name", `%${params.search}%`);
    }

    const { data, count, error } = await query;

    if (error) return fail(error.message, 500);

    return paginated(data ?? [], buildPaginationMeta(count ?? 0, params));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/categories — Create a category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createCategorySchema.parse(body);

    const slug = validated.slug || generateSlug(validated.name);

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert({ ...validated, slug })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return fail("Slug đã tồn tại", 409);
      return fail(error.message, 500);
    }

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}
