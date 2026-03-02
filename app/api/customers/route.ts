import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createCustomerSchema } from "@/lib/validators";
import { ok, paginated, fail, handleError, parsePagination, toRange, buildPaginationMeta } from "@/lib/api-helpers";

// GET /api/customers — List customers with search + pagination
export async function GET(request: NextRequest) {
  try {
    const params = parsePagination(request.nextUrl.searchParams);
    const { from, to } = toRange(params);

    let query = supabaseAdmin
      .from("customers")
      .select("*", { count: "exact" })
      .order(params.sort, { ascending: params.order === "asc" })
      .range(from, to);

    if (params.search) {
      query = query.or(
        `full_name.ilike.%${params.search}%,phone.ilike.%${params.search}%,email.ilike.%${params.search}%`
      );
    }

    const { data, count, error } = await query;

    if (error) return fail(error.message, 500);

    return paginated(data ?? [], buildPaginationMeta(count ?? 0, params));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/customers — Create a customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createCustomerSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("customers")
      .insert(validated)
      .select()
      .single();

    if (error) return fail(error.message, 500);

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}
