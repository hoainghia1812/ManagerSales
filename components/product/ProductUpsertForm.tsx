"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { ImageUploader } from "@/components/product/ImageUploader";
import { Loader2, Plus, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type InitialVariant = {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
};

type InitialProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  is_active: boolean;
  product_variants: InitialVariant[];
};

type VariantDraft = {
  key: string; // react key
  variantId?: string; // existing variant uuid
  sku: string;
  color: string;
  size: string;
  price: string;
  stockQuantity: string;
};

type Mode = "create" | "edit";

interface ProductUpsertFormProps {
  mode: Mode;
  initialProduct?: InitialProduct; // required for edit
}

export function ProductUpsertForm({ mode, initialProduct }: ProductUpsertFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [variants, setVariants] = useState<VariantDraft[]>([
    {
      key: crypto.randomUUID(),
      sku: "",
      color: "",
      size: "",
      price: "",
      stockQuantity: "0",
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "/api/categories?page=1&limit=100&sort=created_at&order=asc"
        );
        const json = await res.json();
        if (!res.ok) return;
        setCategories(json.data ?? []);
      } finally {
        setLoadingCategories(false);
      }
    }
    void fetchCategories();
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !initialProduct) return;

    setName(initialProduct.name);
    setSlug(initialProduct.slug);
    setDescription(initialProduct.description ?? "");
    setCategoryId(initialProduct.category_id ?? "");
    setIsActive(initialProduct.is_active);

    const initialImage =
      initialProduct.product_variants.find((v) => v.image_url)?.image_url ?? null;
    setImageUrl(initialImage);

    setVariants(
      (initialProduct.product_variants ?? []).map((v) => ({
        key: v.id,
        variantId: v.id,
        sku: v.sku,
        color: v.color ?? "",
        size: v.size ?? "",
        price: v.price.toString(),
        stockQuantity: v.stock_quantity.toString(),
      }))
    );
  }, [mode, initialProduct]);

  function updateVariant(
    key: string,
    field: keyof Omit<VariantDraft, "key" | "variantId">,
    value: string
  ): void {
    setVariants((prev) =>
      prev.map((v) => (v.key === key ? { ...v, [field]: value } : v))
    );
  }

  function addVariant(): void {
    setVariants((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        sku: "",
        color: "",
        size: "",
        price: "",
        stockQuantity: "0",
      },
    ]);
  }

  function removeVariant(key: string): void {
    setVariants((prev) => (prev.length > 1 ? prev.filter((v) => v.key !== key) : prev));
  }

  const basePricePreview = useMemo(() => {
    const prices = variants
      .map((v) => Number(v.price))
      .filter((n) => !Number.isNaN(n) && n >= 0);
    if (prices.length === 0) return null;
    return Math.min(...prices);
  }, [variants]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Tên sản phẩm không được trống");
      return;
    }

    if (!imageUrl) {
      setError("Vui lòng chọn ảnh sản phẩm trước");
      return;
    }

    if (variants.length === 0) {
      setError("Cần ít nhất một biến thể sản phẩm");
      return;
    }

    const parsedVariants: Array<{
      variantId?: string;
      sku: string;
      color: string | null;
      size: string | null;
      price: number;
      stock_quantity: number;
      image_url: string;
    }> = [];

    for (const v of variants) {
      const trimmedSku = v.sku.trim();
      if (!trimmedSku) {
        setError("SKU của mọi biến thể không được trống");
        return;
      }

      const numericPrice = Number(v.price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        setError("Giá bán của biến thể không hợp lệ");
        return;
      }

      const numericStock = Number(v.stockQuantity);
      if (!Number.isInteger(numericStock) || numericStock < 0) {
        setError("Tồn kho của biến thể phải là số nguyên không âm");
        return;
      }

      parsedVariants.push({
        variantId: v.variantId,
        sku: trimmedSku,
        color: v.color.trim() ? v.color.trim() : null,
        size: v.size.trim() ? v.size.trim() : null,
        price: numericPrice,
        stock_quantity: numericStock,
        image_url: imageUrl,
      });
    }

    const basePriceValue = Math.min(...parsedVariants.map((x) => x.price));

    setSubmitting(true);

    try {
      if (mode === "create") {
        const payload = {
          name: trimmedName,
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          category_id: categoryId || undefined,
          base_price: basePriceValue,
          is_active: true,
          variants: parsedVariants.map(({ variantId: _id, ...rest }) => rest),
        };

        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Không thể tạo sản phẩm");
          return;
        }

        router.push("/products");
        return;
      }

      if (!initialProduct) {
        setError("Thiếu dữ liệu sản phẩm để cập nhật");
        return;
      }

      // Update product fields (including clearing category with null)
      const updatePayload = {
        name: trimmedName,
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        category_id: categoryId ? categoryId : null,
        base_price: basePriceValue,
        is_active: isActive,
      };

      const updateRes = await fetch(`/api/products/${initialProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      const updateJson = await updateRes.json();
      if (!updateRes.ok) {
        setError(updateJson.error ?? "Không thể cập nhật sản phẩm");
        return;
      }

      // Diff variants
      const existingIds = new Set(initialProduct.product_variants.map((v) => v.id));
      const currentIds = new Set(
        parsedVariants.map((v) => v.variantId).filter(Boolean) as string[]
      );

      // Update existing & create new
      for (const v of parsedVariants) {
        const payload = {
          sku: v.sku,
          color: v.color,
          size: v.size,
          price: v.price,
          stock_quantity: v.stock_quantity,
          image_url: v.image_url,
        };

        if (v.variantId) {
          const res = await fetch(
            `/api/products/${initialProduct.id}/variants/${v.variantId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
          const json = await res.json();
          if (!res.ok) {
            setError(json.error ?? "Không thể cập nhật biến thể");
            return;
          }
        } else {
          const res = await fetch(`/api/products/${initialProduct.id}/variants`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const json = await res.json();
          if (!res.ok) {
            setError(json.error ?? "Không thể tạo biến thể");
            return;
          }
        }
      }

      // Delete removed variants
      for (const id of existingIds) {
        if (!currentIds.has(id)) {
          const res = await fetch(
            `/api/products/${initialProduct.id}/variants/${id}`,
            { method: "DELETE" }
          );
          const json = await res.json();
          if (!res.ok) {
            setError(json.error ?? "Không thể xoá biến thể");
            return;
          }
        }
      }

      router.push("/products");
    } catch {
      setError("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card padding="md">
      <CardHeader
        title={mode === "create" ? "Thêm sản phẩm mới" : "Sửa sản phẩm"}
        subtitle={
          mode === "create"
            ? "Chọn ảnh, nhập thông tin sản phẩm và các biến thể."
            : "Sửa sản phẩm giống như màn hình thêm mới, sau đó bấm Lưu."
        }
      />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 lg:col-span-2">
          <Input
            label="Tên sản phẩm"
            placeholder="Ví dụ: Nến thơm Lavender"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Slug (tuỳ chọn)"
            placeholder="nen-thom-lavender"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Input
            label="Mô tả (tuỳ chọn)"
            placeholder="Mô tả ngắn về sản phẩm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Select
                label="Danh mục"
                value={categoryId}
                onChange={setCategoryId}
                options={[
                  { value: "", label: "Không chọn danh mục" },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
                className={loadingCategories ? "opacity-60" : ""}
              />
            </div>
            <div className="space-y-1.5">
              <p className="block text-sm font-medium text-brand-600">Giá gốc (tự động)</p>
              <p className="text-sm text-brand-700 font-semibold">
                {basePricePreview !== null
                  ? `${basePricePreview.toLocaleString("vi-VN")}đ`
                  : "Chưa có giá biến thể"}
              </p>
              <p className="text-xs text-brand-400">Lấy theo giá thấp nhất trong các biến thể.</p>
            </div>
          </div>

          {mode === "edit" && (
            <label className="inline-flex items-center gap-2 text-sm text-brand-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-brand-300 text-brand-600 focus:ring-brand-400"
              />
              Đang bán
            </label>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-700">Biến thể sản phẩm</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                icon={<Plus size={14} />}
                onClick={addVariant}
              >
                Thêm biến thể
              </Button>
            </div>
            <p className="text-xs text-brand-400">
              Mỗi biến thể có SKU, màu, size, giá và tồn kho riêng.
            </p>

            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div
                  key={v.key}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end rounded-xl border border-brand-100 p-3"
                >
                  <Input
                    label="SKU"
                    value={v.sku}
                    onChange={(e) => updateVariant(v.key, "sku", e.target.value)}
                    required
                  />
                  <Input
                    label="Màu (tuỳ chọn)"
                    value={v.color}
                    onChange={(e) => updateVariant(v.key, "color", e.target.value)}
                  />
                  <Input
                    label="Size (tuỳ chọn)"
                    value={v.size}
                    onChange={(e) => updateVariant(v.key, "size", e.target.value)}
                  />
                  <Input
                    label="Giá bán"
                    type="number"
                    min={0}
                    step="1000"
                    value={v.price}
                    onChange={(e) => updateVariant(v.key, "price", e.target.value)}
                    required
                  />
                  <div className="flex items-end gap-2">
                    <Input
                      label="Tồn kho"
                      type="number"
                      min={0}
                      step="1"
                      value={v.stockQuantity}
                      onChange={(e) => updateVariant(v.key, "stockQuantity", e.target.value)}
                      required
                    />
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(v.key)}
                        className="mb-2 p-2 rounded-lg text-brand-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Xoá biến thể"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    {variants.length === 1 && idx === 0 && <div className="mb-2 w-8" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ImageUploader value={imageUrl ?? undefined} onChange={setImageUrl} />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/products")}
              disabled={submitting}
            >
              Huỷ
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              icon={submitting ? <Loader2 size={16} className="animate-spin" /> : undefined}
            >
              {submitting
                ? mode === "create"
                  ? "Đang tạo..."
                  : "Đang lưu..."
                : mode === "create"
                  ? "Tạo sản phẩm"
                  : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

