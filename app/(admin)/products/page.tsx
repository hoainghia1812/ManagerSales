"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  Plus,
  Package,
  Edit3,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Eye,
  EyeOff,
  Grid3X3,
  List,
} from "lucide-react";
import {
  productsWithDetails,
  categories,
  formatCurrency,
  type Product,
} from "@/lib/data";

type ViewMode = "table" | "grid";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const filtered = productsWithDetails.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "all" || p.category_id === selectedCategory;
    return matchSearch && matchCategory;
  });

  const totalVariants = filtered.reduce((s, p) => s + (p.variants?.length || 0), 0);
  const activeCount = filtered.filter((p) => p.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
            Sản phẩm
          </h1>
          <p className="text-brand-500 mt-1">
            {filtered.length} sản phẩm · {totalVariants} biến thể · {activeCount} đang bán
          </p>
        </div>
        <Button icon={<Plus size={18} />}>Thêm sản phẩm</Button>
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
            {categories.map((cat) => (
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
                {filtered.map((product) => {
                  const isExpanded = expandedProduct === product.id;
                  const totalStock = product.variants?.reduce((s, v) => s + v.stock_quantity, 0) || 0;
                  return (
                    <ProductRow
                      key={product.id}
                      product={product}
                      isExpanded={isExpanded}
                      totalStock={totalStock}
                      onToggle={() => setExpandedProduct(isExpanded ? null : product.id)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductGridCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductRow({ product, isExpanded, totalStock, onToggle }: {
  product: Product;
  isExpanded: boolean;
  totalStock: number;
  onToggle: () => void;
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
          <button className="p-1.5 text-brand-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
            <Edit3 size={15} strokeWidth={1.5} />
          </button>
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
  const totalStock = product.variants?.reduce((s, v) => s + v.stock_quantity, 0) || 0;
  return (
    <Card padding="none" hover>
      <div className="aspect-4/3 bg-linear-to-br from-brand-100 to-brand-200/50 relative overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <Package size={48} className="text-brand-300" strokeWidth={1} />
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="handmade"><Sparkles size={10} className="mr-1" />Handmade</Badge>
          {!product.is_active && <Badge variant="error">Tạm ẩn</Badge>}
        </div>
        {totalStock <= 10 && totalStock > 0 && (
          <div className="absolute top-3 right-3"><Badge variant="warning">Sắp hết</Badge></div>
        )}
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
