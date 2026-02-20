import { Card, CardHeader } from "@/components/ui/Card";
import { Settings } from "lucide-react";
import { RectifierModule } from "@/types";
import { cn } from "@/lib/utils";

interface RectifierModuleStatusCardProps {
  data: RectifierModule[];
}

export function RectifierModuleStatusCard({ data }: RectifierModuleStatusCardProps) {
  return (
    <Card className="col-span-12 lg:col-span-7">
      <CardHeader title="Rectifier Module Status" icon={<Settings className="w-4 h-4 text-amber-500" />} />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
        {data.map((module) => (
          <div key={module.id} className="w-full p-3 rounded-xl border border-gray-100 flex flex-col gap-2 hover:bg-gray-50/50 transition-colors">
            <span className="text-xs font-medium text-gray-500">
              Module <br/>
              <span className="text-sm text-gray-900">{module.id}</span>
            </span>
            
            <div className="flex items-center gap-1.5 my-1">
              <div className={cn("w-1.5 h-1.5 rounded-full", 
                module.status === 'Fault' ? "bg-red-500" :
                module.status === 'Protect' ? "bg-amber-500" :
                module.status === 'AC Off' ? "bg-gray-400" :
                "bg-emerald-500"
              )} />
              <span className={cn("text-xs font-bold",
                 module.status === 'Fault' ? "text-red-500" :
                 module.status === 'Protect' ? "text-amber-500" :
                 module.status === 'AC Off' ? "text-gray-500" :
                 "text-emerald-500"
              )}>
                {module.status}
              </span>
            </div>

            <span className="text-[10px] text-gray-400 font-mono truncate max-w-full">
              {module.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
