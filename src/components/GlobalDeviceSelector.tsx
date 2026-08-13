import React, { useState } from 'react';
import { Device, ThemeColor } from '../types';
import {
  Globe,
  Smartphone,
  Watch,
  Car,
  Radio,
  Laptop,
  Tablet,
  Siren,
  MapPin,
  CheckCircle2,
  Search,
} from 'lucide-react';

interface GlobalDeviceSelectorProps {
  devices: Device[];
  selectedDevice: Device;
  onSelectDevice: (device: Device) => void;
  themeColor?: ThemeColor;
}

export const GlobalDeviceSelector: React.FC<GlobalDeviceSelectorProps> = ({
  devices,
  selectedDevice,
  onSelectDevice,
  themeColor = 'blue',
}) => {
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const countries = [
    { code: 'ALL', name: 'Global Network', flag: '🌍' },
    { code: 'USA', name: 'USA', flag: '🇺🇸' },
    { code: 'Japan', name: 'Japan', flag: '🇯🇵' },
    { code: 'France', name: 'France', flag: '🇫🇷' },
    { code: 'United Kingdom', name: 'UK', flag: '🇬🇧' },
    { code: 'Nigeria', name: 'Nigeria', flag: '🇳🇬' },
  ];

  const filteredDevices = devices.filter((device) => {
    const matchesCountry =
      selectedCountryFilter === 'ALL' || device.country === selectedCountryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (device.personName && device.personName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      device.location.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCountry && matchesSearch;
  });

  const getDeviceIcon = (type: Device['type'], isEmergency: boolean) => {
    if (isEmergency) return <Siren className="w-4 h-4 text-red-500 animate-bounce" />;
    switch (type) {
      case 'phone':
        return <Smartphone className="w-4 h-4" />;
      case 'laptop':
        return <Laptop className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'watch':
        return <Watch className="w-4 h-4" />;
      case 'vehicle':
        return <Car className="w-4 h-4" />;
      default:
        return <Radio className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#191c1e] rounded-2xl p-4 border border-[#e2e8f0] dark:border-[#434655] shadow-xs space-y-3">
      {/* Country Filter Chips & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0] dark:border-[#434655]/60 pb-3">
        {/* Country Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCountryFilter(c.code)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                selectedCountryFilter === c.code
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-[#f1f5f9] dark:bg-[#2d3133] text-[#64748b] dark:text-[#bec6e0] hover:text-[#1e293b] dark:hover:text-white'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-48">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748b] dark:text-[#bec6e0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search person or city..."
            className="w-full bg-[#f1f5f9] dark:bg-[#2d3133] text-xs pl-8 pr-3 py-1.5 rounded-xl text-[#1e293b] dark:text-white outline-none border border-transparent focus:border-blue-500"
          />
        </div>
      </div>

      {/* Device Horizontal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {filteredDevices.map((dev) => {
          const isSelected = dev.id === selectedDevice.id;
          const isEmergency = dev.status === 'EMERGENCY SOS';

          return (
            <div
              key={dev.id}
              onClick={() => onSelectDevice(dev)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden ${
                isEmergency
                  ? 'bg-red-50 dark:bg-red-950/60 border-red-500 ring-2 ring-red-500/50'
                  : isSelected
                  ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-600 shadow-sm'
                  : 'bg-[#f8fafc] dark:bg-[#25292c] border-[#e2e8f0] dark:border-[#434655]/60 hover:border-blue-400'
              }`}
            >
              {/* Top Row: Country Flag + Device Name */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-base shrink-0">{dev.countryFlag || '🇺🇸'}</span>
                  <span className="font-bold text-xs text-[#1e293b] dark:text-white truncate">
                    {dev.personName || dev.name}
                  </span>
                </div>
                <div className="shrink-0">{getDeviceIcon(dev.type, isEmergency)}</div>
              </div>

              {/* Action / Activity Preview */}
              <div className="text-[11px] text-[#64748b] dark:text-[#bec6e0] truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                <span className="truncate">{dev.location.city}</span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-[10px]">
                <span
                  className={`font-semibold truncate ${
                    isEmergency ? 'text-red-600 font-bold animate-pulse' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isEmergency ? 'EMERGENCY SOS' : dev.currentActivity?.action || dev.status}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
