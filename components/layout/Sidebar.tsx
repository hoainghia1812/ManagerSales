"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Warehouse,
  Tag,
  Code2,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Sản phẩm", icon: Package },
  { href: "/categories", label: "Danh mục", icon: Tag },
  { href: "/orders", label: "Đơn hàng", icon: ShoppingBag },
  { href: "/customers", label: "Khách hàng", icon: Users },
  { href: "/inventory", label: "Kho hàng", icon: Warehouse },
  { href: "/revenue", label: "Doanh thu", icon: BarChart3 },
  { href: "/api-explorer", label: "API Explorer", icon: Code2 },
];


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-900/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] bg-brand-700
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-brand-600/30">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="MUSH & CO."
              width={36}
              height={36}
              className="rounded-lg brightness-200"
            />
            <div>
              <span className="font-serif text-base font-semibold text-brand-100 tracking-wide">
              MUSH&CO.
              </span>
              <p className="text-[10px] text-brand-400 tracking-widest uppercase">
                Sales Manager
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-brand-300 hover:text-white p-1 rounded-lg hover:bg-brand-600/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] font-semibold text-brand-500 uppercase tracking-widest">
            Quản lý
          </p>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname?.startsWith(item.href + "/") ?? false);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-brand-400/15 text-brand-400 shadow-sm"
                      : "text-brand-300 hover:bg-brand-600/40 hover:text-brand-100"
                  }
                `}
              >
                <item.icon size={19} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-600/30">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-brand-400/20 flex items-center justify-center text-brand-400 text-sm font-semibold font-serif">
              MC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-100 truncate">
                Admin
              </p>
              <p className="text-xs text-brand-500 truncate">
                admin@mushco.vn
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
