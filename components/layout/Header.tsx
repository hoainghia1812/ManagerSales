"use client";

import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Quản lý sản phẩm",
  "/orders": "Quản lý đơn hàng",
  "/customers": "Khách hàng",
  "/revenue": "Thống kê doanh thu",
  "/settings": "Cài đặt",
};

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname ?? ""] || "MUSH & CO.";

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-brand-100/80 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-brand-600 hover:text-brand-700 p-2 rounded-xl hover:bg-brand-50 transition-colors"
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>
        <h1 className="font-serif text-lg md:text-xl font-semibold text-brand-700">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:flex items-center bg-brand-50 rounded-xl px-3 py-2 border border-brand-100 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/20 transition-all">
          <Search size={16} className="text-brand-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="bg-transparent ml-2 text-sm text-brand-700 placeholder:text-brand-400 focus:outline-none w-44"
          />
        </div>

        <button className="relative p-2 text-brand-500 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors">
          <Bell size={20} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-400 rounded-full ring-2 ring-white" />
        </button>

        <div className="hidden sm:block h-8 w-px bg-brand-100" />

        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center text-brand-100 text-sm font-semibold font-serif shadow-sm">
            MC
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-brand-700 leading-tight">
              Admin
            </p>
            <p className="text-xs text-brand-500 leading-tight">Quản lý</p>
          </div>
        </div>
      </div>
    </header>
  );
}
