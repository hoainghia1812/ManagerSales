"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400"
        strokeWidth={1.5}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-700 text-sm placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all duration-200"
      />
    </div>
  );
}
