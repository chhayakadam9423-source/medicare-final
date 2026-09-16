import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/appointment.dart';
import '../models/prescription.dart';

class LocalStorageService {
  static const String _keyAppointments = 'medicare_appointments';
  static const String _keyPrescriptions = 'medicare_prescriptions';
  static const String _keyHospitals = 'medicare_hospitals';
  static const String _keyDoctors = 'medicare_doctors';
  static const String _keyAds = 'medicare_advertisements';
  static const String _keySavedHospitals = 'medicare_saved_hospitals';
  static const String _keyDarkMode = 'medicare_dark_mode';

  static LocalStorageService? _instance;
  static SharedPreferences? _preferences;

  LocalStorageService._();

  static Future<LocalStorageService> getInstance() async {
    _instance ??= LocalStorageService._();
    _preferences ??= await SharedPreferences.getInstance();
    return _instance!;
  }

  // Appointments
  Future<bool> saveAppointments(List<Appointment> list) async {
    final raw = list.map((a) => a.toJson()).toList();
    return _preferences?.setString(_keyAppointments, jsonEncode(raw)) ?? Future.value(false);
  }

  List<Appointment> getAppointments() {
    final rawString = _preferences?.getString(_keyAppointments);
    if (rawString == null || rawString.isEmpty) return [];
    try {
      final List<dynamic> list = jsonDecode(rawString);
      return list.map((item) => Appointment.fromJson(item as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  // Prescriptions
  Future<bool> savePrescriptions(List<Prescription> list) async {
    final raw = list.map((p) => p.toJson()).toList();
    return _preferences?.setString(_keyPrescriptions, jsonEncode(raw)) ?? Future.value(false);
  }

  List<Prescription> getPrescriptions() {
    final rawString = _preferences?.getString(_keyPrescriptions);
    if (rawString == null || rawString.isEmpty) return [];
    try {
      final List<dynamic> list = jsonDecode(rawString);
      return list.map((item) => Prescription.fromJson(item as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  // Dark Mode
  bool isDarkMode() => _preferences?.getBool(_keyDarkMode) ?? false;
  Future<bool> setDarkMode(bool val) => _preferences?.setBool(_keyDarkMode, val) ?? Future.value(false);

  // Clear all data (Admin reset)
  Future<bool> clearAll() async {
    return _preferences?.clear() ?? Future.value(false);
  }
}
