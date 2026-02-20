'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, MapPin, Eye } from 'lucide-react';
import { Site } from '@/services/api';

interface SitePreviewCardProps {
    site: Site;
    onClose: () => void;
    onLocate: () => void;
}

export function SitePreviewCard({ site, onClose, onLocate }: SitePreviewCardProps) {
    const router = useRouter();

    const handleViewDetails = () => {
        router.push(`/dashboard/${site.site_code}`);
    };

    const statusColor = () => {
        if (!site.is_active) return 'text-gray-400';
        switch (site.latest_status) {
            case 'Normal': return 'text-emerald-400';
            case 'Warning': return 'text-yellow-400';
            case 'Alarm': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="absolute bottom-6 right-6 z-[1000] w-[350px] bg-[#1e293b] rounded-lg shadow-2xl border border-gray-700 overflow-hidden font-sans">
            <div className="p-4">
                {/* Header with Close Button */}
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-white font-bold text-lg uppercase tracking-wide pr-8 leading-tight">
                        {site.site_name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Info */}
                <div className="text-gray-400 text-sm mb-1">
                    Site Code: <span className="text-gray-300 font-mono">{site.site_code}</span>
                </div>
                <div className="text-gray-400 text-sm mb-1">
                    Region: <span className="text-gray-300">{site.region}</span>
                </div>
                <div className={`text-sm font-bold mb-4 ${statusColor()}`}>
                    Status: {site.is_active ? site.latest_status.toUpperCase() : 'OFFLINE'}
                </div>

                {/* Quick stats */}
                {site.is_active && (
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div className="bg-[#0f172a] rounded p-2">
                            <div className="text-xs text-gray-500">VDC</div>
                            <div className="text-white text-sm font-bold">{site.latest_vdc?.toFixed(1) ?? '—'} V</div>
                        </div>
                        <div className="bg-[#0f172a] rounded p-2">
                            <div className="text-xs text-gray-500">Load</div>
                            <div className="text-white text-sm font-bold">{site.latest_load?.toFixed(1) ?? '—'} A</div>
                        </div>
                        <div className="bg-[#0f172a] rounded p-2">
                            <div className="text-xs text-gray-500">Temp</div>
                            <div className="text-white text-sm font-bold">{site.latest_temp?.toFixed(1) ?? '—'} °C</div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleViewDetails}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                        <Eye size={16} />
                        View Details
                    </button>
                    <button
                        onClick={onLocate}
                        className="bg-[#334155] hover:bg-[#475569] text-gray-300 py-2 px-3 rounded flex items-center justify-center transition-colors"
                        title="Locate Site"
                    >
                        <MapPin size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
