import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createInventoryLogSchema } from "@/lib/validators";
import { ok, paginated, fail, handleError, parsePagination, toRange, buildPaginationMeta } from "@/lib/api-helpers";

// GET /api/inventory — List inventory logs with variant info
export async function GET(request: NextRequest) {
  try {
    const params = parsePagination(request.nextUrl.searchParams);
    const { from, to } = toRange(params);
    const changeType = request.nextUrl.searchParams.get("change_type");
    const variantId = request.nextUrl.searchParams.get("variant_id");

    let query = supabaseAdmin
      .from("inventory_logs")
      .select("*, product_variants(*, products(name))", { count: "exact" })
      .order(params.sort, { ascending: params.order === "asc" })
      .range(from, to);

    if (changeType) {
      query = query.eq("change_type", changeType);
    }
    if (variantId) {
      query = query.eq("variant_id", variantId);
    }

    const { data, count, error } = await query;

    if (error) return fail(error.message, 500);

    return paginated(data ?? [], buildPaginationMeta(count ?? 0, params));
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/inventory — Manual stock adjustment (restock / adjustment)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createInventoryLogSchema.parse(body);

    // Verify variant exists
    const { data: variant, error: vErr } = await supabaseAdmin
      .from("product_variants")
      .select("id, stock_quantity")
      .eq("id", validated.variant_id)
      .single();

    if (vErr || !variant) return fail("Biến thể không tồn tại", 404);

    // Prevent stock going negative
    const newStock = variant.stock_quantity + validated.quantity_changed;
    if (newStock < 0) {
      return fail(
        `Tồn kho không đủ. Hiện tại: ${variant.stock_quantity}, điều chỉnh: ${validated.quantity_changed}`,
        409
      );
    }

    // Update stock
    const { error: updateErr } = await supabaseAdmin
      .from("product_variants")
      .update({ stock_quantity: newStock })
      .eq("id", validated.variant_id);

    if (updateErr) return fail(updateErr.message, 500);

    // Create log
    const { data: log, error: logErr } = await supabaseAdmin
      .from("inventory_logs")
      .insert(validated)
      .select("*, product_variants(*, products(name))")
      .single();

    if (logErr) return fail(logErr.message, 500);

    return ok(log, 201);
  } catch (error) {
    return handleError(error);
  }
}
