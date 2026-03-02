"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import {
  Warehouse,
  Package,
  AlertTriangle,
  XCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  Sliders,
  Plus,
  Calendar,
} from "lucide-react";
import {
  inventoryLogsWithDetails,
  inventoryChangeLabels,
  inventoryChangeVariants,
  variantsWithProduct,
  getTotalStock,
  getLowStockVariants,
  getOutOfStockVariants,
  formatDate,
  formatCurrency,
} from "@/lib/data";

const changeTypeFilters = [
  { key: "all", label: "Tất cả", icon: RefreshCw },
  { key: "order", label: "Bán hàng", icon: ArrowDownCircle },
  { key: "cancel", label: "Hoàn trả", icon: ArrowUpCircle },
  { key: "restock", label: "Nhập kho", icon: Plus },
  { key: "adjustment", label: "Điều chỉnh", icon: Sliders },
];

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const lowStock = getLowStockVariants();
  const outOfStock = getOutOfStockVariants();

  const filteredLogs = inventoryLogsWithDetails.filter((l) => {
    const matchSearch =
      l.variant?.product?.name.toLowerCase().includes(search.toLowerCase()) ||
      l.variant?.sku.toLowerCase().includes(search.toLowerCase()) ||
      l.note.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || l.change_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">Kho hàng</h1>
          <p className="text-brand-500 mt-1">Quản lý tồn kho & lịch sử xuất nhập</p>
        </div>
        <Button icon={<Plus size={18} />}>Nhập kho</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng tồn kho"
          value={getTotalStock().toString()}
          change={`${variantsWithProduct.length} biến thể`}
          changeType="increase"
          icon={<Warehouse size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Sản phẩm"
          value={variantsWithProduct.length.toString()}
          change="SKU đang quản lý"
          changeType="increase"
          icon={<Package size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Sắp hết hàng"
          value={lowStock.length.toString()}
          change="≤ 5 sản phẩm"
          changeType="decrease"
          icon={<AlertTriangle size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Hết hàng"
          value={outOfStock.length.toString()}
          change="Cần nhập thêm"
          changeType="decrease"
          icon={<XCircle size={22} strokeWidth={1.5} />}
        />
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Low Stock Warnings */}
        <Card>
          <CardHeader
            title="Cảnh báo tồn kho thấp"
            action={<Badge variant="warning">{lowStock.length + outOfStock.length} cảnh báo</Badge>}
          />
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {outOfStock.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                  <XCircle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-700 truncate">{v.product?.name}</p>
                  <p className="text-xs text-brand-400">{v.sku} · {v.color} · {v.size}</p>
                </div>
                <Badge variant="error">Hết hàng</Badge>
              </div>
            ))}
            {lowStock.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-700 truncate">{v.product?.name}</p>
                  <p className="text-xs text-brand-400">{v.sku} · {v.color} · {v.size}</p>
                </div>
                <span className="text-sm font-semibold text-amber-600">{v.stock_quantity}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* All Variants Stock */}
        <Card>
          <CardHeader title="Tồn kho theo biến thể" />
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {variantsWithProduct
              .filter((v) => v.stock_quantity > 0)
              .sort((a, b) => a.stock_quantity - b.stock_quantity)
              .map((v) => (
                <div key={v.id} className="flex items-center gap-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-700 truncate">{v.product?.name}</p>
                    <p className="text-xs text-brand-400">{v.sku} · {v.size} · {formatCurrency(v.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-20 h-2 bg-brand-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${v.stock_quantity <= 5 ? "bg-amber-400" : v.stock_quantity <= 15 ? "bg-brand-400" : "bg-emerald-500"}`}
                        style={{ width: `${Math.min((v.stock_quantity / 70) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-semibold min-w-[2.5rem] text-right ${v.stock_quantity <= 5 ? "text-amber-600" : "text-brand-700"}`}>
                      {v.stock_quantity}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Inventory Logs */}
      <Card>
        <CardHeader title="Lịch sử xuất nhập kho" />
        <div className="flex flex-wrap gap-2 mb-4">
          {changeTypeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                typeFilter === f.key
                  ? "bg-brand-700 text-white shadow-sm"
                  : "bg-brand-50 text-brand-600 hover:bg-brand-100"
              }`}
            >
              <f.icon size={14} />
              {f.label}
            </button>
          ))}
        </div>

        <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo sản phẩm, SKU, ghi chú..." className="mb-4 w-full md:w-80" />

        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-100">
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Thời gian</th>
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Sản phẩm / SKU</th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Loại</th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Số lượng</th>
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors">
                  <td className="py-3 px-5 text-brand-500 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(log.created_at)}
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-sm font-medium text-brand-700">{log.variant?.product?.name}</p>
                    <p className="text-xs text-brand-400 font-mono">{log.variant?.sku} · {log.variant?.size}</p>
                  </td>
                  <td className="py-3 px-5 text-center">
                    <Badge variant={inventoryChangeVariants[log.change_type] as "success" | "warning" | "error" | "info"}>
                      {inventoryChangeLabels[log.change_type]}
                    </Badge>
                  </td>
                  <td className="py-3 px-5 text-center">
                    <span className={`font-semibold ${log.quantity_changed > 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {log.quantity_changed > 0 ? "+" : ""}{log.quantity_changed}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-brand-500 text-sm">{log.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
