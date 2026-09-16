export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  bloodGroup?: string;
  allergies?: string[];
  address?: string;
  emergencyContact?: string;
}

export interface Department {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface Hospital {
  id: string;
  name: string;
  tagline: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  address: string;
  distance: string; // e.g. "2.4 km"
  type: string; // e.g. "Multi-Speciality", "Super Speciality"
  specialties: string[];
  isOpen: boolean;
  openHours: string;
  about: string;
  departments: string[];
  services: string[];
  facilities: string[];
  emergencyContact: string;
  emergencyAvailable: boolean;
  featured?: boolean;
}

export interface Availability {
  days: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  workingHours: string; // "09:00 AM - 05:00 PM"
  timeSlots: string[]; // ['09:00 AM', '09:30 AM', ...]
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number; // in years
  rating: number;
  reviewCount: number;
  hospitalId: string;
  hospitalName: string;
  avatarUrl: string;
  about: string;
  education: string[];
  consultationFee: number;
  patientsTreated: number;
  availability: Availability;
  isAvailableToday: boolean;
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'pending';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorAvatar: string;
  hospitalId: string;
  hospitalName: string;
  hospitalAddress: string;
  date: string; // YYYY-MM-DD
  time: string; // "10:30 AM"
  reason: string;
  status: AppointmentStatus;
  consultationFee: number;
  createdAt: string;
  notes?: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "1-0-1 (After meals)"
  duration: string; // e.g. "5 days"
  instructions: string; // e.g. "Take with warm water"
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  hospitalName: string;
  date: string;
  diagnosis: string;
  medicines: Medicine[];
  generalAdvice: string;
  followUpDate?: string;
}

export type MedicalRecordCategory =
  | 'Prescriptions'
  | 'Medical History'
  | 'Lab Reports'
  | 'Diagnosis'
  | 'Doctor Notes';

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  category: MedicalRecordCategory;
  date: string;
  doctorName: string;
  hospitalName: string;
  summary: string;
  fileSize?: string;
  tags: string[];
  details?: Record<string, string>;
}

export type AdStatus = 'active' | 'upcoming' | 'expired';

export interface Advertisement {
  id: string;
  hospitalId?: string;
  hospitalName: string;
  bannerImage: string;
  title: string;
  description: string;
  offer: string;
  ctaText: string;
  startDate: string;
  endDate: string;
  isSponsored: boolean;
  status: AdStatus;
  discountBadge?: string;
  targetCategory?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'appointment' | 'offer' | 'prescription' | 'system';
  relatedId?: string;
}

export interface PatientProfile extends User {
  medicalHistory: string[];
  currentMedications: string[];
  upcomingAppointmentCount: number;
  completedAppointmentsCount: number;
}

export type PatientTab = 'home' | 'hospitals' | 'doctors' | 'appointments' | 'records' | 'profile';
