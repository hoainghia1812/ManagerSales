"use client";

import { useEffect, useState } from "react";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { ImageUploader } from "@/components/product/ImageUploader";
import { Loader2, Plus, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type VariantInput = {
  id: string;
  sku: string;
  color: string;
  size: string;
  price: string;
  stockQuantity: string;
};

interface ProductCreateFormProps {
  onCreated?: () => void;
}

export function ProductCreateForm({ onCreated }: ProductCreateFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [variants, setVariants] = useState<VariantInput[]>([
    {
      id: crypto.randomUUID(),
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
        if (!res.ok) {
          setError(json.error ?? "Không thể tải danh mục");
          return;
        }
        setCategories(json.data ?? []);
      } catch {
        setError("Không thể tải danh mục");
      } finally {
        setLoadingCategories(false);
      }
    }

    void fetchCategories();
  }, []);

  function updateVariant(
    id: string,
    field: keyof Omit<VariantInput, "id">,
    value: string
  ): void {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  }

  function addVariant(): void {
    setVariants((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sku: "",
        color: "",
        size: "",
        price: "",
        stockQuantity: "0",
      },
    ]);
  }

  function removeVariant(id: string): void {
    setVariants((prev) => (prev.length > 1 ? prev.filter((v) => v.id !== id) : prev));
  }

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Tên sản phẩm không được trống");
      return;
    }

    if (!imageUrl) {
      setError("Vui lòng upload ảnh sản phẩm trước");
      return;
    }

    if (variants.length === 0) {
      setError("Cần ít nhất một biến thể sản phẩm");
      return;
    }

    const parsedVariants = [];
    for (const variant of variants) {
      const trimmedSku = variant.sku.trim();
      if (!trimmedSku) {
        setError("SKU của mọi biến thể không được trống");
        return;
      }

      const numericPrice = Number(variant.price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        setError("Giá bán của biến thể không hợp lệ");
        return;
      }

      const numericStock = Number(variant.stockQuantity);
      if (!Number.isInteger(numericStock) || numericStock < 0) {
        setError("Tồn kho của biến thể phải là số nguyên không âm");
        return;
      }

      parsedVariants.push({
        sku: trimmedSku,
        color: variant.color.trim() || undefined,
        size: variant.size.trim() || undefined,
        price: numericPrice,
        stock_quantity: numericStock,
        image_url: imageUrl,
      });
    }

    const basePriceValue = Math.min(
      ...parsedVariants.map((v) => v.price)
    );

    setSubmitting(true);

    try {
      const payload = {
        name: trimmedName,
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        category_id: categoryId || undefined,
        base_price: basePriceValue,
        is_active: true,
        variants: parsedVariants,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Không thể tạo sản phẩm");
        return;
      }

      setName("");
      setSlug("");
      setDescription("");
      setCategoryId("");
      setVariants([
        {
          id: crypto.randomUUID(),
          sku: "",
          color: "",
          size: "",
          price: "",
          stockQuantity: "0",
        },
      ]);
      setImageUrl(null);

      if (onCreated) {
        onCreated();
      }
    } catch {
      setError("Đã xảy ra lỗi khi tạo sản phẩm");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card padding="md">
      <CardHeader
        title="Tạo sản phẩm mới"
        subtitle="Upload ảnh trước, sau đó lưu thông tin sản phẩm và biến thể đầu tiên."
      />
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
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
                  { value: "", label: "Chọn danh mục" },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
                className={loadingCategories ? "opacity-60" : ""}
              />
            </div>
            <div className="space-y-1.5">
              <p className="block text-sm font-medium text-brand-600">
                Giá gốc (tự động)
              </p>
              <p className="text-sm text-brand-700 font-semibold">
                {variants.some((v) => v.price.trim())
                  ? `${Math.min(
                      ...variants
                        .map((v) => Number(v.price))
                        .filter((n) => !Number.isNaN(n) && n >= 0)
                    ).toLocaleString("vi-VN")}đ`
                  : "Chưa có giá biến thể"}
              </p>
              <p className="text-xs text-brand-400">
                Lấy theo giá thấp nhất trong các biến thể.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-700">
                Biến thể sản phẩm
              </p>
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
              Mỗi biến thể có SKU, màu, size, giá và tồn kho riêng. Giá gốc của
              sản phẩm sẽ lấy theo giá thấp nhất trong các biến thể.
            </p>

            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end rounded-xl border border-brand-100 p-3"
                >
                  <Input
                    label="SKU"
                    placeholder="VD: NEN-LAV-100"
                    value={variant.sku}
                    onChange={(e) =>
                      updateVariant(variant.id, "sku", e.target.value)
                    }
                    required
                  />
                  <Input
                    label="Màu (tuỳ chọn)"
                    placeholder="VD: Lavender"
                    value={variant.color}
                    onChange={(e) =>
                      updateVariant(variant.id, "color", e.target.value)
                    }
                  />
                  <Input
                    label="Size (tuỳ chọn)"
                    placeholder="VD: 200g"
                    value={variant.size}
                    onChange={(e) =>
                      updateVariant(variant.id, "size", e.target.value)
                    }
                  />
                  <Input
                    label="Giá bán"
                    type="number"
                    min={0}
                    step="1000"
                    placeholder="0"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(variant.id, "price", e.target.value)
                    }
                    required
                  />
                  <div className="flex items-end gap-2">
                    <Input
                      label="Tồn kho"
                      type="number"
                      min={0}
                      step="1"
                      value={variant.stockQuantity}
                      onChange={(e) =>
                        updateVariant(
                          variant.id,
                          "stockQuantity",
                          e.target.value
                        )
                      }
                      required
                    />
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="mb-2 p-2 rounded-lg text-brand-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Xoá biến thể"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    {variants.length === 1 && index === 0 && (
                      <div className="mb-2 w-8" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ImageUploader value={imageUrl ?? undefined} onChange={setImageUrl} />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={submitting}
              icon={
                submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : undefined
              }
            >
              {submitting ? "Đang tạo..." : "Tạo sản phẩm"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

