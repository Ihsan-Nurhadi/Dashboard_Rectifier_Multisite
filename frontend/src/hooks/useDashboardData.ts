import { useState, useEffect } from 'react';
import { DashboardData } from '@/types';
import { format } from 'date-fns';

const INITIAL_DATA: DashboardData = {
  siteInfo: {
    siteName: 'NYK_WORKSHOP',
    projectId: '23XL05C0027',
    ladder: 'Ladder-1',
    sla: '2 Hour',
    statusRealtime: 'Normal',
    statusLadder: 'Over',
    lastData: '2026-02-15 14:22:19',
    location: { lat: -6.305489261279732, lng: 106.95865111442095 },
  },
  environment: {
    doorCabinet: 'Close',
    batteryStolen: 'Close',
    temperature: 33.6,
    humidity: 62.2,
  },
  modules: [
    { id: 1, status: 'Fault', value: 'LK23290...' },
    { id: 2, status: 'Protect', value: 'LK23140...' },
    { id: 3, status: 'Fault', value: 'LK23140...' },
    { id: 4, status: 'Fault', value: 'LK23290...' },
    { id: 5, status: 'AC Off', value: '-' },
    { id: 6, status: 'AC Off', value: '-' },
  ],
  rectifier: {
    vacInputL1: 203.20,
    vacInputL2: 225.10,
    vacInputL3: null,
    vdcOutput: 54,
    batteryCurrent: 0,
    iacInputL1: null,
    iacInputL2: null,
    iacInputL3: null,
    loadCurrent: 63.7,
    loadPower: 3.44,
    pacLoadL1: 0.00,
    pacLoadL2: 0.00,
    pacLoadL3: 0.00,
    rectifierCurrent: 63.7,
    totalPower: 3.44,
  },
  battery: {
    banks: [
      { id: 1, voltage: 53.34, current: 0, soc: 100, soh: 100 },
      { id: 2, voltage: 53.42, current: 0, soc: 100, soh: 100 },
      { id: 3, voltage: 52.90, current: 0, soc: 100, soh: 100 },
    ],
    backupDuration: null,
    timeRemaining: null,
    status: 'Standby',
    startBackup: 'No data',
    socAvg: 100,
  },
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const now = new Date();
        // Simulate slight fluctuations
        const randomFluctuation = (val: number) => val + (Math.random() - 0.5) * 0.5;
        
        return {
          ...prev,
          siteInfo: {
            ...prev.siteInfo,
            lastData: format(now, 'yyyy-MM-dd HH:mm:ss'),
          },
          environment: {
            ...prev.environment,
            temperature: parseFloat(randomFluctuation(prev.environment.temperature).toFixed(1)),
            humidity: parseFloat(randomFluctuation(prev.environment.humidity).toFixed(1)),
          },
          rectifier: {
            ...prev.rectifier,
            vacInputL1: parseFloat(randomFluctuation(prev.rectifier.vacInputL1).toFixed(2)),
            vacInputL2: parseFloat(randomFluctuation(prev.rectifier.vacInputL2).toFixed(2)),
            loadCurrent: parseFloat(randomFluctuation(prev.rectifier.loadCurrent).toFixed(1)),
          },
          battery: {
             ...prev.battery,
             banks: prev.battery.banks.map(bank => ({
               ...bank,
               voltage: parseFloat(randomFluctuation(bank.voltage).toFixed(2)),
             }))
          }
        };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return data;
}
