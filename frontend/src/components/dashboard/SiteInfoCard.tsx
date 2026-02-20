import { Card, CardHeader } from "@/components/ui/Card";
import { Info } from "lucide-react";
import { SiteInfo } from "@/types";
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/ui/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-50 flex items-center justify-center text-gray-400 text-xs rounded-xl">
      Loading map...
    </div>
  )
});

interface SiteInfoCardProps {
  data: SiteInfo;
}

export function SiteInfoCard({ data }: SiteInfoCardProps) {
  return (
    <Card className="col-span-12">
      <CardHeader title="Site Information" icon={<Info className="w-4 h-4 text-indigo-500" />} />
      
      <div className="grid grid-cols-12 gap-8">
        {/* Left Info Column */}
        <div className="col-span-12 lg:col-span-5">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-xs font-medium text-gray-400 uppercase">Site Name</span>
              <span className="text-sm font-bold text-gray-900">{data.siteName}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-xs font-medium text-gray-400 uppercase">Project ID</span>
              <span className="text-sm font-bold text-gray-900 font-mono">{data.projectId}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-xs font-medium text-gray-400 uppercase">Ladder</span>
              <span className="text-sm font-bold text-gray-900">{data.ladder}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-400 uppercase">SLA</span>
              <span className="text-sm font-bold text-gray-900">{data.sla}</span>
            </div>
          </div>
        </div>

        {/* Middle Status Column */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
            <span className="text-xs font-medium text-gray-400 uppercase block mb-1">Status Realtime</span>
            <span className="text-xl font-bold text-emerald-500 font-mono">Normal</span>
          </div>
          
          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/30">
            <span className="text-xs font-medium text-gray-400 uppercase block mb-1">Status Ladder</span>
            <span className="text-xl font-bold text-amber-500 font-mono">Over</span>
          </div>

          <div className="mt-auto">
             <span className="text-xs font-medium text-gray-400 uppercase block mb-1">Last Data</span>
             <span className="text-xs font-mono text-gray-600">{data.lastData}</span>
          </div>
        </div>

        {/* Right Map Column */}
        <div className="col-span-12 lg:col-span-4 h-[250px] lg:h-auto min-h-[200px]">
          <div className="h-full w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm relative z-0">
            <Map 
              lat={data.location.lat} 
              lng={data.location.lng} 
              popupText={data.siteName}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
