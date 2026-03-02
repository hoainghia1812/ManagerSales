"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  ShoppingBag,
  Download,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2,
  Calendar,
  CreditCard,
  Package,
  FileText,
  Plus,
} from "lucide-react";
import {
  ordersWithDetails,
  orderStatusLabels,
  orderStatusVariants,
  paymentStatusLabels,
  paymentStatusVariants,
  formatCurrency,
  formatDate,
  type Order,
} from "@/lib/data";

const statusFilters = [
  { key: "all", label: "Tất cả", icon: ShoppingBag },
  { key: "pending", label: "Chờ xử lý", icon: Clock },
  { key: "processing", label: "Đang xử lý", icon: Loader2 },
  { key: "shipping", label: "Đang giao", icon: Truck },
  { key: "completed", label: "Hoàn thành", icon: CheckCircle2 },
  { key: "cancelled", label: "Đã huỷ", icon: XCircle },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = ordersWithDetails.filter((o) => {
    const matchSearch =
      o.order_code.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.full_name.toLowerCase().includes(search.toLowerCase()) ||
      "";
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = ordersWithDetails.reduce(
    (acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">Đơn hàng</h1>
          <p className="text-brand-500 mt-1">{ordersWithDetails.length} đơn hàng tổng cộng</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Download size={18} strokeWidth={1.5} />}>Xuất Excel</Button>
          <Button icon={<Plus size={18} />}>Tạo đơn</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statusFilters.map((sf) => {
          const count = sf.key === "all" ? ordersWithDetails.length : statusCounts[sf.key] || 0;
          return (
            <button
              key={sf.key}
              onClick={() => setStatusFilter(sf.key)}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                statusFilter === sf.key
                  ? "border-brand-400 bg-brand-400/5 shadow-sm"
                  : "border-brand-100 bg-white hover:border-brand-200"
              }`}
            >
              <sf.icon size={18} strokeWidth={1.5} className={statusFilter === sf.key ? "text-brand-400" : "text-brand-500"} />
              <div className="text-left">
                <p className="text-xs text-brand-500">{sf.label}</p>
                <p className="text-lg font-semibold text-brand-700 font-serif leading-tight">{count}</p>
              </div>
            </button>
          );
        })}
      </div>

      <Card padding="none">
        <div className="p-5 pb-0">
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm mã đơn, khách hàng..." className="w-full md:w-80" />
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-brand-100">
                <th className="w-10 py-3 px-4"></th>
                <th className="text-left py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider">Mã đơn</th>
                <th className="text-left py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider">Khách hàng</th>
                <th className="text-right py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider">Tổng tiền</th>
                <th className="text-center py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider">Trạng thái</th>
                <th className="text-center py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider">Thanh toán</th>
                <th className="text-center py-3 px-4 text-brand-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrder === order.id}
                  onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function OrderRow({ order, isExpanded, onToggle }: {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className={`border-b border-brand-50 hover:bg-brand-50/50 transition-colors cursor-pointer ${isExpanded ? "bg-brand-50/50" : ""}`} onClick={onToggle}>
        <td className="py-3.5 px-4">
          <button className="text-brand-400">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </td>
        <td className="py-3.5 px-4">
          <p className="font-mono text-xs font-medium text-brand-700">{order.order_code}</p>
        </td>
        <td className="py-3.5 px-4">
          <p className="text-brand-700 font-medium">{order.customer?.full_name}</p>
          <p className="text-xs text-brand-400">{order.customer?.phone}</p>
        </td>
        <td className="py-3.5 px-4 text-right text-brand-700 font-semibold">{formatCurrency(order.total_amount)}</td>
        <td className="py-3.5 px-4 text-center">
          <Badge variant={orderStatusVariants[order.status] as "success" | "warning" | "error" | "info"}>
            {orderStatusLabels[order.status]}
          </Badge>
        </td>
        <td className="py-3.5 px-4 text-center">
          <Badge variant={paymentStatusVariants[order.payment_status] as "success" | "warning" | "error"}>
            {paymentStatusLabels[order.payment_status]}
          </Badge>
        </td>
        <td className="py-3.5 px-4 text-center text-brand-500 text-xs hidden md:table-cell">
          <div className="flex items-center justify-center gap-1">
            <Calendar size={12} />
            {formatDate(order.created_at)}
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7} className="bg-brand-50/30 px-4 py-4">
            <div className="ml-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Items */}
              <div>
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Package size={14} /> Sản phẩm ({order.items?.length})
                </p>
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-brand-100/50">
                      <div className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center text-brand-400 shrink-0">
                        <Package size={16} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-700 truncate">{item.variant?.product?.name}</p>
                        <p className="text-xs text-brand-400">{item.variant?.sku} · {item.variant?.color} · {item.variant?.size}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-brand-700">{formatCurrency(item.price)}</p>
                        <p className="text-xs text-brand-400">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info + Payments */}
              <div className="space-y-4">
                {order.note && (
                  <div>
                    <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FileText size={14} /> Ghi chú
                    </p>
                    <p className="text-sm text-brand-600 bg-white rounded-xl p-3 border border-brand-100/50 italic">{order.note}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CreditCard size={14} /> Thanh toán
                  </p>
                  {order.payments && order.payments.length > 0 ? (
                    <div className="space-y-2">
                      {order.payments.map((p) => (
                        <div key={p.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-brand-100/50">
                          <div>
                            <p className="text-sm font-medium text-brand-700">{p.method}</p>
                            <p className="text-xs text-brand-400">{formatDate(p.paid_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-emerald-600">{formatCurrency(p.amount)}</p>
                            <Badge variant="success" className="text-[10px]">Đã thanh toán</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-brand-400 italic bg-white rounded-xl p-3 border border-brand-100/50">Chưa có thanh toán</p>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
