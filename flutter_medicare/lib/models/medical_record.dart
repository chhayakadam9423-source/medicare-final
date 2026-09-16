class MedicalRecord {
  final String id;
  final String patientId;
  final String patientName;
  final String? doctorId;
  final String doctorName;
  final String? appointmentId;
  final String date;
  final String diagnosis;
  final String? prescription;
  final String? notes;
  final String? createdAt;

  const MedicalRecord({
    required this.id,
    required this.patientId,
    required this.patientName,
    this.doctorId,
    required this.doctorName,
    this.appointmentId,
    required this.date,
    required this.diagnosis,
    this.prescription,
    this.notes,
    this.createdAt,
  });

  factory MedicalRecord.fromJson(Map<String, dynamic> json) => MedicalRecord(
        id: json['id'] as String,
        patientId: (json['patient_id'] ?? json['patientId']) as String,
        patientName: (json['patient_name'] ?? json['patientName']) as String? ?? 'Patient',
        doctorId: (json['doctor_id'] ?? json['doctorId']) as String?,
        doctorName: (json['doctor_name'] ?? json['doctorName']) as String? ?? 'Specialist',
        appointmentId: (json['appointment_id'] ?? json['appointmentId']) as String?,
        date: (json['date'] as String? ?? DateTime.now().toIso8601String().split('T').first),
        diagnosis: json['diagnosis'] as String? ?? 'General Consultation',
        prescription: json['prescription'] as String?,
        notes: json['notes'] as String?,
        createdAt: (json['created_at'] ?? json['createdAt']) as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'patient_id': patientId,
        'patient_name': patientName,
        'doctor_id': doctorId,
        'doctor_name': doctorName,
        'appointment_id': appointmentId,
        'date': date,
        'diagnosis': diagnosis,
        'prescription': prescription,
        'notes': notes,
        'created_at': createdAt,
      };
}
