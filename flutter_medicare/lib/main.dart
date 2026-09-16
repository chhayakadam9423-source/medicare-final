import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'services/local_storage_service.dart';
import 'services/supabase_service.dart';
import 'services/auth_service.dart';
import 'screens/splash/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. Initialize local cache storage
  try {
    await LocalStorageService.getInstance();
  } catch (e) {
    debugPrint('LocalStorageService initialization notice: $e');
  }

  // 2. Initialize Supabase Backend
  try {
    await SupabaseService.initialize();
  } catch (e) {
    debugPrint('SupabaseService initialization notice: $e');
  }

  // 3. Initialize Authentication & Session
  try {
    await AuthService.instance.init();
  } catch (e) {
    debugPrint('AuthService initialization notice: $e');
  }

  runApp(const MedicareApp());
}

class MedicareApp extends StatefulWidget {
  const MedicareApp({super.key});

  @override
  State<MedicareApp> createState() => _MedicareAppState();
}

class _MedicareAppState extends State<MedicareApp> {
  ThemeMode _themeMode = ThemeMode.light;

  void toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MEDICARE',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme(),
      darkTheme: AppTheme.darkTheme(),
      themeMode: _themeMode,
      home: MedicareSplashScreen(onToggleTheme: toggleTheme),
    );
  }
}
