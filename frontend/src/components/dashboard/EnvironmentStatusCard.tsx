import { Card, CardHeader } from "@/components/ui/Card";
import { MetricItem } from "@/components/ui/MetricItem";
import { Thermometer, Droplet, DoorOpen, BatteryWarning } from "lucide-react";
import { EnvironmentStatus } from "@/types";

interface EnvironmentStatusCardProps {
  data: EnvironmentStatus;
}

export function EnvironmentStatusCard({ data }: EnvironmentStatusCardProps) {
  return (
    <Card className="col-span-12 lg:col-span-5">
      <CardHeader title="Environment Status" icon={<Thermometer className="w-4 h-4 text-teal-500" />} />
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col p-4 bg-gray-50/50 rounded-lg">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 h-8">Door Cabinet</span>
          <span className={`text-lg font-bold ${data.doorCabinet === 'Close' ? 'text-emerald-500' : 'text-red-500'}`}>
            {data.doorCabinet}
          </span>
        </div>

        <div className="flex flex-col p-4 bg-gray-50/50 rounded-lg">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 h-8">Battery Stolen</span>
          <span className={`text-lg font-bold ${data.batteryStolen === 'Close' ? 'text-emerald-500' : 'text-red-500'}`}>
            {data.batteryStolen}
          </span>
        </div>

        <div className="flex flex-col p-4 bg-gray-50/50 rounded-lg">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 h-8">Temperature</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-amber-500">{data.temperature}</span>
            <span className="text-xs text-gray-400">°C</span>
          </div>
        </div>

        <div className="flex flex-col p-4 bg-gray-50/50 rounded-lg">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 h-8">Humidity</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-blue-500">{data.humidity}</span>
            <span className="text-xs text-gray-400">%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
