class MedicineItem {
  final String id;
  final String name;
  final String dosage;
  final String frequency;
  final String duration;
  final String instructions;

  const MedicineItem({
    required this.id,
    required this.name,
    required this.dosage,
    required this.frequency,
    required this.duration,
    required this.instructions,
  });

  factory MedicineItem.fromJson(Map<String, dynamic> json) => MedicineItem(
        id: (json['id'] as String?) ?? 'med-${DateTime.now().millisecondsSinceEpoch}',
        name: (json['name'] as String?) ?? '',
        dosage: (json['dosage'] as String?) ?? '',
        frequency: (json['frequency'] as String?) ?? '',
        duration: (json['duration'] as String?) ?? '',
        instructions: (json['instructions'] as String?) ?? '',
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'dosage': dosage,
        'frequency': frequency,
        'duration': duration,
        'instructions': instructions,
      };
}

class Prescription {
  final String id;
  final String? appointmentId;
  final String patientId;
  final String patientName;
  final String doctorId;
  final String doctorName;
  final String doctorSpecialization;
  final String hospitalName;
  final String date;
  final String? diagnosis;
  final String? generalAdvice;
  final List<MedicineItem> medicines;

  const Prescription({
    required this.id,
    this.appointmentId,
    required this.patientId,
    required this.patientName,
    required this.doctorId,
    required this.doctorName,
    required this.doctorSpecialization,
    required this.hospitalName,
    required this.date,
    this.diagnosis,
    this.generalAdvice,
    required this.medicines,
  });

  factory Prescription.fromJson(Map<String, dynamic> json) {
    var rawMeds = json['medicines'];
    List<MedicineItem> medList = [];
    if (rawMeds is List) {
      medList = rawMeds
          .whereType<Map<String, dynamic>>()
          .map((m) => MedicineItem.fromJson(m))
          .toList();
    }

    return Prescription(
      id: (json['id'] as String?) ?? '',
      appointmentId: (json['appointment_id'] ?? json['appointmentId']) as String?,
      patientId: (json['patient_id'] ?? json['patientId'] ?? '') as String,
      patientName: (json['patient_name'] ?? json['patientName'] ?? 'Patient') as String,
      doctorId: (json['doctor_id'] ?? json['doctorId'] ?? '') as String,
      doctorName: (json['doctor_name'] ?? json['doctorName'] ?? 'Doctor') as String,
      doctorSpecialization: (json['doctor_specialization'] ?? json['doctorSpecialty'] ?? json['specialization'] ?? 'General Medicine') as String,
      hospitalName: (json['hospital_name'] ?? json['hospitalName'] ?? 'Medicare Hospital') as String,
      date: (json['date'] as String?) ?? DateTime.now().toIso8601String().split('T').first,
      diagnosis: (json['diagnosis'] as String?),
      generalAdvice: (json['general_advice'] ?? json['generalAdvice']) as String?,
      medicines: medList,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'appointment_id': appointmentId,
        'patient_id': patientId,
        'patient_name': patientName,
        'doctor_id': doctorId,
        'doctor_name': doctorName,
        'doctor_specialization': doctorSpecialization,
        'hospital_name': hospitalName,
        'date': date,
        'diagnosis': diagnosis,
        'general_advice': generalAdvice,
        'medicines': medicines.map((m) => m.toJson()).toList(),
      };
}
