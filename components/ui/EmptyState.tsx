import { ReactNode } from "react";
import { Package } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-400 mb-4">
        {icon || <Package size={28} strokeWidth={1.5} />}
      </div>
      <h3 className="font-serif text-lg font-semibold text-brand-700 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-brand-500 text-center max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
