import React, { useState } from 'react';
import { Shield, Smartphone, Lock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LegalModalType } from '../types';

interface Step1Props {
  phoneNumber: string;
  setPhoneNumber: (num: string) => void;
  onProceed: () => void;
  openModal: (type: LegalModalType) => void;
}

export const Step1PhoneEntry: React.FC<Step1Props> = ({
  phoneNumber,
  setPhoneNumber,
  onProceed,
  openModal,
}) => {
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    onProceed();
  };

  const sampleNumbers = [
    '+1 (555) 019-2834',
    '+1 (415) 892-0112',
    '+44 20 7946 0912',
  ];

  return (
    <div className="w-full max-w-[540px] mx-auto my-auto flex flex-col items-center animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1e293b] dark:text-[#eff1f3] tracking-tight mb-1.5">
          Device Recovery
        </h1>
        <p className="text-sm md:text-base text-[#64748b] dark:text-[#bec6e0]">
          Initiate secure tracking protocol.
        </p>
      </div>

      {/* Red Notice Alert Box */}
      <div className="w-full bg-[#fef2f2] dark:bg-[#3f1d1d]/40 border border-[#fee2e2] dark:border-[#991b1b]/50 rounded-xl p-4 md:p-5 mb-5 shadow-xs flex gap-3.5 items-start text-left">
        <div className="p-1 rounded-full bg-red-100 dark:bg-red-950/80 text-[#991b1b] dark:text-red-300 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-[#991b1b] dark:text-red-300 mb-1">
            Important Privacy &amp; Security Notice
          </h3>
          <p className="text-xs md:text-[13px] text-[#7f1d1d] dark:text-red-200/90 leading-relaxed">
            Per global telecommunications privacy laws,{' '}
            <strong className="font-semibold">
              a phone number alone cannot legally or technically reveal a device's real-time physical location
            </strong>
            . SecureLocator protects privacy by preventing unauthorized tracking; we require explicit credential handshakes or linked cloud authorization to display locations.
          </p>
        </div>
      </div>

      {/* Input Card Form */}
      <div className="w-full bg-white dark:bg-[#191c1e] border border-[#e2e8f0] dark:border-[#2d3133] rounded-xl p-6 md:p-8 shadow-[0px_4px_12px_rgba(30,41,59,0.05)] transition-colors">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-semibold text-[#1e293b] dark:text-[#eff1f3]"
              >
                Enter Lost Device Phone Number
              </label>
              <span className="text-[11px] text-[#64748b] dark:text-[#bec6e0]">
                E.164 Format
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#737686]">
                <Smartphone className="w-5 h-5 text-[#64748b] dark:text-[#bec6e0]" />
              </div>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (error) setError('');
                }}
                placeholder="+1 (555) 019-2834"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#2d3133] border border-[#c3c6d7] dark:border-[#434655] rounded-lg text-sm text-[#1e293b] dark:text-white placeholder-[#737686] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
            )}

            {/* Quick preset selector */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-[#64748b] dark:text-[#bec6e0]">
                Presets:
              </span>
              {sampleNumbers.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPhoneNumber(num)}
                  className="text-[11px] bg-[#f2f4f6] dark:bg-[#2d3133] hover:bg-[#e0e3e5] dark:hover:bg-[#434655] text-[#505f76] dark:text-[#bec6e0] px-2 py-0.5 rounded transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold py-3 px-6 rounded-xl text-base flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow group cursor-pointer"
            >
              <Shield className="w-5 h-5 fill-white/20 text-white" />
              <span>Proceed to Verification</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-[#737686] dark:text-[#bec6e0] flex items-center justify-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-[#004ac6] dark:text-[#b4c5ff]" />
              End-to-end encrypted connection
            </p>
          </div>
        </form>
      </div>

      {/* Legal Subtext */}
      <p className="text-[11px] text-[#64748b] dark:text-[#bec6e0] text-center mt-6 leading-relaxed max-w-md">
        By using this service, you agree to our{' '}
        <button
          onClick={() => openModal('privacy')}
          className="text-[#2563eb] dark:text-[#b4c5ff] hover:underline"
        >
          Privacy &amp; Consent Framework
        </button>
        . Unlawful tracking attempts are logged and reported.
      </p>
    </div>
  );
};
