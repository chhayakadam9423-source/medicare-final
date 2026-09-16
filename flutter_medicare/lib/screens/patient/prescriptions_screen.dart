import 'package:flutter/material.dart';
import '../../models/prescription.dart';
import '../../services/auth_service.dart';
import '../../services/supabase_service.dart';

class PrescriptionsScreen extends StatefulWidget {
  const PrescriptionsScreen({super.key});

  @override
  State<PrescriptionsScreen> createState() => _PrescriptionsScreenState();
}

class _PrescriptionsScreenState extends State<PrescriptionsScreen> {
  List<Prescription> _prescriptions = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPrescriptions();
  }

  Future<void> _loadPrescriptions() async {
    setState(() => _isLoading = true);
    final profile = AuthService.instance.currentUserProfile;
    final patientId = profile?.id ?? 'patient-default';
    final list = await SupabaseService.instance.getPrescriptions(patientId: patientId);
    if (mounted) {
      setState(() {
        _prescriptions = list;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Digital Prescriptions',
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
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF0D9488))),
            )
          : _prescriptions.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.receipt_long_rounded, size: 64, color: Colors.grey.shade300),
                      const SizedBox(height: 12),
                      const Text('No prescriptions found', style: TextStyle(color: Color(0xFF64748B), fontSize: 15)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadPrescriptions,
                  color: const Color(0xFF0D9488),
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _prescriptions.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 16),
                    itemBuilder: (context, idx) {
                      final rx = _prescriptions[idx];
                      return Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.02),
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
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      rx.doctorName,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A)),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      '${rx.doctorSpecialization} • ${rx.hospitalName}',
                                      style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF0FDF4),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    rx.date,
                                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF16A34A)),
                                  ),
                                ),
                              ],
                            ),
                            if (rx.diagnosis != null && rx.diagnosis!.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              Text(
                                'Diagnosis: ${rx.diagnosis}',
                                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
                              ),
                            ],
                            const Divider(height: 20, color: Color(0xFFF1F5F9)),
                            const Text(
                              'Prescribed Medicines:',
                              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F766E)),
                            ),
                            const SizedBox(height: 8),
                            ...rx.medicines.map((med) => Container(
                                  margin: const EdgeInsets.only(bottom: 8),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF8FAFC),
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: const Color(0xFFF1F5F9)),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            med.name,
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                                          ),
                                          Text(
                                            med.dosage,
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0D9488)),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'Frequency: ${med.frequency} • Duration: ${med.duration}',
                                        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                      ),
                                      if (med.instructions.isNotEmpty) ...[
                                        const SizedBox(height: 2),
                                        Text(
                                          'Instructions: ${med.instructions}',
                                          style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontStyle: FontStyle.italic),
                                        ),
                                      ],
                                    ],
                                  ),
                                )),
                            if (rx.generalAdvice != null && rx.generalAdvice!.isNotEmpty) ...[
                              const SizedBox(height: 10),
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFEF3C7).withOpacity(0.4),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  'Advice: ${rx.generalAdvice}',
                                  style: const TextStyle(fontSize: 12, color: Color(0xFF92400E)),
                                ),
                              ),
                            ],
                          ],
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
