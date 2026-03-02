"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import {
  customers,
  ordersWithDetails,
  formatCurrency,
  formatDate,
} from "@/lib/data";

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const customerStats = customers.map((c) => {
    const customerOrders = ordersWithDetails.filter((o) => o.customer_id === c.id && o.status !== "cancelled");
    const totalSpent = customerOrders.reduce((s, o) => s + o.total_amount, 0);
    return { ...c, orderCount: customerOrders.length, totalSpent };
  });

  const filteredStats = customerStats.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const totalSpentAll = customerStats.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">Khách hàng</h1>
          <p className="text-brand-500 mt-1">Quản lý thông tin khách hàng</p>
        </div>
        <Button icon={<UserPlus size={18} />}>Thêm khách hàng</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Tổng khách hàng"
          value={customers.length.toString()}
          change="+12%"
          changeType="increase"
          icon={<Users size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Tổng đơn hàng"
          value={ordersWithDetails.filter((o) => o.status !== "cancelled").length.toString()}
          change="+8%"
          changeType="increase"
          icon={<ShoppingBag size={22} strokeWidth={1.5} />}
        />
        <StatCard
          title="Doanh thu từ KH"
          value={formatCurrency(totalSpentAll)}
          change="+15%"
          changeType="increase"
          icon={<Users size={22} strokeWidth={1.5} />}
        />
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-4">
          <CardHeader title="Danh sách khách hàng" />
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm khách hàng..." className="w-full md:w-72" />
        </div>

        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-100">
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Khách hàng</th>
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Liên hệ</th>
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Địa chỉ</th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Đơn hàng</th>
                <th className="text-right py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">Tổng chi tiêu</th>
                <th className="text-center py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((customer) => (
                <tr key={customer.id} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-400 font-serif font-semibold text-sm shrink-0">
                        {customer.full_name.split(" ").slice(-2).map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-brand-700">{customer.full_name}</p>
                        <p className="text-xs text-brand-400">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 hidden md:table-cell">
                    <div className="space-y-1">
                      <p className="text-brand-600 flex items-center gap-1.5 text-xs">
                        <Mail size={12} strokeWidth={1.5} />{customer.email}
                      </p>
                      <p className="text-brand-500 flex items-center gap-1.5 text-xs">
                        <Phone size={12} strokeWidth={1.5} />{customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-5 hidden lg:table-cell">
                    <p className="text-brand-500 flex items-center gap-1.5 text-xs max-w-[200px] truncate">
                      <MapPin size={12} strokeWidth={1.5} className="shrink-0" />{customer.address}
                    </p>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="font-semibold text-brand-700">{customer.orderCount}</span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <p className="font-semibold text-brand-700">{formatCurrency(customer.totalSpent)}</p>
                  </td>
                  <td className="py-4 px-5 text-center text-brand-500 text-xs hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar size={12} />{formatDate(customer.created_at)}
                    </div>
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
