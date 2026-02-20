import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({ label, variant = 'default', className, size = 'md' }: BadgeProps) {
  const variants = {
    success: "text-emerald-500 font-bold",
    warning: "text-amber-500 font-bold",
    danger: "text-red-500 font-bold",
    info: "text-blue-500 font-bold",
    default: "text-gray-500 font-bold",
  };

  const sizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <span className={cn(variants[variant], sizes[size as keyof typeof sizes] || sizes.md, className)}>
      {label}
    </span>
  );
}
