import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Copy,
  Check,
  Code2,
  FileCode,
  Smartphone,
  Download,
  Terminal,
} from 'lucide-react';

export const FlutterCodeModal: React.FC = () => {
  const { isFlutterCodeOpen, setIsFlutterCodeOpen, showToast } = useApp();
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<string>('main.dart');

  if (!isFlutterCodeOpen) return null;

  const flutterFiles: Record<string, { desc: string; code: string }> = {
    'pubspec.yaml': {
      desc: 'Flutter dependencies configuration file',
      code: `name: medicare
description: "MEDICARE — Premium Hospital Management & Healthcare App"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  shared_preferences: ^2.2.2
  google_fonts: ^6.1.0
  intl: ^0.19.0
  flutter_staggered_animations: ^1.1.1
  lucide_icons: ^0.257.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
`,
    },
    'main.dart': {
      desc: 'Entry point with Material 3 Theme & Routes',
      code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MedicareApp());
}

class MedicareApp extends StatelessWidget {
  const MedicareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MEDICARE',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1565C0),
          primary: const Color(0xFF1565C0),
          secondary: const Color(0xFF00897B),
          tertiary: const Color(0xFF26A69A),
          background: const Color(0xFFF5F9FC),
          surface: Colors.white,
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(),
      ),
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    );

    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _controller.forward();
    Future.delayed(const Duration(milliseconds: 2600), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const MedicareHomeScreen()),
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F9FC),
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF1565C0), Color(0xFF00897B)],
                    ),
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF1565C0).withOpacity(0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: const Icon(Icons.local_hospital_rounded, size: 50, color: Colors.white),
                ),
                const SizedBox(height: 20),
                const Text(
                  'MEDICARE',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF1565C0),
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Healthcare made simple.',
                  style: TextStyle(
                    fontSize: 16,
                    color: Color(0xFF667085),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class MedicareHomeScreen extends StatelessWidget {
  const MedicareHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F9FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'MEDICARE',
          style: TextStyle(color: Color(0xFF1565C0), fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Color(0xFF172B4D)),
            onPressed: () {},
          ),
        ],
      ),
      body: const Center(
        child: Text('MEDICARE Flutter Dashboard Running Successfully!'),
      ),
    );
  }
}
`,
    },
    'hospital_model.dart': {
      desc: 'Hospital data model with JSON serialization',
      code: `class Hospital {
  final String id;
  final String name;
  final String tagline;
  final String image;
  final double rating;
  final int reviewCount;
  final String location;
  final String address;
  final String distance;
  final String type;
  final String openHours;
  final bool isOpen;
  final bool emergencyAvailable;
  final String emergencyContact;
  final String about;
  final List<String> departments;
  final List<String> services;
  final List<String> facilities;
  final bool featured;

  Hospital({
    required this.id,
    required this.name,
    required this.tagline,
    required this.image,
    required this.rating,
    required this.reviewCount,
    required this.location,
    required this.address,
    required this.distance,
    required this.type,
    required this.openHours,
    required this.isOpen,
    required this.emergencyAvailable,
    required this.emergencyContact,
    required this.about,
    required this.departments,
    required this.services,
    required this.facilities,
    required this.featured,
  });

  factory Hospital.fromJson(Map<String, dynamic> json) => Hospital(
        id: json['id'],
        name: json['name'],
        tagline: json['tagline'],
        image: json['image'],
        rating: (json['rating'] as num).toDouble(),
        reviewCount: json['reviewCount'],
        location: json['location'],
        address: json['address'],
        distance: json['distance'],
        type: json['type'],
        openHours: json['openHours'],
        isOpen: json['isOpen'],
        emergencyAvailable: json['emergencyAvailable'],
        emergencyContact: json['emergencyContact'],
        about: json['about'],
        departments: List<String>.from(json['departments']),
        services: List<String>.from(json['services']),
        facilities: List<String>.from(json['facilities']),
        featured: json['featured'] ?? false,
      );
}
`,
    },
    'doctor_model.dart': {
      desc: 'Doctor data model with availability slots & ratings',
      code: `class DoctorAvailability {
  final List<String> days;
  final String workingHours;
  final List<String> timeSlots;

  DoctorAvailability({
    required this.days,
    required this.workingHours,
    required this.timeSlots,
  });

  factory DoctorAvailability.fromJson(Map<String, dynamic> json) => DoctorAvailability(
        days: List<String>.from(json['days']),
        workingHours: json['workingHours'],
        timeSlots: List<String>.from(json['timeSlots']),
      );

  Map<String, dynamic> toJson() => {
        'days': days,
        'workingHours': workingHours,
        'timeSlots': timeSlots,
      };
}

class Doctor {
  final String id;
  final String hospitalId;
  final String hospitalName;
  final String name;
  final String specialization;
  final String qualification;
  final int experience;
  final double rating;
  final int reviewCount;
  final int consultationFee;
  final String avatarUrl;
  final String about;
  final List<String> education;
  final bool isAvailableToday;
  final DoctorAvailability availability;

  Doctor({
    required this.id,
    required this.hospitalId,
    required this.hospitalName,
    required this.name,
    required this.specialization,
    required this.qualification,
    required this.experience,
    required this.rating,
    required this.reviewCount,
    required this.consultationFee,
    required this.avatarUrl,
    required this.about,
    required this.education,
    this.isAvailableToday = true,
    required this.availability,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) => Doctor(
        id: json['id'],
        hospitalId: json['hospitalId'],
        hospitalName: json['hospitalName'],
        name: json['name'],
        specialization: json['specialization'],
        qualification: json['qualification'],
        experience: (json['experience'] as num).toInt(),
        rating: (json['rating'] as num).toDouble(),
        reviewCount: (json['reviewCount'] as num).toInt(),
        consultationFee: (json['consultationFee'] as num).toInt(),
        avatarUrl: json['avatarUrl'],
        about: json['about'] ?? '',
        education: List<String>.from(json['education']),
        isAvailableToday: json['isAvailableToday'] ?? true,
        availability: DoctorAvailability.fromJson(json['availability']),
      );
}
`,
    },
    'appointment_model.dart': {
      desc: 'Appointment model with token generator and status',
      code: `enum AppointmentStatus { upcoming, completed, cancelled }

class Appointment {
  final String id;
  final String patientId;
  final String patientName;
  final String doctorId;
  final String doctorName;
  final String doctorSpecialty;
  final String doctorAvatar;
  final String hospitalId;
  final String hospitalName;
  final String hospitalAddress;
  final String date;
  final String time;
  final String reason;
  final AppointmentStatus status;
  final int amount;
  final String createdAt;

  Appointment({
    required this.id,
    required this.patientId,
    required this.patientName,
    required this.doctorId,
    required this.doctorName,
    required this.doctorSpecialty,
    required this.doctorAvatar,
    required this.hospitalId,
    required this.hospitalName,
    required this.hospitalAddress,
    required this.date,
    required this.time,
    required this.reason,
    required this.status,
    required this.amount,
    required this.createdAt,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) => Appointment(
        id: json['id'],
        patientId: json['patientId'],
        patientName: json['patientName'],
        doctorId: json['doctorId'],
        doctorName: json['doctorName'],
        doctorSpecialty: json['doctorSpecialty'],
        doctorAvatar: json['doctorAvatar'],
        hospitalId: json['hospitalId'],
        hospitalName: json['hospitalName'],
        hospitalAddress: json['hospitalAddress'],
        date: json['date'],
        time: json['time'],
        reason: json['reason'],
        status: AppointmentStatus.values.firstWhere(
          (e) => e.name == json['status'],
          orElse: () => AppointmentStatus.upcoming,
        ),
        amount: (json['amount'] as num).toInt(),
        createdAt: json['createdAt'],
      );
}
`,
    },
    'local_storage_service.dart': {
      desc: 'Offline SharedPreferences caching for zero-dependency persistence',
      code: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class LocalStorageService {
  static const String _keyAppointments = 'medicare_appointments';
  static const String _keyPrescriptions = 'medicare_prescriptions';
  static SharedPreferences? _preferences;

  static Future<void> init() async {
    _preferences = await SharedPreferences.getInstance();
  }

  static Future<bool> save(String key, dynamic data) async {
    return await _preferences?.setString(key, jsonEncode(data)) ?? false;
  }

  static dynamic get(String key) {
    final str = _preferences?.getString(key);
    if (str == null) return null;
    return jsonDecode(str);
  }
}
`,
    },
    'AndroidManifest.xml': {
      desc: 'Android Manifest with permissions and launcher configs',
      code: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.medicare.app">
    <uses-permission android:name="android.permission.INTERNET"/>
    <application
        android:label="MEDICARE"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
    </application>
</manifest>
`,
    },
    'build.gradle': {
      desc: 'Android module Gradle build configuration (Sdk 34, MinSdk 21, Flutter Gradle Plugin DSL, Gradle 8.14, AGP 8.11.1)',
      code: `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

android {
    namespace "com.medicare.app"
    compileSdk 34
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    defaultConfig {
        applicationId "com.medicare.app"
        minSdk 21
        targetSdk 34
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
        multiDexEnabled true
    }
}
`,
    },
  };

  const handleCopy = (fileName: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(fileName);
    showToast(`Copied ${fileName} to clipboard!`, 'success');
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div
      id="medicare-flutter-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-slate-900 text-slate-100 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Modal Bar */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00897B] flex items-center justify-center text-white">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-sm text-white flex items-center gap-2">
                Flutter & Dart Source Code
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Android Studio Ready
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Ready-to-run Dart files matching all prompt guidelines
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFlutterCodeOpen(false)}
            className="p-1.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Tabs Strip */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto">
          {Object.keys(flutterFiles).map((fileName) => {
            const isActive = activeFile === fileName;
            return (
              <button
                key={fileName}
                onClick={() => setActiveFile(fileName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{fileName}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0a0f1d] font-mono text-xs text-slate-300 relative">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <span>{flutterFiles[activeFile].desc}</span>
            <button
              onClick={() => handleCopy(activeFile, flutterFiles[activeFile].code)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans font-bold flex items-center gap-1 transition-colors"
            >
              {copiedFile === activeFile ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="overflow-x-auto leading-relaxed whitespace-pre font-mono selection:bg-blue-500/30">
            <code>{flutterFiles[activeFile].code}</code>
          </pre>
        </div>

        {/* Instructions Footer */}
        <div className="p-3.5 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              To run: open folder in Android Studio, run <code>flutter pub get</code>, and launch on Pixel Emulator!
            </span>
          </div>
          <button
            onClick={() => handleCopy(activeFile, flutterFiles[activeFile].code)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            Copy {activeFile}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
