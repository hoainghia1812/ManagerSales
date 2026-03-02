"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Menu, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Quản lý sản phẩm",
  "/orders": "Quản lý đơn hàng",
  "/customers": "Khách hàng",
  "/inventory": "Quản lý kho",
  "/revenue": "Thống kê doanh thu",
  "/api-explorer": "API Explorer",
};

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const title = pageTitles[pathname ?? ""] || "MUSH&CO.";
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Admin";

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

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
        <div className="hidden sm:block h-8 w-px bg-brand-100" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2.5 pl-1 hover:bg-brand-50 rounded-xl p-1.5 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center text-brand-100 text-sm font-semibold font-serif shadow-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-brand-700 leading-tight">
                {displayName}
              </p>
              <p className="text-xs text-brand-500 leading-tight truncate max-w-[120px]">
                {user?.email}
              </p>
            </div>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-brand-100 py-1 z-50">
                <div className="px-3 py-2 border-b border-brand-50">
                  <p className="text-sm font-medium text-brand-700 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-brand-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                  Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
