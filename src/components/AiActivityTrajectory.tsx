import React, { useState } from 'react';
import { Device, ThemeColor } from '../types';
import {
  Navigation,
  Footprints,
  Sparkles,
  RefreshCw,
  Clock,
  Gauge,
  Heart,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Compass,
  Zap,
} from 'lucide-react';

interface AiActivityTrajectoryProps {
  device: Device;
  themeColor?: ThemeColor;
}

export const AiActivityTrajectory: React.FC<AiActivityTrajectoryProps> = ({
  device,
  themeColor = 'blue',
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  const activity = device.currentActivity || {
    action: 'Stationary at monitored location',
    category: 'stationary',
    speedMph: 0,
    headingDegrees: 0,
    headingCardinal: 'N',
    heartRateBpm: 72,
    pedometerStepsToday: 4200,
    altitudeMeters: 15,
  };

  const destination = device.destinationForecast || {
    predictedDestination: 'Monitored Safe Destination',
    destinationAddress: `${device.location.address}, ${device.location.city}`,
    estimatedArrivalMinutes: 10,
    aiConfidenceScore: 92,
    routeDistanceKm: 1.2,
    trajectoryStatus: 'On Timed Schedule',
  };

  const handleRunAiPrediction = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/predict-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personName: device.personName || device.name,
          location: device.location,
          activity: activity,
          historicalPoints: device.history,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAiAnalysisResult(json.data);
      }
    } catch (err) {
      console.error('Failed to run AI trajectory prediction:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categoryColor = {
    walking: 'bg-emerald-500 text-white',
    running: 'bg-amber-500 text-white animate-pulse',
    transit: 'bg-blue-600 text-white',
    driving: 'bg-purple-600 text-white',
    stationary: 'bg-slate-500 text-white',
    unknown: 'bg-gray-500 text-white',
  }[activity.category] || 'bg-blue-600 text-white';

  return (
    <div className="bg-white dark:bg-[#191c1e] rounded-2xl p-5 border border-[#e2e8f0] dark:border-[#434655] shadow-xs space-y-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2e8f0] dark:border-[#434655] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xs">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1e293b] dark:text-white">
                Live Activity & Trajectory Forecasting
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500 animate-spin-slow" />
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-[#64748b] dark:text-[#bec6e0]">
              Real-time gait motion analysis & predicted destination trajectory
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAiPrediction}
          disabled={isAnalyzing}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing Trajectory...' : 'Run Gemini AI Analysis'}</span>
        </button>
      </div>

      {/* Grid: 2 Columns - What Person Is Doing (Activity) vs Where Person Is Going (Destination) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SECTION 1: WHAT THE PERSON IS DOING */}
        <div className="bg-[#f8fafc] dark:bg-[#25292c] rounded-xl p-4 border border-[#e2e8f0] dark:border-[#434655]/60 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#bec6e0] flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-500" />
                Current Motion & Gait Status
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${categoryColor}`}>
                {activity.category}
              </span>
            </div>

            {/* Current Action Highlight */}
            <div className="p-3 bg-white dark:bg-[#191c1e] rounded-xl border border-[#e2e8f0] dark:border-[#434655] shadow-2xs">
              <div className="text-xs font-bold text-[#1e293b] dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{aiAnalysisResult?.currentAction || activity.action}</span>
              </div>
              {device.personName && (
                <div className="mt-1 text-[11px] text-[#64748b] dark:text-[#bec6e0] flex items-center gap-1">
                  <span>Tracked Subject:</span>
                  <strong className="text-[#1e293b] dark:text-white">{device.personName}</strong>
                  {device.countryFlag && <span>{device.countryFlag}</span>}
                </div>
              )}
            </div>

            {/* Gait Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white dark:bg-[#191c1e] rounded-lg border border-[#e2e8f0] dark:border-[#434655]/40 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#bec6e0]">Live Speed</div>
                  <div className="font-bold text-[#1e293b] dark:text-white">{activity.speedMph} mph</div>
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-[#191c1e] rounded-lg border border-[#e2e8f0] dark:border-[#434655]/40 flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#bec6e0]">Vector Heading</div>
                  <div className="font-bold text-[#1e293b] dark:text-white">
                    {activity.headingDegrees}° ({activity.headingCardinal})
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-[#191c1e] rounded-lg border border-[#e2e8f0] dark:border-[#434655]/40 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 shrink-0 animate-pulse" />
                <div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#bec6e0]">Biometric HR</div>
                  <div className="font-bold text-[#1e293b] dark:text-white">
                    {activity.heartRateBpm || 74} BPM
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-[#191c1e] rounded-lg border border-[#e2e8f0] dark:border-[#434655]/40 flex items-center gap-2">
                <Footprints className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#bec6e0]">Steps Today</div>
                  <div className="font-bold text-[#1e293b] dark:text-white">
                    {activity.pedometerStepsToday?.toLocaleString() || '5,410'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: WHERE THE PERSON IS GOING */}
        <div className="bg-[#f8fafc] dark:bg-[#25292c] rounded-xl p-4 border border-[#e2e8f0] dark:border-[#434655]/60 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#bec6e0] flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-indigo-500" />
                Destination & Route Forecast
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {aiAnalysisResult?.trajectoryStatus || destination.trajectoryStatus}
              </span>
            </div>

            {/* Target Destination Box */}
            <div className="p-3 bg-white dark:bg-[#191c1e] rounded-xl border border-[#e2e8f0] dark:border-[#434655] shadow-2xs space-y-1">
              <div className="text-xs font-bold text-[#1e293b] dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">{aiAnalysisResult?.predictedDestination || destination.predictedDestination}</span>
              </div>
              <div className="text-[11px] text-[#64748b] dark:text-[#bec6e0] truncate pl-5">
                {aiAnalysisResult?.destinationAddress || destination.destinationAddress}
              </div>
            </div>

            {/* Confidence & ETA Countdown Bar */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white dark:bg-[#191c1e] rounded-lg border border-[#e2e8f0] dark:border-[#434655]/40 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#bec6e0]">Estimated Arrival</div>
                  <div className="font-bold text-[#1e293b] dark:text-white">
                    {aiAnalysisResult?.estimatedArrivalMinutes || destination.estimatedArrivalMinutes} mins ETA
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-white dark:bg-[#191c1e] rounded-lg border border-[#e2e8f0] dark:border-[#434655]/40 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-[#64748b] dark:text-[#bec6e0]">AI Confidence</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    {aiAnalysisResult?.aiConfidenceScore || destination.aiConfidenceScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* AI Behavioral Risk Note */}
            {aiAnalysisResult?.behavioralRiskNote && (
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded-lg border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>{aiAnalysisResult.behavioralRiskNote}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
