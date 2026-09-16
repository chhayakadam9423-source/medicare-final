import 'package:flutter/material.dart';
import '../../models/medical_record.dart';
import '../../services/auth_service.dart';
import '../../services/supabase_service.dart';

class MedicalRecordsScreen extends StatefulWidget {
  const MedicalRecordsScreen({super.key});

  @override
  State<MedicalRecordsScreen> createState() => _MedicalRecordsScreenState();
}

class _MedicalRecordsScreenState extends State<MedicalRecordsScreen> {
  List<MedicalRecord> _records = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadRecords();
  }

  Future<void> _loadRecords() async {
    setState(() => _isLoading = true);
    final profile = AuthService.instance.currentUserProfile;
    final patientId = profile?.id ?? 'patient-default';
    final list = await SupabaseService.instance.getMedicalRecords(patientId: patientId);
    if (mounted) {
      setState(() {
        _records = list;
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
          'Medical Records & History',
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
          : _records.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.folder_shared_rounded, size: 64, color: Colors.grey.shade300),
                      const SizedBox(height: 12),
                      const Text('No medical records found', style: TextStyle(color: Color(0xFF64748B), fontSize: 15)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadRecords,
                  color: const Color(0xFF0D9488),
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _records.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 14),
                    itemBuilder: (context, idx) {
                      final rec = _records[idx];
                      return Container(
                        padding: const EdgeInsets.all(16),
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
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF0D9488).withOpacity(0.12),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Icon(Icons.description_rounded, color: Color(0xFF0D9488), size: 18),
                                    ),
                                    const SizedBox(width: 10),
                                    Text(
                                      rec.date,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF64748B)),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFEFF6FF),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text('Clinical Note', style: TextStyle(fontSize: 11, color: Color(0xFF1D4ED8), fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),
                            Text(
                              rec.diagnosis,
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Attending Physician: ${rec.doctorName}',
                              style: const TextStyle(fontSize: 13, color: Color(0xFF0D9488), fontWeight: FontWeight.w600),
                            ),
                            if (rec.prescription != null && rec.prescription!.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF0FDF4),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: const Color(0xFFDCFCE7)),
                                ),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Icon(Icons.medication_liquid_rounded, size: 16, color: Color(0xFF16A34A)),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        'Rx: ${rec.prescription}',
                                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF166534)),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                            if (rec.notes != null && rec.notes!.isNotEmpty) ...[
                              const SizedBox(height: 10),
                              Text(
                                'Notes: ${rec.notes}',
                                style: const TextStyle(fontSize: 12, color: Color(0xFF475569), height: 1.4),
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
