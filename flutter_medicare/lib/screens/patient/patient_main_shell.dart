import 'package:flutter/material.dart';
import 'patient_home_tab.dart';
import 'hospitals_tab.dart';
import 'doctor_list_screen.dart';
import 'my_appointments_screen.dart';
import '../profile/profile_screen.dart';

class PatientMainShell extends StatefulWidget {
  final VoidCallback onToggleTheme;
  final int initialTab;
  const PatientMainShell({super.key, required this.onToggleTheme, this.initialTab = 0});

  @override
  State<PatientMainShell> createState() => _PatientMainShellState();
}

class _PatientMainShellState extends State<PatientMainShell> {
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialTab;
  }

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      PatientHomeTab(onNavigateTab: _onTabTapped),
      const HospitalsTab(),
      const DoctorListScreen(),
      const MyAppointmentsScreen(),
      ProfileScreen(onToggleTheme: widget.onToggleTheme),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: pages,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Colors.grey.shade200)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onTabTapped,
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          selectedItemColor: const Color(0xFF0D9488),
          unselectedItemColor: const Color(0xFF94A3B8),
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
          elevation: 0,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home_rounded),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.apartment_outlined),
              activeIcon: Icon(Icons.apartment_rounded),
              label: 'Hospitals',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.medical_services_outlined),
              activeIcon: Icon(Icons.medical_services_rounded),
              label: 'Doctors',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.calendar_month_outlined),
              activeIcon: Icon(Icons.calendar_month_rounded),
              label: 'Visits',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline_rounded),
              activeIcon: Icon(Icons.person_rounded),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
