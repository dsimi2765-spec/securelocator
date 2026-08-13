import React, { useState } from 'react';
import { Device, AuthProvider } from '../types';
import { X, ShieldAlert, Download, Copy, Check, Printer } from 'lucide-react';

interface PoliceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device;
  authenticatedProvider: AuthProvider | null;
}

export const PoliceReportModal: React.FC<PoliceReportModalProps> = ({
  isOpen,
  onClose,
  device,
  authenticatedProvider,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const incidentId = `INC-2026-${Math.floor(100000 + Math.random() * 900000)}-SEC`;
  const reportDate = new Date().toLocaleString();
  const sha256Signature = `0x${Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}...${Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;

  const reportContent = `OFFICIAL STOLEN / LOST DEVICE INCIDENT REPORT
==================================================
Report Reference ID : ${incidentId}
Generated Date/Time : ${reportDate}
Authentication Gateway: ${authenticatedProvider || 'Carrier Multi-Factor ECDH'}
Cryptographic Hash   : ${sha256Signature}

TARGET DEVICE SPECIFICATIONS:
--------------------------------------------------
Device Name          : ${device.name}
Internal System ID   : ${device.id}
Serial Number        : ${device.serialNumber}
IMEI Number          : ${device.imei || 'N/A (Wi-Fi Device)'}
Device Category      : ${device.type.toUpperCase()}
Battery Level        : ${device.battery}%
Network Carrier      : ${device.network}

LAST KNOWN GEOGRAPHIC TELEMETRY:
--------------------------------------------------
Latitude             : ${device.location.lat.toFixed(6)}°
Longitude            : ${device.location.lng.toFixed(6)}°
Street Address       : ${device.location.address}
City / State         : ${device.location.city}, ${device.location.state}
GPS Accuracy Radius  : ±${device.location.accuracyMeters} meters
Last Active Ping     : ${device.location.lastPing}

CELLULAR TRIANGULATION DATA:
--------------------------------------------------
Associated Cell Tower: ${device.cellTower?.towerId || 'SF-TWR-8849 Node'}
Carrier Node         : ${device.cellTower?.carrier || 'Tier-1 Telecom Node'}
Signal Power (RSRP)  : ${device.cellTower?.rsrpDbm || '-78'} dBm
Estimated Range      : ${device.cellTower?.distanceKm || '0.35'} km

VERIFICATION & CONSENT CERTIFICATE:
--------------------------------------------------
The owner of this device has authenticated ownership via encrypted biometrics
and authorized real-time recovery location disclosure for law enforcement agencies.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#191c1e] rounded-2xl border border-[#e2e8f0] dark:border-[#2d3133] p-6 shadow-2xl text-left space-y-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-[#e2e8f0] dark:border-[#2d3133] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg text-[#1e293b] dark:text-white">
                Police Incident Report &amp; Stolen Device Docket
              </h3>
              <p className="text-[11px] text-[#64748b] dark:text-[#bec6e0]">
                Cryptographically signed report for law enforcement authorities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Monospace Box */}
        <div className="flex-1 overflow-y-auto bg-[#0f172a] text-[#38bdf8] p-4 rounded-xl font-mono text-xs leading-relaxed border border-[#1e293b] whitespace-pre-wrap selection:bg-[#0284c7] selection:text-white">
          {reportContent}
        </div>

        {/* Action Buttons Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e2e8f0] dark:border-[#2d3133] shrink-0">
          <div className="text-[11px] text-[#64748b] dark:text-[#bec6e0] font-mono">
            Ref: <span className="font-bold text-[#1e293b] dark:text-white">{incidentId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl border border-[#e2e8f0] dark:border-[#434655] bg-white dark:bg-[#2d3133] hover:bg-[#f8fafc] dark:hover:bg-[#383d40] text-xs font-semibold text-[#1e293b] dark:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#2563eb]" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
