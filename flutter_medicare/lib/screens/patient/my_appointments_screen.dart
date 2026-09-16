import 'package:flutter/material.dart';
import '../../models/appointment.dart';
import '../../services/auth_service.dart';
import '../../services/supabase_service.dart';

class MyAppointmentsScreen extends StatefulWidget {
  const MyAppointmentsScreen({super.key});

  @override
  State<MyAppointmentsScreen> createState() => _MyAppointmentsScreenState();
}

class _MyAppointmentsScreenState extends State<MyAppointmentsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<Appointment> _appointments = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadAppointments();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadAppointments() async {
    setState(() => _isLoading = true);
    final profile = AuthService.instance.currentUserProfile;
    final patientId = profile?.id;
    final list = await SupabaseService.instance.getAppointments(patientId: patientId);
    if (mounted) {
      setState(() {
        _appointments = list;
        _isLoading = false;
      });
    }
  }

  Future<void> _cancelAppointment(Appointment apt) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Cancel Appointment?'),
        content: Text('Are you sure you wish to cancel your consultation with ${apt.doctorName} on ${apt.date} at ${apt.time}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Keep Appointment', style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
            ),
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Cancel Appointment'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await SupabaseService.instance.updateAppointmentStatus(apt.id, AppointmentStatus.cancelled);
      _loadAppointments();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Appointment has been cancelled successfully.'),
            backgroundColor: Color(0xFF0F766E),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // 1. Upcoming & Confirmed
    final upcoming = _appointments
        .where((a) => a.status == AppointmentStatus.confirmed || a.status == AppointmentStatus.pending)
        .toList();
    // 2. Completed
    final completed = _appointments.where((a) => a.status == AppointmentStatus.completed).toList();
    // 3. Cancelled
    final cancelled = _appointments.where((a) => a.status == AppointmentStatus.cancelled).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'My Appointments',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: Navigator.of(context).canPop()
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1E293B)),
                onPressed: () => Navigator.of(context).pop(),
              )
            : null,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFF0D9488),
          labelColor: const Color(0xFF0D9488),
          unselectedLabelColor: const Color(0xFF64748B),
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: [
            Tab(text: 'Upcoming (${upcoming.length})'),
            Tab(text: 'Completed (${completed.length})'),
            Tab(text: 'Cancelled (${cancelled.length})'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF0D9488))),
            )
          : RefreshIndicator(
              onRefresh: _loadAppointments,
              color: const Color(0xFF0D9488),
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildAppointmentList(upcoming, allowCancel: true),
                  _buildAppointmentList(completed, allowCancel: false),
                  _buildAppointmentList(cancelled, allowCancel: false),
                ],
              ),
            ),
    );
  }

  Widget _buildAppointmentList(List<Appointment> list, {required bool allowCancel}) {
    if (list.isEmpty) {
      return ListView(
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.2),
          Center(
            child: Column(
              children: [
                Icon(Icons.event_note_rounded, size: 64, color: Colors.grey.shade300),
                const SizedBox(height: 14),
                const Text('No appointments in this category', style: TextStyle(color: Color(0xFF64748B), fontSize: 15)),
              ],
            ),
          ),
        ],
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: list.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, idx) {
        final apt = list[idx];
        return _buildAppointmentCard(apt, allowCancel: allowCancel);
      },
    );
  }

  Widget _buildAppointmentCard(Appointment apt, {required bool allowCancel}) {
    Color statusColor;
    Color statusBg;
    String statusLabel;

    switch (apt.status) {
      case AppointmentStatus.confirmed:
        statusColor = const Color(0xFF15803D);
        statusBg = const Color(0xFFDCFCE7);
        statusLabel = 'CONFIRMED';
        break;
      case AppointmentStatus.pending:
        statusColor = const Color(0xFFB45309);
        statusBg = const Color(0xFFFEF3C7);
        statusLabel = 'PENDING APPROVAL';
        break;
      case AppointmentStatus.completed:
        statusColor = const Color(0xFF1D4ED8);
        statusBg = const Color(0xFFDBEAFE);
        statusLabel = 'COMPLETED';
        break;
      case AppointmentStatus.cancelled:
        statusColor = const Color(0xFFB91C1C);
        statusBg = const Color(0xFFFEE2E2);
        statusLabel = 'CANCELLED';
        break;
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
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
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusBg,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  statusLabel,
                  style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
              Text(
                '₹${apt.amount}',
                style: const TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0F172A), fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundImage: apt.doctorAvatar.isNotEmpty ? NetworkImage(apt.doctorAvatar) : null,
                backgroundColor: const Color(0xFF0D9488).withOpacity(0.12),
                child: apt.doctorAvatar.isEmpty
                    ? const Icon(Icons.person, color: Color(0xFF0D9488))
                    : null,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      apt.doctorName,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${apt.doctorSpecialty} • ${apt.hospitalName}',
                      style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.access_time_filled_rounded, size: 16, color: Color(0xFF0D9488)),
                    const SizedBox(width: 8),
                    Text(
                      '${apt.date} at ${apt.time}',
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Reason: ${apt.reason}',
                  style: const TextStyle(fontSize: 12, color: Color(0xFF475569)),
                ),
              ],
            ),
          ),
          if (allowCancel && apt.status != AppointmentStatus.cancelled) ...[
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFFDC2626),
                  side: const BorderSide(color: Color(0xFFFCA5A5)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                ),
                onPressed: () => _cancelAppointment(apt),
                child: const Text('Cancel Visit', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
