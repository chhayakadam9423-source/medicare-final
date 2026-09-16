enum AppointmentStatus { upcoming, completed, cancelled }

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

  factory Appointment.fromJson(Map<String, dynamic> json) => Appointment(
        id: json['id'] as String,
        patientId: json['patientId'] as String,
        patientName: json['patientName'] as String,
        doctorId: json['doctorId'] as String,
        doctorName: json['doctorName'] as String,
        doctorSpecialty: json['doctorSpecialty'] as String,
        doctorAvatar: json['doctorAvatar'] as String,
        hospitalId: json['hospitalId'] as String,
        hospitalName: json['hospitalName'] as String,
        hospitalAddress: json['hospitalAddress'] as String,
        date: json['date'] as String,
        time: json['time'] as String,
        reason: json['reason'] as String,
        status: AppointmentStatus.values.firstWhere(
          (e) => e.name == json['status'],
          orElse: () => AppointmentStatus.upcoming,
        ),
        amount: (json['amount'] as num).toInt(),
        createdAt: json['createdAt'] as String,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'patientId': patientId,
        'patientName': patientName,
        'doctorId': doctorId,
        'doctorName': doctorName,
        'doctorSpecialty': doctorSpecialty,
        'doctorAvatar': doctorAvatar,
        'hospitalId': hospitalId,
        'hospitalName': hospitalName,
        'hospitalAddress': hospitalAddress,
        'date': date,
        'time': time,
        'reason': reason,
        'status': status.name,
        'amount': amount,
        'createdAt': createdAt,
      };
}
