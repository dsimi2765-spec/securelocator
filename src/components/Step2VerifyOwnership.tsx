import React from 'react';
import { ShieldCheck, Lock, Smartphone, TowerControl, Sparkles } from 'lucide-react';
import { AuthProvider } from '../types';

interface Step2Props {
  phoneNumber: string;
  onSelectProvider: (provider: AuthProvider) => void;
  isLoading: boolean;
}

export const Step2VerifyOwnership: React.FC<Step2Props> = ({
  phoneNumber,
  onSelectProvider,
  isLoading,
}) => {
  return (
    <div className="w-full max-w-[480px] mx-auto my-auto animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#191c1e] rounded-xl border border-[#e2e8f0] dark:border-[#2d3133] p-8 shadow-[0px_4px_12px_rgba(30,41,59,0.05)] relative overflow-hidden transition-colors">
        {/* Subtle background accent blur */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#2563eb] opacity-5 rounded-bl-full pointer-events-none"></div>

        {/* Shield Header Icon */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-[#f2f4f6] dark:bg-[#2d3133] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e2e8f0] dark:border-[#434655]/40 text-[#004ac6] dark:text-[#b4c5ff] shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#eff1f3] tracking-tight mb-2">
            Verify Ownership
          </h2>
          <p className="text-sm text-[#64748b] dark:text-[#bec6e0] leading-relaxed max-w-sm mx-auto">
            To safeguard against unauthorized surveillance, strict verification is required before proceeding with device recovery.
          </p>

          {phoneNumber && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-medium text-[#2563eb] dark:text-[#b4c5ff]">
              <span>Target:</span>
              <span className="font-mono font-bold">{phoneNumber}</span>
            </div>
          )}
        </div>

        {/* Provider Buttons */}
        <div className="space-y-3.5 relative z-10">
          {/* Android Button */}
          <button
            onClick={() => onSelectProvider('Google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white py-3.5 px-4 rounded-xl font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 disabled:opacity-50 cursor-pointer shadow-xs hover:shadow"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.523 15.3414c-.5511 0-.9998-.4486-.9998-.9997 0-.551.4487-.9996.9998-.9996.551 0 .9997.4486.9997.9996 0 .5511-.4487.9997-.9997.9997zm-11.046 0c-.551 0-.9997-.4486-.9997-.9997 0-.551.4487-.9996.9997-.9996.5511 0 .9998.4486.9998.9996 0 .5511-.4487.9997-.9998.9997zm11.3945-6.2871l1.7924-3.1046c.1126-.1951.0456-.4451-.1495-.5577-.1951-.1127-.4451-.0457-.5577.1495l-1.8239 3.1591c-1.5033-.6873-3.1895-1.0706-4.9828-1.0706s-3.4795.3833-4.9828 1.0706l-1.8239-3.1591c-.1126-.1952-.3626-.2622-.5577-.1495-.1951.1126-.2621.3626-.1495.5577l1.7924 3.1046c-3.1497 1.7163-5.2652 4.9084-5.4851 8.6461h22.4082c-.2199-3.7377-2.3354-6.9298-5.4851-8.6461z" />
            </svg>
            <span>Authenticate via Google Account (Android)</span>
          </button>

          {/* Apple Button */}
          <button
            onClick={() => onSelectProvider('Apple')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#000000] hover:bg-[#1a1a1a] text-white py-3.5 px-4 rounded-xl font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 disabled:opacity-50 cursor-pointer shadow-xs hover:shadow"
          >
            <Smartphone className="w-5 h-5 text-white" />
            <span>Authenticate via Apple ID (iOS)</span>
          </button>

          {/* OR Divider */}
          <div className="relative py-2 flex items-center">
            <div className="flex-grow border-t border-[#e2e8f0] dark:border-[#434655]"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-[#737686] tracking-wider">
              OR
            </span>
            <div className="flex-grow border-t border-[#e2e8f0] dark:border-[#434655]"></div>
          </div>

          {/* Carrier Button */}
          <button
            onClick={() => onSelectProvider('Carrier')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#e6e8ea] dark:bg-[#2d3133] hover:bg-[#e0e3e5] dark:hover:bg-[#434655] text-[#1e293b] dark:text-[#eff1f3] py-3.5 px-4 rounded-xl font-medium text-sm border border-[#c3c6d7] dark:border-[#434655] transition-all focus:outline-none focus:ring-2 focus:ring-outline focus:ring-offset-2 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <TowerControl className="w-5 h-5 text-[#004ac6] dark:text-[#b4c5ff]" />
            <span>Carrier Account Authorization</span>
          </button>
        </div>

        {/* Encrypted Subtext Footer */}
        <div className="mt-8 pt-6 border-t border-[#e2e8f0] dark:border-[#2d3133] text-center relative z-10">
          <p className="text-xs text-[#64748b] dark:text-[#bec6e0] flex items-center justify-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#004ac6] dark:text-[#b4c5ff]" />
            End-to-end encrypted protocol
          </p>
        </div>
      </div>
    </div>
  );
};
