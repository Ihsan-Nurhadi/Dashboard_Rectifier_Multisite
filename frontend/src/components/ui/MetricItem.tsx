import { cn } from "@/lib/utils";

interface MetricItemProps {
  label: string;
  value: string | number;
  unit?: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export function MetricItem({ label, value, unit, variant = 'default', className }: MetricItemProps) {
  const variants = {
    success: "text-emerald-500",
    warning: "text-amber-500",
    danger: "text-red-500",
    info: "text-blue-500",
    default: "text-gray-900",
  };

  return (
    <div className={cn("flex flex-col p-4 bg-gray-50/50 rounded-lg", className)}>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-xl font-bold font-mono", variants[variant])}>{value}</span>
        {unit && <span className="text-xs text-gray-400 font-medium">{unit}</span>}
      </div>
    </div>
  );
}
