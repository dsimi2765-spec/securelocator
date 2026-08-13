import React from 'react';
import { StepNumber, ThemeColor } from '../types';
import { Shield, Moon, Sun, ArrowLeft, Palette } from 'lucide-react';

interface HeaderProps {
  currentStep: StepNumber;
  setStep: (step: StepNumber) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  authenticatedProvider: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  setStep,
  darkMode,
  setDarkMode,
  themeColor,
  setThemeColor,
  authenticatedProvider,
}) => {
  return (
    <header className="bg-white dark:bg-[#191c1e] border-b border-[#e2e8f0] dark:border-[#2d3133] w-full top-0 sticky z-50 transition-colors shadow-xs">
      <div className="flex items-center justify-between px-4 md:px-8 h-16 w-full max-w-[1200px] mx-auto gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => setStep(1)}
          className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
              themeColor === 'red'
                ? 'bg-red-100 dark:bg-red-950/60 text-red-600'
                : themeColor === 'black'
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                : 'bg-blue-50 dark:bg-blue-950/60 text-[#004ac6] dark:text-[#b4c5ff]'
            }`}
          >
            <Shield className="w-5 h-5 fill-current" />
          </div>
          <span
            className={`font-bold text-xl tracking-tight ${
              themeColor === 'red'
                ? 'text-red-600 dark:text-red-400'
                : themeColor === 'black'
                ? 'text-gray-900 dark:text-white'
                : 'text-[#004ac6] dark:text-[#b4c5ff]'
            }`}
          >
            SecureLocator
          </span>
        </div>

        {/* Step Navigation Pills */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#f2f4f6] dark:bg-[#2d3133] p-1 rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40 text-xs font-semibold">
          <button
            onClick={() => setStep(1)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStep === 1
                ? 'bg-white dark:bg-[#191c1e] text-[#1e293b] dark:text-white shadow-xs font-bold'
                : 'text-[#64748b] dark:text-[#bec6e0] hover:text-[#1e293b]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-[#1e293b] dark:text-white text-[10px] flex items-center justify-center font-bold">
              1
            </span>
            <span>Recovery</span>
          </button>

          <button
            onClick={() => setStep(2)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStep === 2
                ? 'bg-white dark:bg-[#191c1e] text-[#1e293b] dark:text-white shadow-xs font-bold'
                : 'text-[#64748b] dark:text-[#bec6e0] hover:text-[#1e293b]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-[#1e293b] dark:text-white text-[10px] flex items-center justify-center font-bold">
              2
            </span>
            <span>Verification</span>
          </button>

          <button
            onClick={() => setStep(3)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentStep === 3
                ? 'bg-white dark:bg-[#191c1e] text-[#1e293b] dark:text-white shadow-xs font-bold'
                : 'text-[#64748b] dark:text-[#bec6e0] hover:text-[#1e293b]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-[#1e293b] dark:text-white text-[10px] flex items-center justify-center font-bold">
              3
            </span>
            <span>Dashboard</span>
          </button>
        </div>

        {/* Right Actions: Red / Blue / Black Theme Selector & Dark Mode */}
        <div className="flex items-center gap-2">
          {/* Red, Blue, Black Theme Selector Pill */}
          <div className="flex items-center gap-1 bg-[#f2f4f6] dark:bg-[#2d3133] p-1 rounded-xl border border-[#e2e8f0] dark:border-[#434655]/40 text-xs font-semibold">
            <div className="hidden lg:flex items-center gap-1 px-1.5 text-[11px] text-[#64748b] dark:text-[#bec6e0]">
              <Palette className="w-3.5 h-3.5" />
              <span>Theme:</span>
            </div>

            {/* Red Theme Button */}
            <button
              onClick={() => setThemeColor('red')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                themeColor === 'red'
                  ? 'bg-red-600 text-white shadow-xs font-bold'
                  : 'text-[#64748b] dark:text-[#bec6e0] hover:bg-red-100 dark:hover:bg-red-950/40'
              }`}
              title="Red Theme (Emergency Alert)"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white/40"></span>
              <span className="text-[11px] hidden sm:inline">Red</span>
            </button>

            {/* Blue Theme Button */}
            <button
              onClick={() => setThemeColor('blue')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                themeColor === 'blue'
                  ? 'bg-[#2563eb] text-white shadow-xs font-bold'
                  : 'text-[#64748b] dark:text-[#bec6e0] hover:bg-blue-100 dark:hover:bg-blue-950/40'
              }`}
              title="Blue Theme (Cyber Radar)"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white/40"></span>
              <span className="text-[11px] hidden sm:inline">Blue</span>
            </button>

            {/* Black Theme Button */}
            <button
              onClick={() => setThemeColor('black')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                themeColor === 'black'
                  ? 'bg-black text-white shadow-xs font-bold border border-gray-700'
                  : 'text-[#64748b] dark:text-[#bec6e0] hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
              title="Black Theme (OLED Stealth)"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-black border border-white/40"></span>
              <span className="text-[11px] hidden sm:inline">Black</span>
            </button>
          </div>

          {currentStep > 1 && (
            <button
              onClick={() => setStep((currentStep - 1) as StepNumber)}
              className="text-xs font-semibold px-2.5 py-1.5 text-[#505f76] dark:text-[#bec6e0] hover:bg-[#f2f4f6] dark:hover:bg-[#2d3133] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Go back a step"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Back</span>
            </button>
          )}

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-[#505f76] dark:text-[#bec6e0] hover:bg-[#f2f4f6] dark:hover:bg-[#2d3133] transition-colors cursor-pointer"
            title="Toggle Light/Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

