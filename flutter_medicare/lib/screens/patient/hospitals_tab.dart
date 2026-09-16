import 'package:flutter/material.dart';
import '../../models/hospital.dart';
import '../../services/supabase_service.dart';
import 'doctor_list_screen.dart';

class HospitalsTab extends StatefulWidget {
  const HospitalsTab({super.key});

  @override
  State<HospitalsTab> createState() => _HospitalsTabState();
}

class _HospitalsTabState extends State<HospitalsTab> {
  List<Hospital> _hospitals = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadHospitals();
  }

  Future<void> _loadHospitals() async {
    setState(() => _isLoading = true);
    final list = await SupabaseService.instance.getHospitals();
    if (mounted) {
      setState(() {
        _hospitals = list;
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
          'Network Hospitals',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF0D9488))),
            )
          : RefreshIndicator(
              onRefresh: _loadHospitals,
              color: const Color(0xFF0D9488),
              child: ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: _hospitals.length,
                separatorBuilder: (_, __) => const SizedBox(height: 16),
                itemBuilder: (context, idx) {
                  final hosp = _hospitals[idx];
                  return Container(
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
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                          child: Image.network(
                            hosp.imageUrl,
                            height: 150,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              height: 150,
                              color: const Color(0xFF0D9488).withOpacity(0.1),
                              child: const Icon(Icons.local_hospital_rounded, size: 60, color: Color(0xFF0D9488)),
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      hosp.name,
                                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFEF3C7),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.star_rounded, size: 14, color: Color(0xFFD97706)),
                                        const SizedBox(width: 2),
                                        Text('${hosp.rating}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFB45309))),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  const Icon(Icons.location_on_outlined, size: 16, color: Color(0xFF64748B)),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(hosp.address, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  const Icon(Icons.phone_in_talk_outlined, size: 16, color: Color(0xFF0D9488)),
                                  const SizedBox(width: 4),
                                  Text(hosp.phone, style: const TextStyle(fontSize: 12, color: Color(0xFF0D9488), fontWeight: FontWeight.w600)),
                                ],
                              ),
                              const SizedBox(height: 12),
                              const Text('Key Departments:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF334155))),
                              const SizedBox(height: 6),
                              Wrap(
                                spacing: 6,
                                runSpacing: 6,
                                children: hosp.departments.map((dep) {
                                  return Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF1F5F9),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(dep, style: const TextStyle(fontSize: 11, color: Color(0xFF475569))),
                                  );
                                }).toList(),
                              ),
                              const SizedBox(height: 14),
                              SizedBox(
                                width: double.infinity,
                                height: 40,
                                child: ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF0D9488),
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  ),
                                  onPressed: () {
                                    Navigator.of(context).push(
                                      MaterialPageRoute(builder: (_) => const DoctorListScreen()),
                                    );
                                  },
                                  child: const Text('Find Doctors at this Hospital', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                                ),
                              ),
                            ],
                          ),
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
