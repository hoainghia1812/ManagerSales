import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { updateCategorySchema } from "@/lib/validators";
import { ok, fail, handleError, generateSlug } from "@/lib/api-helpers";

export const runtime = "nodejs";

type CategoryParams = { params: Promise<{ id: string }> };

// GET
export async function GET(
  _request: NextRequest,
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