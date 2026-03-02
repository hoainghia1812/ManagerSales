import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase/client";

export interface UploadProductImageOptions {
  onProgress?: (percent: number) => void;
}

export async function uploadProductImage(
  file: File,
  options?: UploadProductImageOptions
): Promise<string> {
  if (!file) {
    throw new Error("File không hợp lệ");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Chỉ hỗ trợ upload file ảnh");
  }

  const maxSizeBytes = 5 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error("Kích thước ảnh vượt quá 5MB");
  }

  const compressionOptions: imageCompression.Options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    onProgress: (progress) => {
      if (options?.onProgress) {
        const normalized = Math.min(80, Math.max(0, progress));
        options.onProgress(normalized);
      }
    },
  };

  let fileToUpload: File = file;

  try {
    fileToUpload = await imageCompression(file, compressionOptions);
  } catch {
    fileToUpload = file;
  }

  const uuid = crypto.randomUUID();
  const originalName = file.name.toLowerCase();
  const extMatch = originalName.match(/\.(\w+)$/);
  const ext = extMatch?.[1] ?? "jpg";
  const path = `products/${uuid}.${ext}`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(path, fileToUpload, {
      cacheControl: "3600",
      upsert: false,
      contentType: fileToUpload.type || "image/jpeg",
    });

  if (error || !data) {
    throw new Error(error?.message ?? "Không thể upload ảnh");
  }

  if (options?.onProgress) {
    options.onProgress(100);
  }

  const {
    data: publicData,
    error: publicError,
  } = supabase.storage.from("product-images").getPublicUrl(data.path);

  if (publicError || !publicData?.publicUrl) {
    throw new Error(
      publicError?.message ?? "Không thể lấy public URL của ảnh"
    );
  }

  return publicData.publicUrl;
}

