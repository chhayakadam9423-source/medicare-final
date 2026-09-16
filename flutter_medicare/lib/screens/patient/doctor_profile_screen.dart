import 'package:flutter/material.dart';
import '../../models/doctor.dart';
import 'book_appointment_screen.dart';

class DoctorProfileScreen extends StatelessWidget {
  final Doctor doctor;
  const DoctorProfileScreen({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            backgroundColor: const Color(0xFF0D9488),
            leading: IconButton(
              icon: const CircleAvatar(
                backgroundColor: Colors.white,
                child: Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1E293B), size: 16),
              ),
              onPressed: () => Navigator.of(context).pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    doctor.avatarUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      color: const Color(0xFF0D9488),
                      child: const Icon(Icons.person, size: 80, color: Colors.white70),
                    ),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.1),
                          Colors.black.withOpacity(0.7),
                        ],
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 20,
                    left: 20,
                    right: 20,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          doctor.name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${doctor.specialization} • ${doctor.qualification}',
                          style: const TextStyle(color: Colors.white70, fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stat Cards (Experience, Rating, Fee)
                  Row(
                    children: [
                      _statCard('${doctor.experience} Yrs', 'Experience', Icons.work_history_rounded),
                      const SizedBox(width: 12),
                      _statCard('${doctor.rating} ★', '${doctor.reviewCount} Reviews', Icons.star_rounded),
                      const SizedBox(width: 12),
                      _statCard('₹${doctor.consultationFee}', 'Consult Fee', Icons.payments_rounded),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Hospital Info
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0D9488).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.local_hospital_rounded, color: Color(0xFF0D9488), size: 24),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                doctor.hospitalName,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
                              ),
                              const SizedBox(height: 4),
                              const Text('Premier NABH Accredited Facility', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // About Section
                  const Text('About Specialist', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                  const SizedBox(height: 10),
                  Text(
                    doctor.about.isNotEmpty ? doctor.about : 'Senior consultant specialist dedicated to evidence-based healthcare and patient wellness.',
                    style: const TextStyle(fontSize: 14, color: Color(0xFF475569), height: 1.6),
                  ),

                  const SizedBox(height: 24),

                  // Availability Days & Times
                  const Text('Consultation Schedule', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.schedule_rounded, color: Color(0xFF0D9488), size: 20),
                            const SizedBox(width: 8),
                            Text('Hours: ${doctor.availability.workingHours}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF1E293B))),
                          ],
                        ),
                        const SizedBox(height: 12),
                        const Text('Available Days:', style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: doctor.availability.days.map((day) {
                            return Chip(
                              label: Text(day, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                              backgroundColor: const Color(0xFFF0FDF4),
                              side: const BorderSide(color: Color(0xFFBBF7D0)),
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 12),
                        const Text('Daily Slots:', style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: doctor.availability.timeSlots.map((slot) {
                            return Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF1F5F9),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(slot, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF334155))),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 10,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Consultation Fee', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                  Text('₹${doctor.consultationFee}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0F766E))),
                ],
              ),
              const SizedBox(width: 20),
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0D9488),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => BookAppointmentScreen(doctor: doctor),
                        ),
                      );
                    },
                    child: const Text('Book Appointment', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statCard(String value, String label, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          children: [
            Icon(icon, color: const Color(0xFF0D9488), size: 22),
            const SizedBox(height: 6),
            Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
          ],
        ),
      ),
    );
  }
}
