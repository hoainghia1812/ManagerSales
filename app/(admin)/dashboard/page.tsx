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
  topProducts,
  formatCurrency,
  orders,
  statusLabels,
  statusVariants,
} from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
          Xin chào!
        </h1>
        <p className="text-brand-500 mt-1">
          Tổng quan hoạt động kinh doanh hôm nay
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Doanh thu tháng"
          value="45.2M"
          change="+12.5%"
          changeType="increase"
          icon={<Banknote size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Đơn hàng"
          value="156"
          change="+8.2%"
          changeType="increase"
          icon={<ShoppingBag size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Khách hàng mới"
          value="34"
          change="+5.1%"
          changeType="increase"
          icon={<Users size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Sản phẩm"
          value="48"
          change="+2"
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
                  <linearGradient
                    id="colorRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#C4973B"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#C4973B"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E8D5C0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#8B6F5E"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#8B6F5E"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), "Doanh thu"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E8D5C0",
                    boxShadow: "0 4px 12px rgba(74,44,29,0.08)",
                    fontSize: "13px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C4973B"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Sản phẩm bán chạy" />
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-400 text-xs font-semibold font-serif shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-700 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-brand-500">
                    {product.sold} đã bán
                  </p>
                </div>
                <span className="text-xs font-medium text-brand-400 whitespace-nowrap">
                  {product.revenue}
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
            <a
              href="/orders"
              className="text-sm text-brand-400 hover:text-brand-700 transition-colors flex items-center gap-1 font-medium"
            >
              Xem tất cả
              <ArrowUpRight size={14} />
            </a>
          }
        />
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm min-w-[600px]">
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
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors"
                >
                  <td className="py-3.5 px-5 font-medium text-brand-700">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-5 text-brand-600">
                    {order.customer}
                  </td>
                  <td className="py-3.5 px-5 text-brand-500 hidden md:table-cell">
                    {order.product}
                  </td>
                  <td className="py-3.5 px-5 text-right text-brand-700 font-medium">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
