import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "increase" | "decrease";
  icon: ReactNode;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "increase",
  icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-100/50 p-5 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-brand-500 font-medium">{title}</p>
          <p className="text-2xl font-semibold text-brand-700 font-serif">
            {value}
          </p>
          {change && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                changeType === "increase"
                  ? "text-emerald-600"
                  : "text-red-500"
              }`}
            >
              {changeType === "increase" ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {change}
              <span className="text-brand-400 ml-1">vs tháng trước</span>
            </div>
          )}
        </div>
        <div className="w-11 h-11 rounded-xl bg-brand-400/10 flex items-center justify-center text-brand-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
