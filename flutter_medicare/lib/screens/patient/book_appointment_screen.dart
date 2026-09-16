import 'package:flutter/material.dart';
import '../../models/doctor.dart';
import '../../models/appointment.dart';
import '../../services/auth_service.dart';
import '../../services/supabase_service.dart';

class BookAppointmentScreen extends StatefulWidget {
  final Doctor doctor;
  const BookAppointmentScreen({super.key, required this.doctor});

  @override
  State<BookAppointmentScreen> createState() => _BookAppointmentScreenState();
}

class _BookAppointmentScreenState extends State<BookAppointmentScreen> {
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  String? _selectedTimeSlot;
  final _reasonController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    if (widget.doctor.availability.timeSlots.isNotEmpty) {
      _selectedTimeSlot = widget.doctor.availability.timeSlots.first;
    }
  }

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }

  Future<void> _pickAppointmentDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: now,
      lastDate: now.add(const Duration(days: 90)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF0D9488),
              onPrimary: Colors.white,
              onSurface: Color(0xFF1E293B),
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _selectedDate = picked;
        _errorMessage = null;
      });
    }
  }

  Future<void> _confirmBooking() async {
    final reason = _reasonController.text.trim();
    if (_selectedTimeSlot == null) {
      setState(() => _errorMessage = 'Please select a consultation time slot.');
      return;
    }
    if (reason.isEmpty) {
      setState(() => _errorMessage = 'Please describe the reason for your visit or symptoms.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final formattedDate = _selectedDate.toIso8601String().split('T').first;

    try {
      // 1. Check slot availability to prevent duplicates
      final isAvailable = await SupabaseService.instance.checkSlotAvailability(
        doctorId: widget.doctor.id,
        appointmentDate: formattedDate,
        appointmentTime: _selectedTimeSlot!,
      );

      if (!isAvailable) {
        throw 'This time slot ($_selectedTimeSlot on $formattedDate) has already been booked. Please choose another slot.';
      }

      final profile = AuthService.instance.currentUserProfile;
      final patientId = profile?.id ?? 'patient-default';
      final patientName = profile?.fullName ?? 'Registered Patient';

      // 2. Insert into Supabase table appointments
      final newAppointment = await SupabaseService.instance.createAppointment({
        'patient_id': patientId,
        'patient_name': patientName,
        'doctor_id': widget.doctor.id,
        'doctor_name': widget.doctor.name,
        'doctor_specialty': widget.doctor.specialization,
        'doctor_avatar': widget.doctor.avatarUrl,
        'hospital_id': widget.doctor.hospitalId,
        'hospital_name': widget.doctor.hospitalName,
        'appointment_date': formattedDate,
        'appointment_time': _selectedTimeSlot!,
        'reason': reason,
        'status': 'pending',
        'amount': widget.doctor.consultationFee,
        'created_at': DateTime.now().toIso8601String(),
      });

      if (!mounted) return;

      // 3. Show booking confirmation modal
      showModalBottomSheet(
        context: context,
        isDismissible: false,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (context) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 48,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFCBD5E1),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              Container(
                width: 68,
                height: 68,
                decoration: const BoxDecoration(
                  color: Color(0xFFDCFCE7),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle_rounded, color: Color(0xFF16A34A), size: 42),
              ),
              const SizedBox(height: 16),
              const Text(
                'Appointment Requested!',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 6),
              const Text(
                'Your appointment request has been submitted to the specialist for confirmation.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    _summaryRow('Doctor', widget.doctor.name),
                    const Divider(height: 16),
                    _summaryRow('Specialization', widget.doctor.specialization),
                    const Divider(height: 16),
                    _summaryRow('Date & Time', '$formattedDate • $_selectedTimeSlot'),
                    const Divider(height: 16),
                    _summaryRow('Hospital', widget.doctor.hospitalName),
                    const Divider(height: 16),
                    _summaryRow('Consultation Fee', '₹${widget.doctor.consultationFee}'),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0D9488),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () {
                    Navigator.of(context).pop(); // close sheet
                    Navigator.of(context).pop(newAppointment); // back to caller
                  },
                  child: const Text('View in My Appointments', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      );
    } catch (e) {
      if (mounted) {
        setState(() => _errorMessage = e.toString());
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Widget _summaryRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final formattedDate = _selectedDate.toIso8601String().split('T').first;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Book Consultation',
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
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Doctor Summary Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 32,
                    backgroundImage: NetworkImage(widget.doctor.avatarUrl),
                    backgroundColor: const Color(0xFF0D9488).withOpacity(0.1),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.doctor.name,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          widget.doctor.specialization,
                          style: const TextStyle(fontSize: 13, color: Color(0xFF0D9488), fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          widget.doctor.hospitalName,
                          style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDF4),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFBBF7D0)),
                    ),
                    child: Text(
                      '₹${widget.doctor.consultationFee}',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF15803D)),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Error Banner
            if (_errorMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 20),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFFECACA)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, color: Color(0xFFDC2626), size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(_errorMessage!, style: const TextStyle(color: Color(0xFFB91C1C), fontSize: 13)),
                    ),
                  ],
                ),
              ),

            // 1. Select Date
            const Text(
              '1. Select Consultation Date',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF1E293B)),
            ),
            const SizedBox(height: 10),
            InkWell(
              onTap: _pickAppointmentDate,
              borderRadius: BorderRadius.circular(14),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFF0D9488), width: 1.5),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.calendar_month_rounded, color: Color(0xFF0D9488)),
                        const SizedBox(width: 12),
                        Text(
                          formattedDate,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                        ),
                      ],
                    ),
                    const Text('Change Date', style: TextStyle(color: Color(0xFF0D9488), fontWeight: FontWeight.w600, fontSize: 13)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // 2. Select Time Slot
            const Text(
              '2. Select Available Time Slot',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF1E293B)),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: widget.doctor.availability.timeSlots.map((slot) {
                final isSelected = _selectedTimeSlot == slot;
                return ChoiceChip(
                  label: Text(slot),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) setState(() => _selectedTimeSlot = slot);
                  },
                  selectedColor: const Color(0xFF0D9488),
                  backgroundColor: Colors.white,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : const Color(0xFF334155),
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                    side: BorderSide(
                      color: isSelected ? const Color(0xFF0D9488) : const Color(0xFFCBD5E1),
                    ),
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 24),

            // 3. Reason for Visit
            const Text(
              '3. Reason / Symptoms',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF1E293B)),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _reasonController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'e.g., Follow-up consultation, chest tightness, routine blood pressure check...',
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF0D9488), width: 1.5),
                ),
              ),
            ),

            const SizedBox(height: 32),

            // Confirm Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0D9488),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: _isLoading ? null : _confirmBooking,
                child: _isLoading
                    ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(color: Colors.white))
                    : const Text('Confirm & Book Appointment', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
