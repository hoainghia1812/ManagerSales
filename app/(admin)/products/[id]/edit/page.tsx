"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductUpsertForm } from "@/components/product/ProductUpsertForm";

type Variant = {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
};

type ProductResponse = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  is_active: boolean;
  product_variants: Variant[];
};

export default function EditProductPage() {
  const params = useParams();
  const productId = (params?.id ?? "") as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductResponse | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/products/${productId}`);
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Không thể tải sản phẩm");
          return;
        }
        setProduct(json.data ?? null);
      } catch {
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      void load();
    }
  }, [productId]);

  if (loading) {
    return <p className="text-sm text-brand-500">Đang tải sản phẩm...</p>;
  }

  if (!product) {
    return <p className="text-sm text-red-500">{error ?? "Không tìm thấy sản phẩm"}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
          Sửa sản phẩm
        </h1>
        <p className="text-brand-500 mt-1">
          Cập nhật sản phẩm và biến thể, sau đó bấm lưu.
        </p>
      </div>

      <ProductUpsertForm mode="edit" initialProduct={product} />
    </div>
  );
}

