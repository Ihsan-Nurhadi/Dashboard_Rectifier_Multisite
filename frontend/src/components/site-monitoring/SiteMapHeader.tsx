import { Building2, Satellite } from "lucide-react";
import { SITES } from "../../data/sites";

export function SiteMapHeader() {
  const totalSites = SITES.length;
  const onlineSites = SITES.filter(s => s.status === 'online').length;
  const offlineSites = SITES.filter(s => s.status === 'offline').length;

  return (
    <div className="bg-[#0f172a] text-white p-4 flex justify-between items-center shadow-md z-50 relative shrink-0">
      <div className="flex items-center gap-4">
        <div className="bg-emerald-400 p-2 rounded-lg">
          <Satellite className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Rectifier Site Map</h1>
          <p className="text-xs text-gray-400">Real-time Surveillance</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Total Sites Card */}
        <div className="bg-[#1e293b] rounded-lg p-3 flex items-center gap-3 min-w-[140px] border border-gray-800">
          <div className="p-2 bg-cyan-900/30 rounded-lg">
            <Building2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total Sites</p>
            <p className="text-xl font-bold">{totalSites}</p>
          </div>
        </div>

        {/* Online Sites Card */}
        <div className="bg-[#1e293b] rounded-lg p-3 flex items-center gap-3 min-w-[140px] border border-gray-800">
          <div className="p-2 bg-emerald-900/30 rounded-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Online</p>
            <p className="text-xl font-bold text-emerald-400">{onlineSites}</p>
          </div>
        </div>

        {/* Offline Sites Card */}
        <div className="bg-[#1e293b] rounded-lg p-3 flex items-center gap-3 min-w-[140px] border border-gray-800">
          <div className="p-2 bg-slate-700/30 rounded-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Offline</p>
            <p className="text-xl font-bold">{offlineSites}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
