enum AppointmentStatus { pending, confirmed, completed, cancelled }

class Appointment {
  final String id;
  final String patientId;
  final String patientName;
  final String doctorId;
  final String doctorName;
  final String doctorSpecialty;
  final String doctorAvatar;
  final String hospitalId;
  final String hospitalName;
  final String hospitalAddress;
  final String date;
  final String time;
  final String reason;
  final AppointmentStatus status;
  final int amount;
  final String createdAt;

  const Appointment({
    required this.id,
    required this.patientId,
    required this.patientName,
    required this.doctorId,
    required this.doctorName,
    required this.doctorSpecialty,
    required this.doctorAvatar,
    required this.hospitalId,
    required this.hospitalName,
    required this.hospitalAddress,
    required this.date,
    required this.time,
    required this.reason,
    required this.status,
    required this.amount,
    required this.createdAt,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    final rawStatus = (json['status'] as String? ?? 'pending').toLowerCase();
    AppointmentStatus parsedStatus;
    switch (rawStatus) {
      case 'confirmed':
        parsedStatus = AppointmentStatus.confirmed;
        break;
      case 'completed':
        parsedStatus = AppointmentStatus.completed;
        break;
      case 'cancelled':
      case 'rejected':
        parsedStatus = AppointmentStatus.cancelled;
        break;
      case 'pending':
      case 'upcoming':
      default:
        parsedStatus = AppointmentStatus.pending;
        break;
    }

    return Appointment(
      id: json['id'] as String? ?? '',
      patientId: (json['patient_id'] ?? json['patientId']) as String? ?? '',
      patientName: (json['patient_name'] ?? json['patientName']) as String? ?? 'Patient',
      doctorId: (json['doctor_id'] ?? json['doctorId']) as String? ?? '',
      doctorName: (json['doctor_name'] ?? json['doctorName']) as String? ?? 'Doctor',
      doctorSpecialty: (json['doctor_specialty'] ?? json['doctorSpecialty']) as String? ?? 'General Medicine',
      doctorAvatar: (json['doctor_avatar'] ?? json['doctorAvatar']) as String? ?? '',
      hospitalId: (json['hospital_id'] ?? json['hospitalId']) as String? ?? '',
      hospitalName: (json['hospital_name'] ?? json['hospitalName']) as String? ?? 'Medicare Hospital',
      hospitalAddress: (json['hospital_address'] ?? json['hospitalAddress']) as String? ?? 'Healthcare Complex',
      date: (json['appointment_date'] ?? json['date']) as String? ?? DateTime.now().toIso8601String().split('T').first,
      time: (json['appointment_time'] ?? json['time']) as String? ?? '10:00 AM',
      reason: json['reason'] as String? ?? 'General Consultation',
      status: parsedStatus,
      amount: (json['amount'] as num?)?.toInt() ?? 500,
      createdAt: (json['created_at'] ?? json['createdAt']) as String? ?? DateTime.now().toIso8601String(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'patient_id': patientId,
        'patient_name': patientName,
        'doctor_id': doctorId,
        'doctor_name': doctorName,
        'doctor_specialty': doctorSpecialty,
        'doctor_avatar': doctorAvatar,
        'hospital_id': hospitalId,
        'hospital_name': hospitalName,
        'hospital_address': hospitalAddress,
        'appointment_date': date,
        'appointment_time': time,
        'reason': reason,
        'status': status.name,
        'amount': amount,
        'created_at': createdAt,
      };

  Appointment copyWith({
    String? id,
    String? patientId,
    String? patientName,
    String? doctorId,
    String? doctorName,
    String? doctorSpecialty,
    String? doctorAvatar,
    String? hospitalId,
    String? hospitalName,
    String? hospitalAddress,
    String? date,
    String? time,
    String? reason,
    AppointmentStatus? status,
    int? amount,
    String? createdAt,
  }) {
    return Appointment(
      id: id ?? this.id,
      patientId: patientId ?? this.patientId,
      patientName: patientName ?? this.patientName,
      doctorId: doctorId ?? this.doctorId,
      doctorName: doctorName ?? this.doctorName,
      doctorSpecialty: doctorSpecialty ?? this.doctorSpecialty,
      doctorAvatar: doctorAvatar ?? this.doctorAvatar,
      hospitalId: hospitalId ?? this.hospitalId,
      hospitalName: hospitalName ?? this.hospitalName,
      hospitalAddress: hospitalAddress ?? this.hospitalAddress,
      date: date ?? this.date,
      time: time ?? this.time,
      reason: reason ?? this.reason,
      status: status ?? this.status,
      amount: amount ?? this.amount,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
