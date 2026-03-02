import { supabaseAdmin } from "@/lib/supabase/server";
import { ok, fail, handleError } from "@/lib/api-helpers";

type StoredImage = {
  name: string;
  url: string;
  createdAt?: string;
};

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .list("", {
        limit: 200,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      return fail(error.message, 500);
    }

    const files = (data ?? []).filter((file) => !file.name.startsWith("."));

    const images: StoredImage[] = files.map((file) => {
      const fullPath = file.name;
      const { data: publicData } = supabaseAdmin.storage
        .from("product-images")
        .getPublicUrl(fullPath);

      return {
        name: fullPath,
        url: publicData.publicUrl,
        createdAt:
          (file as { created_at?: string }).created_at ?? undefined,
      };
    });

    return ok(images);
  } catch (error) {
    return handleError(error);
  }
}

