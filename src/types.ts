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

export interface PersonActivity {
  action: string;
  category: 'walking' | 'running' | 'transit' | 'driving' | 'stationary' | 'unknown';
  speedMph: number;
  headingDegrees: number;
  headingCardinal: string;
  heartRateBpm?: number;
  pedometerStepsToday?: number;
  altitudeMeters?: number;
}

export interface DestinationForecast {
  predictedDestination: string;
  destinationAddress: string;
  estimatedArrivalMinutes: number;
  aiConfidenceScore: number;
  routeDistanceKm: number;
  trajectoryStatus: 'On Timed Schedule' | 'Slight Route Deviation' | 'Rapid Acceleration' | 'Stationary Delay';
}

export interface CrimeSceneDetails {
  crimeType: string;
  severityLevel: 'Level 1 (Low)' | 'Level 2 (Moderate)' | 'Level 3 (High)' | 'Level 4 (Critical)' | 'Level 5 (Maximum Emergency)';
  threatCoordinates: { lat: number; lng: number };
  crimeSceneRadiusMeters: number;
  nearestPoliceStation: { name: string; distanceKm: number; phone: string; address: string };
  nearestHospital: { name: string; distanceKm: number; phone: string };
  dispatchStatus: 'En Route (ETA 4 mins)' | 'Dispatch Notified' | 'Pending AI Dispatch' | 'Units Arrived';
}

export interface PanicAlarmState {
  isAlarmActive: boolean;
  alarmType?: 'Silent Duress' | 'Violent Impact / Crash' | 'Panic SOS Trigger' | 'Acoustic Siren';
  triggerTimestamp?: string;
  decibelLevel?: number;
  audioWiretapActive?: boolean;
  crimeSceneDetails?: CrimeSceneDetails;
}

export interface Device {
  id: string;
  name: string;
  personName?: string;
  country?: string;
  countryFlag?: string;
  timezone?: string;
  serialNumber: string;
  imei?: string;
  type: 'phone' | 'laptop' | 'tablet' | 'watch' | 'vehicle' | 'tracker';
  status: 'Active' | 'Lost Mode' | 'Offline' | 'Locked' | 'EMERGENCY SOS';
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
  currentActivity?: PersonActivity;
  destinationForecast?: DestinationForecast;
  panicAlarmState?: PanicAlarmState;
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

