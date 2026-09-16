import 'package:flutter/material.dart';
import '../../models/appointment.dart';
import '../../models/medical_record.dart';
import '../../services/auth_service.dart';
import '../../services/supabase_service.dart';

class DoctorPatientDetailScreen extends StatefulWidget {
  final Appointment appointment;
  final VoidCallback onUpdated;
  const DoctorPatientDetailScreen({super.key, required this.appointment, required this.onUpdated});

  @override
  State<DoctorPatientDetailScreen> createState() => _DoctorPatientDetailScreenState();
}

class _DoctorPatientDetailScreenState extends State<DoctorPatientDetailScreen> {
  List<MedicalRecord> _records = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPatientHistory();
  }

  Future<void> _loadPatientHistory() async {
    setState(() => _isLoading = true);
    final list = await SupabaseService.instance.getMedicalRecords(patientId: widget.appointment.patientId);
    if (mounted) {
      setState(() {
        _records = list;
        _isLoading = false;
      });
    }
  }

  void _showAddClinicalRecordDialog() {
    final diagnosisController = TextEditingController();
    final prescriptionController = TextEditingController();
    final notesController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Add Clinical Medical Record', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: diagnosisController,
                decoration: const InputDecoration(
                  labelText: 'Diagnosis *',
                  hintText: 'e.g. Acute Bronchitis, Hypertension Stage 1',
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: prescriptionController,
                decoration: const InputDecoration(
                  labelText: 'Prescription Summary',
                  hintText: 'e.g. Amoxicillin 500mg TDS, Paracetamol SOS',
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: notesController,
                maxLines: 2,
                decoration: const InputDecoration(
                  labelText: 'Doctor Clinical Notes',
                  hintText: 'e.g. Patient advised 3 days bed rest and adequate hydration',
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0D9488),
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              final diag = diagnosisController.text.trim();
              if (diag.isEmpty) return;

              final doctorProfile = AuthService.instance.currentUserProfile;
              final doctorName = doctorProfile?.fullName ?? widget.appointment.doctorName;

              Navigator.of(context).pop();

              await SupabaseService.instance.createMedicalRecord({
                'patient_id': widget.appointment.patientId,
                'patient_name': widget.appointment.patientName,
                'doctor_id': widget.appointment.doctorId,
                'doctor_name': doctorName,
                'date': DateTime.now().toIso8601String().split('T').first,
                'diagnosis': diag,
                'prescription': prescriptionController.text.trim(),
                'notes': notesController.text.trim(),
                'created_at': DateTime.now().toIso8601String(),
              });

              _loadPatientHistory();
              widget.onUpdated();
            },
            child: const Text('Save Record'),
          ),
        ],
      ),
    );
  }

  void _showWritePrescriptionDialog() {
    final medicineNameController = TextEditingController();
    final dosageController = TextEditingController(text: '1 Tablet');
    final frequencyController = TextEditingController(text: 'Twice daily after food');
    final durationController = TextEditingController(text: '5 Days');
    final adviceController = TextEditingController(text: 'Avoid oily and spicy food');

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Write Digital Rx Prescription', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: medicineNameController,
                decoration: const InputDecoration(
                  labelText: 'Medicine Name *',
                  hintText: 'e.g. Tab Azithromycin 500mg',
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: dosageController,
                      decoration: const InputDecoration(labelText: 'Dosage'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: durationController,
                      decoration: const InputDecoration(labelText: 'Duration'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              TextField(
                controller: frequencyController,
                decoration: const InputDecoration(labelText: 'Frequency / Timing'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: adviceController,
                decoration: const InputDecoration(labelText: 'General Advice'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0D9488),
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              final medName = medicineNameController.text.trim();
              if (medName.isEmpty) return;

              final doctorProfile = AuthService.instance.currentUserProfile;
              final doctorName = doctorProfile?.fullName ?? widget.appointment.doctorName;

              Navigator.of(context).pop();

              await SupabaseService.instance.createPrescription({
                'patient_id': widget.appointment.patientId,
                'patient_name': widget.appointment.patientName,
                'doctor_id': widget.appointment.doctorId,
                'doctor_name': doctorName,
                'doctor_specialization': widget.appointment.doctorSpecialty,
                'hospital_name': widget.appointment.hospitalName,
                'date': DateTime.now().toIso8601String().split('T').first,
                'diagnosis': widget.appointment.reason,
                'medicines': [
                  {
                    'name': medName,
                    'dosage': dosageController.text.trim(),
                    'frequency': frequencyController.text.trim(),
                    'duration': durationController.text.trim(),
                    'instructions': 'As prescribed',
                  }
                ],
                'general_advice': adviceController.text.trim(),
                'created_at': DateTime.now().toIso8601String(),
              });

              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Prescription created and saved to patient records!'),
                    backgroundColor: Color(0xFF0D9488),
                  ),
                );
              }
            },
            child: const Text('Issue Rx'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Patient Consultation File',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1E293B)),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Patient Basic Info Card
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
                      CircleAvatar(
                        radius: 28,
                        backgroundColor: const Color(0xFF0D9488).withOpacity(0.12),
                        child: Text(
                          widget.appointment.patientName.isNotEmpty ? widget.appointment.patientName[0].toUpperCase() : 'P',
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0D9488)),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.appointment.patientName,
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Appointment ID: #${widget.appointment.id.substring(0, 8)}',
                              style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 24, color: Color(0xFFF1F5F9)),
                  _infoRow(Icons.calendar_month_rounded, 'Visit Date & Time', '${widget.appointment.date} at ${widget.appointment.time}'),
                  const SizedBox(height: 8),
                  _infoRow(Icons.help_outline_rounded, 'Chief Complaint / Reason', widget.appointment.reason),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Quick Doctor Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0D9488),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _showAddClinicalRecordDialog,
                    icon: const Icon(Icons.note_add_rounded, size: 18),
                    label: const Text('Add Record', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2563EB),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _showWritePrescriptionDialog,
                    icon: const Icon(Icons.medication_rounded, size: 18),
                    label: const Text('Write Rx', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Patient Medical History Section
            const Text(
              'Past Medical History',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 10),

            if (_isLoading)
              const Center(child: Padding(padding: EdgeInsets.all(20), child: CircularProgressIndicator()))
            else if (_records.isEmpty)
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: const Center(
                  child: Text('No previous medical records found for this patient.', style: TextStyle(color: Color(0xFF64748B), fontSize: 13)),
                ),
              )
            else
              ..._records.map((rec) => Container(
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
                            Text(rec.diagnosis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
                            Text(rec.date, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                          ],
                        ),
                        if (rec.prescription != null && rec.prescription!.isNotEmpty) ...[
                          const SizedBox(height: 6),
                          Text('Rx: ${rec.prescription}', style: const TextStyle(fontSize: 12, color: Color(0xFF0D9488), fontWeight: FontWeight.w600)),
                        ],
                        if (rec.notes != null && rec.notes!.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Text('Notes: ${rec.notes}', style: const TextStyle(fontSize: 12, color: Color(0xFF475569))),
                        ],
                      ],
                    ),
                  )),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: const Color(0xFF0D9488)),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
              const SizedBox(height: 2),
              Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF1E293B))),
            ],
          ),
        ),
      ],
    );
  }
}
