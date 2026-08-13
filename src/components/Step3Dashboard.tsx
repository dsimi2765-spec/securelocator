import React, { useState } from 'react';
import { Device, AuditLog, AuthProvider, GeofenceZone, ThemeColor } from '../types';
import {
  MapPin,
  CheckCircle2,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Car,
  Radio,
  Volume2,
  Lock,
  Battery,
  Wifi,
  Compass,
  RefreshCw,
  Layers,
  Crosshair,
  AlertOctagon,
  ShieldAlert,
  ChevronDown,
  History,
  X,
  FileText,
  Plus,
  Navigation,
  Shield,
  RadioTower,
  Bell,
  Clock,
  Printer,
  Siren,
} from 'lucide-react';
import { playLocatorSound } from '../utils/audio';
import { AddDeviceModal } from './AddDeviceModal';
import { PoliceReportModal } from './PoliceReportModal';

interface Step3DashboardProps {
  devices: Device[];
  selectedDevice: Device;
  onSelectDevice: (device: Device) => void;
  auditLogs: AuditLog[];
  onToggleLostMode: (deviceId: string, message?: string, phone?: string) => void;
  onTriggerPing: () => void;
  onAddDevice: (newDevice: Device) => void;
  authenticatedProvider: AuthProvider | null;
  themeColor?: ThemeColor;
}

export const Step3Dashboard: React.FC<Step3DashboardProps> = ({
  devices,
  selectedDevice,
  onSelectDevice,
  auditLogs,
  onToggleLostMode,
  onTriggerPing,
  onAddDevice,
  authenticatedProvider,
  themeColor = 'blue',
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'history' | 'geofence' | 'cellular'>('live');

  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isSosStrobeActive, setIsSosStrobeActive] = useState(false);
  const [mapMode, setMapMode] = useState<'vector' | 'satellite'>('vector');

  // Modals state
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showPoliceReportModal, setShowPoliceReportModal] = useState(false);
  const [showLostModeModal, setShowLostModeModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showWipeModal, setShowWipeModal] = useState(false);

  // Lost mode form state
  const [customMessage, setCustomMessage] = useState(
    selectedDevice.lostModeMessage || 'This device is lost. Please call the owner.'
  );
  const [contactPhone, setContactPhone] = useState(
    selectedDevice.lostModeContactPhone || '+1 (555) 019-2834'
  );

  // Geofence form state
  const [newGeofenceName, setNewGeofenceName] = useState('');
  const [newGeofenceRadius, setNewGeofenceRadius] = useState(200);

  // Notifications toast
  const [pingNotification, setPingNotification] = useState<string | null>(null);

  // Dynamic theme styling map for red, blue, and black themes
  const themeClasses = {
    red: {
      accentText: 'text-red-600 dark:text-red-400',
      accentBg: 'bg-red-600',
      ringBorder: 'border-red-600 bg-red-600/20',
      tabActive: 'border-red-600 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/40 font-bold',
      buttonPrimary: 'bg-red-600 hover:bg-red-700 text-white',
      svgFill: '#dc2626',
    },
    black: {
      accentText: 'text-gray-900 dark:text-white',
      accentBg: 'bg-gray-900 dark:bg-black',
      ringBorder: 'border-gray-800 bg-gray-800/30',
      tabActive: 'border-gray-900 dark:border-white text-gray-900 dark:text-white bg-gray-200/60 dark:bg-gray-800/60 font-bold',
      buttonPrimary: 'bg-gray-900 dark:bg-black hover:bg-black text-white border border-gray-700',
      svgFill: '#111827',
    },
    blue: {
      accentText: 'text-[#2563eb] dark:text-blue-300',
      accentBg: 'bg-[#2563eb]',
      ringBorder: 'border-[#2563eb] bg-[#2563eb]/20',
      tabActive: 'border-[#2563eb] text-[#2563eb] bg-blue-50/50 dark:bg-blue-950/40 dark:text-blue-300 font-bold',
      buttonPrimary: 'bg-[#2563eb] hover:bg-blue-700 text-white',
      svgFill: '#2563eb',
    },
  };
  const theme = themeClasses[themeColor] || themeClasses.blue;

  // Handle play sound audio alarm
  const handlePlaySound = () => {
    setIsPlayingSound(true);
    playLocatorSound();

    const notif = `Remote sound alert triggered on ${selectedDevice.name}! Playing 85dB sonar ping...`;
    setPingNotification(notif);

    setTimeout(() => {
      setIsPlayingSound(false);
    }, 3000);

    setTimeout(() => {
      setPingNotification(null);
    }, 5000);
  };

  // Toggle SOS Strobe Beacon
  const handleToggleSosStrobe = () => {
    const nextState = !isSosStrobeActive;
    setIsSosStrobeActive(nextState);
    if (nextState) {
      playLocatorSound();
      setPingNotification(`EMERGENCY SOS BEACON ACTIVE on ${selectedDevice.name}! Screen strobing & audio pulsing.`);
    } else {
      setPingNotification(`SOS Strobe Beacon deactivated.`);
      setTimeout(() => setPingNotification(null), 3000);
    }
  };

  const handleManualPing = () => {
    onTriggerPing();
    setPingNotification(`Fresh GPS satellite handshake received for ${selectedDevice.name}.`);
    setTimeout(() => setPingNotification(null), 4000);
  };

  const handleSaveLostMode = (e: React.FormEvent) => {
    e.preventDefault();
    onToggleLostMode(selectedDevice.id, customMessage, contactPhone);
    setShowLostModeModal(false);
    setPingNotification(`Lost Mode enabled on ${selectedDevice.name}. Lock screen updated.`);
    setTimeout(() => setPingNotification(null), 4000);
  };

  // Handle Adding new Geofence Zone
  const handleAddGeofence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGeofenceName.trim()) return;

    const newZone: GeofenceZone = {
      id: `gf-${Date.now()}`,
      name: newGeofenceName.trim(),
      lat: selectedDevice.location.lat,
      lng: selectedDevice.location.lng,
      radiusMeters: Number(newGeofenceRadius),
      isSafe: true,
      alertOnEntry: false,
      alertOnExit: true,
    };

    if (!selectedDevice.geofences) {
      selectedDevice.geofences = [];
    }
    selectedDevice.geofences.push(newZone);

    setNewGeofenceName('');
    setPingNotification(`Geofence "${newZone.name}" created for ${selectedDevice.name}.`);
    setTimeout(() => setPingNotification(null), 4000);
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'phone':
        return <Smartphone className="w-5 h-5 text-[#2563eb]" />;
      case 'laptop':
        return <Laptop className="w-5 h-5 text-[#2563eb]" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-[#2563eb]" />;
      case 'watch':
        return <Watch className="w-5 h-5 text-[#2563eb]" />;
      case 'vehicle':
        return <Car className="w-5 h-5 text-[#2563eb]" />;
      case 'tracker':
        return <Radio className="w-5 h-5 text-[#2563eb]" />;
      default:
        return <Smartphone className="w-5 h-5 text-[#2563eb]" />;
    }
  };

  return (
    <div className="w-full max-w-[840px] mx-auto my-auto flex flex-col gap-5 animate-in fade-in duration-300 text-left pb-8">
      {/* SOS Strobe Visual Screen Pulse Overlay */}
      {isSosStrobeActive && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-blue-600/30 dark:bg-blue-500/30 animate-ping" />
      )}

      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#e2e8f0] dark:border-[#2d3133]">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b] dark:text-[#eff1f3] tracking-tight">
            Authorized Device Dashboard
          </h1>
          <div className="flex items-center gap-2 text-[#004ac6] dark:text-[#b4c5ff] mt-1 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 fill-[#004ac6] dark:fill-[#b4c5ff] text-white" />
            <span>Secure connection established ({authenticatedProvider || 'Carrier Auth'})</span>
          </div>
        </div>

        {/* Device Switcher and Add Device Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-auto">
            <label className="text-[11px] font-semibold text-[#64748b] dark:text-[#bec6e0] block mb-1">
              Active Device:
            </label>
            <div className="relative">
              <select
                value={selectedDevice.id}
                onChange={(e) => {
                  const target = devices.find((d) => d.id === e.target.value);
                  if (target) onSelectDevice(target);
                }}
                className="appearance-none w-full sm:w-[220px] bg-white dark:bg-[#191c1e] border border-[#c3c6d7] dark:border-[#434655] rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-[#1e293b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb] cursor-pointer shadow-2xs truncate"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.id})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748b] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setShowAddDeviceModal(true)}
              className={`mt-5 p-2 rounded-xl shadow-2xs font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0 ${theme.buttonPrimary}`}
              title="Add New Tracked Device"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Device</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ping Notification Alert Toast */}
      {pingNotification && (
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 animate-spin ${theme.accentText}`} />
            <span>{pingNotification}</span>
          </div>
          <button
            onClick={() => setPingNotification(null)}
            className="text-slate-500 hover:text-slate-700 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Lost Mode Active Banner */}
      {selectedDevice.status === 'Lost Mode' && (
        <div className="bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/80 text-red-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-red-800 dark:text-red-200">
                LOST MODE ACTIVE
              </div>
              <p className="text-xs text-red-700 dark:text-red-300">
                "{selectedDevice.lostModeMessage}" — Phone: {selectedDevice.lostModeContactPhone}
              </p>
            </div>
          </div>
          <button
            onClick={() => onToggleLostMode(selectedDevice.id)}
            className="px-3 py-1.5 bg-white dark:bg-red-900/40 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer shrink-0"
          >
            Disable Lost Mode
          </button>
        </div>
      )}

      {/* Primary Dashboard Navigation Tabs */}
      <div className="flex border-b border-[#e2e8f0] dark:border-[#2d3133] gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'live', label: 'GPS Radar & Live', icon: Navigation },
          { id: 'history', label: 'Location Timeline', icon: Clock },
          { id: 'geofence', label: 'Geofence Safe Zones', icon: Shield },
          { id: 'cellular', label: 'Triangulation & Cell Tower', icon: RadioTower },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
                isActive
                  ? theme.tabActive
                  : 'border-transparent text-[#64748b] dark:text-[#bec6e0] hover:text-[#1e293b] dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>


      {/* TAB 1: LIVE GPS RADAR & CONTROL PANEL */}
      {activeTab === 'live' && (
        <div className="flex flex-col gap-5">
          {/* Encrypted GPS Map Stream Card */}
          <section className="flex flex-col gap-3 w-full">
            <div className="w-full aspect-square sm:aspect-[16/10] bg-[#e6e8ea] dark:bg-[#2d3133] rounded-xl border border-[#c3c6d7] dark:border-[#434655] relative overflow-hidden shadow-sm flex items-center justify-center group">
              {/* Map Vector Grid Visual Canvas */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  mapMode === 'satellite' ? 'bg-[#1e293b]' : 'bg-[#e2e8f0] dark:bg-[#1e293b]'
                }`}
              >
                {/* SVG Vector Map City Streets */}
                <svg className="w-full h-full opacity-60 dark:opacity-40" viewBox="0 0 800 500">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke={mapMode === 'satellite' ? '#334155' : '#cbd5e1'}
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* City Road Networks */}
                  <path
                    d="M0,120 Q300,100 800,220 M0,320 Q400,380 800,280 M250,0 Q220,250 300,500 M550,0 Q600,200 520,500"
                    fill="none"
                    stroke={mapMode === 'satellite' ? '#475569' : '#94a3b8'}
                    strokeWidth="12"
                  />
                  <path
                    d="M0,120 Q300,100 800,220 M0,320 Q400,380 800,280 M250,0 Q220,250 300,500 M550,0 Q600,200 520,500"
                    fill="none"
                    stroke={mapMode === 'satellite' ? '#64748b' : '#ffffff'}
                    strokeWidth="8"
                  />

                  {/* Geofence Perimeter Circle on Map */}
                  <circle
                    cx="400"
                    cy="230"
                    r="120"
                    fill="#10b981"
                    fillOpacity="0.08"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                  />

                  {/* Target Location GPS Circle */}
                  <circle
                    cx="400"
                    cy="230"
                    r={selectedDevice.location.accuracyMeters * 5}
                    fill={theme.svgFill}
                    fillOpacity="0.15"
                    stroke={theme.svgFill}
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                </svg>
              </div>

              {/* Target GPS Pin Marker with Animated Pulse Ring */}
              <div className="absolute top-[46%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                {/* Pulsing Radar Ring */}
                <div className={`absolute w-20 h-20 rounded-full animate-pulse-ring pointer-events-none border-2 ${theme.ringBorder}`}></div>

                {/* Target Marker Pin */}
                <div className={`w-10 h-10 ${theme.accentBg} text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-[#191c1e] z-10 hover:scale-110 transition-transform cursor-pointer`}>
                  <MapPin className="w-6 h-6 fill-white text-current" />
                </div>

                {/* Floating Device Name Tag */}
                <div className="mt-2 bg-white/95 dark:bg-[#191c1e]/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-[#e2e8f0] dark:border-[#434655] text-xs font-bold text-[#1e293b] dark:text-white flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{selectedDevice.name}</span>
                </div>
              </div>

              {/* Top Floating Badge */}
              <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
                <div className="bg-white/90 dark:bg-[#191c1e]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#e2e8f0] dark:border-[#434655] shadow-xs flex items-center gap-2 text-xs font-semibold text-[#1e293b] dark:text-white">
                  <Compass className={`w-4 h-4 animate-spin-slow ${theme.accentText}`} />
                  <span>Encrypted GPS Map Stream</span>
                </div>
                <div className="hidden sm:flex bg-slate-900/90 text-white backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-[11px] font-mono tracking-tight shadow-xs">
                  {selectedDevice.location.lat.toFixed(4)}° N, {Math.abs(selectedDevice.location.lng).toFixed(4)}° W
                </div>
              </div>

              {/* Top Right Map Controls */}
              <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
                <button
                  onClick={() => setMapMode(mapMode === 'vector' ? 'satellite' : 'vector')}
                  className="p-2 bg-white/90 dark:bg-[#191c1e]/90 hover:bg-white dark:hover:bg-[#2d3133] rounded-lg border border-[#e2e8f0] dark:border-[#434655] text-xs font-semibold text-[#1e293b] dark:text-white shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Toggle Satellite Mode"
                >
                  <Layers className={`w-4 h-4 ${theme.accentText}`} />
                  <span className="hidden sm:inline capitalize">{mapMode}</span>
                </button>
                <button
                  onClick={handleManualPing}
                  className="p-2 bg-white/90 dark:bg-[#191c1e]/90 hover:bg-white dark:hover:bg-[#2d3133] rounded-lg border border-[#e2e8f0] dark:border-[#434655] text-xs font-semibold text-[#1e293b] dark:text-white shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Re-center GPS Target"
                >
                  <Crosshair className={`w-4 h-4 ${theme.accentText}`} />
                  <span className="hidden sm:inline">Ping</span>
                </button>
              </div>

              {/* Bottom Floating Address Bar */}
              <div className="absolute bottom-3 left-3 right-3 z-20 bg-white/90 dark:bg-[#191c1e]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#e2e8f0] dark:border-[#434655] shadow-sm flex items-center justify-between text-xs text-[#1e293b] dark:text-white">
                <div className="flex items-center gap-2 truncate">
                  <MapPin className={`w-4 h-4 shrink-0 ${theme.accentText}`} />

                  <span className="font-semibold truncate">
                    {selectedDevice.location.address}, {selectedDevice.location.city},{' '}
                    {selectedDevice.location.state}
                  </span>
                </div>
                <span className="text-[11px] text-[#64748b] dark:text-[#bec6e0] shrink-0 font-mono ml-2">
                  Accuracy: ±{selectedDevice.location.accuracyMeters}m
                </span>
              </div>
            </div>
          </section>

          {/* Telemetry & Action Buttons Grid */}
          <section className="bg-white dark:bg-[#191c1e] rounded-xl border border-[#e2e8f0] dark:border-[#2d3133] p-5 flex flex-col gap-4 shadow-xs">
            {/* Device Header */}
            <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#2d3133] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#d0e1fb] dark:bg-blue-950/80 flex items-center justify-center shrink-0">
                  {getDeviceIcon(selectedDevice.type)}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base md:text-lg text-[#1e293b] dark:text-[#eff1f3]">
                    {selectedDevice.name}
                  </span>
                  <span className="text-xs text-[#64748b] dark:text-[#bec6e0] font-mono">
                    ID: {selectedDevice.id} • Serial: {selectedDevice.serialNumber}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  selectedDevice.status === 'Active'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] dark:text-[#b4c5ff] border-blue-200 dark:border-blue-800'
                    : selectedDevice.status === 'Lost Mode'
                    ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300'
                }`}
              >
                {selectedDevice.status}
              </div>
            </div>

            {/* Battery & Network Telemetry Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 p-3 bg-[#f8fafc] dark:bg-[#2d3133] rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40">
                <span className="text-[11px] font-bold text-[#64748b] dark:text-[#bec6e0] uppercase tracking-wider">
                  BATTERY
                </span>
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-[#2563eb]" />
                  <span className="font-bold text-base text-[#1e293b] dark:text-white">
                    {selectedDevice.battery}%
                  </span>
                  <div className="w-12 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden ml-auto hidden sm:block">
                    <div
                      className={`h-full ${
                        selectedDevice.battery > 30 ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${selectedDevice.battery}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-[#f8fafc] dark:bg-[#2d3133] rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40">
                <span className="text-[11px] font-bold text-[#64748b] dark:text-[#bec6e0] uppercase tracking-wider">
                  NETWORK
                </span>
                <div className="flex items-center gap-2 truncate">
                  <Wifi className="w-4 h-4 text-[#2563eb] shrink-0" />
                  <span className="font-bold text-sm text-[#1e293b] dark:text-white truncate">
                    {selectedDevice.network}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {/* Play Sound Button */}
            <button
              onClick={handlePlaySound}
              disabled={isPlayingSound}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#e2e8f0] dark:border-[#434655] bg-white dark:bg-[#191c1e] text-[#1e293b] dark:text-white font-semibold text-xs hover:bg-[#f2f4f6] dark:hover:bg-[#2d3133] transition-all cursor-pointer shadow-xs active:scale-[0.99] ${
                isPlayingSound ? 'ring-2 ring-[#2563eb]' : ''
              }`}
            >
              <Volume2 className={`w-4 h-4 text-[#2563eb] ${isPlayingSound ? 'animate-bounce' : ''}`} />
              <span>{isPlayingSound ? 'Sonar Ping Active...' : 'Play Sound Alarm'}</span>
            </button>

            {/* Emergency SOS Strobe Button */}
            <button
              onClick={handleToggleSosStrobe}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-xs transition-all cursor-pointer shadow-xs ${
                isSosStrobeActive
                  ? 'bg-blue-600 text-white border-blue-700 animate-pulse'
                  : 'bg-white dark:bg-[#191c1e] text-[#1e293b] dark:text-white border-[#e2e8f0] dark:border-[#434655] hover:bg-[#f2f4f6] dark:hover:bg-[#2d3133]'
              }`}
            >
              <Siren className={`w-4 h-4 ${isSosStrobeActive ? 'text-white' : 'text-blue-600'}`} />
              <span>{isSosStrobeActive ? 'Stop SOS Strobe' : 'SOS Beacon Strobe'}</span>
            </button>

            {/* Enable Lost Mode Button */}
            <button
              onClick={() => setShowLostModeModal(true)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <Lock className="w-4 h-4 fill-white text-[#ef4444]" />
              <span>{selectedDevice.status === 'Lost Mode' ? 'Edit Lost Mode' : 'Enable Lost Mode'}</span>
            </button>
          </section>
        </div>
      )}

      {/* TAB 2: LOCATION HISTORY TIMELINE */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-[#191c1e] rounded-xl border border-[#e2e8f0] dark:border-[#2d3133] p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#2d3133] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2563eb]" />
              <h3 className="font-bold text-base text-[#1e293b] dark:text-white">
                Location Breadcrumb Timeline
              </h3>
            </div>
            <span className="text-xs text-[#64748b] font-mono">
              {selectedDevice.history?.length || 0} pings recorded
            </span>
          </div>

          <p className="text-xs text-[#64748b] dark:text-[#bec6e0]">
            Review historical location logs and movement speed recorded for <strong>{selectedDevice.name}</strong>.
          </p>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#e2e8f0] dark:before:bg-[#434655]">
            {(selectedDevice.history || []).map((point, index) => (
              <div key={point.id} className="relative pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#f8fafc] dark:bg-[#2d3133] rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40 text-xs">
                {/* Timeline Dot */}
                <div className={`absolute left-2.5 top-4 w-2.5 h-2.5 rounded-full -translate-x-1/2 ${
                  index === 0 ? 'bg-[#2563eb] ring-4 ring-blue-100 dark:ring-blue-950' : 'bg-[#94a3b8]'
                }`} />

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1e293b] dark:text-white">{point.address}</span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 rounded-md text-[10px] font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#64748b] dark:text-[#bec6e0] font-mono">
                    Lat: {point.lat.toFixed(4)}°, Lng: {point.lng.toFixed(4)}°
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[#505f76] dark:text-[#bec6e0] shrink-0">
                  <div className="text-right">
                    <div className="font-semibold text-[#1e293b] dark:text-white">{point.speed}</div>
                    <div className="text-[11px] text-[#64748b] font-mono">{point.timestamp}</div>
                  </div>
                  <div className="px-2 py-1 bg-white dark:bg-[#191c1e] rounded-lg border border-[#e2e8f0] dark:border-[#434655] font-mono text-[11px] font-semibold text-[#2563eb]">
                    {point.battery}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GEOFENCE SAFE ZONES */}
      {activeTab === 'geofence' && (
        <div className="bg-white dark:bg-[#191c1e] rounded-xl border border-[#e2e8f0] dark:border-[#2d3133] p-5 flex flex-col gap-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#2d3133] pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#2563eb]" />
              <h3 className="font-bold text-base text-[#1e293b] dark:text-white">
                Geofence Safe Zones Manager
              </h3>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Inside Safe Zone
            </span>
          </div>

          {/* Active Geofence List */}
          <div className="space-y-3">
            {(selectedDevice.geofences || []).map((zone) => (
              <div
                key={zone.id}
                className="p-3.5 bg-[#f8fafc] dark:bg-[#2d3133] rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#1e293b] dark:text-white text-sm">{zone.name}</div>
                    <div className="text-[11px] text-[#64748b] dark:text-[#bec6e0] font-mono">
                      Radius: {zone.radiusMeters}m • Exit Alert: {zone.alertOnExit ? 'ENABLED' : 'OFF'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold">
                    Safe Perimeter Active
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Geofence Form */}
          <form onSubmit={handleAddGeofence} className="p-4 bg-[#f1f5f9] dark:bg-[#25282a] rounded-xl border border-[#cbd5e1] dark:border-[#434655] space-y-3">
            <h4 className="font-bold text-xs text-[#1e293b] dark:text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#2563eb]" /> Create New Geofence Zone
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748b] dark:text-[#bec6e0] mb-1">
                  Zone Label:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Home, Office, Gym"
                  value={newGeofenceName}
                  onChange={(e) => setNewGeofenceName(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-[#191c1e] border border-[#c3c6d7] dark:border-[#434655] rounded-lg text-xs text-[#1e293b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#64748b] dark:text-[#bec6e0] mb-1">
                  Radius (Meters): {newGeofenceRadius}m
                </label>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={newGeofenceRadius}
                  onChange={(e) => setNewGeofenceRadius(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#2563eb]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#2563eb] hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs cursor-pointer"
            >
              Add Geofence Barrier
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: CELLULAR & TRIANGULATION DIAGNOSTICS */}
      {activeTab === 'cellular' && (
        <div className="bg-white dark:bg-[#191c1e] rounded-xl border border-[#e2e8f0] dark:border-[#2d3133] p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] dark:border-[#2d3133] pb-3">
            <div className="flex items-center gap-2">
              <RadioTower className="w-5 h-5 text-[#2563eb]" />
              <h3 className="font-bold text-base text-[#1e293b] dark:text-white">
                Cell Tower Triangulation &amp; Radio Signal Diagnostics
              </h3>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-[#2563eb] text-xs font-semibold rounded-lg">
              Carrier Verified Node
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#f8fafc] dark:bg-[#2d3133] rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40 space-y-2">
              <span className="text-[11px] font-bold text-[#64748b] dark:text-[#bec6e0] uppercase">
                Primary Cell Tower Node ID
              </span>
              <div className="text-base font-bold text-[#1e293b] dark:text-white font-mono">
                {selectedDevice.cellTower?.towerId || 'SF-TWR-8849'}
              </div>
              <p className="text-xs text-[#64748b] dark:text-[#bec6e0]">
                {selectedDevice.cellTower?.carrier || 'Verizon Wireless Node 42'}
              </p>
            </div>

            <div className="p-4 bg-[#f8fafc] dark:bg-[#2d3133] rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40 space-y-2">
              <span className="text-[11px] font-bold text-[#64748b] dark:text-[#bec6e0] uppercase">
                Signal Power (RSRP)
              </span>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {selectedDevice.cellTower?.rsrpDbm || -78} dBm (Excellent)
              </div>
              <p className="text-xs text-[#64748b] dark:text-[#bec6e0]">
                Band: {selectedDevice.cellTower?.band || 'B66 (2100MHz)'}
              </p>
            </div>

            <div className="p-4 bg-[#f8fafc] dark:bg-[#2d3133] rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40 space-y-2">
              <span className="text-[11px] font-bold text-[#64748b] dark:text-[#bec6e0] uppercase">
                Estimated Tower Distance
              </span>
              <div className="text-base font-bold text-[#1e293b] dark:text-white font-mono">
                ~{selectedDevice.cellTower?.distanceKm || 0.35} km
              </div>
              <p className="text-xs text-[#64748b] dark:text-[#bec6e0]">
                3-point triangulation accuracy verified
              </p>
            </div>

            <div className="p-4 bg-[#f8fafc] dark:bg-[#2d3133] rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40 space-y-2">
              <span className="text-[11px] font-bold text-[#64748b] dark:text-[#bec6e0] uppercase">
                ECDH Handshake Protocol
              </span>
              <div className="text-base font-bold text-[#2563eb] font-mono">
                256-Bit Elliptic Curve
              </div>
              <p className="text-xs text-[#64748b] dark:text-[#bec6e0]">
                Zero-knowledge authorization token validated
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Actions Toolbar Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAuditModal(true)}
            className="text-xs text-[#505f76] dark:text-[#bec6e0] hover:text-[#2563eb] flex items-center gap-1.5 font-semibold cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Handshake Logs</span>
          </button>

          <button
            onClick={() => setShowPoliceReportModal(true)}
            className="text-xs text-[#2563eb] hover:underline flex items-center gap-1.5 font-semibold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Stolen Device Police Report</span>
          </button>
        </div>

        <button
          onClick={() => setShowWipeModal(true)}
          className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 flex items-center gap-1.5 font-semibold cursor-pointer"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Remote Erase Device (Dry Run)</span>
        </button>
      </div>

      {/* Modals */}
      <AddDeviceModal
        isOpen={showAddDeviceModal}
        onClose={() => setShowAddDeviceModal(false)}
        onAddDevice={onAddDevice}
      />

      <PoliceReportModal
        isOpen={showPoliceReportModal}
        onClose={() => setShowPoliceReportModal(false)}
        device={selectedDevice}
        authenticatedProvider={authenticatedProvider}
      />

      {/* Lost Mode Modal */}
      {showLostModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#191c1e] rounded-2xl border border-[#e2e8f0] dark:border-[#2d3133] p-6 shadow-2xl text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#e2e8f0] dark:border-[#2d3133]">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-lg text-[#1e293b] dark:text-white">
                  Configure Lost Mode
                </h3>
              </div>
              <button
                onClick={() => setShowLostModeModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#64748b] dark:text-[#bec6e0] leading-relaxed">
              Lost Mode locks your device, displays a custom contact message on screen, and streams real-time GPS telemetry.
            </p>

            <form onSubmit={handleSaveLostMode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1e293b] dark:text-white mb-1">
                  Lock Screen Display Message:
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-[#f8fafc] dark:bg-[#2d3133] border border-[#c3c6d7] dark:border-[#434655] rounded-xl text-xs text-[#1e293b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e293b] dark:text-white mb-1">
                  Owner Contact Phone Number:
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#f8fafc] dark:bg-[#2d3133] border border-[#c3c6d7] dark:border-[#434655] rounded-xl text-xs text-[#1e293b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLostModeModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#e2e8f0] dark:border-[#434655] text-xs font-semibold text-[#505f76] dark:text-[#bec6e0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  Enable &amp; Lock Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#191c1e] rounded-2xl border border-[#e2e8f0] dark:border-[#2d3133] p-6 shadow-2xl text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#e2e8f0] dark:border-[#2d3133]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2563eb]" />
                <h3 className="font-bold text-base text-[#1e293b] dark:text-white">
                  Handshake Audit Log
                </h3>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-[#f8fafc] dark:bg-[#2d3133] rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40 text-xs space-y-1"
                >
                  <div className="flex justify-between font-semibold text-[#1e293b] dark:text-white">
                    <span>{log.action}</span>
                    <span className="font-mono text-[11px] text-[#64748b]">{log.timestamp}</span>
                  </div>
                  <p className="text-[#505f76] dark:text-[#bec6e0]">{log.details}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAuditModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-semibold cursor-pointer"
            >
              Close Log
            </button>
          </div>
        </div>
      )}

      {/* Remote Wipe Modal */}
      {showWipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#191c1e] rounded-2xl border border-red-200 dark:border-red-900 p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertOctagon className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg text-[#1e293b] dark:text-white">
                  Remote Wipe Simulation
                </h3>
                <p className="text-xs text-red-600">Irreversible Action Warning</p>
              </div>
            </div>

            <p className="text-xs text-[#505f76] dark:text-[#bec6e0] leading-relaxed">
              Performing a remote wipe will send a cryptographically signed command to erase all user data on <strong>{selectedDevice.name}</strong> upon its next network handshake.
            </p>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setShowWipeModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#e2e8f0] dark:border-[#434655] text-xs font-semibold text-[#505f76] dark:text-[#bec6e0] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowWipeModal(false);
                  setPingNotification(`Simulated Remote Wipe signal issued for ${selectedDevice.name}.`);
                  setTimeout(() => setPingNotification(null), 4000);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                Simulate Erase Signal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
