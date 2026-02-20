"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { SITES } from "../../data/sites";

export interface SiteSidebarProps {
    onSelectSite?: (site: typeof SITES[0]) => void;
}

export function SiteSidebar({ onSelectSite }: SiteSidebarProps) {
    const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');

    const filteredSites = SITES.filter(site => {
        if (filter === 'all') return true;
        return site.status === filter;
    });

    const counts = {
        all: SITES.length,
        online: SITES.filter(s => s.status === 'online').length,
        offline: SITES.filter(s => s.status === 'offline').length,
    };

    return (
        <div className="w-80 bg-[#0f172a] text-white flex flex-col h-full border-r border-gray-800 shrink-0">
            {/* Header */}
            <div className="p-4 pt-6">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-2xl font-bold">Site</h2>
                    <span className="text-xs text-slate-400 mb-1">{counts.all} results</span>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`text-xs py-1.5 px-2 rounded border transition-colors ${filter === 'all'
                            ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'
                            : 'bg-[#1e293b] border-gray-700 text-gray-400 hover:bg-gray-800'
                            }`}
                    >
                        All ({counts.all})
                    </button>
                    <button
                        onClick={() => setFilter('online')}
                        className={`text-xs py-1.5 px-2 rounded border transition-colors ${filter === 'online'
                            ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'
                            : 'bg-[#1e293b] border-gray-700 text-gray-400 hover:bg-gray-800'
                            }`}
                    >
                        Online ({counts.online})
                    </button>
                    <button
                        onClick={() => setFilter('offline')}
                        className={`text-xs py-1.5 px-2 rounded border transition-colors ${filter === 'offline'
                            ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' // Using emerald for consistency or maybe gray? keeping active style consistent
                            : 'bg-[#1e293b] border-gray-700 text-gray-400 hover:bg-gray-800'
                            }`}
                    >
                        Offline ({counts.offline})
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0f172a] [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
                {filteredSites.map(site => (
                    <div
                        key={site.id}
                        onClick={() => onSelectSite?.(site)}
                        className="bg-[#151f32] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                {/* Status Icon Box */}
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${site.status === 'online' ? 'bg-emerald-900/20' : 'bg-red-900/20'
                                    }`}>
                                    <div className={`w-2.5 h-2.5 rounded-full ${site.status === 'online'
                                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                        : 'bg-red-500' // Red for offline as per original map logic, though image shows gray. Keeping logic consistent with map.
                                        // Actually image shows generic dots. The offline one in image is hidden or not distinct on first glance. 
                                        // I'll stick to online=emerald, offline=red/gray.
                                        }`}></div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-bold text-sm text-white uppercase tracking-wide">{site.name}</h3>
                                    <p className="text-xs text-gray-400">{site.location}</p>
                                    <p className="text-[10px] text-gray-500 pt-1">Updated 5 min ago</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${site.status === 'online'
                                    ? 'bg-emerald-950 text-emerald-500'
                                    : 'bg-red-950 text-red-500'
                                    }`}>
                                    {site.status}
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors mt-2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
