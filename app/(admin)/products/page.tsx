"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  Plus,
  Package,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Eye,
  EyeOff,
  Grid3X3,
  List,
} from "lucide-react";
import { formatCurrency } from "@/lib/data";
import { useDebounce } from "@/lib/hooks/useDebounce";

type ViewMode = "table" | "grid";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Variant = {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  base_price: number;
  is_active: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
  variants?: Variant[];
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedSearch = useDebounce(search, 2000);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "/api/categories?page=1&limit=100&sort=created_at&order=asc"
        );
        const json = await res.json();
        if (!res.ok) {
          return;
        }
        setCategories(json.data ?? []);
      } catch {
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        setLoadingProducts(true);
        setProductsError(null);

        const params = new URLSearchParams({
          page: "1",
          limit: "100",
          sort: "created_at",
          order: "desc",
        });

        const keyword = debouncedSearch.trim();
        if (keyword.length >= 2) {
          params.set("search", keyword);
        }

        if (selectedCategory !== "all") {
          params.set("category_id", selectedCategory);
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        const json = await res.json();

        if (!res.ok) {
          setProductsError(json.error ?? "Không thể tải sản phẩm");
          return;
        }

        const items = (json.data ?? []) as Array<
          Product & { product_variants?: Variant[] }
        >;

        const mapped: Product[] = items.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description ?? null,
          category_id: p.category_id ?? null,
          base_price: Number(p.base_price ?? 0),
          is_active: p.is_active,
          category: p.category ?? p.category,
          variants: (p.product_variants ?? []).map((v) => ({
            id: v.id,
            sku: v.sku,
            color: v.color,
            size: v.size,
            price: Number(v.price),
            stock_quantity: v.stock_quantity,
            image_url: v.image_url ?? null,
          })),
        }));

        if (!cancelled) {
          setProducts(mapped);
        }
      } catch {
        setProductsError("Không thể tải sản phẩm");
      } finally {
        setLoadingProducts(false);
      }
    }

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedCategory, reloadKey]);

  const filtered = products;

  const totalVariants = filtered.reduce(
    (s, p) => s + (p.variants?.length || 0),
    0
  );
  const activeCount = filtered.filter((p) => p.is_active).length;

  async function handleConfirmDelete(): Promise<void> {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteMessage(null);

    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setDeleteMessage(json.error ?? "Không thể xoá sản phẩm");
        return;
      }

      setDeleteMessage("Xoá sản phẩm thành công");
      setReloadKey((key) => key + 1);

      window.setTimeout(() => {
        setDeleteTarget(null);
        setDeleteMessage(null);
      }, 1500);
    } catch {
      setDeleteMessage("Đã xảy ra lỗi khi xoá sản phẩm");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
            Sản phẩm
          </h1>
          <p className="text-brand-500 mt-1">
            {filtered.length} sản phẩm · {totalVariants} biến thể ·{" "}
            {activeCount} đang bán
          </p>
        </div>
        <Link href="/products/new">
          <Button icon={<Plus size={18} />}>Thêm sản phẩm</Button>
        </Link>
      </div>

      <Card padding="md">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-brand-700 text-white shadow-sm"
                  : "bg-brand-50 text-brand-600 hover:bg-brand-100"
              }`}
            >
              Tất cả
            </button>
          {!loadingCategories &&
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-brand-700 text-white shadow-sm"
                    : "bg-brand-50 text-brand-600 hover:bg-brand-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <SearchBar value={search} onChange={setSearch} placeholder="Tìm sản phẩm..." className="flex-1 md:w-60" />
            <div className="flex border border-brand-200 rounded-xl overflow-hidden">
              <button onClick={() => setViewMode("table")} className={`p-2.5 transition-colors cursor-pointer ${viewMode === "table" ? "bg-brand-700 text-white" : "bg-white text-brand-500 hover:bg-brand-50"}`}>
                <List size={16} />
              </button>
              <button onClick={() => setViewMode("grid")} className={`p-2.5 transition-colors cursor-pointer ${viewMode === "grid" ? "bg-brand-700 text-white" : "bg-white text-brand-500 hover:bg-brand-50"}`}>
                <Grid3X3 size={16} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {viewMode === "table" ? (
        <Card padding="none">
          <div className="overflow-x-auto">
            {productsError && (
              <p className="px-4 pt-4 text-sm text-red-500">
                {productsError}
              </p>
            )}
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-brand-100">
                  <th className="w-10 py-3 px-4"></th>
                  <th className="text-left py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider">Sản phẩm</th>
                  <th className="text-left py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider">Danh mục</th>
                  <th className="text-right py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider">Giá gốc</th>
                  <th className="text-center py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider">Biến thể</th>
                  <th className="text-center py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider">Trạng thái</th>
                  <th className="text-center py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loadingProducts ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 px-4 text-center text-sm text-brand-400"
                    >
                      Đang tải sản phẩm...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 px-4 text-center text-sm text-brand-400"
                    >
                      Không có sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => {
                    const isExpanded = expandedProduct === product.id;
                    const totalStock =
                      product.variants?.reduce(
                        (s, v) => s + v.stock_quantity,
                        0
                      ) || 0;
                    return (
                      <ProductRow
                        key={product.id}
                        product={product}
                        isExpanded={isExpanded}
                        totalStock={totalStock}
                        onToggle={() =>
                          setExpandedProduct(
                            isExpanded ? null : product.id
                          )
                        }
                        onDelete={(p) => {
                          setDeleteTarget(p);
                          setDeleteMessage(null);
                        }}
                      />
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loadingProducts ? (
            <p className="col-span-full text-center text-sm text-brand-400">
              Đang tải sản phẩm...
            </p>
          ) : filtered.length === 0 ? (
            <p className="col-span-full text-center text-sm text-brand-400">
              Không có sản phẩm nào.
            </p>
          ) : (
            filtered.map((product) => (
              <ProductGridCard key={product.id} product={product} />
            ))
          )}
        </div>
      )}

      {deleteTarget && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white border border-brand-200 shadow-lg rounded-2xl p-4 space-y-3">
          <p className="text-sm font-semibold text-brand-700">
            Xoá sản phẩm?
          </p>
          <p className="text-sm text-brand-500">
            Bạn có chắc muốn xoá{" "}
            <span className="font-semibold">{deleteTarget.name}</span>? Thao
            tác này không thể hoàn tác.
          </p>
          {deleteMessage && (
            <p className="text-xs text-brand-400">{deleteMessage}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (deleteLoading) return;
                setDeleteTarget(null);
                setDeleteMessage(null);
              }}
            >
              Huỷ
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => void handleConfirmDelete()}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Đang xoá..." : "Xoá"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductRow({
  product,
  isExpanded,
  totalStock,
  onToggle,
  onDelete,
}: {
  product: Product;
  isExpanded: boolean;
  totalStock: number;
  onToggle: () => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <>
      <tr className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors cursor-pointer" onClick={onToggle}>
        <td className="py-3 px-4">
          <button className="text-brand-400">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-400 shrink-0">
              <Package size={18} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-medium text-brand-700">{product.name}</p>
              <p className="text-xs text-brand-400">{product.slug}</p>
            </div>
          </div>
        </td>
        <td className="py-3 px-4">
          <Badge variant="default">{product.category?.name}</Badge>
        </td>
        <td className="py-3 px-4 text-right font-medium text-brand-700">
          {formatCurrency(product.base_price)}
        </td>
        <td className="py-3 px-4 text-center">
          <span className="text-brand-600">{product.variants?.length || 0}</span>
          <span className="text-brand-400 text-xs ml-1">({totalStock} kho)</span>
        </td>
        <td className="py-3 px-4 text-center">
          {product.is_active ? (
            <Badge variant="success"><Eye size={10} className="mr-1" />Đang bán</Badge>
          ) : (
            <Badge variant="error"><EyeOff size={10} className="mr-1" />Tạm ẩn</Badge>
          )}
        </td>
        <td className="py-3 px-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Link
              href={`/products/${product.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-brand-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors inline-flex"
              aria-label="Sửa sản phẩm"
            >
              <Edit3 size={15} strokeWidth={1.5} />
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product);
              }}
              className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Xoá sản phẩm"
            >
              <Trash2 size={15} strokeWidth={1.5} />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && product.variants && product.variants.length > 0 && (
        <tr>
          <td colSpan={7} className="bg-brand-50/30 px-4 py-3">
            <div className="ml-8">
              <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2">
                Biến thể ({product.variants.length})
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-brand-400">
                      <th className="text-left py-2 pr-4 font-medium">SKU</th>
                      <th className="text-left py-2 pr-4 font-medium">Màu sắc</th>
                      <th className="text-left py-2 pr-4 font-medium">Size</th>
                      <th className="text-right py-2 pr-4 font-medium">Giá bán</th>
                      <th className="text-center py-2 pr-4 font-medium">Tồn kho</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((v) => (
                      <tr key={v.id} className="border-t border-brand-100/50">
                        <td className="py-2 pr-4 font-mono text-brand-600">{v.sku}</td>
                        <td className="py-2 pr-4 text-brand-600">{v.color}</td>
                        <td className="py-2 pr-4 text-brand-600">{v.size}</td>
                        <td className="py-2 pr-4 text-right font-medium text-brand-700">{formatCurrency(v.price)}</td>
                        <td className="py-2 pr-4 text-center">
                          <span className={`font-semibold ${v.stock_quantity === 0 ? "text-red-500" : v.stock_quantity <= 5 ? "text-amber-600" : "text-emerald-600"}`}>
                            {v.stock_quantity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function ProductGridCard({ product }: { product: Product }) {
  const totalStock =
    product.variants?.reduce((s, v) => s + v.stock_quantity, 0) || 0;
  const thumbnail =
    product.variants?.find((v) => v.image_url && v.image_url.length > 0)
      ?.image_url ?? null;
  return (
    <Card padding="none" hover>
      <div className="aspect-4/3 bg-linear-to-br from-brand-100 to-brand-200/50 relative overflow-hidden rounded-t-2xl">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package size={48} className="text-brand-300" strokeWidth={1} />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="handmade"><Sparkles size={10} className="mr-1" />Handmade</Badge>
          {!product.is_active && <Badge variant="error">Tạm ẩn</Badge>}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-brand-400 font-medium uppercase tracking-wide">{product.category?.name}</p>
        <h3 className="font-serif text-base font-semibold text-brand-700 mt-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-brand-500 mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-50">
          <span className="text-lg font-semibold text-brand-400 font-serif">{formatCurrency(product.base_price)}</span>
          <div className="text-right">
            <p className="text-xs text-brand-500">{product.variants?.length} biến thể</p>
            <p className="text-xs text-brand-400">Kho: {totalStock}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
