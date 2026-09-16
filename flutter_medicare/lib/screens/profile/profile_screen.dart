import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import '../welcome/welcome_screen.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  const ProfileScreen({super.key, required this.onToggleTheme});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  bool _isEditing = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    final profile = AuthService.instance.currentUserProfile;
    _nameController.text = profile?.fullName ?? '';
    _phoneController.text = profile?.phone ?? '';
    _addressController.text = profile?.address ?? '';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _saveProfile() async {
    setState(() => _isLoading = true);
    try {
      await AuthService.instance.updateProfile(
        fullName: _nameController.text.trim(),
        phone: _phoneController.text.trim(),
        address: _addressController.text.trim(),
      );
      setState(() => _isEditing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully!'),
            backgroundColor: Color(0xFF0D9488),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error updating profile: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _handleLogout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Sign Out'),
        content: const Text('Are you sure you want to sign out from your Medicare account?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
            ),
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Sign Out'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await AuthService.instance.signOut();
      if (!mounted) return;
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => WelcomeScreen(onToggleTheme: widget.onToggleTheme)),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = AuthService.instance.currentUserProfile;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Account Profile',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        actions: [
          IconButton(
            icon: Icon(_isEditing ? Icons.close_rounded : Icons.edit_rounded, color: const Color(0xFF0D9488)),
            onPressed: () => setState(() => _isEditing = !_isEditing),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            // User Avatar & Role Badge
            Center(
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 46,
                    backgroundColor: const Color(0xFF0D9488).withOpacity(0.15),
                    child: Text(
                      profile?.fullName.isNotEmpty == true ? profile!.fullName[0].toUpperCase() : 'U',
                      style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Color(0xFF0D9488)),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    profile?.fullName ?? 'Medicare Patient',
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    profile?.email ?? '',
                    style: const TextStyle(fontSize: 14, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFDCFCE7),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFBBF7D0)),
                    ),
                    child: Text(
                      (profile?.role ?? 'patient').toUpperCase(),
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF15803D)),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // Profile Info Cards or Edit Form
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: _isEditing ? _buildEditForm() : _buildInfoView(profile),
            ),

            const SizedBox(height: 20),

            // Preferences Card
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.dark_mode_outlined, color: Color(0xFF0D9488)),
                    title: const Text('App Theme', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    trailing: const Icon(Icons.swap_horiz_rounded),
                    onTap: widget.onToggleTheme,
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.security_rounded, color: Color(0xFF0D9488)),
                    title: const Text('Password & Security', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    trailing: const Icon(Icons.chevron_right_rounded),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Password reset link can be sent from Forgot Password.')),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // Logout Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFEE2E2),
                  foregroundColor: const Color(0xFFDC2626),
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _handleLogout,
                icon: const Icon(Icons.logout_rounded, size: 20),
                label: const Text('Sign Out from Medicare', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoView(dynamic profile) {
    return Column(
      children: [
        _profileRow(Icons.person_outline_rounded, 'Full Name', profile?.fullName ?? '—'),
        const Divider(height: 20),
        _profileRow(Icons.email_outlined, 'Email Address', profile?.email ?? '—'),
        const Divider(height: 20),
        _profileRow(Icons.phone_outlined, 'Phone Number', profile?.phone ?? '+91 98765 43210'),
        const Divider(height: 20),
        _profileRow(Icons.location_on_outlined, 'Residential Address', profile?.address ?? 'Bandra West, Mumbai'),
      ],
    );
  }

  Widget _profileRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 20, color: const Color(0xFF64748B)),
        const SizedBox(width: 14),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
            const SizedBox(height: 2),
            Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF1E293B))),
          ],
        ),
      ],
    );
  }

  Widget _buildEditForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Edit Profile Information', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        const SizedBox(height: 14),
        TextFormField(
          controller: _nameController,
          decoration: const InputDecoration(labelText: 'Full Name'),
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: _phoneController,
          decoration: const InputDecoration(labelText: 'Phone Number'),
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: _addressController,
          decoration: const InputDecoration(labelText: 'Residential Address'),
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          height: 46,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0D9488),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: _isLoading ? null : _saveProfile,
            child: _isLoading
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Save Changes', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ),
      ],
    );
  }
}
