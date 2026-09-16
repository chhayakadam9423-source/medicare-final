import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { SplashScreen } from './components/splash/SplashScreen';
import { OnboardingScreen } from './components/onboarding/OnboardingScreen';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';

// Patient Components
import { PatientHome } from './components/patient/PatientHome';
import { HospitalListScreen } from './components/patient/HospitalListScreen';
import { HospitalDetailScreen } from './components/patient/HospitalDetailScreen';
import { DoctorListScreen } from './components/patient/DoctorListScreen';
import { DoctorProfileScreen } from './components/patient/DoctorProfileScreen';
import { PatientAppointmentsScreen } from './components/patient/PatientAppointmentsScreen';
import { MedicalRecordsScreen } from './components/patient/MedicalRecordsScreen';
import { PatientProfileScreen } from './components/patient/PatientProfileScreen';
import { PatientBottomNav } from './components/patient/PatientBottomNav';

// Doctor & Admin Screens
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Modals
import { AppointmentBookingModal } from './components/patient/AppointmentBookingModal';
import { AppointmentSuccessScreen } from './components/patient/AppointmentSuccessScreen';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationsModal } from './components/common/NotificationsModal';
import { FlutterCodeModal } from './components/common/FlutterCodeModal';

const MainAppContent: React.FC = () => {
  const {
    hasSeenSplash,
    setHasSeenSplash,
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
    isLoggedIn,
    currentRole,
    patientTab,
    selectedDoctor,
    setSelectedDoctor,
    selectedHospital,
    setSelectedHospital,
  } = useApp();

  const [authView, setAuthView] = useState<'welcome' | 'login' | 'register'>('login');

  // 1. Splash Screen Phase
  if (!hasSeenSplash) {
    return (
      <DeviceFrame>
        <SplashScreen onFinish={() => setHasSeenSplash(true)} />
      </DeviceFrame>
    );
  }

  // 2. Onboarding Carousel Phase
  if (!hasCompletedOnboarding) {
    return (
      <DeviceFrame>
        <OnboardingScreen onFinish={() => setHasCompletedOnboarding(true)} />
      </DeviceFrame>
    );
  }

  // 3. Authentication Phase
  if (!isLoggedIn) {
    return (
      <DeviceFrame>
        {authView === 'welcome' && (
          <WelcomeScreen
            onSelectLogin={() => setAuthView('login')}
            onSelectRegister={() => setAuthView('register')}
          />
        )}
        {authView === 'login' && (
          <LoginScreen
            onGoToRegister={() => setAuthView('register')}
            onBackToWelcome={() => setAuthView('welcome')}
          />
        )}
        {authView === 'register' && (
          <RegisterScreen onGoToLogin={() => setAuthView('login')} />
        )}
      </DeviceFrame>
    );
  }

  // 4. Authenticated Application
  return (
    <DeviceFrame>
      <div className="relative w-full min-h-full flex flex-col bg-[#F5F9FC] dark:bg-slate-900">
        {/* DOCTOR ROLE VIEW */}
        {currentRole === 'doctor' && <DoctorDashboard />}

        {/* ADMIN ROLE VIEW */}
        {currentRole === 'admin' && <AdminDashboard />}

        {/* PATIENT ROLE VIEW */}
        {currentRole === 'patient' && (
          <>
            {selectedDoctor ? (
              <DoctorProfileScreen
                doctor={selectedDoctor}
                onBack={() => setSelectedDoctor(null)}
              />
            ) : selectedHospital ? (
              <HospitalDetailScreen
                hospital={selectedHospital}
                onBack={() => setSelectedHospital(null)}
              />
            ) : (
              <>
                {patientTab === 'home' && <PatientHome />}
                {patientTab === 'hospitals' && <HospitalListScreen />}
                {patientTab === 'doctors' && <DoctorListScreen />}
                {patientTab === 'appointments' && <PatientAppointmentsScreen />}
                {patientTab === 'records' && <MedicalRecordsScreen />}
                {patientTab === 'profile' && <PatientProfileScreen />}
                <PatientBottomNav />
              </>
            )}
          </>
        )}

        {/* Universal Application Modals */}
        <AppointmentBookingModal />
        <AppointmentSuccessScreen />
        <GlobalSearchModal />
        <NotificationsModal />
        <FlutterCodeModal />
      </div>
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
