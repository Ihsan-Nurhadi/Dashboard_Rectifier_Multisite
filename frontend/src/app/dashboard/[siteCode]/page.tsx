"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/layout/Header";
import { SiteInfoCard } from "@/components/dashboard/SiteInfoCard";
import { EnvironmentStatusCard } from "@/components/dashboard/EnvironmentStatusCard";
import { RectifierModuleStatusCard } from "@/components/dashboard/RectifierModuleStatusCard";
import { RectifierStatusCard } from "@/components/dashboard/RectifierStatusCard";
import { BatteryStatusCard } from "@/components/dashboard/BatteryStatusCard";
import { RectifierAPI } from '@/services/api';
import { DashboardData } from '@/types';

export default function SiteDashboard({ 
  params 
}: { 
  params: Promise<{ siteCode: string }> 
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const dashboardData = await RectifierAPI.getDashboardData(resolvedParams.siteCode);
      
      if (dashboardData) {
        setData(dashboardData);
        setError(null);
      } else {
        setError(`No data available for site ${resolvedParams.siteCode}`);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch data from backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [resolvedParams.siteCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ← Back to Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <Header />
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          <SiteInfoCard data={data.siteInfo} />
          <EnvironmentStatusCard data={data.environment} />
          <RectifierModuleStatusCard data={data.modules} />
          <RectifierStatusCard data={data.rectifier} />
          <BatteryStatusCard data={data.battery} />
        </div>
        
        <footer className="text-center text-xs text-gray-400 mt-12 pb-4 font-mono">
          Last updated: {data.siteInfo.lastData} | Site: {data.siteInfo.projectId}
        </footer>
      </div>
    </div>
  );
}