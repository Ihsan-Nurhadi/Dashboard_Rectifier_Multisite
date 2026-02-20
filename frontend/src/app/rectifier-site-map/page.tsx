"use client";

import { useState } from 'react'; // Added import
import dynamic from 'next/dynamic';
import { SiteMapHeader } from "@/components/site-monitoring/SiteMapHeader";
import { SiteSidebar } from "@/components/site-monitoring/SiteSidebar"; // Added import

// Dynamically import the map component to avoid SSR issues with Leaflet
const SiteMap = dynamic(
    () => import("@/components/site-monitoring/SiteMap"),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                Loading Map...
            </div>
        )
    }
);

export default function RectifierSiteMapMonitoringPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedSite, setSelectedSite] = useState<any>(null); // Ideally use Site type

    return (
        <div className="flex flex-col h-screen w-full bg-gray-900 overflow-hidden">
            <SiteMapHeader />
            <div className="flex-1 relative z-0 flex overflow-hidden">
                {/* Sidebar */}
                <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'
                        }`}
                >
                    <div className="w-80 h-full">
                        <SiteSidebar onSelectSite={setSelectedSite} />
                    </div>
                </div>

                {/* Map */}
                <div className="flex-1 relative">
                    <SiteMap
                        isSidebarOpen={isSidebarOpen}
                        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                        selectedSite={selectedSite}
                        onCloseSite={() => setSelectedSite(null)}
                    />
                </div>
            </div>
        </div>
    );
}
