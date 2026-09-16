import 'package:flutter/material.dart';
import '../../models/doctor.dart';
import '../../services/supabase_service.dart';
import 'doctor_profile_screen.dart';
import 'book_appointment_screen.dart';

class DoctorListScreen extends StatefulWidget {
  final String? initialSpecialty;
  const DoctorListScreen({super.key, this.initialSpecialty});

  @override
  State<DoctorListScreen> createState() => _DoctorListScreenState();
}

class _DoctorListScreenState extends State<DoctorListScreen> {
  final _searchController = TextEditingController();
  String _selectedSpecialty = 'All';
  List<Doctor> _doctors = [];
  bool _isLoading = true;

  final List<String> _specialties = [
    'All',
    'Cardiologist',
    'Pediatrician',
    'Orthopedic Surgeon',
    'Neurologist',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialSpecialty != null && _specialties.contains(widget.initialSpecialty)) {
      _selectedSpecialty = widget.initialSpecialty!;
    }
    _loadDoctors();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadDoctors() async {
    setState(() => _isLoading = true);
    final list = await SupabaseService.instance.getDoctors(
      specialization: _selectedSpecialty == 'All' ? null : _selectedSpecialty,
      search: _searchController.text.trim(),
    );
    if (mounted) {
      setState(() {
        _doctors = list;
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
          'Find Specialists',
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
      body: Column(
        children: [
          // Search & Filter Box
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  onChanged: (_) => _loadDoctors(),
                  decoration: InputDecoration(
                    hintText: 'Search doctor name or symptom...',
                    prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF0D9488)),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              _loadDoctors();
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: const Color(0xFFF1F5F9),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
                const SizedBox(height: 12),
                // Specialties horizontal list
                SizedBox(
                  height: 38,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _specialties.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (context, idx) {
                      final spec = _specialties[idx];
                      final isSelected = _selectedSpecialty == spec;
                      return ChoiceChip(
                        label: Text(spec),
                        selected: isSelected,
                        onSelected: (selected) {
                          if (selected) {
                            setState(() => _selectedSpecialty = spec);
                            _loadDoctors();
                          }
                        },
                        selectedColor: const Color(0xFF0D9488),
                        backgroundColor: const Color(0xFFF8FAFC),
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : const Color(0xFF475569),
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          fontSize: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(
                            color: isSelected ? const Color(0xFF0D9488) : const Color(0xFFE2E8F0),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // Doctor List
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF0D9488))),
                  )
                : _doctors.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.person_search_rounded, size: 64, color: Colors.grey.shade400),
                            const SizedBox(height: 12),
                            const Text('No doctors match your criteria', style: TextStyle(color: Color(0xFF64748B), fontSize: 15)),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadDoctors,
                        color: const Color(0xFF0D9488),
                        child: ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: _doctors.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (context, idx) {
                            final doc = _doctors[idx];
                            return _buildDoctorCard(doc);
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildDoctorCard(Doctor doc) {
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
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 32,
                  backgroundImage: NetworkImage(doc.avatarUrl),
                  backgroundColor: const Color(0xFF0D9488).withOpacity(0.1),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              doc.name,
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFEF3C7),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.star_rounded, size: 14, color: Color(0xFFD97706)),
                                const SizedBox(width: 2),
                                Text(
                                  '${doc.rating}',
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFB45309)),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      Text(
                        doc.specialization,
                        style: const TextStyle(color: Color(0xFF0D9488), fontWeight: FontWeight.w600, fontSize: 13),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${doc.experience} yrs exp • ${doc.hospitalName}',
                        style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Fee: ₹${doc.consultationFee}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F766E)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const Divider(height: 20, color: Color(0xFFF1F5F9)),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      side: const BorderSide(color: Color(0xFFCBD5E1)),
                    ),
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => DoctorProfileScreen(doctor: doc)),
                      );
                    },
                    child: const Text('View Profile', style: TextStyle(color: Color(0xFF334155), fontSize: 13)),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0D9488),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => BookAppointmentScreen(doctor: doc)),
                      );
                    },
                    child: const Text('Book Visit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
