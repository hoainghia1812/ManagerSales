"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Banknote,
  TrendingUp,
  ShoppingBag,
  Target,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  monthlyRevenue,
  categoryRevenue,
  revenueData,
  ordersWithDetails,
  payments,
  formatCurrency,
} from "@/lib/data";

type Period = "week" | "month" | "year";

const periodLabels: Record<Period, string> = {
  week: "Tuần này",
  month: "Tháng này",
  year: "Năm nay",
};

export default function RevenuePage() {
  const [period, setPeriod] = useState<Period>("month");

  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = monthlyRevenue.reduce((s, m) => s + m.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const target = 700000000;
  const progress = (totalRevenue / target) * 100;

  const paidPayments = payments.filter((p) => p.status === "completed");
  const totalPaid = paidPayments.reduce((s, p) => s + p.amount, 0);

  const paymentMethods = paidPayments.reduce((acc, p) => {
    acc[p.method] = (acc[p.method] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">Thống kê doanh thu</h1>
          <p className="text-brand-500 mt-1">Phân tích hiệu quả kinh doanh</p>
        </div>
        <div className="flex border border-brand-200 rounded-xl overflow-hidden">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                period === p ? "bg-brand-700 text-white" : "bg-white text-brand-600 hover:bg-brand-50"
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng doanh thu" value={formatCurrency(totalRevenue)} change="+18.2%" changeType="increase" icon={<Banknote size={22} strokeWidth={1.5} />} />
        <StatCard title="Đã thu" value={formatCurrency(totalPaid)} change={`${paidPayments.length} giao dịch`} changeType="increase" icon={<TrendingUp size={22} strokeWidth={1.5} />} />
        <StatCard title="Giá trị TB/đơn" value={formatCurrency(Math.round(avgOrderValue))} change="+5.8%" changeType="increase" icon={<ShoppingBag size={22} strokeWidth={1.5} />} />
        <StatCard title="Mục tiêu năm" value={`${Math.round(progress)}%`} change={formatCurrency(target - totalRevenue) + " còn lại"} changeType="increase" icon={<Target size={22} strokeWidth={1.5} />} />
      </div>

      <Card>
        <CardHeader title="Mục tiêu doanh thu năm" subtitle={`${formatCurrency(totalRevenue)} / ${formatCurrency(target)}`} />
        <ProgressBar value={totalRevenue} max={target} showLabel color="bg-linear-to-r from-brand-700 to-brand-400" />
        <div className="flex justify-between mt-2 text-xs text-brand-500">
          <span>0</span>
          <span>{formatCurrency(target)}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Biểu đồ doanh thu theo tháng"
            action={<span className="flex items-center gap-1 text-sm text-emerald-600 font-medium"><ArrowUpRight size={16} />+18.2%</span>}
          />
          <div className="w-full" style={{ height: 320, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C0" vertical={false} />
                <XAxis dataKey="name" stroke="#8B6F5E" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B6F5E" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), "Doanh thu"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E8D5C0", boxShadow: "0 4px 12px rgba(74,44,29,0.08)", fontSize: "13px" }}
                />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                  {monthlyRevenue.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === monthlyRevenue.length - 1 ? "#C4973B" : "#4A2C1D"} opacity={0.4 + (index / (monthlyRevenue.length - 1)) * 0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader title="Theo danh mục" />
            <div className="space-y-4">
              {categoryRevenue.map((cat, i) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-brand-700">{cat.name}</span>
                    <span className="text-sm text-brand-400 font-medium">{cat.value}%</span>
                  </div>
                  <ProgressBar
                    value={cat.value} max={100}
                    color={i === 0 ? "bg-brand-700" : i === 1 ? "bg-brand-600" : i === 2 ? "bg-brand-400" : "bg-brand-300"}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Phương thức thanh toán" />
            <div className="space-y-3">
              {Object.entries(paymentMethods).map(([method, amount]) => (
                <div key={method} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-brand-700">{method}</span>
                  <span className="text-sm font-semibold text-brand-400">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Xu hướng doanh thu tuần" />
        <div className="w-full" style={{ height: 250, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A2C1D" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4A2C1D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8D5C0" vertical={false} />
              <XAxis dataKey="name" stroke="#8B6F5E" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8B6F5E" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip
                formatter={(value) => [formatCurrency(value as number), "Doanh thu"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #E8D5C0", boxShadow: "0 4px 12px rgba(74,44,29,0.08)", fontSize: "13px" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#4A2C1D" fillOpacity={1} fill="url(#colorWeekly)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
