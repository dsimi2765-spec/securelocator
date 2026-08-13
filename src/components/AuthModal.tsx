import React, { useState, useEffect } from 'react';
import { AuthProvider } from '../types';
import { Shield, CheckCircle2, Lock, Smartphone, TowerControl, AlertCircle, Loader2 } from 'lucide-react';

interface AuthModalProps {
  provider: AuthProvider | null;
  phoneNumber: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  provider,
  phoneNumber,
  onClose,
  onSuccess,
}) => {
  const [stage, setStage] = useState<'connecting' | 'consent' | 'success'>('connecting');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!provider) return;

    setStage('connecting');
    setProgress(15);

    const timer1 = setTimeout(() => setProgress(55), 400);
    const timer2 = setTimeout(() => setProgress(88), 900);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setStage('consent');
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [provider]);

  if (!provider) return null;

  const handleApprove = () => {
    setStage('success');
    setTimeout(() => {
      onSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#191c1e] rounded-2xl border border-[#e2e8f0] dark:border-[#2d3133] shadow-2xl overflow-hidden p-6 text-left transition-colors">
        {/* Header Icon */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] dark:border-[#2d3133] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-[#2563eb]">
              {provider === 'Google' && (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9998-.4486-.9998-.9997 0-.551.4487-.9996.9998-.9996.551 0 .9997.4486.9997.9996 0 .5511-.4487.9997-.9997.9997zm-11.046 0c-.551 0-.9997-.4486-.9997-.9997 0-.551.4487-.9996.9997-.9996.5511 0 .9998.4486.9998.9996 0 .5511-.4487.9997-.9998.9997zm11.3945-6.2871l1.7924-3.1046c.1126-.1951.0456-.4451-.1495-.5577-.1951-.1127-.4451-.0457-.5577.1495l-1.8239 3.1591c-1.5033-.6873-3.1895-1.0706-4.9828-1.0706s-3.4795.3833-4.9828 1.0706l-1.8239-3.1591c-.1126-.1952-.3626-.2622-.5577-.1495-.1951.1126-.2621.3626-.1495.5577l1.7924 3.1046c-3.1497 1.7163-5.2652 4.9084-5.4851 8.6461h22.4082c-.2199-3.7377-2.3354-6.9298-5.4851-8.6461z" />
                </svg>
              )}
              {provider === 'Apple' && <Smartphone className="w-5 h-5 text-black dark:text-white" />}
              {provider === 'Carrier' && <TowerControl className="w-5 h-5 text-[#004ac6]" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1e293b] dark:text-[#eff1f3]">
                {provider === 'Google' && 'Google Account Authorization'}
                {provider === 'Apple' && 'Apple ID Security Gateway'}
                {provider === 'Carrier' && 'Carrier Cell Network Verification'}
              </h3>
              <p className="text-xs text-[#64748b] dark:text-[#bec6e0]">
                {provider === 'Carrier' ? 'Verizon / AT&T / T-Mobile API' : 'OAuth 2.0 Identity Token'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-[#1e293b] dark:hover:text-white text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Stage 1: Connecting */}
        {stage === 'connecting' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto text-[#2563eb] animate-spin flex items-center justify-center">
              <Loader2 className="w-8 h-8" />
            </div>
            <div>
              <p className="font-medium text-sm text-[#1e293b] dark:text-[#eff1f3]">
                Establishing Secure Handshake...
              </p>
              <p className="text-xs text-[#64748b] dark:text-[#bec6e0] mt-1">
                Exchanging cryptographic keys with {provider} authorization server.
              </p>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-[#f2f4f6] dark:bg-[#2d3133] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#2563eb] h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Stage 2: Consent Approval */}
        {stage === 'consent' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl p-3.5 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#2563eb] shrink-0" />
              <div className="text-xs text-blue-900 dark:text-blue-200">
                <span className="font-semibold block">Identity Verified</span>
                <span>Account owner confirmed for device lookup.</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#1e293b] dark:text-[#eff1f3] bg-[#f8fafc] dark:bg-[#2d3133] p-4 rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40">
              <p className="font-semibold text-sm mb-1">Authorization Scope:</p>
              <ul className="space-y-1.5 text-[#505f76] dark:text-[#bec6e0]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></span>
                  <span>Read real-time encrypted GPS telemetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></span>
                  <span>Enable remote security ping &amp; play alarm</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></span>
                  <span>Trigger lost mode lock screen message</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#e2e8f0] dark:border-[#434655] text-xs font-semibold text-[#505f76] dark:text-[#bec6e0] hover:bg-[#f2f4f6] dark:hover:bg-[#2d3133] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                Grant Access &amp; Track
              </button>
            </div>
          </div>
        )}

        {/* Stage 3: Success */}
        {stage === 'success' && (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-base text-[#1e293b] dark:text-white">
              Authorization Successful!
            </h4>
            <p className="text-xs text-[#64748b] dark:text-[#bec6e0]">
              Redirecting to Encrypted GPS Dashboard...
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-[#e2e8f0] dark:border-[#2d3133] text-[11px] text-[#737686] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#004ac6]" /> 256-bit ECDH key
          </span>
          <span>Target: {phoneNumber}</span>
        </div>
      </div>
    </div>
  );
};
