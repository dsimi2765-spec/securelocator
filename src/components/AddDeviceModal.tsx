import React, { useState } from 'react';
import { Device } from '../types';
import { X, Plus, Smartphone, Laptop, Tablet, Watch, Car, Radio } from 'lucide-react';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDevice: (newDevice: Device) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, onAddDevice }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<Device['type']>('phone');
  const [serialNumber, setSerialNumber] = useState('');
  const [imei, setImei] = useState('');
  const [network, setNetwork] = useState('Secure LTE');
  const [city, setCity] = useState('San Francisco');
  const [address, setAddress] = useState('Market St & 4th St');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomId = `SL-${Math.floor(1000 + Math.random() * 9000)}-${type.charAt(0).toUpperCase()}`;
    const generatedSerial = serialNumber.trim() || `SN${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    const newDevice: Device = {
      id: randomId,
      name: name.trim(),
      serialNumber: generatedSerial,
      imei: imei.trim() || undefined,
      type: type,
      status: 'Active',
      battery: 100,
      network: network,
      location: {
        lat: 37.7749 + (Math.random() - 0.5) * 0.02,
        lng: -122.4194 + (Math.random() - 0.5) * 0.02,
        address: address.trim() || '742 Market Street',
        city: city.trim() || 'San Francisco',
        state: 'CA',
        accuracyMeters: Math.floor(Math.random() * 5) + 2,
        lastPing: 'Just registered',
      },
      history: [
        {
          id: 'h-initial',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          lat: 37.7749,
          lng: -122.4194,
          address: address.trim() || '742 Market Street',
          speed: '0 mph (Stationary)',
          battery: 100,
        },
      ],
      geofences: [
        {
          id: `gf-${Date.now()}`,
          name: 'Default Safe Zone',
          lat: 37.7749,
          lng: -122.4194,
          radiusMeters: 250,
          isSafe: true,
          alertOnEntry: false,
          alertOnExit: true,
        },
      ],
      cellTower: {
        towerId: `SF-TWR-${Math.floor(1000 + Math.random() * 9000)}`,
        carrier: 'Global Carrier Gateway',
        rsrpDbm: -75,
        band: 'B66 (2100MHz)',
        distanceKm: 0.2,
      },
    };

    onAddDevice(newDevice);
    onClose();
    // Reset form
    setName('');
    setSerialNumber('');
    setImei('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#191c1e] rounded-2xl border border-[#e2e8f0] dark:border-[#2d3133] p-6 shadow-2xl text-left space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#e2e8f0] dark:border-[#2d3133]">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#2563eb]" />
            <h3 className="font-bold text-lg text-[#1e293b] dark:text-white">
              Register New Tracked Device
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Device Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#1e293b] dark:text-white mb-2">
              Device Category:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'phone', label: 'Phone', icon: Smartphone },
                { id: 'laptop', label: 'Laptop', icon: Laptop },
                { id: 'tablet', label: 'Tablet', icon: Tablet },
                { id: 'watch', label: 'Watch', icon: Watch },
                { id: 'vehicle', label: 'Vehicle', icon: Car },
                { id: 'tracker', label: 'Tag', icon: Radio },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as Device['type'])}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#2563eb] bg-blue-50 dark:bg-blue-950/80 text-[#2563eb] dark:text-blue-300'
                        : 'border-[#e2e8f0] dark:border-[#434655] bg-[#f8fafc] dark:bg-[#2d3133] text-[#64748b] dark:text-[#bec6e0]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Device Name */}
          <div>
            <label className="block text-xs font-semibold text-[#1e293b] dark:text-white mb-1">
              Device Label / Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Work iPhone 15, Secondary Tablet, Back-pack Tag"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-[#f8fafc] dark:bg-[#2d3133] border border-[#c3c6d7] dark:border-[#434655] rounded-xl text-xs text-[#1e293b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1e293b] dark:text-white mb-1">
                Serial Number:
              </label>
              <input
                type="text"
                placeholder="e.g. F2LGG023P2R9"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full p-2.5 bg-[#f8fafc] dark:bg-[#2d3133] border border-[#c3c6d7] dark:border-[#434655] rounded-xl text-xs text-[#1e293b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e293b] dark:text-white mb-1">
                IMEI (Cellular devices):
              </label>
              <input
                type="text"
                placeholder="15-digit IMEI"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                className="w-full p-2.5 bg-[#f8fafc] dark:bg-[#2d3133] border border-[#c3c6d7] dark:border-[#434655] rounded-xl text-xs text-[#1e293b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1e293b] dark:text-white mb-1">
                Network Type:
              </label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full p-2.5 bg-[#f8fafc] dark:bg-[#2d3133] border border-[#c3c6d7] dark:border-[#434655] rounded-xl text-xs text-[#1e293b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              >
                <option value="Secure LTE">Secure LTE</option>
                <option value="5G Ultra-Wideband">5G Ultra-Wideband</option>
                <option value="Encrypted Wi-Fi">Encrypted Wi-Fi</option>
                <option value="Satellite IoT Network">Satellite IoT Network</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e293b] dark:text-white mb-1">
                City / Location:
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-[#f8fafc] dark:bg-[#2d3133] border border-[#c3c6d7] dark:border-[#434655] rounded-xl text-xs text-[#1e293b] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#e2e8f0] dark:border-[#434655] text-xs font-semibold text-[#505f76] dark:text-[#bec6e0] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Add Device to Locator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
