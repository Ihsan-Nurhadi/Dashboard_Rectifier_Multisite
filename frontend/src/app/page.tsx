"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { SiteMapHeader } from "@/components/site-monitoring/SiteMapHeader";
import { SiteSidebar } from "@/components/site-monitoring/SiteSidebar";
import { RectifierAPI, Site } from "@/services/api";

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
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  // Auth guard: redirect to /login if not authenticated
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("isAuthenticated") !== "true") {
        router.replace("/login");
      } else {
        setIsAuthed(true);
      }
    }
  }, [router]);

  const fetchSites = async () => {
    try {
      const data = await RectifierAPI.getSites();
      setSites(data);
    } catch (error) {
      console.error("Failed to fetch sites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
    const interval = setInterval(fetchSites, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Don't render map until auth is confirmed
  if (!isAuthed) {
    return <div className="min-h-screen bg-gray-900" />;
  }

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
            <SiteSidebar
              sites={sites}
              onSelectSite={setSelectedSite}
            />
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <SiteMap
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            selectedSite={selectedSite}
            onCloseSite={() => setSelectedSite(null)}
            onSelectSite={setSelectedSite}
            sites={sites}
          />
        </div>
      </div>
    </div>
  );
}
