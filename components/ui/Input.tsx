import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-brand-600">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 rounded-xl border border-brand-200
              bg-white text-brand-700 text-sm
              placeholder:text-brand-400
              focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400
              transition-all duration-200
              ${icon ? "pl-10" : ""}
              ${error ? "border-red-400 focus:ring-red-400/20 focus:border-red-400" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  className = "",
}: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-brand-600">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-2.5 rounded-xl border border-brand-200
          bg-white text-brand-700 text-sm
          focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400
          transition-all duration-200 appearance-none cursor-pointer
          ${className}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
