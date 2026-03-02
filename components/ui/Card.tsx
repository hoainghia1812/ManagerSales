import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-brand-100/50
        ${paddings[padding]}
        ${hover ? "hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  action?: ReactNode;
  subtitle?: string;
}

export function CardHeader({ title, action, subtitle }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-serif text-lg font-semibold text-brand-700">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-brand-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
