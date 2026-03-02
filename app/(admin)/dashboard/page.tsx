"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import {
  Banknote,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  revenueData,
  ordersWithDetails,
  productsWithDetails,
  customers,
  variants,
  formatCurrency,
  formatDate,
  orderStatusLabels,
  orderStatusVariants,
  paymentStatusLabels,
  paymentStatusVariants,
  getLowStockVariants,
  getTotalStock,
} from "@/lib/data";

export default function DashboardPage() {
  const completedOrders = ordersWithDetails.filter((o) => o.status === "completed");
  const totalRevenue = completedOrders.reduce((s, o) => s + o.total_amount, 0);
  const lowStock = getLowStockVariants();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
          Xin chào!
        </h1>
        <p className="text-brand-500 mt-1">
          Tổng quan hoạt động kinh doanh
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Doanh thu"
          value={formatCurrency(totalRevenue)}
          change="+12.5%"
          changeType="increase"
          icon={<Banknote size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Đơn hàng"
          value={ordersWithDetails.length.toString()}
          change="+8.2%"
          changeType="increase"
          icon={<ShoppingBag size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Khách hàng"
          value={customers.length.toString()}
          change="+5.1%"
          changeType="increase"
          icon={<Users size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Tồn kho"
          value={getTotalStock().toString()}
          change={`${variants.length} biến thể`}
          changeType="increase"
          icon={<Package size={22} strokeWidth={1.5} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Doanh thu 7 ngày qua"
            action={
              <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                <TrendingUp size={16} />
                +12.5%
              </span>
            }
          />
          <div className="w-full" style={{ height: 280, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C4973B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C4973B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C0" vertical={false} />
                <XAxis dataKey="name" stroke="#8B6F5E" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B6F5E" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), "Doanh thu"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E8D5C0", boxShadow: "0 4px 12px rgba(74,44,29,0.08)", fontSize: "13px" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C4973B" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Cảnh báo tồn kho"
            action={
              <Badge variant="warning">
                <AlertTriangle size={12} className="mr-1" />
                {lowStock.length} sắp hết
              </Badge>
            }
          />
          <div className="space-y-3">
            {lowStock.slice(0, 6).map((v) => (
              <div key={v.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                  <AlertTriangle size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-700 truncate">
                    {v.product?.name}
                  </p>
                  <p className="text-xs text-brand-500">
                    {v.sku} · {v.size}
                  </p>
                </div>
                <span className="text-sm font-semibold text-amber-600">
                  {v.stock_quantity}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Đơn hàng gần đây"
          action={
            <a href="/orders" className="text-sm text-brand-400 hover:text-brand-700 transition-colors flex items-center gap-1 font-medium">
              Xem tất cả
              <ArrowUpRight size={14} />
            </a>
          }
        />
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-100">
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Mã đơn</th>
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Khách hàng</th>
                <th className="text-right py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Tổng tiền</th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Trạng thái</th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Thanh toán</th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {ordersWithDetails.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-brand-700 font-mono text-xs">{order.order_code}</td>
                  <td className="py-3.5 px-5 text-brand-600">{order.customer?.full_name}</td>
                  <td className="py-3.5 px-5 text-right text-brand-700 font-semibold">{formatCurrency(order.total_amount)}</td>
                  <td className="py-3.5 px-5 text-center">
                    <Badge variant={orderStatusVariants[order.status] as "success" | "warning" | "error" | "info"}>
                      {orderStatusLabels[order.status]}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <Badge variant={paymentStatusVariants[order.payment_status] as "success" | "warning" | "error"}>
                      {paymentStatusLabels[order.payment_status]}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-5 text-center text-brand-500 text-xs hidden md:table-cell">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
