import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'services/local_storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await LocalStorageService.getInstance();
  } catch (e) {
    debugPrint('LocalStorageService initialization error: $e');
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
      _themeMode =
          _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
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
      home: SplashScreen(onToggleTheme: toggleTheme),
    );
  }
}

// ----------------------------------------------------
// 1. SPLASH SCREEN
// ----------------------------------------------------
class SplashScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  const SplashScreen({super.key, required this.onToggleTheme});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    );

    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _controller.forward();

    Future.delayed(const Duration(milliseconds: 2200), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (_) => OnboardingScreen(onToggleTheme: widget.onToggleTheme),
          ),
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
      backgroundColor: AppTheme.iceBackground,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppTheme.primaryBlue, AppTheme.medicalTeal],
                    ),
                    borderRadius: BorderRadius.circular(26),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.primaryBlue.withOpacity(0.35),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: const Icon(Icons.local_hospital_rounded,
                      size: 48, color: Colors.white),
                ),
                const SizedBox(height: 24),
                const Text(
                  'MEDICARE',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    color: AppTheme.primaryBlue,
                    letterSpacing: 2.0,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Healthcare made simple.',
                  style: TextStyle(
                    fontSize: 15,
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

// ----------------------------------------------------
// 2. ONBOARDING SCREEN
// ----------------------------------------------------
class OnboardingScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  const OnboardingScreen({super.key, required this.onToggleTheme});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> _slides = [
    {
      'title': 'Find Verified Hospitals',
      'desc':
          'Locate top multi-specialty healthcare centers nearby with 24/7 emergency response.',
      'icon': 'local_hospital',
    },
    {
      'title': 'Book Renowned Specialists',
      'desc':
          'Schedule instant in-clinic or video consultations with experienced doctors.',
      'icon': 'medical_services',
    },
    {
      'title': 'Digital Health Records',
      'desc':
          'Prescriptions, clinical notes, and treatment histories safely stored offline.',
      'icon': 'folder_shared',
    },
  ];

  void _finishOnboarding() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => MainAppShell(onToggleTheme: widget.onToggleTheme),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            children: [
              Align(
                alignment: Alignment.topRight,
                child: TextButton(
                  onPressed: _finishOnboarding,
                  child: const Text('Skip',
                      style: TextStyle(
                          color: AppTheme.primaryBlue,
                          fontWeight: FontWeight.bold)),
                ),
              ),
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (idx) => setState(() => _currentPage = idx),
                  itemCount: _slides.length,
                  itemBuilder: (context, index) {
                    final slide = _slides[index];
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            color: AppTheme.primaryBlue.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            index == 0
                                ? Icons.local_hospital_rounded
                                : index == 1
                                    ? Icons.person_search_rounded
                                    : Icons.assignment_turned_in_rounded,
                            size: 60,
                            color: AppTheme.primaryBlue,
                          ),
                        ),
                        const SizedBox(height: 40),
                        Text(
                          slide['title']!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF172B4D),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          slide['desc']!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 15,
                            color: Color(0xFF667085),
                            height: 1.5,
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _slides.length,
                  (i) => Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: _currentPage == i ? 24 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: _currentPage == i
                          ? AppTheme.primaryBlue
                          : Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryBlue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  onPressed: () {
                    if (_currentPage < _slides.length - 1) {
                      _pageController.nextPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    } else {
                      _finishOnboarding();
                    }
                  },
                  child: Text(
                    _currentPage == _slides.length - 1
                        ? 'Get Started'
                        : 'Continue',
                    style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ----------------------------------------------------
// 3. MAIN APP SHELL (MULTI-ROLE CONTAINER)
// ----------------------------------------------------
class MainAppShell extends StatefulWidget {
  final VoidCallback onToggleTheme;
  const MainAppShell({super.key, required this.onToggleTheme});

  @override
  State<MainAppShell> createState() => _MainAppShellState();
}

class _MainAppShellState extends State<MainAppShell> {
  String _currentRole = 'patient'; // 'patient', 'doctor', 'admin'
  int _patientNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.local_hospital_rounded,
                color: AppTheme.primaryBlue, size: 24),
            const SizedBox(width: 8),
            Text(
              _currentRole == 'patient'
                  ? 'MEDICARE'
                  : _currentRole == 'doctor'
                      ? 'DOCTOR CONSOLE'
                      : 'ADMIN MANAGEMENT',
              style: const TextStyle(
                fontWeight: FontWeight.w900,
                color: AppTheme.primaryBlue,
                letterSpacing: 1.0,
                fontSize: 18,
              ),
            ),
          ],
        ),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.swap_horiz_rounded),
            tooltip: 'Switch Role',
            onSelected: (role) => setState(() => _currentRole = role),
            itemBuilder: (context) => const [
              PopupMenuItem(value: 'patient', child: Text('👤 Patient Mode')),
              PopupMenuItem(value: 'doctor', child: Text('🩺 Doctor Console')),
              PopupMenuItem(value: 'admin', child: Text('⚙️ Admin Portal')),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.dark_mode_outlined),
            onPressed: widget.onToggleTheme,
          ),
        ],
      ),
      body: _buildCurrentRoleView(),
      bottomNavigationBar: _currentRole == 'patient'
          ? NavigationBar(
              selectedIndex: _patientNavIndex,
              onDestinationSelected: (idx) =>
                  setState(() => _patientNavIndex = idx),
              destinations: const [
                NavigationDestination(
                    icon: Icon(Icons.home_outlined),
                    selectedIcon: Icon(Icons.home_rounded),
                    label: 'Home'),
                NavigationDestination(
                    icon: Icon(Icons.business_outlined),
                    selectedIcon: Icon(Icons.business_rounded),
                    label: 'Hospitals'),
                NavigationDestination(
                    icon: Icon(Icons.person_search_outlined),
                    selectedIcon: Icon(Icons.person_search_rounded),
                    label: 'Doctors'),
                NavigationDestination(
                    icon: Icon(Icons.calendar_today_outlined),
                    selectedIcon: Icon(Icons.calendar_month_rounded),
                    label: 'Visits'),
                NavigationDestination(
                    icon: Icon(Icons.folder_outlined),
                    selectedIcon: Icon(Icons.folder_rounded),
                    label: 'Records'),
              ],
            )
          : null,
    );
  }

  Widget _buildCurrentRoleView() {
    if (_currentRole == 'doctor') {
      return const DoctorConsoleView();
    }
    if (_currentRole == 'admin') {
      return const AdminPortalView();
    }
    // Patient views
    switch (_patientNavIndex) {
      case 0:
        return const PatientDashboardTab();
      case 1:
        return const HospitalsListTab();
      case 2:
        return const DoctorsListTab();
      case 3:
        return const PatientAppointmentsTab();
      case 4:
        return const PatientRecordsTab();
      default:
        return const PatientDashboardTab();
    }
  }
}

// ----------------------------------------------------
// 4. PATIENT HOME TAB
// ----------------------------------------------------
class PatientDashboardTab extends StatelessWidget {
  const PatientDashboardTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Sponsored Ad Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF1E3A8A), Color(0xFF0D9488)],
            ),
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.12),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.amber.shade400,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text('SPONSORED',
                        style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.black)),
                  ),
                  const Text('Flat 25% OFF',
                      style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 12)),
                ],
              ),
              const SizedBox(height: 12),
              const Text(
                'Apex Superspeciality Hospital',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 4),
              const Text(
                'Comprehensive Cardiac Care & 24/7 ICU Helpline',
                style: TextStyle(color: Colors.white70, fontSize: 13),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: AppTheme.primaryBlue,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {},
                child: const Text('Book Consultation'),
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),
        const Text(
          'Quick Services',
          style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: Color(0xFF172B4D)),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _quickServiceItem(Icons.business_rounded, 'Hospitals',
                AppTheme.primaryBlue, () {}),
            _quickServiceItem(Icons.person_search_rounded, 'Specialists',
                AppTheme.medicalTeal, () {}),
            _quickServiceItem(Icons.calendar_today_rounded, 'Visits',
                Colors.orange, () {}),
            _quickServiceItem(Icons.folder_shared_rounded, 'Records',
                Colors.purple, () {}),
          ],
        ),

        const SizedBox(height: 28),
        const Text(
          'Top Verified Hospitals',
          style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: Color(0xFF172B4D)),
        ),
        const SizedBox(height: 12),
        Card(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: const ListTile(
            leading: CircleAvatar(
              backgroundColor: AppTheme.primaryBlue,
              child: Icon(Icons.local_hospital, color: Colors.white),
            ),
            title: Text('Metro General Hospital',
                style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('4.8 ★ (1,240 reviews) • 1.2 km • Open 24/7'),
            trailing: Icon(Icons.chevron_right),
          ),
        ),
        Card(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: const ListTile(
            leading: CircleAvatar(
              backgroundColor: AppTheme.medicalTeal,
              child: Icon(Icons.local_hospital, color: Colors.white),
            ),
            title: Text('City Care Multi-Specialty',
                style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('4.7 ★ (850 reviews) • 2.4 km • 24/7 Emergency'),
            trailing: Icon(Icons.chevron_right),
          ),
        ),
      ],
    );
  }

  Widget _quickServiceItem(
      IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(18),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 8),
          Text(label,
              style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF172B4D))),
        ],
      ),
    );
  }
}

// ----------------------------------------------------
// 5. HOSPITALS LIST TAB
// ----------------------------------------------------
class HospitalsListTab extends StatelessWidget {
  const HospitalsListTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        Text(
          'Healthcare Centers',
          style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Color(0xFF172B4D)),
        ),
        SizedBox(height: 12),
        Card(
          child: ListTile(
            leading: Icon(Icons.local_hospital, color: AppTheme.primaryBlue),
            title: Text('Apex Superspeciality Hospital'),
            subtitle: Text('Bandra West • Multi-Speciality • 4.9 ★'),
          ),
        ),
        Card(
          child: ListTile(
            leading: Icon(Icons.local_hospital, color: AppTheme.medicalTeal),
            title: Text('Metro General Hospital'),
            subtitle: Text('Andheri East • General Care • 4.8 ★'),
          ),
        ),
        Card(
          child: ListTile(
            leading: Icon(Icons.local_hospital, color: AppTheme.mintAccent),
            title: Text('Lifecare Children Hospital'),
            subtitle: Text('Juhu • Pediatrics & NICU • 4.9 ★'),
          ),
        ),
      ],
    );
  }
}

// ----------------------------------------------------
// 6. DOCTORS LIST TAB
// ----------------------------------------------------
class DoctorsListTab extends StatelessWidget {
  const DoctorsListTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        Text(
          'Medical Specialists',
          style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Color(0xFF172B4D)),
        ),
        SizedBox(height: 12),
        Card(
          child: ListTile(
            leading: CircleAvatar(child: Text('RV')),
            title: Text('Dr. Rajesh Verma'),
            subtitle: Text('Chief Cardiologist • 16 yrs exp • ₹800 Fee'),
            trailing: Icon(Icons.calendar_month, color: AppTheme.primaryBlue),
          ),
        ),
        Card(
          child: ListTile(
            leading: CircleAvatar(child: Text('AS')),
            title: Text('Dr. Ananya Sharma'),
            subtitle: Text('Pediatrician & Neonatologist • 12 yrs exp'),
            trailing: Icon(Icons.calendar_month, color: AppTheme.primaryBlue),
          ),
        ),
      ],
    );
  }
}

// ----------------------------------------------------
// 7. PATIENT APPOINTMENTS TAB
// ----------------------------------------------------
class PatientAppointmentsTab extends StatelessWidget {
  const PatientAppointmentsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        Text(
          'My Consultations',
          style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Color(0xFF172B4D)),
        ),
        SizedBox(height: 12),
        Card(
          child: ListTile(
            leading: Icon(Icons.check_circle, color: Colors.green),
            title: Text('Dr. Rajesh Verma — Cardiology'),
            subtitle: Text('Tomorrow at 10:00 AM • Apex Superspeciality'),
            trailing: Text('CONFIRMED',
                style: TextStyle(
                    color: Colors.green,
                    fontWeight: FontWeight.bold,
                    fontSize: 11)),
          ),
        ),
      ],
    );
  }
}

// ----------------------------------------------------
// 8. PATIENT RECORDS TAB
// ----------------------------------------------------
class PatientRecordsTab extends StatelessWidget {
  const PatientRecordsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        Text(
          'Medical Prescriptions',
          style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Color(0xFF172B4D)),
        ),
        SizedBox(height: 12),
        Card(
          child: ListTile(
            leading: Icon(Icons.receipt_long, color: AppTheme.primaryBlue),
            title: Text('Acute Bronchitis & Cough'),
            subtitle: Text('Dr. Rajesh Verma • 2 Medicines Prescribed'),
            trailing: Icon(Icons.download),
          ),
        ),
      ],
    );
  }
}

// ----------------------------------------------------
// 9. DOCTOR CONSOLE VIEW
// ----------------------------------------------------
class DoctorConsoleView extends StatelessWidget {
  const DoctorConsoleView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Doctor Patient Queue',
          style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Color(0xFF172B4D)),
        ),
        const SizedBox(height: 12),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Patient: Rahul Sharma (32, M)',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    Chip(
                      label: const Text('Upcoming', style: TextStyle(fontSize: 11)),
                      backgroundColor: const Color(0xFFE0F2FE),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text('Complaint: Persistent dry cough and slight fever'),
                const SizedBox(height: 12),
                Row(
                  children: [
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.medicalTeal),
                      onPressed: () {},
                      icon: const Icon(Icons.medical_services_outlined,
                          size: 16, color: Colors.white),
                      label: const Text('Create Rx',
                          style: TextStyle(color: Colors.white)),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton(
                      onPressed: () {},
                      child: const Text('Complete'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ----------------------------------------------------
// 10. ADMIN PORTAL VIEW
// ----------------------------------------------------
class AdminPortalView extends StatelessWidget {
  const AdminPortalView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Hospital Administration Hub',
          style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Color(0xFF172B4D)),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: Card(
                color: AppTheme.primaryBlue,
                child: const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      Text('12',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.bold)),
                      Text('Hospitals', style: TextStyle(color: Colors.white70)),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Card(
                color: AppTheme.medicalTeal,
                child: const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      Text('48',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.bold)),
                      Text('Doctors', style: TextStyle(color: Colors.white70)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        ListTile(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          tileColor: Colors.white,
          leading: const Icon(Icons.campaign_rounded, color: Colors.orange),
          title: const Text('Manage Advertisements'),
          subtitle: const Text('3 Active sponsored carousels'),
          trailing: const Icon(Icons.arrow_forward_ios, size: 16),
          onTap: () {},
        ),
      ],
    );
  }
}
