"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X, Heart } from "lucide-react";

export function ShopHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-100/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-16 md:h-20 flex items-center justify-between">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-brand-700 p-2"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {["Tất cả", "Nến thơm", "Quà tặng", "Tinh dầu"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-400 hover:after:w-full after:transition-all"
                >
                  {item}
                </a>
              )
            )}
          </nav>

          <Link href="/shop" className="flex items-center gap-2.5 absolute left-1/2 -translate-x-1/2">
            <Image
              src="/logo.png"
              alt="MUSH & CO."
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="hidden sm:block">
              <span className="font-serif text-lg font-bold text-brand-700 tracking-wide">
                MUSH & CO.
              </span>
              <p className="text-[9px] text-brand-400 tracking-[0.2em] uppercase">
                The Luxury of Giving
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button className="p-2 text-brand-600 hover:text-brand-700 transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className="hidden sm:block p-2 text-brand-600 hover:text-brand-700 transition-colors">
              <Heart size={20} strokeWidth={1.5} />
            </button>
            <button className="relative p-2 text-brand-600 hover:text-brand-700 transition-colors">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-brand-100 bg-white px-4 py-4 space-y-2">
          {["Tất cả", "Nến thơm", "Quà tặng", "Tinh dầu", "Xà phòng", "Hoa khô"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="block py-2 text-brand-600 hover:text-brand-700 font-medium text-sm"
              >
                {item}
              </a>
            )
          )}
        </div>
      )}
    </header>
  );
}
