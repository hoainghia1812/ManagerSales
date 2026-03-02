"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, UploadCloud, X } from "lucide-react";
import { uploadProductImage } from "@/lib/uploadProductImage";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

type ImageUploaderProps = {
  value?: string | null;
  onChange: (url: string | null) => void;
};

type StoredImage = {
  name: string;
  url: string;
  createdAt?: string;
};

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [libraryImages, setLibraryImages] = useState<StoredImage[]>([]);

  useEffect(() => {
    if (value !== previewUrl) {
      setPreviewUrl(value ?? null);
    }
  }, [value, previewUrl]);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.type.startsWith("image/")) {
        setError("Chỉ hỗ trợ upload file ảnh");
        return;
      }

      const maxSizeBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setError("Ảnh phải nhỏ hơn 5MB");
        return;
      }

      setUploading(true);
      setProgress(0);

      try {
        const url = await uploadProductImage(file, {
          onProgress: (p) => setProgress(p),
        });

        setPreviewUrl(url);
        onChange(url);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload ảnh thất bại";
        setError(message);
        setPreviewUrl(null);
        onChange(null);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onChange]
  );

  const onFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const onDrop = async (
    event: React.DragEvent<HTMLDivElement>
  ): Promise<void> => {
    event.preventDefault();
    if (uploading) return;

    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const clearImage = (): void => {
    setPreviewUrl(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const openLibrary = async (): Promise<void> => {
    if (uploading) return;
    setLibraryOpen(true);

    if (libraryImages.length > 0 || libraryLoading) return;

    setLibraryLoading(true);
    setLibraryError(null);

    try {
      const res = await fetch("/api/product-images");
      const json = (await res.json()) as { data?: StoredImage[]; error?: string };

      if (!res.ok) {
        setLibraryError(json.error ?? "Không thể tải thư viện ảnh");
        return;
      }

      setLibraryImages(json.data ?? []);
      setLibraryError(null);
    } catch {
      setLibraryError("Không thể tải thư viện ảnh");
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleSelectFromLibrary = (image: StoredImage): void => {
    setPreviewUrl(image.url);
    onChange(image.url);
    setLibraryOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-brand-600 mb-1">
        Ảnh sản phẩm
      </label>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 cursor-pointer transition-colors ${
          uploading
            ? "border-brand-300 bg-brand-50"
            : "border-brand-200 hover:border-brand-400 hover:bg-brand-50/60"
        }`}
        onClick={() => void openLibrary()}
      >
        {previewUrl ? (
          <div className="relative w-full max-w-xs aspect-square">
            <Image
              src={previewUrl}
              alt="Ảnh sản phẩm"
              fill
              sizes="256px"
              className="object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="absolute top-2 right-2 bg-white/90 rounded-full p-1 text-brand-500 hover:text-red-500 shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-400">
              <ImageIcon size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-brand-700">
                Kéo thả ảnh vào đây
              </p>
              <p className="text-xs text-brand-400">
                hoặc bấm để chọn file (JPG, PNG, WebP, &lt; 5MB)
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              icon={<UploadCloud size={16} />}
            >
              Chọn ảnh
            </Button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        {uploading && (
          <div className="absolute inset-x-4 bottom-4">
            <ProgressBar value={progress} />
            <p className="mt-1 text-xs text-center text-brand-400">
              Đang upload... {progress.toFixed(0)}%
            </p>
          </div>
        )}

        {libraryOpen && (
          <div className="absolute inset-0 z-10 bg-white rounded-2xl shadow-lg border border-brand-200 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-brand-100">
              <div>
                <p className="text-sm font-semibold text-brand-700">
                  Thư viện ảnh sản phẩm
                </p>
                <p className="text-xs text-brand-400">
                  Chọn ảnh đã upload trước đó hoặc tải ảnh mới.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<UploadCloud size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Tải ảnh mới
                </Button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLibraryOpen(false);
                  }}
                  className="p-1.5 rounded-full text-brand-400 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {libraryLoading ? (
                <p className="text-sm text-brand-400 text-center">
                  Đang tải thư viện ảnh...
                </p>
              ) : libraryError ? (
                <p className="text-sm text-red-500 text-center">
                  {libraryError}
                </p>
              ) : libraryImages.length === 0 ? (
                <p className="text-sm text-brand-400 text-center">
                  Chưa có ảnh nào trong thư viện. Hãy tải ảnh mới.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {libraryImages.map((image) => (
                    <button
                      key={image.name}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectFromLibrary(image);
                      }}
                      className="relative aspect-square rounded-xl overflow-hidden border border-brand-100 hover:border-brand-400 hover:shadow-sm transition-all"
                    >
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

