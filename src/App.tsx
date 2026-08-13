import React, { useState, useEffect } from 'react';
import { StepNumber, AuthProvider, Device, AuditLog, LegalModalType, ThemeColor } from './types';
import { INITIAL_DEVICES, INITIAL_AUDIT_LOGS } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Step1PhoneEntry } from './components/Step1PhoneEntry';
import { Step2VerifyOwnership } from './components/Step2VerifyOwnership';
import { Step3Dashboard } from './components/Step3Dashboard';
import { AuthModal } from './components/AuthModal';
import { LegalModal } from './components/LegalModal';

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 019-2834');
  const [activeProvider, setActiveProvider] = useState<AuthProvider | null>(null);
  const [authModalProvider, setAuthModalProvider] = useState<AuthProvider | null>(null);

  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(INITIAL_DEVICES[0].id);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');

  // Sync dark mode & theme attribute on root HTML element
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeColor);

    if (darkMode || themeColor === 'black') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [darkMode, themeColor]);


  const selectedDevice = devices.find((d) => d.id === setSelectedDeviceId ? d.id === selectedDeviceId : true) || devices[0];

  // Handler for proceeding from Step 1 to Step 2
  const handleProceedToStep2 = () => {
    setCurrentStep(2);
  };

  // Handler for selecting provider in Step 2
  const handleSelectProvider = (provider: AuthProvider) => {
    setAuthModalProvider(provider);
  };

  // Handler when OAuth / Auth modal completes successfully
  const handleAuthSuccess = () => {
    if (authModalProvider) {
      setActiveProvider(authModalProvider);

      // Add audit log entry
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: `${authModalProvider} Owner Authorization`,
        details: `Explicit permission granted for phone ${phoneNumber}`,
        type: 'auth',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
    setAuthModalProvider(null);
    setCurrentStep(3);
  };

  // Toggle Lost Mode on device
  const handleToggleLostMode = (deviceId: string, message?: string, phone?: string) => {
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === deviceId) {
          const isCurrentlyLost = dev.status === 'Lost Mode';
          const newStatus = isCurrentlyLost ? 'Active' : 'Lost Mode';
          return {
            ...dev,
            status: newStatus,
            lostModeMessage: message || dev.lostModeMessage,
            lostModeContactPhone: phone || dev.lostModeContactPhone,
          };
        }
        return dev;
      })
    );

    // Add log
    const target = devices.find((d) => d.id === deviceId);
    if (target) {
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: target.status === 'Lost Mode' ? 'Lost Mode Cleared' : 'Lost Mode Activated',
        details: `Security lock state updated for ${target.name}`,
        type: 'security',
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
  };

  // Trigger manual ping update
  const handleTriggerPing = () => {
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === selectedDeviceId) {
          // slight float jitter to simulate live tracking
          const latJitter = (Math.random() - 0.5) * 0.0004;
          const lngJitter = (Math.random() - 0.5) * 0.0004;
          return {
            ...dev,
            location: {
              ...dev.location,
              lat: dev.location.lat + latJitter,
              lng: dev.location.lng + lngJitter,
              lastPing: 'Just now',
            },
          };
        }
        return dev;
      })
    );

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      action: 'GPS Ping Broadcast',
      details: `Position updated for ${selectedDevice.name}`,
      type: 'ping',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Add a new device
  const handleAddDevice = (newDevice: Device) => {
    setDevices((prev) => [newDevice, ...prev]);
    setSelectedDeviceId(newDevice.id);

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      action: 'New Device Registered',
      details: `${newDevice.name} (${newDevice.id}) added to location watch`,
      type: 'security',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#191c1e] text-[#1e293b] dark:text-[#eff1f3] transition-colors font-sans antialiased">
      {/* Top Header */}
      <Header
        currentStep={currentStep}
        setStep={setCurrentStep}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        authenticatedProvider={activeProvider}
      />

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 md:py-12 w-full max-w-[1200px] mx-auto">
        {currentStep === 1 && (
          <Step1PhoneEntry
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onProceed={handleProceedToStep2}
            openModal={setLegalModal}
          />
        )}

        {currentStep === 2 && (
          <Step2VerifyOwnership
            phoneNumber={phoneNumber}
            onSelectProvider={handleSelectProvider}
            isLoading={!!authModalProvider}
          />
        )}

        {currentStep === 3 && (
          <Step3Dashboard
            devices={devices}
            selectedDevice={selectedDevice}
            onSelectDevice={(d) => setSelectedDeviceId(d.id)}
            auditLogs={auditLogs}
            onToggleLostMode={handleToggleLostMode}
            onTriggerPing={handleTriggerPing}
            onAddDevice={handleAddDevice}
            authenticatedProvider={activeProvider}
            themeColor={themeColor}
          />
        )}
      </main>


      {/* Footer */}
      <Footer openModal={setLegalModal} />

      {/* Auth / OAuth Handshake Modal */}
      <AuthModal
        provider={authModalProvider}
        phoneNumber={phoneNumber}
        onClose={() => setAuthModalProvider(null)}
        onSuccess={handleAuthSuccess}
      />

      {/* Legal & Policy Modal */}
      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
}
