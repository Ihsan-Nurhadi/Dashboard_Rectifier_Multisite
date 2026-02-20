import { Card, CardHeader } from "@/components/ui/Card";
import { MetricItem } from "@/components/ui/MetricItem";
import { Gauge } from "lucide-react";
import { RectifierStatus } from "@/types";

interface RectifierStatusCardProps {
  data: RectifierStatus;
}

export function RectifierStatusCard({ data }: RectifierStatusCardProps) {
  const metrics = [
    { label: "VAC Input Phase L1", value: data.vacInputL1, unit: "V", variant: "success" },
    { label: "VAC Input Phase L2", value: data.vacInputL2, unit: "V", variant: "success" },
    { label: "VAC Input Phase L3", value: data.vacInputL3 ?? "-", unit: "V", variant: "warning" },
    { label: "VDC Output", value: data.vdcOutput, unit: "V", variant: "info" },
    { label: "Battery Current", value: data.batteryCurrent, unit: "A", variant: "info" },

    { label: "IAC Input Phase L1", value: data.iacInputL1 ?? "-", unit: "A", variant: "warning" },
    { label: "IAC Input Phase L2", value: data.iacInputL2 ?? "-", unit: "A", variant: "warning" },
    { label: "IAC Input Phase L3", value: data.iacInputL3 ?? "-", unit: "A", variant: "warning" },
    { label: "Load Current DC Out", value: data.loadCurrent, unit: "A", variant: "success" },
    { label: "Load Power DC", value: data.loadPower, unit: "kW", variant: "success" },

    { label: "PAC Load Phase L1", value: data.pacLoadL1.toFixed(2), unit: "W", variant: "success" },
    { label: "PAC Load Phase L2", value: data.pacLoadL2.toFixed(2), unit: "W", variant: "success" },
    { label: "PAC Load Phase L3", value: data.pacLoadL3.toFixed(2), unit: "W", variant: "success" },
    { label: "Rectifier Current DC", value: data.rectifierCurrent, unit: "A", variant: "info" },
    { label: "Total Power DC", value: data.totalPower, unit: "kW", variant: "info" },
  ];

  return (
    <Card className="col-span-12">
      <CardHeader title="Rectifier Status" icon={<Gauge className="w-4 h-4 text-indigo-500" />} />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <MetricItem
            key={index}
            label={metric.label}
            value={metric.value}
            unit={metric.unit}
            variant={metric.variant as any}
          />
        ))}
      </div>
    </Card>
  );
}
