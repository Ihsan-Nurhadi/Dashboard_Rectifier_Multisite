import { Bell, Map, RefreshCw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between py-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="bg-indigo-500 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
          <Zap className="w-6 h-6 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Rectifier Monitoring</h1>
          <p className="text-xs text-gray-400 font-medium">IoT Power System Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Live</span>
        </div>

        <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors">
          <Map className="w-4 h-4" />
          <span>Back to Map</span>
        </Link>

        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 text-white text-sm font-medium transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
    </header>
  );
}
