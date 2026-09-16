import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../services/auth_service.dart';
import '../welcome/welcome_screen.dart';
import '../patient/patient_main_shell.dart';
import '../doctor/doctor_dashboard_screen.dart';
import '../admin/admin_dashboard_screen.dart';

class MedicareSplashScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  const MedicareSplashScreen({super.key, required this.onToggleTheme});

  @override
  State<MedicareSplashScreen> createState() => _MedicareSplashScreenState();
}

class _MedicareSplashScreenState extends State<MedicareSplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    );

    _scaleAnimation = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _controller.forward();

    // Authenticated check after splash
    Future.delayed(const Duration(milliseconds: 2000), () {
      if (!mounted) return;
      _routeNext();
    });
  }

  void _routeNext() {
    final auth = AuthService.instance;
    if (auth.isAuthenticated) {
      final role = auth.userRole;
      Widget target;
      if (role == 'doctor') {
        target = DoctorDashboardScreen(onToggleTheme: widget.onToggleTheme);
      } else if (role == 'admin') {
        target = AdminDashboardScreen(onToggleTheme: widget.onToggleTheme);
      } else {
        target = PatientMainShell(onToggleTheme: widget.onToggleTheme);
      }
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => target),
      );
    } else {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => WelcomeScreen(onToggleTheme: widget.onToggleTheme),
        ),
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0FDF4), // Refreshing clean medical background
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Medical Cross Logo Container
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF0D9488), Color(0xFF059669)], // Medical Teal/Green
                    ),
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF0D9488).withOpacity(0.35),
                        blurRadius: 24,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.local_hospital_rounded,
                      size: 52,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'MEDICARE',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F766E),
                    letterSpacing: 3.0,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Hospital Management System',
                  style: TextStyle(
                    fontSize: 16,
                    color: Color(0xFF4B5563),
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 48),
                const SizedBox(
                  width: 32,
                  height: 32,
                  child: CircularProgressIndicator(
                    strokeWidth: 3,
                    valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF0D9488)),
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
