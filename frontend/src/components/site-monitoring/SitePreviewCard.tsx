'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, MapPin, Eye } from 'lucide-react';

interface Site {
    id: number;
    name: string;
    lat: number;
    lng: number;
    status: string;
    siteCode?: string;
}

interface SitePreviewCardProps {
    site: Site;
    onClose: () => void;
    onLocate: () => void;
}

export function SitePreviewCard({ site, onClose, onLocate }: SitePreviewCardProps) {
    const router = useRouter();

    const handleViewDetails = () => {
        if (site.siteCode) {
            router.push(`/dashboard/${site.siteCode}`);
        }
    };

    return (
        <div className="absolute bottom-6 right-6 z-[1000] w-[350px] bg-[#1e293b] rounded-lg shadow-2xl border border-gray-700 overflow-hidden font-sans animation-fade-in-up">
            <div className="p-4">
                {/* Header with Close Button */}
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-white font-bold text-lg uppercase tracking-wide pr-8 leading-tight">
                        {site.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Location */}
                <div className="text-gray-400 text-sm mb-4">
                    {site.siteCode ? `Site Code: ${site.siteCode}` : 'Setu, Tangerang'}
                </div>

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
