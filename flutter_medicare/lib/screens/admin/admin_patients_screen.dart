import 'package:flutter/material.dart';
import '../../models/user_profile.dart';
import '../../services/supabase_service.dart';

class AdminPatientsScreen extends StatefulWidget {
  const AdminPatientsScreen({super.key});

  @override
  State<AdminPatientsScreen> createState() => _AdminPatientsScreenState();
}

class _AdminPatientsScreenState extends State<AdminPatientsScreen> {
  List<UserProfile> _patients = [];
  bool _isLoading = true;
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadPatients();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadPatients() async {
    setState(() => _isLoading = true);
    final list = await SupabaseService.instance.getPatients(search: _searchController.text.trim());
    if (mounted) {
      setState(() {
        _patients = list;
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
          'Registered Patients Directory',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1E293B)),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Column(
        children: [
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: TextField(
              controller: _searchController,
              onChanged: (_) => _loadPatients(),
              decoration: InputDecoration(
                hintText: 'Search patient by name or phone...',
                prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF0D9488)),
                filled: true,
                fillColor: const Color(0xFFF1F5F9),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _loadPatients,
                    color: const Color(0xFF0D9488),
                    child: _patients.isEmpty
                        ? const Center(child: Text('No registered patients found.'))
                        : ListView.separated(
                            padding: const EdgeInsets.all(16),
                            itemCount: _patients.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 12),
                            itemBuilder: (context, idx) {
                              final p = _patients[idx];
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
                                      radius: 24,
                                      backgroundColor: const Color(0xFF0D9488).withOpacity(0.12),
                                      child: Text(
                                        p.fullName.isNotEmpty ? p.fullName[0].toUpperCase() : 'P',
                                        style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0D9488)),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            p.fullName,
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            '${p.email} • ${p.phone ?? "No phone"}',
                                            style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                          ),
                                          if (p.address != null && p.address!.isNotEmpty) ...[
                                            const SizedBox(height: 2),
                                            Text(
                                              p.address!,
                                              style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ],
                                        ],
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFF0FDF4),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        p.gender ?? 'Patient',
                                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),
          ),
        ],
      ),
    );
  }
}
