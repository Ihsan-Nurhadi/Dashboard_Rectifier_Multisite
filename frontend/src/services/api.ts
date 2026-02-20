// API Service for Multi-Site Monitoring
import { DashboardData } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://103.176.45.14:3000/api';

export interface Site {
  id: number;
  site_code: string;
  site_name: string;
  latitude: number;
  longitude: number;
  region: string;
  address: string;
  project_id: string;
  ladder: string;
  sla: string;
  latest_vdc: number | null;
  latest_load: number | null;
  latest_temp: number | null;
  latest_status: string;
  last_update: string | null;
  is_active: boolean;
}

export class RectifierAPI {
  /**
   * Get all sites with latest data
   */
  static async getSites(): Promise<Site[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/sites/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sites');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching sites:', error);
      return [];
    }
  }

  /**
   * Get specific site detail
   */
  static async getSite(siteCode: string): Promise<Site | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/sites/${siteCode}/`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching site:', error);
      return null;
    }
  }

  /**
   * Get dashboard data for specific site
   */
  static async getDashboardData(siteCode: string): Promise<DashboardData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/sites/${siteCode}/dashboard/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error('Failed to fetch dashboard data:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data as DashboardData;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return null;
    }
  }

  /**
   * Get historical data for charts
   */
  static async getHistory(siteCode: string, limit: number = 50) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sites/${siteCode}/history/?limit=${limit}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching history:', error);
      return null;
    }
  }
}

export default RectifierAPI;