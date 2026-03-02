"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  ShoppingBag,
  Eye,
  Download,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  orders,
  statusLabels,
  statusVariants,
  formatCurrency,
  formatDate,
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
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const selected = selectedOrder
    ? orders.find((o) => o.id === selectedOrder)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
            Đơn hàng
          </h1>
          <p className="text-brand-500 mt-1">
            {orders.length} đơn hàng tổng cộng
          </p>
        </div>
        <Button
          variant="outline"
          icon={<Download size={18} strokeWidth={1.5} />}
        >
          Xuất Excel
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statusFilters.map((sf) => {
          const count =
            sf.key === "all"
              ? orders.length
              : statusCounts[sf.key] || 0;
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
              <sf.icon
                size={18}
                strokeWidth={1.5}
                className={
                  statusFilter === sf.key
                    ? "text-brand-400"
                    : "text-brand-500"
                }
              />
              <div className="text-left">
                <p className="text-xs text-brand-500">{sf.label}</p>
                <p className="text-lg font-semibold text-brand-700 font-serif leading-tight">
                  {count}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <Card padding="md">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm theo mã đơn, khách hàng..."
            className="w-full md:w-80"
          />
        </div>

        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-100">
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                  Sản phẩm
                </th>
                <th className="text-right py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">
                  Ngày
                </th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className={`border-b border-brand-50 hover:bg-brand-50/50 transition-colors cursor-pointer ${
                    selectedOrder === order.id ? "bg-brand-50" : ""
                  }`}
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder === order.id ? null : order.id
                    )
                  }
                >
                  <td className="py-3.5 px-5 font-medium text-brand-700">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-5">
                    <div>
                      <p className="text-brand-700 font-medium">
                        {order.customer}
                      </p>
                      <p className="text-xs text-brand-400">{order.phone}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-brand-500 hidden md:table-cell">
                    <div>
                      <p className="truncate max-w-[200px]">{order.product}</p>
                      <p className="text-xs text-brand-400">
                        SL: {order.items}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-right text-brand-700 font-semibold">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <Badge
                      variant={
                        statusVariants[order.status] as
                          | "success"
                          | "warning"
                          | "error"
                          | "info"
                      }
                    >
                      {statusLabels[order.status]}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-5 text-center text-brand-500 hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Calendar size={12} />
                      {formatDate(order.date)}
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <button className="p-1.5 text-brand-400 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <Card>
          <CardHeader
            title={`Chi tiết đơn hàng ${selected.id}`}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Đóng
              </Button>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-brand-600 uppercase tracking-wider">
                Thông tin khách hàng
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-brand-500">Tên:</span>{" "}
                  <span className="text-brand-700 font-medium">
                    {selected.customer}
                  </span>
                </p>
                <p>
                  <span className="text-brand-500">Email:</span>{" "}
                  <span className="text-brand-700">{selected.email}</span>
                </p>
                <p>
                  <span className="text-brand-500">SĐT:</span>{" "}
                  <span className="text-brand-700">{selected.phone}</span>
                </p>
                <p>
                  <span className="text-brand-500">Địa chỉ:</span>{" "}
                  <span className="text-brand-700">{selected.address}</span>
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-brand-600 uppercase tracking-wider">
                Thông tin đơn hàng
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-brand-500">Sản phẩm:</span>{" "}
                  <span className="text-brand-700 font-medium">
                    {selected.product}
                  </span>
                </p>
                <p>
                  <span className="text-brand-500">Số lượng:</span>{" "}
                  <span className="text-brand-700">{selected.items}</span>
                </p>
                <p>
                  <span className="text-brand-500">Tổng tiền:</span>{" "}
                  <span className="text-brand-700 font-semibold text-lg">
                    {formatCurrency(selected.total)}
                  </span>
                </p>
                <p>
                  <span className="text-brand-500">Trạng thái:</span>{" "}
                  <Badge
                    variant={
                      statusVariants[selected.status] as
                        | "success"
                        | "warning"
                        | "error"
                        | "info"
                    }
                  >
                    {statusLabels[selected.status]}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
