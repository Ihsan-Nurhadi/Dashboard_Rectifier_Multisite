import { Card, CardHeader } from "@/components/ui/Card";
import { Battery, Timer } from "lucide-react";
import { BatteryStatus } from "@/types";

interface BatteryStatusCardProps {
  data: BatteryStatus;
}

function formatDuration(minutes: number | null): string {
  if (minutes === null || isNaN(minutes)) return "00:00:00";
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  const s = Math.floor((minutes * 60) % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function BatteryStatusCard({ data }: BatteryStatusCardProps) {
  return (
    <Card className="col-span-12">
      <CardHeader title="Battery" icon={<Battery className="w-4 h-4 text-emerald-500" />} />
      
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Battery Bank Table */}
        <div className="col-span-12 lg:col-span-6">
          <div className="mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Battery Bank Status</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 font-medium text-gray-500 text-xs uppercase">Item</th>
                    {data.banks.map(bank => (
                      <th key={bank.id} className="text-right py-2 font-medium text-gray-500 text-xs uppercase">Bank {bank.id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-500 text-xs">Voltage (V)</td>
                    {data.banks.map(bank => (
                      <td key={bank.id} className="text-right py-3 font-mono font-bold text-indigo-500">{bank.voltage}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-500 text-xs">Current (A)</td>
                    {data.banks.map(bank => (
                      <td key={bank.id} className="text-right py-3 font-mono font-bold text-gray-900">{bank.current}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-500 text-xs">SoC (%)</td>
                    {data.banks.map(bank => (
                      <td key={bank.id} className="text-right py-3 font-mono font-bold text-emerald-500">{bank.soc}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-500 text-xs">SoH (%)</td>
                    {data.banks.map(bank => (
                      <td key={bank.id} className="text-right py-3 font-mono font-bold text-emerald-500">{bank.soh}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Summary Metrics and Countdown */}
        <div className="col-span-12 lg:col-span-6">
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="flex flex-col p-4 bg-gray-50/50 rounded-lg">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Backup Duration</span>
              <span className="text-xl font-bold font-mono text-amber-500">{data.backupDuration ?? "—"}</span>
            </div>

            <div className="flex flex-col p-4 bg-gray-50/50 rounded-lg">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Status Battery</span>
              <span className="text-xl font-bold font-mono text-emerald-500">{data.status}</span>
            </div>

            <div className="flex flex-col p-4 bg-gray-50/50 rounded-lg">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Start Backup</span>
              <span className="text-xl font-bold font-mono text-pink-500">{data.startBackup}</span>
            </div>

            <div className="flex flex-col p-4 bg-gray-50/50 rounded-lg">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Time Remaining</span>
              <span className="text-xl font-bold font-mono text-amber-500">
                -
              </span>
            </div>
            
            {/* Countdown Backup Display */}
            <div className="col-span-2 flex flex-col p-4 bg-gray-50/50 rounded-lg">
               <span className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Countdown Backup</span>
               <div className="flex items-center gap-2">
                 <Timer className="w-5 h-5 text-gray-400" />
                 <span className="text-xl font-bold font-mono text-emerald-500 tracking-widest tabular-nums">
                   00:00:00
                 </span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
