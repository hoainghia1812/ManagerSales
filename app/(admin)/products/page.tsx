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
  Trash2,
  Filter,
  Grid3X3,
  List,
  Sparkles,
} from "lucide-react";
import { products, categories, formatCurrency } from "@/lib/data";

type ViewMode = "grid" | "table";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filtered = products.filter((p) => {
    const matchSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === "Tất cả" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
            Sản phẩm
          </h1>
          <p className="text-brand-500 mt-1">
            {products.length} sản phẩm handmade
          </p>
        </div>
        <Button icon={<Plus size={18} />}>Thêm sản phẩm</Button>
      </div>

      <Card padding="md">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-brand-700 text-white shadow-sm"
                    : "bg-brand-50 text-brand-600 hover:bg-brand-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Tìm sản phẩm..."
              className="flex-1 md:w-60"
            />
            <div className="flex border border-brand-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-brand-700 text-white"
                    : "bg-white text-brand-500 hover:bg-brand-50"
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2.5 transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-brand-700 text-white"
                    : "bg-white text-brand-500 hover:bg-brand-50"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductGridCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <ProductTable products={filtered} />
      )}
    </div>
  );
}

function ProductGridCard({ product }: { product: (typeof products)[0] }) {
  return (
    <Card padding="none" hover>
      <div className="aspect-4/3 bg-linear-to-br from-brand-100 to-brand-200/50 relative overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <Package
            size={48}
            className="text-brand-300"
            strokeWidth={1}
          />
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.isHandmade && (
            <Badge variant="handmade">
              <Sparkles size={10} className="mr-1" />
              Handmade
            </Badge>
          )}
          {product.isNew && <Badge variant="success">Mới</Badge>}
        </div>
        {product.stock <= 10 && (
          <div className="absolute top-3 right-3">
            <Badge variant="warning">Sắp hết</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-brand-400 font-medium uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="font-serif text-base font-semibold text-brand-700 mt-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-brand-500 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-50">
          <span className="text-lg font-semibold text-brand-400 font-serif">
            {formatCurrency(product.price)}
          </span>
          <span className="text-xs text-brand-500">
            Kho: {product.stock}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit3 size={14} />
            Sửa
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 size={14} className="text-red-400" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ProductTable({ products: items }: { products: typeof products }) {
  return (
    <Card padding="none">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-brand-100">
              <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                Danh mục
              </th>
              <th className="text-right py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                Giá
              </th>
              <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                Kho
              </th>
              <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                Đã bán
              </th>
              <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr
                key={product.id}
                className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors"
              >
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-400 shrink-0">
                      <Package size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-medium text-brand-700">
                        {product.name}
                      </p>
                      <div className="flex gap-1 mt-0.5">
                        {product.isHandmade && (
                          <Badge variant="handmade" className="text-[10px]">
                            Handmade
                          </Badge>
                        )}
                        {product.isNew && (
                          <Badge variant="success" className="text-[10px]">
                            Mới
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5 text-brand-500">
                  {product.category}
                </td>
                <td className="py-3 px-5 text-right font-medium text-brand-700">
                  {formatCurrency(product.price)}
                </td>
                <td className="py-3 px-5 text-center">
                  <span
                    className={`font-medium ${
                      product.stock <= 10
                        ? "text-amber-600"
                        : "text-brand-600"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="py-3 px-5 text-center text-brand-600">
                  {product.sold}
                </td>
                <td className="py-3 px-5">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 text-brand-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
                      <Edit3 size={15} strokeWidth={1.5} />
                    </button>
                    <button className="p-1.5 text-brand-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={15} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
