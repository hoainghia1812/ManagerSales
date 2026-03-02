"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Users,
  UserPlus,
  Crown,
  Heart,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  ArrowUpRight,
  Star,
} from "lucide-react";
import { customers, formatCurrency, formatDate } from "@/lib/data";

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgSpent = totalRevenue / totalCustomers;
  const topCustomer = customers.reduce((top, c) =>
    c.totalSpent > top.totalSpent ? c : top
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
            Khách hàng
          </h1>
          <p className="text-brand-500 mt-1">
            Quản lý thông tin khách hàng thân thiết
          </p>
        </div>
        <Button icon={<UserPlus size={18} />}>Thêm khách hàng</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng khách hàng"
          value={totalCustomers.toString()}
          change="+12%"
          changeType="increase"
          icon={<Users size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Khách hàng VIP"
          value="5"
          change="+2"
          changeType="increase"
          icon={<Crown size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Chi tiêu TB"
          value={formatCurrency(Math.round(avgSpent))}
          change="+8.5%"
          changeType="increase"
          icon={<Heart size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(totalRevenue)}
          change="+15%"
          changeType="increase"
          icon={<Star size={22} strokeWidth={1.5} />}
        />
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-4">
          <CardHeader title="Danh sách khách hàng" />
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm khách hàng..."
            className="w-full md:w-72"
          />
        </div>

        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-brand-100">
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                  Liên hệ
                </th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="text-right py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Tổng chi tiêu
                </th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">
                  Hạng
                </th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">
                  Lần mua cuối
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => {
                const tier =
                  customer.totalSpent >= 10000000
                    ? "VIP"
                    : customer.totalSpent >= 5000000
                      ? "Gold"
                      : "Silver";
                const tierVariant =
                  tier === "VIP"
                    ? "handmade"
                    : tier === "Gold"
                      ? "warning"
                      : "default";

                return (
                  <tr
                    key={customer.id}
                    className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-400 font-serif font-semibold text-sm shrink-0">
                          {customer.name
                            .split(" ")
                            .slice(-2)
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-brand-700">
                            {customer.name}
                          </p>
                          <p className="text-xs text-brand-400">
                            {customer.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 hidden md:table-cell">
                      <div className="space-y-1">
                        <p className="text-brand-600 flex items-center gap-1.5 text-xs">
                          <Mail size={12} strokeWidth={1.5} />
                          {customer.email}
                        </p>
                        <p className="text-brand-500 flex items-center gap-1.5 text-xs">
                          <Phone size={12} strokeWidth={1.5} />
                          {customer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <ShoppingBag
                          size={14}
                          className="text-brand-400"
                          strokeWidth={1.5}
                        />
                        <span className="font-medium text-brand-700">
                          {customer.totalOrders}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <p className="font-semibold text-brand-700">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                      <ProgressBar
                        value={customer.totalSpent}
                        max={topCustomer.totalSpent}
                        className="mt-1.5"
                      />
                    </td>
                    <td className="py-4 px-5 text-center hidden lg:table-cell">
                      <Badge variant={tierVariant as any}>{tier}</Badge>
                    </td>
                    <td className="py-4 px-5 text-center text-brand-500 text-xs hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar size={12} />
                        {formatDate(customer.lastOrder)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
