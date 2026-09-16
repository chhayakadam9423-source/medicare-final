import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Hospital,
  Doctor,
  Appointment,
  Prescription,
  MedicalRecord,
  Advertisement,
  NotificationItem,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_HOSPITALS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_ADVERTISEMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export type PatientTab = 'home' | 'hospitals' | 'doctors' | 'appointments' | 'records' | 'profile';
export type DoctorTab = 'dashboard' | 'appointments' | 'patients' | 'availability' | 'profile';
export type AdminTab = 'dashboard' | 'hospitals' | 'doctors' | 'advertisements';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  // Theme & Frame
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  deviceFrame: 'phone' | 'expanded';
  toggleDeviceFrame: () => void;

  // Auth & Navigation lifecycle
  hasSeenSplash: boolean;
  setHasSeenSplash: (val: boolean) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (val: boolean) => void;
  isLoggedIn: boolean;
  currentUser: User;
  currentRole: UserRole;
  loginAs: (role: UserRole, email?: string, password?: string) => boolean;
  registerUser: (userData: { name: string; email: string; phone: string; role: UserRole; password?: string }) => boolean;
  logout: () => void;
  showWelcome: boolean;
  setShowWelcome: (val: boolean) => void;

  // Active Tab per role
  patientTab: PatientTab;
  setPatientTab: (tab: PatientTab) => void;
  doctorTab: DoctorTab;
  setDoctorTab: (tab: DoctorTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Entities state
  hospitals: Hospital[];
  doctors: Doctor[];
  patients: User[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  medicalRecords: MedicalRecord[];
  advertisements: Advertisement[];
  notifications: NotificationItem[];
  savedHospitalIds: string[];
  toggleSaveHospital: (hospitalId: string) => void;

  // Detail & Action Modals
  selectedHospital: Hospital | null;
  setSelectedHospital: (hospital: Hospital | null) => void;
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  selectedPrescription: Prescription | null;
  setSelectedPrescription: (rx: Prescription | null) => void;
  bookingDoctor: Doctor | null;
  bookingHospital: Hospital | null;
  startBooking: (doctor?: Doctor, hospital?: Hospital) => void;
  cancelBooking: () => void;
  isBookingOpen: boolean;
  setIsBookingOpen: (val: boolean) => void;
  bookingDraft: { hospital: Hospital | null; doctor: Doctor | null };
  bookingSuccessData: Appointment | null;
  setBookingSuccessData: (data: Appointment | null) => void;
  confirmedAppointment: Appointment | null;
  setConfirmedAppointment: (data: Appointment | null) => void;
  createAppointment: (data: {
    doctorId: string;
    hospitalId: string;
    date: string;
    time: string;
    reason: string;
    [key: string]: any;
  }) => Appointment;

  // Doctor Modals
  doctorSelectedPatient: User | null;
  setDoctorSelectedPatient: (pat: User | null) => void;
  isCreatePrescriptionOpen: boolean;
  setIsCreatePrescriptionOpen: (val: boolean) => void;
  prescriptionTargetPatient: User | null;
  openCreatePrescription: (pat?: User) => void;

  // Global Dialogs
  isNotificationOpen: boolean;
  setIsNotificationOpen: (val: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  isFlutterCodeOpen: boolean;
  setIsFlutterCodeOpen: (val: boolean) => void;

  // Actions
  bookAppointment: (data: {
    doctorId: string;
    hospitalId: string;
    date: string;
    time: string;
    reason: string;
  }) => Appointment;
  cancelAppointment: (id: string) => void;
  acceptAppointment: (id: string) => void;
  rejectAppointment: (id: string) => void;
  completeAppointment: (id: string) => void;
  addPrescription: (rx: Omit<Prescription, 'id'>) => Prescription;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Admin Actions
  addHospital: (hosp: Omit<Hospital, 'id'>) => void;
  updateHospital: (id: string, hosp: Partial<Hospital>) => void;
  deleteHospital: (id: string) => void;
  addDoctor: (doc: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, doc: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  addAdvertisement: (ad: Omit<Advertisement, 'id'>) => void;
  updateAdvertisement: (id: string, ad: Partial<Advertisement>) => void;
  deleteAdvertisement: (id: string) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('medicare_theme') as 'light' | 'dark') || 'light';
  });

  const [deviceFrame, setDeviceFrame] = useState<'phone' | 'expanded'>(() => {
    return (localStorage.getItem('medicare_frame') as 'phone' | 'expanded') || 'phone';
  });

  // App launch lifecycle
  const [hasSeenSplash, setHasSeenSplash] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('medicare_onboarding_done') === 'true';
  });
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  // Authentication
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('medicare_role') as UserRole) || 'patient';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('medicare_logged_in') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('medicare_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS.patient;
      }
    }
    return DEMO_USERS[currentRole] || DEMO_USERS.patient;
  });

  // Navigation tabs
  const [patientTab, setPatientTab] = useState<PatientTab>('home');
  const [doctorTab, setDoctorTab] = useState<DoctorTab>('dashboard');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Entities
  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('medicare_hospitals');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('medicare_doctors');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [patients, setPatients] = useState<User[]>(INITIAL_PATIENTS);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('medicare_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('medicare_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('medicare_records');
    return saved ? JSON.parse(saved) : INITIAL_MEDICAL_RECORDS;
  });

  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => {
    const saved = localStorage.getItem('medicare_advertisements');
    return saved ? JSON.parse(saved) : INITIAL_ADVERTISEMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('medicare_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [savedHospitalIds, setSavedHospitalIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('medicare_saved_hospitals');
    return saved ? JSON.parse(saved) : ['hosp-1', 'hosp-2'];
  });

  // Modals & Selected states
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // Booking Flow
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingHospital, setBookingHospital] = useState<Hospital | null>(null);
  const [bookingSuccessData, setBookingSuccessData] = useState<Appointment | null>(null);

  // Doctor Modals
  const [doctorSelectedPatient, setDoctorSelectedPatient] = useState<User | null>(null);
  const [isCreatePrescriptionOpen, setIsCreatePrescriptionOpen] = useState(false);
  const [prescriptionTargetPatient, setPrescriptionTargetPatient] = useState<User | null>(null);

  // Global Dialogs
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFlutterCodeOpen, setIsFlutterCodeOpen] = useState(false);

  // Toast system
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('medicare_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('medicare_frame', deviceFrame);
  }, [deviceFrame]);

  useEffect(() => {
    localStorage.setItem('medicare_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('medicare_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('medicare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('medicare_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('medicare_advertisements', JSON.stringify(advertisements));
  }, [advertisements]);

  useEffect(() => {
    localStorage.setItem('medicare_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('medicare_saved_hospitals', JSON.stringify(savedHospitalIds));
  }, [savedHospitalIds]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleDeviceFrame = () => {
    setDeviceFrame((prev) => (prev === 'phone' ? 'expanded' : 'phone'));
  };

  const loginAs = (role: UserRole, email?: string, password?: string) => {
    const user = DEMO_USERS[role] || {
      id: `pat-${Date.now()}`,
      name: email ? email.split('@')[0] : 'User',
      email: email || `${role}@medicare.com`,
      phone: '+91 98765 00000',
      role,
    };

    setCurrentRole(role);
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('medicare_logged_in', 'true');
    localStorage.setItem('medicare_role', role);
    localStorage.setItem('medicare_user', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}! Switched to ${role.toUpperCase()} mode.`, 'success');
    return true;
  };

  const registerUser = (userData: { name: string; email: string; phone: string; role: UserRole }) => {
    if (userData.role === 'admin') {
      showToast('Admin registration is not available publicly.', 'error');
      return false;
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      gender: 'Male',
      age: 30,
      bloodGroup: 'B+',
    };

    setCurrentRole(userData.role);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('medicare_logged_in', 'true');
    localStorage.setItem('medicare_role', userData.role);
    localStorage.setItem('medicare_user', JSON.stringify(newUser));
    showToast(`Account created successfully! Welcome to MEDICARE, ${newUser.name}.`, 'success');
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('medicare_logged_in');
    showToast('You have been logged out.', 'info');
  };

  const toggleSaveHospital = (hospitalId: string) => {
    setSavedHospitalIds((prev) => {
      const exists = prev.includes(hospitalId);
      const updated = exists ? prev.filter((id) => id !== hospitalId) : [...prev, hospitalId];
      showToast(exists ? 'Removed from saved hospitals' : 'Added to saved hospitals', 'info');
      return updated;
    });
  };

  const startBooking = (doctor?: Doctor, hospital?: Hospital) => {
    setBookingDoctor(doctor || null);
    setBookingHospital(hospital || null);
    setIsBookingOpen(true);
  };

  const cancelBooking = () => {
    setIsBookingOpen(false);
    setBookingDoctor(null);
    setBookingHospital(null);
  };

  const bookAppointment = (data: {
    doctorId: string;
    hospitalId: string;
    date: string;
    time: string;
    reason: string;
  }) => {
    const doc = doctors.find((d) => d.id === data.doctorId) || doctors[0];
    const hosp = hospitals.find((h) => h.id === data.hospitalId) || hospitals[0];

    const newAppointment: Appointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      patientAge: currentUser.age || 32,
      patientGender: currentUser.gender || 'Male',
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialization: doc.specialization,
      doctorAvatar: doc.avatarUrl,
      hospitalId: hosp.id,
      hospitalName: hosp.name,
      hospitalAddress: hosp.address,
      date: data.date,
      time: data.time,
      reason: data.reason || 'General Consultation',
      status: 'upcoming',
      consultationFee: doc.consultationFee,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Create notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Appointment Booked Successfully',
      message: `Your appointment with ${doc.name} at ${hosp.name} is scheduled for ${data.date} at ${data.time}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'appointment',
      relatedId: newAppointment.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    setBookingSuccessData(newAppointment);
    setIsBookingOpen(false);
    return newAppointment;
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
    showToast('Appointment has been cancelled.', 'info');
  };

  const acceptAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'upcoming' } : apt))
    );
    showToast('Appointment accepted.', 'success');
  };

  const rejectAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
    showToast('Appointment declined.', 'info');
  };

  const completeAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'completed' } : apt))
    );
    showToast('Appointment marked as completed.', 'success');
  };

  const openCreatePrescription = (pat?: User) => {
    setPrescriptionTargetPatient(pat || null);
    setIsCreatePrescriptionOpen(true);
  };

  const addPrescription = (rxData: Omit<Prescription, 'id'>) => {
    const newRx: Prescription = {
      ...rxData,
      id: `rx-${Date.now().toString().slice(-4)}`,
    };
    setPrescriptions((prev) => [newRx, ...prev]);

    // Also add to patient's medical records
    const newRecord: MedicalRecord = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      patientId: newRx.patientId,
      title: `Prescription: ${newRx.diagnosis}`,
      category: 'Prescriptions',
      date: newRx.date,
      doctorName: newRx.doctorName,
      hospitalName: newRx.hospitalName,
      summary: `${newRx.medicines.length} medications prescribed for ${newRx.diagnosis}.`,
      tags: ['Prescription', newRx.doctorSpecialization],
      fileSize: '650 KB',
    };
    setMedicalRecords((prev) => [newRecord, ...prev]);

    showToast('Prescription saved & dispatched to patient records!', 'success');
    return newRx;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Admin CRUD
  const addHospital = (hosp: Omit<Hospital, 'id'>) => {
    const newHosp: Hospital = {
      ...hosp,
      id: `hosp-${Date.now()}`,
    };
    setHospitals((prev) => [newHosp, ...prev]);
    showToast(`Hospital "${newHosp.name}" added successfully!`, 'success');
  };

  const updateHospital = (id: string, hosp: Partial<Hospital>) => {
    setHospitals((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...hosp } : h))
    );
    showToast('Hospital details updated.', 'success');
  };

  const deleteHospital = (id: string) => {
    setHospitals((prev) => prev.filter((h) => h.id !== id));
    showToast('Hospital removed.', 'info');
  };

  const addDoctor = (doc: Omit<Doctor, 'id'>) => {
    const newDoc: Doctor = {
      ...doc,
      id: `doc-${Date.now()}`,
    };
    setDoctors((prev) => [newDoc, ...prev]);
    showToast(`Doctor "${newDoc.name}" added successfully!`, 'success');
  };

  const updateDoctor = (id: string, doc: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...doc } : d))
    );
    showToast('Doctor details updated.', 'success');
  };

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    showToast('Doctor profile removed.', 'info');
  };

  const addAdvertisement = (ad: Omit<Advertisement, 'id'>) => {
    const newAd: Advertisement = {
      ...ad,
      id: `ad-${Date.now()}`,
    };
    setAdvertisements((prev) => [newAd, ...prev]);
    showToast(`Advertisement "${newAd.title}" published!`, 'success');
  };

  const updateAdvertisement = (id: string, ad: Partial<Advertisement>) => {
    setAdvertisements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...ad } : a))
    );
    showToast('Advertisement updated.', 'success');
  };

  const deleteAdvertisement = (id: string) => {
    setAdvertisements((prev) => prev.filter((a) => a.id !== id));
    showToast('Advertisement deleted.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        deviceFrame,
        toggleDeviceFrame,
        hasSeenSplash,
        setHasSeenSplash,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        showWelcome,
        setShowWelcome,
        isLoggedIn,
        currentUser,
        currentRole,
        loginAs,
        registerUser,
        logout,
        patientTab,
        setPatientTab,
        doctorTab,
        setDoctorTab,
        adminTab,
        setAdminTab,
        hospitals,
        doctors,
        patients,
        appointments,
        prescriptions,
        medicalRecords,
        advertisements,
        notifications,
        savedHospitalIds,
        toggleSaveHospital,
        selectedHospital,
        setSelectedHospital,
        selectedDoctor,
        setSelectedDoctor,
        selectedPrescription,
        setSelectedPrescription,
        bookingDoctor,
        bookingHospital,
        startBooking,
        cancelBooking,
        isBookingOpen,
        setIsBookingOpen,
        bookingDraft: { hospital: bookingHospital, doctor: bookingDoctor },
        bookingSuccessData,
        setBookingSuccessData,
        confirmedAppointment: bookingSuccessData,
        setConfirmedAppointment: setBookingSuccessData,
        createAppointment: (data: any) => bookAppointment(data),
        doctorSelectedPatient,
        setDoctorSelectedPatient,
        isCreatePrescriptionOpen,
        setIsCreatePrescriptionOpen,
        prescriptionTargetPatient,
        openCreatePrescription,
        isNotificationOpen,
        setIsNotificationOpen,
        isSearchOpen,
        setIsSearchOpen,
        isFlutterCodeOpen,
        setIsFlutterCodeOpen,
        bookAppointment,
        cancelAppointment,
        acceptAppointment,
        rejectAppointment,
        completeAppointment,
        addPrescription,
        markNotificationRead,
        markAllNotificationsRead,
        addHospital,
        updateHospital,
        deleteHospital,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addAdvertisement,
        updateAdvertisement,
        deleteAdvertisement,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
