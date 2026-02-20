import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status?: 'success' | 'warning' | 'error' | 'info' | 'default';
  className?: string;
}

export function StatusIndicator({ status = 'default', className }: StatusIndicatorProps) {
  const colors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    default: "bg-gray-400",
  };

  return (
    <div className={cn("w-2 h-2 rounded-full", colors[status], className)} />
  );
}
