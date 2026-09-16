import 'package:flutter/material.dart';
import '../../models/appointment.dart';
import '../../models/doctor.dart';
import '../../models/user_profile.dart';
import '../../services/auth_service.dart';
import '../../services/supabase_service.dart';
import 'admin_doctors_screen.dart';
import 'admin_patients_screen.dart';
import '../welcome/welcome_screen.dart';

class AdminDashboardScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  const AdminDashboardScreen({super.key, required this.onToggleTheme});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  List<Doctor> _doctors = [];
  List<UserProfile> _patients = [];
  List<Appointment> _appointments = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _isLoading = true);
    final docs = await SupabaseService.instance.getDoctors();
    final patients = await SupabaseService.instance.getPatients();
    final apts = await SupabaseService.instance.getAppointments();

    if (mounted) {
      setState(() {
        _doctors = docs;
        _patients = patients;
        _appointments = apts;
        _isLoading = false;
      });
    }
  }

  Future<void> _updateAppointmentStatus(String aptId, AppointmentStatus newStatus) async {
    await SupabaseService.instance.updateAppointmentStatus(aptId, newStatus);
    _loadDashboardData();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Appointment status updated successfully.'),
          backgroundColor: Color(0xFF0D9488),
        ),
      );
    }
  }

  Future<void> _handleSignOut() async {
    await AuthService.instance.signOut();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => WelcomeScreen(onToggleTheme: widget.onToggleTheme)),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final pendingCount = _appointments.where((a) => a.status == AppointmentStatus.pending).length;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Hospital Administration',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: Color(0xFFDC2626)),
            tooltip: 'Sign Out',
            onPressed: _handleSignOut,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF0D9488))))
          : RefreshIndicator(
              onRefresh: _loadDashboardData,
              color: const Color(0xFF0D9488),
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(18.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Admin Banner
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0D9488).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Icon(Icons.admin_panel_settings_rounded, color: Color(0xFF2DD4BF), size: 30),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text(
                                  'System Overview',
                                  style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                                ),
                                SizedBox(height: 2),
                                Text(
                                  'Medicare Central Hospital Control Panel',
                                  style: TextStyle(color: Colors.white70, fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Metrics Grid (Patients, Doctors, Appointments, Pending)
                    Row(
                      children: [
                        _metricCard('${_patients.length}', 'Registered\nPatients', Icons.people_alt_rounded, const Color(0xFF0284C7)),
                        const SizedBox(width: 10),
                        _metricCard('${_doctors.length}', 'Specialist\nDoctors', Icons.medical_services_rounded, const Color(0xFF0D9488)),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        _metricCard('${_appointments.length}', 'Total\nAppointments', Icons.calendar_month_rounded, const Color(0xFF7C3AED)),
                        const SizedBox(width: 10),
                        _metricCard('$pendingCount', 'Pending\nRequests', Icons.pending_actions_rounded, const Color(0xFFD97706)),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Management Navigation Cards
                    const Text('Operations Management', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                    const SizedBox(height: 12),

                    _navCard(
                      icon: Icons.person_search_rounded,
                      title: 'Manage Doctors Directory',
                      subtitle: 'Add new specialists, edit consultation fee, toggle active status',
                      color: const Color(0xFF0D9488),
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const AdminDoctorsScreen()),
                        ).then((_) => _loadDashboardData());
                      },
                    ),
                    const SizedBox(height: 10),

                    _navCard(
                      icon: Icons.group_rounded,
                      title: 'Manage Patients Directory',
                      subtitle: 'Search registered patients, review profile details and contacts',
                      color: const Color(0xFF0284C7),
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const AdminPatientsScreen()),
                        );
                      },
                    ),

                    const SizedBox(height: 24),

                    // Manage Appointments Section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Manage Appointments', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                        Text('${_appointments.length} Total', style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                      ],
                    ),
                    const SizedBox(height: 10),

                    if (_appointments.isEmpty)
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: const Center(child: Text('No appointments in the system.')),
                      )
                    else
                      ..._appointments.take(10).map((apt) => _buildAppointmentAdminCard(apt)),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _metricCard(String count, String label, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(count, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: color)),
                  const SizedBox(height: 2),
                  Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600, height: 1.2)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _navCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8)),
          ],
        ),
      ),
    );
  }

  Widget _buildAppointmentAdminCard(Appointment apt) {
    Color statusColor;
    switch (apt.status) {
      case AppointmentStatus.confirmed:
        statusColor = const Color(0xFF15803D);
        break;
      case AppointmentStatus.pending:
        statusColor = const Color(0xFFB45309);
        break;
      case AppointmentStatus.completed:
        statusColor = const Color(0xFF1D4ED8);
        break;
      case AppointmentStatus.cancelled:
        statusColor = const Color(0xFFB91C1C);
        break;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${apt.patientName} ➔ ${apt.doctorName}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
              ),
              Text(
                apt.status.name.toUpperCase(),
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: statusColor),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            '${apt.date} at ${apt.time} • ${apt.hospitalName}',
            style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              if (apt.status != AppointmentStatus.confirmed)
                TextButton(
                  onPressed: () => _updateAppointmentStatus(apt.id, AppointmentStatus.confirmed),
                  child: const Text('Confirm', style: TextStyle(color: Color(0xFF15803D), fontSize: 12)),
                ),
              if (apt.status != AppointmentStatus.completed)
                TextButton(
                  onPressed: () => _updateAppointmentStatus(apt.id, AppointmentStatus.completed),
                  child: const Text('Complete', style: TextStyle(color: Color(0xFF2563EB), fontSize: 12)),
                ),
              if (apt.status != AppointmentStatus.cancelled)
                TextButton(
                  onPressed: () => _updateAppointmentStatus(apt.id, AppointmentStatus.cancelled),
                  child: const Text('Cancel', style: TextStyle(color: Color(0xFFDC2626), fontSize: 12)),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
