"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/data";
import { ArrowLeft, Package, Save, Trash2, Plus } from "lucide-react";

type Variant = {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
};

type EditableVariant = {
  id: string;
  sku: string;
  color: string;
  size: string;
  price: string;
  stockQuantity: string;
  imageUrl: string;
};

type ProductWithVariants = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  is_active: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
  product_variants?: Variant[];
};

export default function ProductVariantsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params?.id ?? "") as string;

  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  const [variants, setVariants] = useState<EditableVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newVariant, setNewVariant] = useState<EditableVariant>({
    id: "new",
    sku: "",
    color: "",
    size: "",
    price: "",
    stockQuantity: "0",
    imageUrl: "",
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/products/${productId}`);
        const json = await res.json();

        if (!res.ok) {
          setError(json.error ?? "Không thể tải sản phẩm");
          return;
        }

        const data = json.data as ProductWithVariants;
        setProduct(data);

        const editable: EditableVariant[] = (data.product_variants ?? []).map(
          (v) => ({
            id: v.id,
            sku: v.sku,
            color: v.color ?? "",
            size: v.size ?? "",
            price: v.price.toString(),
            stockQuantity: v.stock_quantity.toString(),
            imageUrl: v.image_url ?? "",
          })
        );
        setVariants(editable);
      } catch {
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      void fetchProduct();
    }
  }, [productId]);

  function updateVariantField(
    id: string,
    field: keyof EditableVariant,
    value: string
  ): void {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  }

  async function handleSaveVariant(variant: EditableVariant): Promise<void> {
    const trimmedSku = variant.sku.trim();
    if (!trimmedSku) {
      setError("SKU không được trống");
      return;
    }

    const numericPrice = Number(variant.price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setError("Giá bán không hợp lệ");
      return;
    }

    const numericStock = Number(variant.stockQuantity);
    if (!Number.isInteger(numericStock) || numericStock < 0) {
      setError("Tồn kho phải là số nguyên không âm");
      return;
    }

    setSavingId(variant.id);
    setError(null);

    try {
      const payload = {
        sku: trimmedSku,
        color: variant.color.trim() || null,
        size: variant.size.trim() || null,
        price: numericPrice,
        stock_quantity: numericStock,
        image_url: variant.imageUrl.trim() || null,
      };

      const res = await fetch(
        `/api/products/${productId}/variants/${variant.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Không thể cập nhật biến thể");
        return;
      }
    } catch {
      setError("Đã xảy ra lỗi khi cập nhật biến thể");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDeleteVariant(id: string): Promise<void> {
    if (!window.confirm("Bạn có chắc muốn xoá biến thể này?")) return;

    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(
        `/api/products/${productId}/variants/${id}`,
        {
          method: "DELETE",
        }
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Không thể xoá biến thể");
        return;
      }

      setVariants((prev) => prev.filter((v) => v.id !== id));
    } catch {
      setError("Đã xảy ra lỗi khi xoá biến thể");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCreateVariant(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setCreateError(null);

    const trimmedSku = newVariant.sku.trim();
    if (!trimmedSku) {
      setCreateError("SKU không được trống");
      return;
    }

    const numericPrice = Number(newVariant.price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setCreateError("Giá bán không hợp lệ");
      return;
    }

    const numericStock = Number(newVariant.stockQuantity);
    if (!Number.isInteger(numericStock) || numericStock < 0) {
      setCreateError("Tồn kho phải là số nguyên không âm");
      return;
    }

    setCreating(true);

    try {
      const payload = {
        sku: trimmedSku,
        color: newVariant.color.trim() || null,
        size: newVariant.size.trim() || null,
        price: numericPrice,
        stock_quantity: numericStock,
        image_url: newVariant.imageUrl.trim() || null,
      };

      const res = await fetch(`/api/products/${productId}/variants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setCreateError(json.error ?? "Không thể tạo biến thể");
        return;
      }

      const created = json.data as Variant;
      setVariants((prev) => [
        ...prev,
        {
          id: created.id,
          sku: created.sku,
          color: created.color ?? "",
          size: created.size ?? "",
          price: created.price.toString(),
          stockQuantity: created.stock_quantity.toString(),
          imageUrl: created.image_url ?? "",
        },
      ]);

      setNewVariant({
        id: "new",
        sku: "",
        color: "",
        size: "",
        price: "",
        stockQuantity: "0",
        imageUrl: "",
      });
    } catch {
      setCreateError("Đã xảy ra lỗi khi tạo biến thể");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-brand-500">Đang tải dữ liệu sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={() => router.push("/products")}
        >
          Quay lại danh sách sản phẩm
        </Button>
        <p className="text-sm text-red-500">
          {error ?? "Không tìm thấy sản phẩm"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft size={16} />}
            onClick={() => router.push("/products")}
          >
            Quay lại
          </Button>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
              Biến thể sản phẩm
            </h1>
            <p className="text-brand-500 mt-1 text-sm">
              {product.name} ·{" "}
              <span className="text-brand-400">{product.slug}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          {product.category && (
            <p className="text-xs text-brand-400 mb-1">
              Danh mục: {product.category.name}
            </p>
          )}
          <p className="text-xs text-brand-500">
            Giá gốc:{" "}
            <span className="font-semibold text-brand-700">
              {formatCurrency(product.base_price)}
            </span>
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <Card padding="md">
        <CardHeader
          title="Danh sách biến thể"
          subtitle="Chỉnh sửa chi tiết từng biến thể sản phẩm."
        />
        {variants.length === 0 ? (
          <p className="text-sm text-brand-400">
            Chưa có biến thể nào. Hãy tạo biến thể đầu tiên ở bên dưới.
          </p>
        ) : (
          <div className="space-y-3">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start rounded-xl border border-brand-100 p-3 bg-brand-50/40"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-brand-100 shrink-0 flex items-center justify-center">
                    {variant.imageUrl ? (
                      <Image
                        src={variant.imageUrl}
                        alt={variant.sku}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <Package
                        size={24}
                        className="text-brand-300"
                        strokeWidth={1}
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <Input
                      label="SKU"
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariantField(variant.id, "sku", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <Input
                  label="Màu (tuỳ chọn)"
                  value={variant.color}
                  onChange={(e) =>
                    updateVariantField(variant.id, "color", e.target.value)
                  }
                />
                <Input
                  label="Size (tuỳ chọn)"
                  value={variant.size}
                  onChange={(e) =>
                    updateVariantField(variant.id, "size", e.target.value)
                  }
                />
                <Input
                  label="Giá bán"
                  type="number"
                  min={0}
                  step="1000"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariantField(variant.id, "price", e.target.value)
                  }
                  required
                />
                <div className="space-y-2">
                  <Input
                    label="Tồn kho"
                    type="number"
                    min={0}
                    step="1"
                    value={variant.stockQuantity}
                    onChange={(e) =>
                      updateVariantField(
                        variant.id,
                        "stockQuantity",
                        e.target.value
                      )
                    }
                    required
                  />
                  <Input
                    label="URL ảnh (tuỳ chọn)"
                    value={variant.imageUrl}
                    onChange={(e) =>
                      updateVariantField(
                        variant.id,
                        "imageUrl",
                        e.target.value
                      )
                    }
                  />
                  <div className="flex gap-2 justify-end pt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      icon={<Save size={14} />}
                      onClick={() => void handleSaveVariant(variant)}
                      disabled={savingId === variant.id}
                    >
                      {savingId === variant.id ? "Đang lưu..." : "Lưu"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      icon={<Trash2 size={14} />}
                      onClick={() => void handleDeleteVariant(variant.id)}
                      disabled={deletingId === variant.id}
                    >
                      {deletingId === variant.id ? "Đang xoá..." : "Xoá"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card padding="md">
        <CardHeader
          title="Thêm biến thể mới"
          subtitle="Tạo biến thể mới cho sản phẩm này."
        />
        <form
          onSubmit={handleCreateVariant}
          className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
        >
          <Input
            label="SKU"
            value={newVariant.sku}
            onChange={(e) =>
              setNewVariant({ ...newVariant, sku: e.target.value })
            }
            required
          />
          <Input
            label="Màu (tuỳ chọn)"
            value={newVariant.color}
            onChange={(e) =>
              setNewVariant({ ...newVariant, color: e.target.value })
            }
          />
          <Input
            label="Size (tuỳ chọn)"
            value={newVariant.size}
            onChange={(e) =>
              setNewVariant({ ...newVariant, size: e.target.value })
            }
          />
          <Input
            label="Giá bán"
            type="number"
            min={0}
            step="1000"
            value={newVariant.price}
            onChange={(e) =>
              setNewVariant({ ...newVariant, price: e.target.value })
            }
            required
          />
          <div className="space-y-2">
            <Input
              label="Tồn kho"
              type="number"
              min={0}
              step="1"
              value={newVariant.stockQuantity}
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  stockQuantity: e.target.value,
                })
              }
              required
            />
            <Input
              label="URL ảnh (tuỳ chọn)"
              value={newVariant.imageUrl}
              onChange={(e) =>
                setNewVariant({ ...newVariant, imageUrl: e.target.value })
              }
            />
            {createError && (
              <p className="text-xs text-red-500">{createError}</p>
            )}
            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                size="sm"
                icon={<Plus size={14} />}
                disabled={creating}
              >
                {creating ? "Đang tạo..." : "Thêm biến thể"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

