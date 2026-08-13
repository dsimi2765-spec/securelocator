import React from 'react';
import { LegalModalType } from '../types';
import { X, ShieldCheck, FileText, PhoneCall, ScrollText } from 'lucide-react';

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#191c1e] rounded-2xl border border-[#e2e8f0] dark:border-[#2d3133] p-6 shadow-2xl text-left space-y-4 max-h-[85vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-[#e2e8f0] dark:border-[#2d3133] shrink-0">
          <div className="flex items-center gap-2 text-[#004ac6] dark:text-[#b4c5ff]">
            {type === 'privacy' && <ShieldCheck className="w-5 h-5" />}
            {type === 'terms' && <ScrollText className="w-5 h-5" />}
            {type === 'whitepaper' && <FileText className="w-5 h-5" />}
            {type === 'support' && <PhoneCall className="w-5 h-5" />}
            <h3 className="font-bold text-lg text-[#1e293b] dark:text-white capitalize">
              {type === 'privacy' && 'Privacy & Consent Framework'}
              {type === 'terms' && 'Terms of Service'}
              {type === 'whitepaper' && 'Security Whitepaper'}
              {type === 'support' && 'Contact Emergency Support'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto pr-1 text-xs text-[#505f76] dark:text-[#bec6e0] leading-relaxed space-y-3 flex-1">
          {type === 'privacy' && (
            <>
              <p className="font-semibold text-sm text-[#1e293b] dark:text-white">
                1. Explicit Consent Requirements
              </p>
              <p>
                SecureLocator operates on a strict zero-surveillance architecture. Global cellular privacy standards prohibit displaying device geolocation based solely on a phone number input without authenticated account ownership handshakes.
              </p>
              <p className="font-semibold text-sm text-[#1e293b] dark:text-white">
                2. Data Encryption &amp; Ephemeral Logs
              </p>
              <p>
                All GPS telemetry streams pass through 256-bit Elliptic Curve Diffie-Hellman (ECDH) key exchanges. Real-time location pings are never stored permanently on unencrypted databases and are auto-purged after 24 hours.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p className="font-semibold text-sm text-[#1e293b] dark:text-white">
                1. Authorized Usage Only
              </p>
              <p>
                You warrant that you are the lawful owner or authorized administrator of any device searched using the SecureLocator recovery platform. Unlawful tracking of third-party devices is strictly illegal under federal law.
              </p>
              <p className="font-semibold text-sm text-[#1e293b] dark:text-white">
                2. Audit Logging
              </p>
              <p>
                All lookup attempts, credential handshakes, and remote action triggers (e.g., sound alerts, remote wipes) are recorded in tamper-evident security audit trails for law enforcement review if required.
              </p>
            </>
          )}

          {type === 'whitepaper' && (
            <>
              <p className="font-semibold text-sm text-[#1e293b] dark:text-white">
                Technical Security Overview
              </p>
              <p>
                SecureLocator integrates direct carrier node signaling (SS7 / Diameter gateway validation) alongside OEM Cloud OAuth 2.0 handshakes (Google Find My Device &amp; Apple Find My Network protocols).
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>End-to-End Encrypted Telemetry Pipe</li>
                <li>Mutual TLS 1.3 Communication</li>
                <li>Zero-Knowledge Owner Verification</li>
              </ul>
            </>
          )}

          {type === 'support' && (
            <>
              <p className="font-semibold text-sm text-[#1e293b] dark:text-white">
                Device Recovery Assistance Team
              </p>
              <p>
                If your device has been stolen or poses an immediate physical safety risk, do not attempt physical confrontation. Contact local law enforcement and provide your SecureLocator Incident Tracking Token.
              </p>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-900 text-[#004ac6] dark:text-[#b4c5ff] font-mono text-xs">
                Emergency Support Line: 1-800-SECURE-LOC (24/7)
                <br />
                Incident Email: recovery@securelocator.com
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#e2e8f0] dark:border-[#2d3133] shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-semibold hover:bg-[#1d4ed8] transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
