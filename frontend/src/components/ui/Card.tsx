import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-100 p-6", className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  icon?: ReactNode;
  className?: string;
}

export function CardHeader({ title, icon, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center gap-2 mb-4 border-b border-dashed border-gray-100 pb-2", className)}>
      {icon}
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</h3>
    </div>
  );
}
