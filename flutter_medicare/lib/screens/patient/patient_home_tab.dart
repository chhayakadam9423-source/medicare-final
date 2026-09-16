import 'package:flutter/material.dart';
import '../../models/appointment.dart';
import '../../models/doctor.dart';
import '../../models/hospital.dart';
import '../../services/auth_service.dart';
import '../../services/supabase_service.dart';
import 'doctor_list_screen.dart';
import 'doctor_profile_screen.dart';
import 'book_appointment_screen.dart';
import 'my_appointments_screen.dart';
import 'medical_records_screen.dart';
import 'prescriptions_screen.dart';

class PatientHomeTab extends StatefulWidget {
  final Function(int) onNavigateTab;
  const PatientHomeTab({super.key, required this.onNavigateTab});

  @override
  State<PatientHomeTab> createState() => _PatientHomeTabState();
}

class _PatientHomeTabState extends State<PatientHomeTab> {
  List<Doctor> _topDoctors = [];
  List<Hospital> _hospitals = [];
  Appointment? _nextAppointment;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _isLoading = true);
    final user = AuthService.instance.currentUserProfile;
    final patientId = user?.id ?? 'patient-default';

    final doctors = await SupabaseService.instance.getDoctors();
    final hospitals = await SupabaseService.instance.getHospitals();
    final appointments = await SupabaseService.instance.getAppointments(patientId: patientId);

    Appointment? nextApt;
    final activeAppointments = appointments.where((a) => a.status == AppointmentStatus.confirmed || a.status == AppointmentStatus.pending).toList();
    if (activeAppointments.isNotEmpty) {
      nextApt = activeAppointments.first;
    }

    if (mounted) {
      setState(() {
        _topDoctors = doctors.take(5).toList();
        _hospitals = hospitals;
        _nextAppointment = nextApt;
        _isLoading = false;
      });
    }
  }

  void _callEmergency() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: const [
            Icon(Icons.emergency_rounded, color: Color(0xFFDC2626), size: 28),
            SizedBox(width: 8),
            Text('Emergency Helpline'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Medicare 24/7 Rapid Emergency Response:'),
            SizedBox(height: 8),
            Text(
              '📞 108 / +91 22 2640 5500',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFFDC2626)),
            ),
            SizedBox(height: 12),
            Text('Ambulance on call with Cardiac Life Support. Average arrival time: 8-12 minutes.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Calling Emergency Services: 108...')),
              );
            },
            child: const Text('Call Now'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService.instance.currentUserProfile;
    final patientName = user?.fullName ?? 'Patient';

    return RefreshIndicator(
      onRefresh: _loadDashboardData,
      color: const Color(0xFF0D9488),
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header: Greeting & Quick Profile
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome to Medicare,',
                      style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                    ),
                    Text(
                      patientName,
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () => widget.onNavigateTab(4), // Profile tab
                  child: CircleAvatar(
                    radius: 22,
                    backgroundColor: const Color(0xFF0D9488).withOpacity(0.12),
                    child: Text(
                      patientName.isNotEmpty ? patientName[0].toUpperCase() : 'P',
                      style: const TextStyle(color: Color(0xFF0D9488), fontWeight: FontWeight.bold, fontSize: 18),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Next Appointment Card (if available)
            if (_nextAppointment != null) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0D9488), Color(0xFF047857)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(18),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF0D9488).withOpacity(0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.calendar_month_rounded, color: Colors.white, size: 16),
                            SizedBox(width: 6),
                            Text(
                              'Upcoming Consultation',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            _nextAppointment!.status.name.toUpperCase(),
                            style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _nextAppointment!.doctorName,
                      style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${_nextAppointment!.doctorSpecialty} • ${_nextAppointment!.hospitalName}',
                      style: const TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.access_time_rounded, color: Colors.white, size: 14),
                            const SizedBox(width: 6),
                            Text(
                              '${_nextAppointment!.date} • ${_nextAppointment!.time}',
                              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        TextButton(
                          style: TextButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF0D9488),
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const MyAppointmentsScreen()),
                            );
                          },
                          child: const Text('View Details', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Quick Service Actions Grid
            const Text(
              'Quick Hospital Services',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 3,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 0.95,
              children: [
                _quickActionButton(
                  icon: Icons.person_search_rounded,
                  title: 'Find Doctor',
                  color: const Color(0xFF0D9488),
                  onTap: () => widget.onNavigateTab(2), // Doctors tab
                ),
                _quickActionButton(
                  icon: Icons.event_available_rounded,
                  title: 'Book Visit',
                  color: const Color(0xFF2563EB),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const DoctorListScreen()),
                    );
                  },
                ),
                _quickActionButton(
                  icon: Icons.calendar_month_rounded,
                  title: 'My Visits',
                  color: const Color(0xFF7C3AED),
                  onTap: () => widget.onNavigateTab(3), // Appointments tab
                ),
                _quickActionButton(
                  icon: Icons.description_rounded,
                  title: 'Records',
                  color: const Color(0xFFD97706),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const MedicalRecordsScreen()),
                    );
                  },
                ),
                _quickActionButton(
                  icon: Icons.medication_rounded,
                  title: 'Prescriptions',
                  color: const Color(0xFF059669),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const PrescriptionsScreen()),
                    );
                  },
                ),
                _quickActionButton(
                  icon: Icons.emergency_rounded,
                  title: 'Emergency',
                  color: const Color(0xFFDC2626),
                  onTap: _callEmergency,
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Top Specialists Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Top Specialists',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                TextButton(
                  onPressed: () => widget.onNavigateTab(2),
                  child: const Text('View All', style: TextStyle(color: Color(0xFF0D9488), fontWeight: FontWeight.bold, fontSize: 13)),
                ),
              ],
            ),
            const SizedBox(height: 8),

            if (_isLoading)
              const Center(child: Padding(padding: EdgeInsets.all(20), child: CircularProgressIndicator()))
            else
              SizedBox(
                height: 195,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _topDoctors.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 12),
                  itemBuilder: (context, idx) {
                    final doc = _topDoctors[idx];
                    return _doctorMiniCard(doc);
                  },
                ),
              ),

            const SizedBox(height: 24),

            // Hospitals & Departments
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Network Hospitals',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                TextButton(
                  onPressed: () => widget.onNavigateTab(1), // Hospitals tab
                  child: const Text('Explore', style: TextStyle(color: Color(0xFF0D9488), fontWeight: FontWeight.bold, fontSize: 13)),
                ),
              ],
            ),
            const SizedBox(height: 8),

            ..._hospitals.map((hosp) => _hospitalCard(hosp)),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _quickActionButton({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
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
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF334155)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _doctorMiniCard(Doctor doc) {
    return Container(
      width: 145,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 28,
            backgroundImage: NetworkImage(doc.avatarUrl),
            backgroundColor: const Color(0xFF0D9488).withOpacity(0.1),
          ),
          const SizedBox(height: 8),
          Text(
            doc.name,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            doc.specialization,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 11, color: Color(0xFF0D9488), fontWeight: FontWeight.w500),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const Spacer(),
          SizedBox(
            width: double.infinity,
            height: 30,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0D9488),
                foregroundColor: Colors.white,
                padding: EdgeInsets.zero,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => DoctorProfileScreen(doctor: doc)),
                );
              },
              child: const Text('Consult', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _hospitalCard(Hospital hosp) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.network(
              hosp.imageUrl,
              width: 60,
              height: 60,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                width: 60,
                height: 60,
                color: const Color(0xFF0D9488).withOpacity(0.1),
                child: const Icon(Icons.local_hospital, color: Color(0xFF0D9488)),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  hosp.name,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 2),
                Text(
                  hosp.address,
                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.star_rounded, size: 14, color: Color(0xFFD97706)),
                    const SizedBox(width: 2),
                    Text('${hosp.rating}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFB45309))),
                    const SizedBox(width: 8),
                    Text('•  ${hosp.departments.length} Depts', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
