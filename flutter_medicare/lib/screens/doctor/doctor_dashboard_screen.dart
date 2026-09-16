import 'package:flutter/material.dart';
import '../../models/appointment.dart';
import '../../services/auth_service.dart';
import '../../services/supabase_service.dart';
import 'doctor_patient_detail_screen.dart';
import '../welcome/welcome_screen.dart';

class DoctorDashboardScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  const DoctorDashboardScreen({super.key, required this.onToggleTheme});

  @override
  State<DoctorDashboardScreen> createState() => _DoctorDashboardScreenState();
}

class _DoctorDashboardScreenState extends State<DoctorDashboardScreen> {
  List<Appointment> _appointments = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAppointments();
  }

  Future<void> _loadAppointments() async {
    setState(() => _isLoading = true);
    final user = AuthService.instance.currentUserProfile;
    final doctorId = user?.id;
    // For doctor role, retrieve appointments for this doctor (or all in test mode)
    final list = await SupabaseService.instance.getAppointments(doctorId: doctorId);
    if (mounted) {
      setState(() {
        _appointments = list;
        _isLoading = false;
      });
    }
  }

  Future<void> _updateStatus(String aptId, AppointmentStatus newStatus) async {
    await SupabaseService.instance.updateAppointmentStatus(aptId, newStatus);
    _loadAppointments();
    if (mounted) {
      String statusName = newStatus == AppointmentStatus.confirmed
          ? 'Confirmed'
          : newStatus == AppointmentStatus.completed
              ? 'Completed'
              : 'Rejected';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Appointment marked as $statusName'),
          backgroundColor: const Color(0xFF0D9488),
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
    final user = AuthService.instance.currentUserProfile;
    final doctorName = user?.fullName ?? 'Dr. Rajesh Verma';

    final pending = _appointments.where((a) => a.status == AppointmentStatus.pending).toList();
    final confirmed = _appointments.where((a) => a.status == AppointmentStatus.confirmed).toList();
    final completed = _appointments.where((a) => a.status == AppointmentStatus.completed).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Doctor Clinical Console',
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
          ? const Center(
              child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF0D9488))),
            )
          : RefreshIndicator(
              onRefresh: _loadAppointments,
              color: const Color(0xFF0D9488),
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(18.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Doctor Profile Banner
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF0F766E), Color(0xFF0D9488)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(18),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF0D9488).withOpacity(0.25),
                            blurRadius: 14,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 30,
                            backgroundColor: Colors.white,
                            child: Text(
                              doctorName.isNotEmpty ? doctorName.split(' ').last[0] : 'D',
                              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF0D9488)),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  doctorName,
                                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'Senior Consultant • Apex Multispeciality Hospital',
                                  style: TextStyle(color: Colors.white70, fontSize: 12),
                                ),
                                const SizedBox(height: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text(
                                    'DOCTOR PORTAL ACTIVE',
                                    style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Quick Stats Row
                    Row(
                      children: [
                        _statCard('${_appointments.length}', 'Total Visits', const Color(0xFF0D9488)),
                        const SizedBox(width: 10),
                        _statCard('${pending.length}', 'Pending', const Color(0xFFD97706)),
                        const SizedBox(width: 10),
                        _statCard('${confirmed.length}', 'Confirmed', const Color(0xFF2563EB)),
                        const SizedBox(width: 10),
                        _statCard('${completed.length}', 'Completed', const Color(0xFF16A34A)),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Section 1: Pending Appointment Requests
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Pending Requests (Action Required)',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            '${pending.length}',
                            style: const TextStyle(color: Color(0xFFB45309), fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    if (pending.isEmpty)
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: const Center(
                          child: Text('No pending appointment requests.', style: TextStyle(color: Color(0xFF64748B), fontSize: 13)),
                        ),
                      )
                    else
                      ...pending.map((apt) => _buildPendingCard(apt)),

                    const SizedBox(height: 24),

                    // Section 2: Confirmed Schedule (Today's / Upcoming)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Confirmed Schedule',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                        Text('${confirmed.length} Patients', style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                      ],
                    ),
                    const SizedBox(height: 10),

                    if (confirmed.isEmpty)
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: const Center(
                          child: Text('No confirmed appointments scheduled.', style: TextStyle(color: Color(0xFF64748B), fontSize: 13)),
                        ),
                      )
                    else
                      ...confirmed.map((apt) => _buildConfirmedCard(apt)),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _statCard(String count, String label, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 6),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          children: [
            Text(count, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: color)),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 10, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  Widget _buildPendingCard(Appointment apt) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFFDE68A)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                apt.patientName,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
              ),
              Text(
                '${apt.date} • ${apt.time}',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF0D9488)),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Chief Complaint: ${apt.reason}',
            style: const TextStyle(fontSize: 13, color: Color(0xFF475569)),
          ),
          const Divider(height: 18, color: Color(0xFFF1F5F9)),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFFDC2626),
                    side: const BorderSide(color: Color(0xFFFCA5A5)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: () => _updateStatus(apt.id, AppointmentStatus.cancelled),
                  child: const Text('Reject', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0D9488),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: () => _updateStatus(apt.id, AppointmentStatus.confirmed),
                  child: const Text('Accept Visit', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildConfirmedCard(Appointment apt) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                apt.patientName,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text('CONFIRMED', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF15803D))),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            '${apt.date} at ${apt.time} • Reason: ${apt.reason}',
            style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
          ),
          const Divider(height: 18, color: Color(0xFFF1F5F9)),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF0D9488),
                    side: const BorderSide(color: Color(0xFF0D9488)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => DoctorPatientDetailScreen(
                          appointment: apt,
                          onUpdated: _loadAppointments,
                        ),
                      ),
                    );
                  },
                  icon: const Icon(Icons.medical_information_rounded, size: 16),
                  label: const Text('Patient File', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF16A34A),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: () => _updateStatus(apt.id, AppointmentStatus.completed),
                  icon: const Icon(Icons.check_circle_outline_rounded, size: 16),
                  label: const Text('Complete', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
