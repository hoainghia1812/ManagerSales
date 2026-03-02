"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Package,
  ShoppingBag,
  Sparkles,
  Star,
  ArrowRight,
  Gift,
  Heart,
  Truck,
  Shield,
  Leaf,
} from "lucide-react";
import { products, categories, formatCurrency } from "@/lib/data";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filtered = products.filter(
    (p) => selectedCategory === "Tất cả" || p.category === selectedCategory
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-linear-to-br from-brand-100 via-brand-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-brand-400" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-700" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32 relative">
          <div className="max-w-2xl">
            <Badge variant="handmade" className="mb-4">
              <Sparkles size={12} className="mr-1" />
              100% Handmade
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brand-700 leading-tight">
              Nghệ thuật
              <br />
              <span className="text-brand-400">trao tặng</span>
            </h1>
            <p className="text-brand-500 text-lg md:text-xl mt-4 md:mt-6 leading-relaxed max-w-lg">
              Mỗi sản phẩm là một tác phẩm thủ công, được tạo ra với tình yêu
              và sự tỉ mỉ trong từng chi tiết.
            </p>
            <div className="flex flex-wrap gap-3 mt-6 md:mt-8">
              <Button
                size="lg"
                icon={<ShoppingBag size={18} />}
                className="shadow-lg shadow-brand-700/20"
              >
                Khám phá ngay
              </Button>
              <Button variant="outline" size="lg" icon={<Gift size={18} />}>
                Quà tặng
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-y border-brand-100/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Sparkles, text: "100% Handmade" },
              { icon: Truck, text: "Giao hàng toàn quốc" },
              { icon: Shield, text: "Bảo đảm chất lượng" },
              { icon: Leaf, text: "Nguyên liệu tự nhiên" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 justify-center md:justify-start"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-400 shrink-0">
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-brand-600">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-700">
            Bộ sưu tập
          </h2>
          <p className="text-brand-500 mt-2 text-lg">
            Những sản phẩm thủ công được yêu thích nhất
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-brand-700 text-white shadow-md"
                  : "bg-white text-brand-600 hover:bg-brand-100 border border-brand-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700 text-brand-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
          <Gift size={40} className="mx-auto text-brand-400 mb-4" strokeWidth={1.5} />
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            Quà tặng ý nghĩa
          </h2>
          <p className="text-brand-300 text-lg max-w-lg mx-auto mb-8">
            Hãy để MUSH & CO. giúp bạn trao gửi yêu thương qua những món quà
            thủ công tinh tế
          </p>
          <Button
            variant="secondary"
            size="lg"
            icon={<ArrowRight size={18} />}
            className="shadow-lg"
          >
            Đặt quà ngay
          </Button>
        </div>
      </section>
    </div>
  );
}

function ShopProductCard({
  product,
}: {
  product: (typeof products)[0];
}) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-brand-100/50">
      <div className="aspect-square bg-linear-to-br from-brand-100 to-brand-200/30 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <Package
            size={64}
            className="text-brand-300/60"
            strokeWidth={0.8}
          />
        </div>

        <div className="absolute top-3 left-3 flex gap-1.5">
          {product.isHandmade && (
            <Badge variant="handmade">
              <Sparkles size={10} className="mr-1" />
              Handmade
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="success">Mới</Badge>
          )}
        </div>

        <button
          onClick={() => setLiked(!liked)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            liked
              ? "bg-red-50 text-red-500"
              : "bg-white/80 text-brand-400 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} strokeWidth={1.5} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-brand-700/5 to-transparent h-20" />
      </div>

      <div className="p-4 md:p-5">
        <div className="flex items-center gap-1 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < 4 ? "text-brand-400" : "text-brand-200"}
              fill={i < 4 ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          ))}
          <span className="text-xs text-brand-400 ml-1">(4.0)</span>
        </div>

        <p className="text-xs text-brand-400 uppercase tracking-wider font-medium">
          {product.category}
        </p>
        <h3 className="font-serif text-lg font-semibold text-brand-700 mt-1 leading-snug">
          {product.name}
        </h3>
        <p className="text-sm text-brand-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-50">
          <span className="text-xl font-bold text-brand-400 font-serif">
            {formatCurrency(product.price)}
          </span>
          <Button
            size="sm"
            icon={<ShoppingBag size={14} />}
            className="shadow-sm"
          >
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
}
