"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Site } from "@/services/api";

export interface SiteSidebarProps {
    sites?: Site[];
    onSelectSite?: (site: Site) => void;
}

export function SiteSidebar({ sites = [], onSelectSite }: SiteSidebarProps) {
    const [filter, setFilter] = useState<'all' | 'Normal' | 'Warning' | 'Alarm' | 'Offline'>('all');

    const filteredSites = sites.filter(site => {
        if (filter === 'all') return true;
        if (filter === 'Offline') return !site.is_active;
        return site.latest_status === filter;
    });

    const counts = {
        all: sites.length,
        online: sites.filter(s => s.is_active).length,
        offline: sites.filter(s => !s.is_active).length,
    };

    const getStatusColor = (status: string, isActive: boolean) => {
        if (!isActive) return { dot: 'bg-gray-500', badge: 'bg-gray-950 text-gray-400' };
        switch (status) {
            case 'Normal': return { dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]', badge: 'bg-emerald-950 text-emerald-500' };
            case 'Warning': return { dot: 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]', badge: 'bg-yellow-950 text-yellow-500' };
            case 'Alarm': return { dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]', badge: 'bg-red-950 text-red-500' };
            default: return { dot: 'bg-gray-500', badge: 'bg-gray-950 text-gray-400' };
        }
    };

    return (
        <div className="w-80 bg-[#0f172a] text-white flex flex-col h-full border-r border-gray-800 shrink-0">
            {/* Header */}
            <div className="p-4 pt-6">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-2xl font-bold">Sites</h2>
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
                        onClick={() => setFilter('Normal')}
                        className={`text-xs py-1.5 px-2 rounded border transition-colors ${filter === 'Normal'
                            ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'
                            : 'bg-[#1e293b] border-gray-700 text-gray-400 hover:bg-gray-800'
                            }`}
                    >
                        Online ({counts.online})
                    </button>
                    <button
                        onClick={() => setFilter('Offline')}
                        className={`text-xs py-1.5 px-2 rounded border transition-colors ${filter === 'Offline'
                            ? 'bg-red-900/30 border-red-500/50 text-red-400'
                            : 'bg-[#1e293b] border-gray-700 text-gray-400 hover:bg-gray-800'
                            }`}
                    >
                        Offline ({counts.offline})
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#0f172a] [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
                {filteredSites.length === 0 && (
                    <p className="text-xs text-gray-500 text-center pt-8">No sites found</p>
                )}
                {filteredSites.map(site => {
                    const colors = getStatusColor(site.latest_status, site.is_active);
                    return (
                        <div
                            key={site.id}
                            onClick={() => onSelectSite?.(site)}
                            className="bg-[#151f32] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    {/* Status Icon Box */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${site.is_active ? 'bg-emerald-900/20' : 'bg-gray-900/20'}`}>
                                        <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`}></div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-bold text-sm text-white uppercase tracking-wide">{site.site_name}</h3>
                                        <p className="text-xs text-gray-400">{site.region}</p>
                                        <p className="text-[10px] text-gray-500 pt-1">
                                            {site.last_update ? new Date(site.last_update).toLocaleString('id-ID') : 'No data'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${colors.badge}`}>
                                        {site.is_active ? site.latest_status : 'Offline'}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors mt-2" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
