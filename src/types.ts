export type StepNumber = 1 | 2 | 3;

export type AuthProvider = 'Google' | 'Apple' | 'Carrier';

export interface LocationHistoryPoint {
  id: string;
  timestamp: string;
  lat: number;
  lng: number;
  address: string;
  speed: string;
  battery: number;
}

export interface GeofenceZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  isSafe: boolean;
  alertOnEntry: boolean;
  alertOnExit: boolean;
}

export interface CellTowerInfo {
  towerId: string;
  carrier: string;
  rsrpDbm: number;
  band: string;
  distanceKm: number;
}

export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  imei?: string;
  type: 'phone' | 'laptop' | 'tablet' | 'watch' | 'vehicle' | 'tracker';
  status: 'Active' | 'Lost Mode' | 'Offline' | 'Locked';
  battery: number;
  network: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    accuracyMeters: number;
    lastPing: string;
  };
  lostModeMessage?: string;
  lostModeContactPhone?: string;
  history?: LocationHistoryPoint[];
  geofences?: GeofenceZone[];
  cellTower?: CellTowerInfo;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'security' | 'auth' | 'system' | 'ping';
}

export type LegalModalType = 'privacy' | 'terms' | 'whitepaper' | 'support' | 'policeReport' | null;

export type ThemeColor = 'blue' | 'red' | 'black';

