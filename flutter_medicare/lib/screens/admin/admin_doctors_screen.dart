import 'package:flutter/material.dart';
import '../../models/doctor.dart';
import '../../models/hospital.dart';
import '../../services/supabase_service.dart';

class AdminDoctorsScreen extends StatefulWidget {
  const AdminDoctorsScreen({super.key});

  @override
  State<AdminDoctorsScreen> createState() => _AdminDoctorsScreenState();
}

class _AdminDoctorsScreenState extends State<AdminDoctorsScreen> {
  List<Doctor> _doctors = [];
  List<Hospital> _hospitals = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final docs = await SupabaseService.instance.getDoctors();
    final hosps = await SupabaseService.instance.getHospitals();
    if (mounted) {
      setState(() {
        _doctors = docs;
        _hospitals = hosps;
        _isLoading = false;
      });
    }
  }

  void _showAddDoctorDialog() {
    final nameController = TextEditingController();
    final specController = TextEditingController();
    final qualController = TextEditingController(text: 'MBBS, MD');
    final expController = TextEditingController(text: '8');
    final feeController = TextEditingController(text: '800');
    final phoneController = TextEditingController(text: '+91 98201 00000');
    String selectedHospitalId = _hospitals.isNotEmpty ? _hospitals.first.id : 'hosp-001';
    String selectedHospitalName = _hospitals.isNotEmpty ? _hospitals.first.name : 'Apex Multispeciality Hospital';

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Text('Add Specialist Doctor', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'Doctor Full Name *', hintText: 'Dr. Neha Gupta'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: specController,
                  decoration: const InputDecoration(labelText: 'Specialization *', hintText: 'Cardiologist, Neurologist...'),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: selectedHospitalId,
                  decoration: const InputDecoration(labelText: 'Affiliated Hospital'),
                  items: _hospitals.map((h) => DropdownMenuItem(value: h.id, child: Text(h.name, overflow: TextOverflow.ellipsis))).toList(),
                  onChanged: (val) {
                    if (val != null) {
                      setDialogState(() {
                        selectedHospitalId = val;
                        selectedHospitalName = _hospitals.firstWhere((h) => h.id == val).name;
                      });
                    }
                  },
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: expController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(labelText: 'Experience (Yrs)'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: feeController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(labelText: 'Fee (₹)'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: qualController,
                  decoration: const InputDecoration(labelText: 'Qualifications'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: phoneController,
                  decoration: const InputDecoration(labelText: 'Contact Phone'),
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
                final name = nameController.text.trim();
                final spec = specController.text.trim();
                if (name.isEmpty || spec.isEmpty) return;

                Navigator.of(context).pop();

                await SupabaseService.instance.addDoctor({
                  'name': name.startsWith('Dr.') ? name : 'Dr. $name',
                  'specialization': spec,
                  'hospital_id': selectedHospitalId,
                  'hospital_name': selectedHospitalName,
                  'qualification': qualController.text.trim(),
                  'experience': int.tryParse(expController.text.trim()) ?? 5,
                  'consultation_fee': int.tryParse(feeController.text.trim()) ?? 750,
                  'phone': phoneController.text.trim(),
                  'about': 'Experienced specialist at $selectedHospitalName.',
                  'avatar_url': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&fit=crop&q=80',
                  'rating': 4.9,
                  'review_count': 12,
                  'is_active': true,
                  'available_days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  'available_time_slots': ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
                  'working_hours': '09:00 AM - 05:00 PM',
                });

                _loadData();
              },
              child: const Text('Add Doctor'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _toggleDoctorStatus(Doctor doc) async {
    final newStatus = !doc.isActive;
    await SupabaseService.instance.updateDoctorStatus(doc.id, newStatus);
    _loadData();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${doc.name} status updated to ${newStatus ? "Active" : "Deactivated"}'),
          backgroundColor: const Color(0xFF0D9488),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Manage Doctors & Staff',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1E293B)),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFF0D9488),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.person_add_rounded),
        label: const Text('Add Doctor', style: TextStyle(fontWeight: FontWeight.bold)),
        onPressed: _showAddDoctorDialog,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              color: const Color(0xFF0D9488),
              child: ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: _doctors.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, idx) {
                  final doc = _doctors[idx];
                  return Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 26,
                          backgroundImage: NetworkImage(doc.avatarUrl),
                          backgroundColor: const Color(0xFF0D9488).withOpacity(0.1),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                doc.name,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${doc.specialization} • ${doc.hospitalName}',
                                style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: doc.isActive ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E2),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      doc.isActive ? 'ACTIVE' : 'DEACTIVATED',
                                      style: TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        color: doc.isActive ? const Color(0xFF15803D) : const Color(0xFFB91C1C),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text('Fee: ₹${doc.consultationFee}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0D9488))),
                                ],
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: Icon(
                            doc.isActive ? Icons.block_rounded : Icons.check_circle_outline_rounded,
                            color: doc.isActive ? const Color(0xFFDC2626) : const Color(0xFF16A34A),
                          ),
                          tooltip: doc.isActive ? 'Deactivate Doctor' : 'Activate Doctor',
                          onPressed: () => _toggleDoctorStatus(doc),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
    );
  }
}
