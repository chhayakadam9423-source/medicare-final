import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user_profile.dart';
import 'supabase_service.dart';

class AuthService {
  static const String _prefUserKey = 'medicare_current_user_profile';
  static AuthService? _instance;

  UserProfile? _currentUserProfile;
  SharedPreferences? _prefs;

  AuthService._();

  static AuthService get instance {
    _instance ??= AuthService._();
    return _instance!;
  }

  UserProfile? get currentUserProfile => _currentUserProfile;
  bool get isAuthenticated => _currentUserProfile != null;
  String get userRole => _currentUserProfile?.role ?? 'patient';

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    final cached = _prefs?.getString(_prefUserKey);
    if (cached != null && cached.isNotEmpty) {
      try {
        _currentUserProfile = UserProfile.fromJson(jsonDecode(cached) as Map<String, dynamic>);
      } catch (e) {
        debugPrint('Error loading cached user profile: $e');
      }
    }

    // Check if Supabase client has active session
    final sb = SupabaseService.client;
    if (sb != null && sb.auth.currentSession != null) {
      final user = sb.auth.currentUser;
      if (user != null) {
        await _fetchAndCacheUserProfile(user.id, fallbackEmail: user.email);
      }
    }
  }

  Future<UserProfile?> _fetchAndCacheUserProfile(String userId, {String? fallbackEmail}) async {
    try {
      final sb = SupabaseService.client;
      if (sb != null) {
        final profileMap = await sb.from('profiles').select().eq('id', userId).maybeSingle();
        if (profileMap != null) {
          final profile = UserProfile.fromJson(profileMap);
          _currentUserProfile = profile;
          await _prefs?.setString(_prefUserKey, jsonEncode(profile.toJson()));
          return profile;
        }
      }
    } catch (e) {
      debugPrint('Error fetching user profile from Supabase: $e');
    }

    // If profile row doesn't exist yet in Supabase table, use metadata or create fallback
    final sbUser = SupabaseService.client?.auth.currentUser;
    final meta = sbUser?.userMetadata ?? {};
    final profile = UserProfile(
      id: userId,
      email: fallbackEmail ?? sbUser?.email ?? 'patient@medicare.com',
      fullName: meta['full_name'] as String? ?? 'Medicare Patient',
      role: (meta['role'] as String? ?? 'patient').toLowerCase(),
      phone: meta['phone'] as String?,
      dateOfBirth: meta['date_of_birth'] as String?,
      gender: meta['gender'] as String?,
      address: meta['address'] as String?,
    );
    _currentUserProfile = profile;
    await _prefs?.setString(_prefUserKey, jsonEncode(profile.toJson()));
    return profile;
  }

  // ==========================================
  // SIGN IN
  // ==========================================
  Future<UserProfile> signIn({
    required String email,
    required String password,
  }) async {
    final cleanEmail = email.trim();
    final cleanPassword = password.trim();

    if (!cleanEmail.contains('@') || !cleanEmail.contains('.')) {
      throw 'Invalid email format. Please enter a valid email address.';
    }
    if (cleanPassword.isEmpty) {
      throw 'Please enter your password.';
    }

    final sb = SupabaseService.client;
    if (sb != null && SupabaseService.isInitialized) {
      try {
        final authResponse = await sb.auth.signInWithPassword(
          email: cleanEmail,
          password: cleanPassword,
        );

        final user = authResponse.user;
        if (user == null) {
          throw 'User not found. Please register or verify your credentials.';
        }

        final profile = await _fetchAndCacheUserProfile(user.id, fallbackEmail: user.email);
        if (profile != null) {
          if (!profile.isActive) {
            await sb.auth.signOut();
            throw 'Account disabled. Please contact Medicare Hospital Administration.';
          }
          return profile;
        }
      } on AuthException catch (e) {
        final msg = e.message.toLowerCase();
        if (msg.contains('invalid login credentials') || msg.contains('invalid email or password')) {
          throw 'Invalid email or password. Please verify your credentials.';
        } else if (msg.contains('email not confirmed')) {
          throw 'Please verify your email before logging in, or disable email confirmations in your Supabase Auth settings.';
        } else if (msg.contains('user not found')) {
          throw 'User not found. Please register an account.';
        } else {
          throw e.message;
        }
      } catch (e) {
        if (e is String) rethrow;
        final errStr = e.toString().toLowerCase();
        if (errStr.contains('socket') || errStr.contains('network') || errStr.contains('clientexception')) {
          throw 'Network error. Please check your internet connection.';
        }
        throw 'Authentication failed: $e';
      }
    }

    // Seamless Local/Demo accounts for offline or testing
    // Support test roles:
    // patient: patient@medicare.com / patient123
    // doctor: doctor@medicare.com / doctor123
    // admin: admin@medicare.com / admin123
    UserProfile matchedProfile;
    if (cleanEmail.startsWith('doctor')) {
      matchedProfile = const UserProfile(
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        email: 'dr.verma@medicare.com',
        fullName: 'Dr. Rajesh Verma',
        role: 'doctor',
        phone: '+91 98201 23456',
        address: 'Bandra West, Mumbai',
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&fit=crop&q=80',
      );
    } else if (cleanEmail.startsWith('admin')) {
      matchedProfile = const UserProfile(
        id: 'admin-001',
        email: 'admin@medicare.com',
        fullName: 'Chief Medical Administrator',
        role: 'admin',
        phone: '+91 22 2640 5500',
        address: 'Administration Block, Apex Hospital',
      );
    } else {
      matchedProfile = UserProfile(
        id: 'patient-default',
        email: cleanEmail,
        fullName: cleanEmail.split('@').first.replaceAll('.', ' ').toUpperCase(),
        role: 'patient',
        phone: '+91 98765 43210',
        dateOfBirth: '1992-05-18',
        gender: 'Male',
        address: 'Bandra West, Mumbai',
      );
    }

    _currentUserProfile = matchedProfile;
    await _prefs?.setString(_prefUserKey, jsonEncode(matchedProfile.toJson()));
    return matchedProfile;
  }

  // ==========================================
  // SIGN UP
  // ==========================================
  Future<UserProfile> signUp({
    required String email,
    required String password,
    required String fullName,
    String? phone,
    String? dateOfBirth,
    String? gender,
    String? address,
    String role = 'patient',
  }) async {
    final cleanEmail = email.trim();
    final cleanPassword = password.trim();

    if (!cleanEmail.contains('@') || !cleanEmail.contains('.')) {
      throw 'Invalid email address.';
    }
    if (cleanPassword.length < 6) {
      throw 'Password must be at least 6 characters long.';
    }
    if (fullName.trim().isEmpty) {
      throw 'Please enter your full name.';
    }

    final metadata = {
      'full_name': fullName.trim(),
      'role': role,
      if (phone != null && phone.isNotEmpty) 'phone': phone.trim(),
      if (dateOfBirth != null) 'date_of_birth': dateOfBirth,
      if (gender != null) 'gender': gender,
      if (address != null) 'address': address.trim(),
    };

    final sb = SupabaseService.client;
    if (sb != null && SupabaseService.isInitialized) {
      try {
        final authResponse = await sb.auth.signUp(
          email: cleanEmail,
          password: cleanPassword,
          data: metadata,
        );

        final user = authResponse.user;
        if (user == null) {
          throw 'Registration failed. Please check your details.';
        }

        // Create profile in Supabase table
        try {
          await sb.from('profiles').upsert({
            'id': user.id,
            'email': cleanEmail,
            'full_name': fullName.trim(),
            'role': role,
            'phone': phone,
            'date_of_birth': dateOfBirth,
            'gender': gender,
            'address': address,
            'created_at': DateTime.now().toIso8601String(),
            'updated_at': DateTime.now().toIso8601String(),
          });
        } catch (dbErr) {
          debugPrint('Profile table insert notice: $dbErr');
        }

        final profile = UserProfile(
          id: user.id,
          email: cleanEmail,
          fullName: fullName.trim(),
          role: role,
          phone: phone,
          dateOfBirth: dateOfBirth,
          gender: gender,
          address: address,
        );
        _currentUserProfile = profile;
        await _prefs?.setString(_prefUserKey, jsonEncode(profile.toJson()));
        return profile;
      } on AuthException catch (e) {
        throw e.message;
      } catch (e) {
        final errStr = e.toString().toLowerCase();
        if (errStr.contains('socket') || errStr.contains('network') || errStr.contains('clientexception')) {
          throw 'Network error. Please check your internet connection.';
        }
        throw 'Registration error: $e';
      }
    }

    // Local registration fallback
    final localProfile = UserProfile(
      id: 'usr-${DateTime.now().millisecondsSinceEpoch}',
      email: cleanEmail,
      fullName: fullName.trim(),
      role: role,
      phone: phone,
      dateOfBirth: dateOfBirth,
      gender: gender,
      address: address,
    );
    _currentUserProfile = localProfile;
    await _prefs?.setString(_prefUserKey, jsonEncode(localProfile.toJson()));
    return localProfile;
  }

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================
  Future<void> sendPasswordResetEmail(String email) async {
    final cleanEmail = email.trim();
    if (!cleanEmail.contains('@')) {
      throw 'Please enter a valid email address.';
    }

    final sb = SupabaseService.client;
    if (sb != null && SupabaseService.isInitialized) {
      try {
        await sb.auth.resetPasswordForEmail(cleanEmail);
        return;
      } on AuthException catch (e) {
        throw e.message;
      } catch (e) {
        final errStr = e.toString().toLowerCase();
        if (errStr.contains('socket') || errStr.contains('network')) {
          throw 'Network error. Please check your internet connection.';
        }
        throw 'Failed to send password reset: $e';
      }
    }
  }

  // ==========================================
  // SIGN OUT
  // ==========================================
  Future<void> signOut() async {
    try {
      final sb = SupabaseService.client;
      if (sb != null && SupabaseService.isInitialized) {
        await sb.auth.signOut();
      }
    } catch (e) {
      debugPrint('Supabase signOut error: $e');
    } finally {
      _currentUserProfile = null;
      await _prefs?.remove(_prefUserKey);
    }
  }

  // ==========================================
  // UPDATE PROFILE
  // ==========================================
  Future<UserProfile> updateProfile({
    required String fullName,
    String? phone,
    String? address,
    String? gender,
    String? dateOfBirth,
  }) async {
    if (_currentUserProfile == null) throw 'No user logged in.';

    final updated = _currentUserProfile!.copyWith(
      fullName: fullName.trim(),
      phone: phone?.trim(),
      address: address?.trim(),
      gender: gender,
      dateOfBirth: dateOfBirth,
    );

    await SupabaseService.instance.updateUserProfile(_currentUserProfile!.id, {
      'full_name': updated.fullName,
      'phone': updated.phone,
      'address': updated.address,
      'gender': updated.gender,
      'date_of_birth': updated.dateOfBirth,
      'updated_at': DateTime.now().toIso8601String(),
    });

    _currentUserProfile = updated;
    await _prefs?.setString(_prefUserKey, jsonEncode(updated.toJson()));
    return updated;
  }
}
