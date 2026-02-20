# MQTT Publisher Multi-Site & Frontend Integration

## 📡 MQTT Publisher untuk Testing (3 Sites)

**File:** `mqtt_publisher_multisite.py` (Root project folder)

```python
#!/usr/bin/env python3
"""
MQTT Publisher untuk Multi-Site Testing
Publish data ke 3 sites: NYK, BSD, JKT
"""

import json
import time
import random
import paho.mqtt.client as mqtt
from datetime import datetime

# MQTT Configuration
MQTT_BROKER = "broker.emqx.io"
MQTT_PORT = 1883
MQTT_CLIENT_ID = f"multisite_publisher_{random.randint(1000, 9999)}"

# Sites configuration
SITES = [
    {
        'site_code': 'NYK',
        'site_name': 'NYK Workshop',
        'latitude': -6.305489,
        'longitude': 106.958651,
        'region': 'Jakarta Timur',
        'project_id': '23XL05C0027',
    },
    {
        'site_code': 'BSD',
        'site_name': 'BSD Office',
        'latitude': -6.301934,
        'longitude': 106.652817,
        'region': 'Tangerang Selatan',
        'project_id': '23XL05C0028',
    },
    {
        'site_code': 'JKT',
        'site_name': 'Jakarta Data Center',
        'latitude': -6.211544,
        'longitude': 106.845172,
        'region': 'Jakarta Pusat',
        'project_id': '23XL05C0029',
    },
]


def generate_data_for_site(site):
    """Generate realistic data untuk site"""
    timestamp = int(time.time() * 1000)
    
    # Randomize status untuk testing
    statuses = ['Normal', 'Normal', 'Normal', 'Warning', 'Alarm']
    status = random.choice(statuses)
    
    data = {
        "ts": timestamp,
        "site_code": site['site_code'],
        "site_name": site['site_name'],
        "project_id": site['project_id'],
        "ladder": "Ladder-1",
        "sla": "2 Hour",
        "status_realtime": status,
        "status_ladder": random.choice(["Normal", "Over", "Under"]),
        "latitude": site['latitude'],
        "longitude": site['longitude'],
        "region": site['region'],
        
        # Environment
        "door_cabinet": random.choice(["Close", "Close", "Close", "Open"]),
        "battery_stolen": "Close",
        "temperature": round(random.uniform(28.0, 38.0), 1),
        "humidity": round(random.uniform(50.0, 75.0), 1),
        
        # Rectifier - vary by status
        "vac_input_l1": round(random.uniform(200.0, 230.0), 2),
        "vac_input_l2": round(random.uniform(200.0, 230.0), 2),
        "vac_input_l3": None,
        
        "vdc_output": round(random.uniform(48.0 if status == 'Alarm' else 52.0, 55.0), 2),
        "battery_current": round(random.uniform(-2.0, 2.0), 2),
        
        "iac_input_l1": None,
        "iac_input_l2": None,
        "iac_input_l3": None,
        
        "load_current": round(random.uniform(45.0, 75.0), 1),
        "load_power": round(random.uniform(2.0, 4.5), 2),
        
        "pac_load_l1": round(random.uniform(0.5, 2.0), 2),
        "pac_load_l2": round(random.uniform(0.5, 2.0), 2),
        "pac_load_l3": round(random.uniform(0.5, 2.0), 2),
        
        "rectifier_current": round(random.uniform(45.0, 75.0), 1),
        "total_power": round(random.uniform(2.0, 4.5), 2),
        
        # Battery Banks
        "battery_bank_1_voltage": round(random.uniform(51.5, 54.5), 2),
        "battery_bank_1_current": round(random.uniform(-0.5, 0.5), 2),
        "battery_bank_1_soc": round(random.uniform(90.0, 100.0), 1),
        "battery_bank_1_soh": round(random.uniform(95.0, 100.0), 1),
        
        "battery_bank_2_voltage": round(random.uniform(51.5, 54.5), 2),
        "battery_bank_2_current": round(random.uniform(-0.5, 0.5), 2),
        "battery_bank_2_soc": round(random.uniform(90.0, 100.0), 1),
        "battery_bank_2_soh": round(random.uniform(95.0, 100.0), 1),
        
        "battery_bank_3_voltage": round(random.uniform(51.5, 54.5), 2),
        "battery_bank_3_current": round(random.uniform(-0.5, 0.5), 2),
        "battery_bank_3_soc": round(random.uniform(90.0, 100.0), 1),
        "battery_bank_3_soh": round(random.uniform(95.0, 100.0), 1),
        
        "backup_duration": None,
        "time_remaining": None,
        "battery_status": random.choice(["Standby", "Standby", "Charging"]),
        "start_backup": "No data",
        "soc_avg": round(random.uniform(90.0, 100.0), 1),
        
        # Modules
        "modules_status": [
            {"id": 1, "status": random.choice(["Normal", "Fault", "Protect"]), "value": "LK23290..."},
            {"id": 2, "status": random.choice(["Normal", "Fault"]), "value": "LK23140..."},
            {"id": 3, "status": "Normal", "value": "LK23140..."},
            {"id": 4, "status": "Normal", "value": "LK23290..."},
            {"id": 5, "status": random.choice(["Normal", "AC Off"]), "value": "-"},
            {"id": 6, "status": "AC Off", "value": "-"},
        ]
    }
    
    return data


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("=" * 70)
        print("✓ Connected to MQTT Broker")
        print(f"  Broker: {MQTT_BROKER}:{MQTT_PORT}")
        print(f"  Publishing to {len(SITES)} sites")
        print("=" * 70)
        print("\n📊 Publishing multi-site data...")
        print("Press Ctrl+C to stop\n")
    else:
        print(f"✗ Connection failed, rc: {rc}")


def main():
    print("\n" + "=" * 70)
    print("Multi-Site MQTT Publisher")
    print("=" * 70)
    print(f"\n📡 Connecting to {MQTT_BROKER}:{MQTT_PORT}...")
    
    client = mqtt.Client(client_id=MQTT_CLIENT_ID)
    client.on_connect = on_connect
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
        time.sleep(2)
        
        count = 0
        while True:
            count += 1
            timestamp = datetime.now().strftime("%H:%M:%S")
            
            # Publish data untuk setiap site
            for site in SITES:
                data = generate_data_for_site(site)
                topic = f"rectifier/{site['site_code']}/data"
                payload = json.dumps(data)
                
                result = client.publish(topic, payload, qos=1)
                
                if result.rc == mqtt.MQTT_ERR_SUCCESS:
                    status_icon = "🟢" if data['status_realtime'] == 'Normal' else "🟡" if data['status_realtime'] == 'Warning' else "🔴"
                    print(f"[{timestamp}] #{count} {status_icon} {site['site_code']}: VDC={data['vdc_output']}V Load={data['load_current']}A Temp={data['temperature']}°C Status={data['status_realtime']}")
                else:
                    print(f"[{timestamp}] #{count} ✗ Failed to publish to {site['site_code']}")
            
            print()  # Empty line between rounds
            time.sleep(3)  # Publish every 3 seconds
            
    except KeyboardInterrupt:
        print("\n\n" + "=" * 70)
        print("Stopping publisher...")
        print(f"Total rounds published: {count}")
        print("=" * 70)
    except Exception as e:
        print(f"\n✗ Error: {e}")
    finally:
        client.loop_stop()
        client.disconnect()
        print("Disconnected from MQTT broker\n")


if __name__ == "__main__":
    main()
```

---

## 🎨 Frontend Integration

### **Update Frontend API Service**

**File:** `frontend/src/services/api.ts`

```typescript
// API Service for Multi-Site Monitoring
import { DashboardData } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
```

### **Update Environment Variables**

**File:** `frontend/.env.local`

```env
# Django Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Map Configuration
NEXT_PUBLIC_MAP_CENTER_LAT=-6.2
NEXT_PUBLIC_MAP_CENTER_LNG=106.8
NEXT_PUBLIC_MAP_ZOOM=11
```

### **Create Dashboard Page per Site**

**File:** `frontend/src/app/dashboard/[siteCode]/page.tsx`

```typescript
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
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Back to Map
          </button>
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
          Last updated: {data.siteInfo.lastData} | Site: {data.siteInfo.siteCode}
        </footer>
      </div>
    </div>
  );
}
```

---

## 🚀 Complete Startup Sequence

```bash
# Terminal 1: Backend Django
cd backend
venv\Scripts\activate
python manage.py runserver

# Terminal 2: MQTT Listener
cd backend
venv\Scripts\activate
python mqtt_listener_multisite.py

# Terminal 3: MQTT Publisher (for testing)
python mqtt_publisher_multisite.py

# Terminal 4: Frontend Next.js
cd frontend
npm run dev
```

**Access:**
- Landing Page (Map): http://localhost:3000
- Site Dashboard: http://localhost:3000/dashboard/NYK
- Backend API: http://localhost:8000/api/sites/
- Django Admin: http://localhost:8000/admin/

---

Semua ready! 🎉
