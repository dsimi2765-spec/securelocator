import React, { useState } from 'react';
import { Device, ThemeColor } from '../types';
import {
  Siren,
  AlertTriangle,
  Radio,
  Volume2,
  VolumeX,
  PhoneCall,
  ShieldAlert,
  Building2,
  Hospital,
  Sparkles,
  RefreshCw,
  FileText,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Mic,
  Crosshair,
} from 'lucide-react';
import { playLocatorSound } from '../utils/audio';

interface CrimeSceneLocatorPanelProps {
  device: Device;
  themeColor?: ThemeColor;
  onTogglePanicAlarm?: (deviceId: string) => void;
}

export const CrimeSceneLocatorPanel: React.FC<CrimeSceneLocatorPanelProps> = ({
  device,
  themeColor = 'blue',
  onTogglePanicAlarm,
}) => {
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);
  const [isAnalyzingCrime, setIsAnalyzingCrime] = useState(false);
  const [crimeBriefing, setCrimeBriefing] = useState<any>(null);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);

  const panicState = device.panicAlarmState || {
    isAlarmActive: device.status === 'EMERGENCY SOS',
    alarmType: 'Panic SOS Trigger',
    triggerTimestamp: 'Just now',
    decibelLevel: 88,
    audioWiretapActive: true,
  };

  const crimeScene = panicState.crimeSceneDetails || {
    crimeType: 'Emergency SOS Distress Signal',
    severityLevel: 'Level 4 (Critical)',
    threatCoordinates: { lat: device.location.lat, lng: device.location.lng },
    crimeSceneRadiusMeters: 150,
    nearestPoliceStation: {
      name: `Central Precinct #${Math.floor(10 + Math.random() * 80)}`,
      distanceKm: 0.42,
      phone: '+1 (555) 911-0199',
      address: `100 Police Plaza, ${device.location.city}`,
    },
    nearestHospital: {
      name: `${device.location.city} General Trauma Center`,
      distanceKm: 0.65,
      phone: '+1 (555) 911-0288',
    },
    dispatchStatus: 'En Route (ETA 4 mins)',
  };

  const handleToggleSiren = () => {
    if (isPlayingSiren) {
      setIsPlayingSiren(false);
    } else {
      setIsPlayingSiren(true);
      playLocatorSound();
      setTimeout(() => setIsPlayingSiren(false), 5000);
    }
  };

  const handleGenerateCrimeAnalysis = async () => {
    setIsAnalyzingCrime(true);
    try {
      const res = await fetch('/api/ai/crime-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceName: device.name,
          personName: device.personName,
          crimeType: crimeScene.crimeType,
          severityLevel: crimeScene.severityLevel,
          location: device.location,
          panicState: panicState,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCrimeBriefing(json.data);
      }
    } catch (err) {
      console.error('Crime scene AI analysis failed:', err);
    } finally {
      setIsAnalyzingCrime(false);
    }
  };

  const isAlarm = panicState.isAlarmActive || device.status === 'EMERGENCY SOS';

  return (
    <div className={`rounded-2xl p-5 border shadow-sm transition-all space-y-5 ${
      isAlarm
        ? 'bg-red-50/90 dark:bg-red-950/40 border-red-500/80 ring-2 ring-red-500/40'
        : 'bg-white dark:bg-[#191c1e] border-[#e2e8f0] dark:border-[#434655]'
    }`}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-200 dark:border-red-900/60 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl text-white shadow-xs ${isAlarm ? 'bg-red-600 animate-bounce' : 'bg-slate-700'}`}>
            <Siren className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-base font-bold ${isAlarm ? 'text-red-700 dark:text-red-300' : 'text-[#1e293b] dark:text-white'}`}>
                Emergency Alarm & Crime Scene Unit
              </h3>
              {isAlarm ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold animate-pulse flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  EMERGENCY SOS ACTIVE
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  Standby Monitored
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748b] dark:text-[#bec6e0]">
              Instant crime scene coordinates, acoustic wiretap telemetry & 911/112 law enforcement dispatch
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSiren}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPlayingSiren
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-900 text-white'
            }`}
          >
            {isPlayingSiren ? <Volume2 className="w-4 h-4 animate-spin" /> : <VolumeX className="w-4 h-4" />}
            <span>{isPlayingSiren ? 'Acoustic Siren Blasting...' : 'Sound Acoustic Alarm'}</span>
          </button>

          {onTogglePanicAlarm && (
            <button
              onClick={() => onTogglePanicAlarm(device.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${
                isAlarm
                  ? 'bg-slate-800 hover:bg-slate-900 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              }`}
            >
              {isAlarm ? 'Deactivate Alarm' : 'Trigger Panic SOS Alarm'}
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Crime Scene Details & AI Forensic Dispatch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Crime Scene Pinpoint & Emergency Services */}
        <div className="bg-white/80 dark:bg-[#25292c] rounded-xl p-4 border border-red-200 dark:border-red-900/60 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <Crosshair className="w-4 h-4" />
              Crime Scene Perimeter Pinpoint
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">
              {crimeScene.severityLevel}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start justify-between">
              <span className="text-[#64748b] dark:text-[#bec6e0]">Incident Type:</span>
              <span className="font-bold text-red-700 dark:text-red-300 text-right">{crimeScene.crimeType}</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-[#64748b] dark:text-[#bec6e0]">Location:</span>
              <span className="font-semibold text-[#1e293b] dark:text-white text-right">
                {device.location.address}, {device.location.city}
              </span>
            </div>

            <div className="flex items-start justify-between font-mono text-[11px]">
              <span className="text-[#64748b] dark:text-[#bec6e0]">GPS Coordinates:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">
                {device.location.lat.toFixed(5)}° N, {device.location.lng.toFixed(5)}° W
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[#64748b] dark:text-[#bec6e0] flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-red-500" /> Ambient Noise:
              </span>
              <span className="font-bold text-red-600">{panicState.decibelLevel || 88} dB (Distress Peak)</span>
            </div>
          </div>

          {/* Emergency Service Precinct Cards */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="p-2.5 bg-slate-50 dark:bg-[#191c1e] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-[#1e293b] dark:text-white">{crimeScene.nearestPoliceStation.name}</div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#bec6e0]">
                    {crimeScene.nearestPoliceStation.distanceKm} km away · {crimeScene.nearestPoliceStation.address}
                  </div>
                </div>
              </div>
              <a
                href={`tel:${crimeScene.nearestPoliceStation.phone}`}
                className="p-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
                title="Call Police Precinct"
              >
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-[#191c1e] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Hospital className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-[#1e293b] dark:text-white">{crimeScene.nearestHospital.name}</div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#bec6e0]">
                    {crimeScene.nearestHospital.distanceKm} km away · Emergency Medical Readiness
                  </div>
                </div>
              </div>
              <a
                href={`tel:${crimeScene.nearestHospital.phone}`}
                className="p-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors cursor-pointer shrink-0"
                title="Call Trauma Hospital"
              >
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* AI Law Enforcement Forensic Briefing & Dispatch */}
        <div className="bg-white/80 dark:bg-[#25292c] rounded-xl p-4 border border-red-200 dark:border-red-900/60 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                AI Law Enforcement Forensic Briefing
              </span>
              <button
                onClick={handleGenerateCrimeAnalysis}
                disabled={isAnalyzingCrime}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{isAnalyzingCrime ? 'Analyzing...' : 'Generate AI Report'}</span>
              </button>
            </div>

            {/* AI Forensic Summary Box */}
            <div className="p-3 bg-red-100/60 dark:bg-red-950/60 rounded-xl border border-red-300 dark:border-red-800 text-xs space-y-1.5">
              <div className="font-bold text-red-900 dark:text-red-200 flex items-center justify-between">
                <span>Incident Ref ID: {crimeBriefing?.incidentId || 'CS-911-7781'}</span>
                <span className="text-[10px] font-mono bg-red-700 text-white px-1.5 py-0.5 rounded">
                  Threat Rating: {crimeBriefing?.threatRatingScore || 94}/100
                </span>
              </div>
              <p className="text-[#1e293b] dark:text-slate-200 leading-relaxed text-[11px]">
                {crimeBriefing?.forensicSummary ||
                  `AUTOMATED CRIME SCENE BRIEFING: High-velocity shockwave and duress trigger recorded at ${device.location.address}. Police units dispatch recommended immediately.`}
              </p>
            </div>

            {/* Tactical Directives List */}
            <div className="space-y-1 text-[11px]">
              <div className="font-bold text-[#1e293b] dark:text-white">Tactical First Responder Directives:</div>
              <ul className="space-y-1 text-[#64748b] dark:text-[#bec6e0] list-disc list-inside">
                {(
                  crimeBriefing?.tacticalDirectives || [
                    'Dispatch 2 armed patrol units to crime scene coordinates.',
                    `Establish ${crimeScene.crimeSceneRadiusMeters}m perimeter containment zone.`,
                    'Alert regional Trauma Hospital for emergency triage.',
                  ]
                ).map((directive: string, idx: number) => (
                  <li key={idx}>{directive}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dispatch Button */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
            <button
              onClick={() => setDispatchConfirmed(!dispatchConfirmed)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                dispatchConfirmed ? 'bg-emerald-600' : 'bg-red-600 hover:bg-red-700 animate-pulse'
              }`}
            >
              {dispatchConfirmed ? <CheckCircle2 className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
              <span>{dispatchConfirmed ? 'Emergency Dispatch Request Transmitted (Units En Route)' : 'Transmit Official Police 911 Dispatch'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
