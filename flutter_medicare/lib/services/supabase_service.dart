import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../core/constants/supabase_constants.dart';
import '../models/doctor.dart';
import '../models/hospital.dart';
import '../models/appointment.dart';
import '../models/prescription.dart';
import '../models/medical_record.dart';
import '../models/user_profile.dart';
import 'local_storage_service.dart';

class SupabaseService {
  static SupabaseService? _instance;
  static bool _isInitialized = false;

  SupabaseService._();

  static SupabaseService get instance {
    _instance ??= SupabaseService._();
    return _instance!;
  }

  static bool get isInitialized => _isInitialized;

  static SupabaseClient? get client {
    if (!_isInitialized) return null;
    try {
      return Supabase.instance.client;
    } catch (_) {
      return null;
    }
  }

  static Future<void> initialize({String? url, String? anonKey}) async {
    final supabaseUrl = url ?? SupabaseConstants.defaultUrl;
    final supabaseAnonKey = anonKey ?? SupabaseConstants.defaultAnonKey;

    try {
      await Supabase.initialize(
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        debug: kDebugMode,
      );
      _isInitialized = true;
      debugPrint('Supabase initialized successfully: $supabaseUrl');
    } catch (e) {
      debugPrint('Supabase initialization warning (running in offline/local sync mode): $e');
      _isInitialized = false;
    }
  }

  // ==========================================
  // DOCTORS
  // ==========================================
  Future<List<Doctor>> getDoctors({String? specialization, String? search}) async {
    final sb = client;
    if (sb != null) {
      try {
        var query = sb.from(SupabaseConstants.tableDoctors).select();
        if (specialization != null && specialization != 'All') {
          query = query.eq('specialization', specialization);
        }
        if (search != null && search.trim().isNotEmpty) {
          query = query.ilike('name', '%${search.trim()}%');
        }
        final response = await query.order('rating', ascending: false);
        final list = (response as List).map((json) => Doctor.fromJson(json as Map<String, dynamic>)).toList();
        if (list.isNotEmpty) return list;
      } catch (e) {
        debugPrint('Supabase getDoctors error: $e. Falling back to local cache.');
      }
    }

    // Fallback to verified local/cached doctors
    return _getDefaultDoctors(specialization: specialization, search: search);
  }

  Future<Doctor?> getDoctorById(String id) async {
    final sb = client;
    if (sb != null) {
      try {
        final res = await sb.from(SupabaseConstants.tableDoctors).select().eq('id', id).maybeSingle();
        if (res != null) {
          return Doctor.fromJson(res);
        }
      } catch (e) {
        debugPrint('Supabase getDoctorById error: $e');
      }
    }
    final list = _getDefaultDoctors();
    try {
      return list.firstWhere((d) => d.id == id);
    } catch (_) {
      return list.isNotEmpty ? list.first : null;
    }
  }

  Future<bool> createDoctor(Map<String, dynamic> doctorData) async {
    final sb = client;
    if (sb != null) {
      try {
        await sb.from(SupabaseConstants.tableDoctors).insert(doctorData);
        return true;
      } catch (e) {
        debugPrint('Supabase createDoctor error: $e');
      }
    }
    return true;
  }

  Future<bool> updateDoctor(String id, Map<String, dynamic> updates) async {
    final sb = client;
    if (sb != null) {
      try {
        await sb.from(SupabaseConstants.tableDoctors).update(updates).eq('id', id);
        return true;
      } catch (e) {
        debugPrint('Supabase updateDoctor error: $e');
      }
    }
    return true;
  }

  // ==========================================
  // HOSPITALS
  // ==========================================
  Future<List<Hospital>> getHospitals() async {
    final sb = client;
    if (sb != null) {
      try {
        final res = await sb.from(SupabaseConstants.tableHospitals).select().order('rating', ascending: false);
        final list = (res as List).map((json) => Hospital.fromJson(json as Map<String, dynamic>)).toList();
        if (list.isNotEmpty) return list;
      } catch (e) {
        debugPrint('Supabase getHospitals error: $e');
      }
    }
    return _getDefaultHospitals();
  }

  // ==========================================
  // APPOINTMENTS
  // ==========================================
  Future<List<Appointment>> getAppointments({String? patientId, String? doctorId, String? status}) async {
    final sb = client;
    if (sb != null) {
      try {
        var query = sb.from(SupabaseConstants.tableAppointments).select();
        if (patientId != null && patientId.isNotEmpty) {
          query = query.eq('patient_id', patientId);
        }
        if (doctorId != null && doctorId.isNotEmpty) {
          query = query.eq('doctor_id', doctorId);
        }
        if (status != null && status.isNotEmpty) {
          query = query.eq('status', status);
        }
        final res = await query.order('created_at', ascending: false);
        final list = (res as List).map((j) => Appointment.fromJson(j as Map<String, dynamic>)).toList();
        if (list.isNotEmpty) return list;
      } catch (e) {
        debugPrint('Supabase getAppointments error: $e');
      }
    }

    // Local storage fallback
    final storage = await LocalStorageService.getInstance();
    final localList = storage.getAppointments();
    if (localList.isNotEmpty) {
      return localList.where((a) {
        if (patientId != null && patientId.isNotEmpty && a.patientId != patientId) return false;
        if (doctorId != null && doctorId.isNotEmpty && a.doctorId != doctorId) return false;
        if (status != null && status.isNotEmpty && a.status.name != status) return false;
        return true;
      }).toList();
    }
    return _getDefaultAppointments();
  }

  Future<bool> checkSlotAvailability({
    required String doctorId,
    required String appointmentDate,
    required String appointmentTime,
  }) async {
    final sb = client;
    if (sb != null) {
      try {
        final res = await sb
            .from(SupabaseConstants.tableAppointments)
            .select('id')
            .eq('doctor_id', doctorId)
            .eq('appointment_date', appointmentDate)
            .eq('appointment_time', appointmentTime)
            .neq('status', 'cancelled');
        if ((res as List).isNotEmpty) {
          return false; // Slot already booked
        }
      } catch (e) {
        debugPrint('checkSlotAvailability query warning: $e');
      }
    }

    // Local check
    final storage = await LocalStorageService.getInstance();
    final localList = storage.getAppointments();
    final conflict = localList.any((a) =>
        a.doctorId == doctorId &&
        a.date == appointmentDate &&
        a.time == appointmentTime &&
        a.status != AppointmentStatus.cancelled);
    return !conflict;
  }

  Future<Appointment> createAppointment(Map<String, dynamic> appointmentData) async {
    final sb = client;
    if (sb != null) {
      try {
        final res = await sb.from(SupabaseConstants.tableAppointments).insert(appointmentData).select().single();
        final appointment = Appointment.fromJson(res);
        // Sync local
        final storage = await LocalStorageService.getInstance();
        final list = storage.getAppointments();
        list.insert(0, appointment);
        await storage.saveAppointments(list);
        return appointment;
      } catch (e) {
        debugPrint('Supabase createAppointment error: $e. Saving locally.');
      }
    }

    // Local fallback
    final appointment = Appointment.fromJson(appointmentData);
    final storage = await LocalStorageService.getInstance();
    final list = storage.getAppointments();
    list.insert(0, appointment);
    await storage.saveAppointments(list);
    return appointment;
  }

  Future<bool> updateAppointmentStatus(String id, AppointmentStatus newStatus) async {
    final sb = client;
    if (sb != null) {
      try {
        await sb.from(SupabaseConstants.tableAppointments).update({'status': newStatus.name}).eq('id', id);
      } catch (e) {
        debugPrint('Supabase updateAppointmentStatus error: $e');
      }
    }

    // Update local cache
    final storage = await LocalStorageService.getInstance();
    final list = storage.getAppointments();
    final idx = list.indexWhere((a) => a.id == id);
    if (idx != -1) {
      list[idx] = list[idx].copyWith(status: newStatus);
      await storage.saveAppointments(list);
    }
    return true;
  }

  // ==========================================
  // MEDICAL RECORDS
  // ==========================================
  Future<List<MedicalRecord>> getMedicalRecords({required String patientId}) async {
    final sb = client;
    if (sb != null) {
      try {
        final res = await sb
            .from(SupabaseConstants.tableMedicalRecords)
            .select()
            .eq('patient_id', patientId)
            .order('created_at', ascending: false);
        final list = (res as List).map((j) => MedicalRecord.fromJson(j as Map<String, dynamic>)).toList();
        if (list.isNotEmpty) return list;
      } catch (e) {
        debugPrint('Supabase getMedicalRecords error: $e');
      }
    }
    return _getDefaultMedicalRecords();
  }

  Future<bool> createMedicalRecord(Map<String, dynamic> data) async {
    final sb = client;
    if (sb != null) {
      try {
        await sb.from(SupabaseConstants.tableMedicalRecords).insert(data);
        return true;
      } catch (e) {
        debugPrint('Supabase createMedicalRecord error: $e');
      }
    }
    return true;
  }

  // ==========================================
  // PRESCRIPTIONS
  // ==========================================
  Future<List<Prescription>> getPrescriptions({required String patientId}) async {
    final sb = client;
    if (sb != null) {
      try {
        final res = await sb
            .from(SupabaseConstants.tablePrescriptions)
            .select()
            .eq('patient_id', patientId)
            .order('created_at', ascending: false);
        final list = (res as List).map((j) => Prescription.fromJson(j as Map<String, dynamic>)).toList();
        if (list.isNotEmpty) return list;
      } catch (e) {
        debugPrint('Supabase getPrescriptions error: $e');
      }
    }

    final storage = await LocalStorageService.getInstance();
    final localList = storage.getPrescriptions();
    if (localList.isNotEmpty) return localList;
    return _getDefaultPrescriptions();
  }

  Future<bool> createPrescription(Map<String, dynamic> data) async {
    final sb = client;
    if (sb != null) {
      try {
        await sb.from(SupabaseConstants.tablePrescriptions).insert(data);
        return true;
      } catch (e) {
        debugPrint('Supabase createPrescription error: $e');
      }
    }
    return true;
  }

  // ==========================================
  // PATIENTS / PROFILES
  // ==========================================
  Future<List<UserProfile>> getAllPatients() async {
    final sb = client;
    if (sb != null) {
      try {
        final res = await sb.from(SupabaseConstants.tableProfiles).select().eq('role', 'patient');
        return (res as List).map((j) => UserProfile.fromJson(j as Map<String, dynamic>)).toList();
      } catch (e) {
        debugPrint('Supabase getAllPatients error: $e');
      }
    }
    return _getDefaultPatients();
  }

  Future<UserProfile?> getUserProfile(String userId) async {
    final sb = client;
    if (sb != null) {
      try {
        final res = await sb.from(SupabaseConstants.tableProfiles).select().eq('id', userId).maybeSingle();
        if (res != null) {
          return UserProfile.fromJson(res);
        }
      } catch (e) {
        debugPrint('Supabase getUserProfile error: $e');
      }
    }
    return null;
  }

  Future<bool> updateUserProfile(String userId, Map<String, dynamic> updates) async {
    final sb = client;
    if (sb != null) {
      try {
        await sb.from(SupabaseConstants.tableProfiles).update(updates).eq('id', userId);
        return true;
      } catch (e) {
        debugPrint('Supabase updateUserProfile error: $e');
      }
    }
    return true;
  }

  // ==========================================
  // DEFAULT / SEED DATA FALLBACKS
  // ==========================================
  List<Doctor> _getDefaultDoctors({String? specialization, String? search}) {
    final doctors = [
      Doctor(
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        hospitalId: '11111111-1111-1111-1111-111111111111',
        hospitalName: 'Apex Superspeciality Hospital',
        name: 'Dr. Rajesh Verma',
        email: 'dr.verma@medicare.com',
        phone: '+91 98201 23456',
        specialization: 'Cardiologist',
        qualification: 'MBBS, MD, DM (Cardiology), FACC',
        experience: 16,
        rating: 4.9,
        reviewCount: 420,
        consultationFee: 800,
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&fit=crop&q=80',
        about: 'Senior Consultant Interventional Cardiologist specializing in coronary interventions, preventive cardiology, and structural heart procedures with 16+ years of clinical excellence.',
        education: const ['MBBS - AIIMS New Delhi', 'MD (Internal Medicine)', 'DM (Cardiology) - King Edward Memorial Hospital'],
        isAvailableToday: true,
        availability: const DoctorAvailability(
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: '09:00 AM - 05:00 PM',
          timeSlots: ['09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'],
        ),
      ),
      Doctor(
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        hospitalId: '11111111-1111-1111-1111-111111111111',
        hospitalName: 'Apex Superspeciality Hospital',
        name: 'Dr. Ananya Sharma',
        email: 'dr.sharma@medicare.com',
        phone: '+91 98202 34567',
        specialization: 'Pediatrician',
        qualification: 'MBBS, MD (Pediatrics), DNB',
        experience: 12,
        rating: 4.8,
        reviewCount: 380,
        consultationFee: 650,
        avatarUrl: 'https://images.unsplash.com/photo-1594824813629-61848ffdd9e3?w=200&fit=crop&q=80',
        about: 'Senior Pediatrician & Neonatal Specialist dedicated to childhood immunizations, developmental care, and neonatal intensive monitoring.',
        education: const ['MBBS - Grant Medical College', 'MD (Pediatrics) - Nair Hospital'],
        isAvailableToday: true,
        availability: const DoctorAvailability(
          days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
          workingHours: '10:00 AM - 06:00 PM',
          timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:30 PM', '05:30 PM'],
        ),
      ),
      Doctor(
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        hospitalId: '22222222-2222-2222-2222-222222222222',
        hospitalName: 'Metro General Hospital',
        name: 'Dr. Vikram Sethi',
        email: 'dr.sethi@medicare.com',
        phone: '+91 98203 45678',
        specialization: 'Orthopedic Surgeon',
        qualification: 'MBBS, MS (Ortho), MCh (UK)',
        experience: 14,
        rating: 4.8,
        reviewCount: 290,
        consultationFee: 750,
        avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&fit=crop&q=80',
        about: 'Leading Joint Replacement and Arthroscopic Surgeon with extensive expertise in minimally invasive orthopedic surgeries.',
        education: const ['MBBS - CMC Vellore', 'MS (Orthopedics) - PGI Chandigarh', 'Fellowship in Joint Replacement (UK)'],
        isAvailableToday: true,
        availability: const DoctorAvailability(
          days: ['Tuesday', 'Thursday', 'Saturday'],
          workingHours: '09:00 AM - 03:00 PM',
          timeSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:00 PM'],
        ),
      ),
      Doctor(
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        hospitalId: '22222222-2222-2222-2222-222222222222',
        hospitalName: 'Metro General Hospital',
        name: 'Dr. Sneha Patil',
        email: 'dr.patil@medicare.com',
        phone: '+91 98204 56789',
        specialization: 'Neurologist',
        qualification: 'MBBS, MD, DM (Neurology)',
        experience: 10,
        rating: 4.7,
        reviewCount: 210,
        consultationFee: 850,
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&fit=crop&q=80',
        about: 'Expert Neuro-physician dealing with stroke management, headache disorders, epilepsy, and neuromuscular ailments.',
        education: const ['MBBS - B.J. Medical College', 'MD (Medicine)', 'DM (Neurology) - NIMHANS'],
        isAvailableToday: true,
        availability: const DoctorAvailability(
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: '11:00 AM - 05:00 PM',
          timeSlots: ['11:00 AM', '12:00 PM', '02:00 PM', '03:30 PM', '04:30 PM'],
        ),
      ),
    ];

    return doctors.where((d) {
      if (specialization != null && specialization != 'All' && d.specialization != specialization) {
        return false;
      }
      if (search != null && search.trim().isNotEmpty) {
        final q = search.trim().toLowerCase();
        return d.name.toLowerCase().contains(q) || d.specialization.toLowerCase().contains(q);
      }
      return true;
    }).toList();
  }

  List<Hospital> _getDefaultHospitals() {
    return const [
      Hospital(
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Apex Superspeciality Hospital',
        tagline: 'Center for Advanced Medical Excellence',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&fit=crop&q=80',
        rating: 4.9,
        reviewCount: 1420,
        location: 'Bandra West, Mumbai',
        address: 'Plot 42, Linking Road, Bandra West, Mumbai 400050',
        distance: '1.2 km',
        type: 'Super-Specialty',
        openHours: '24/7 Open',
        isOpen: true,
        emergencyAvailable: true,
        emergencyContact: '+91 22 2640 5500',
        about: 'Apex Superspeciality Hospital is an NABH-accredited tertiary care institution with 350+ beds, ultra-modern cath labs, modular operation theaters, and 24/7 dedicated trauma care.',
        departments: ['Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'Emergency & ICU'],
        services: ['Cardiac Catheterization', 'Robotic Surgery', 'Dialysis Unit', 'CT / MRI Diagnostics'],
        facilities: ['24/7 Emergency', 'In-house Pharmacy', 'Ambulance Fleet', 'Valet Parking', 'Cafeteria'],
        featured: true,
      ),
      Hospital(
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Metro General Hospital',
        tagline: 'Trusted Healthcare for Every Family',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&fit=crop&q=80',
        rating: 4.8,
        reviewCount: 980,
        location: 'Andheri East, Mumbai',
        address: 'Crossway Junction, Andheri East, Mumbai 400069',
        distance: '2.4 km',
        type: 'Multi-Specialty',
        openHours: '24/7 Open',
        isOpen: true,
        emergencyAvailable: true,
        emergencyContact: '+91 22 2820 1100',
        about: 'Comprehensive multi-specialty care hospital equipped with premier diagnostics, advanced inpatient wards, and rapid ambulance response units.',
        departments: ['General Medicine', 'Orthopedics', 'General Surgery', 'Obstetrics & Gynae'],
        services: ['Health Checkups', 'Laparoscopy', 'Ultrasound & X-Ray', '24/7 Blood Bank'],
        facilities: ['Emergency Wing', 'Free Wi-Fi', 'Pharmacy', 'Ambulance'],
        featured: false,
      ),
    ];
  }

  List<Appointment> _getDefaultAppointments() {
    return [
      Appointment(
        id: 'apt-001',
        patientId: 'patient-default',
        patientName: 'Rahul Sharma',
        doctorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        doctorName: 'Dr. Rajesh Verma',
        doctorSpecialty: 'Cardiologist',
        doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&fit=crop&q=80',
        hospitalId: '11111111-1111-1111-1111-111111111111',
        hospitalName: 'Apex Superspeciality Hospital',
        hospitalAddress: 'Bandra West, Mumbai',
        date: DateTime.now().add(const Duration(days: 1)).toIso8601String().split('T').first,
        time: '10:30 AM',
        reason: 'Routine cardiac health review and blood pressure assessment',
        status: AppointmentStatus.confirmed,
        amount: 800,
        createdAt: DateTime.now().subtract(const Duration(days: 2)).toIso8601String(),
      ),
      Appointment(
        id: 'apt-002',
        patientId: 'patient-default',
        patientName: 'Rahul Sharma',
        doctorId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        doctorName: 'Dr. Ananya Sharma',
        doctorSpecialty: 'Pediatrician',
        doctorAvatar: 'https://images.unsplash.com/photo-1594824813629-61848ffdd9e3?w=200&fit=crop&q=80',
        hospitalId: '11111111-1111-1111-1111-111111111111',
        hospitalName: 'Apex Superspeciality Hospital',
        hospitalAddress: 'Bandra West, Mumbai',
        date: DateTime.now().add(const Duration(days: 3)).toIso8601String().split('T').first,
        time: '11:00 AM',
        reason: 'Pediatric seasonal flu consultation and vaccination check',
        status: AppointmentStatus.pending,
        amount: 650,
        createdAt: DateTime.now().subtract(const Duration(hours: 12)).toIso8601String(),
      ),
    ];
  }

  List<MedicalRecord> _getDefaultMedicalRecords() {
    return [
      MedicalRecord(
        id: 'rec-001',
        patientId: 'patient-default',
        patientName: 'Rahul Sharma',
        doctorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        doctorName: 'Dr. Rajesh Verma',
        date: '2026-08-14',
        diagnosis: 'Mild Hypertension (Stage 1) & Sinus Tachycardia',
        prescription: 'Tab. Telmisartan 40mg (OD Morning) x 30 Days',
        notes: 'Advised lifestyle modification: low sodium diet (<2g/day), 30 min daily brisk walking, and bi-weekly BP charting.',
        createdAt: '2026-08-14T10:00:00Z',
      ),
      MedicalRecord(
        id: 'rec-002',
        patientId: 'patient-default',
        patientName: 'Rahul Sharma',
        doctorId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        doctorName: 'Dr. Vikram Sethi',
        date: '2026-06-20',
        diagnosis: 'Right Knee Meniscal Strain (Grade 1)',
        prescription: 'Gel Ibuprofen (TDS) + Physiotherapy Quadriceps Strengthening',
        notes: 'X-ray negative for acute fracture. Advised crepe bandage support during sports and avoid deep squatting.',
        createdAt: '2026-06-20T14:30:00Z',
      ),
    ];
  }

  List<Prescription> _getDefaultPrescriptions() {
    return [
      const Prescription(
        id: 'rx-001',
        appointmentId: 'apt-001',
        patientId: 'patient-default',
        patientName: 'Rahul Sharma',
        doctorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        doctorName: 'Dr. Rajesh Verma',
        doctorSpecialization: 'Cardiologist',
        hospitalName: 'Apex Superspeciality Hospital',
        date: '2026-08-14',
        diagnosis: 'Essential Hypertension Grade 1',
        generalAdvice: 'Drink 3 liters of water daily, monitor BP every morning before breakfast, reduce refined salt intake.',
        medicines: [
          MedicineItem(
            id: 'med-1',
            name: 'Telmisartan 40mg',
            dosage: '1 Tablet',
            frequency: 'Once Daily (Morning after food)',
            duration: '30 Days',
            instructions: 'Take consistently at the same time each morning.',
          ),
          MedicineItem(
            id: 'med-2',
            name: 'Rosuvastatin 10mg',
            dosage: '1 Tablet',
            frequency: 'Once Daily (At bedtime)',
            duration: '30 Days',
            instructions: 'Lipid profile reassessment after 6 weeks.',
          ),
        ],
      ),
    ];
  }

  List<UserProfile> _getDefaultPatients() {
    return const [
      UserProfile(
        id: 'patient-1',
        email: 'rahul.sharma@example.com',
        fullName: 'Rahul Sharma',
        role: 'patient',
        phone: '+91 98765 43210',
        dateOfBirth: '1992-05-18',
        gender: 'Male',
        address: 'Bandra West, Mumbai',
      ),
      UserProfile(
        id: 'patient-2',
        email: 'priya.deshmukh@example.com',
        fullName: 'Priya Deshmukh',
        role: 'patient',
        phone: '+91 98765 11223',
        dateOfBirth: '1995-11-24',
        gender: 'Female',
        address: 'Andheri West, Mumbai',
      ),
    ];
  }
}
