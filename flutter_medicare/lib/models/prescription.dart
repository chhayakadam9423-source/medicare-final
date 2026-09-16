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
        id: json['id'] as String,
        name: json['name'] as String,
        dosage: json['dosage'] as String,
        frequency: json['frequency'] as String,
        duration: json['duration'] as String,
        instructions: json['instructions'] as String? ?? '',
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
  final String appointmentId;
  final String patientId;
  final String patientName;
  final String doctorId;
  final String doctorName;
  final String doctorSpecialization;
  final String hospitalName;
  final String date;
  final String diagnosis;
  final String generalAdvice;
  final List<MedicineItem> medicines;

  const Prescription({
    required this.id,
    required this.appointmentId,
    required this.patientId,
    required this.patientName,
    required this.doctorId,
    required this.doctorName,
    required this.doctorSpecialization,
    required this.hospitalName,
    required this.date,
    required this.diagnosis,
    required this.generalAdvice,
    required this.medicines,
  });

  factory Prescription.fromJson(Map<String, dynamic> json) => Prescription(
        id: json['id'] as String,
        appointmentId: json['appointmentId'] as String,
        patientId: json['patientId'] as String,
        patientName: json['patientName'] as String,
        doctorId: json['doctorId'] as String,
        doctorName: json['doctorName'] as String,
        doctorSpecialization: json['doctorSpecialization'] as String,
        hospitalName: json['hospitalName'] as String,
        date: json['date'] as String,
        diagnosis: json['diagnosis'] as String,
        generalAdvice: json['generalAdvice'] as String? ?? '',
        medicines: (json['medicines'] as List)
            .map((m) => MedicineItem.fromJson(m as Map<String, dynamic>))
            .toList(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'appointmentId': appointmentId,
        'patientId': patientId,
        'patientName': patientName,
        'doctorId': doctorId,
        'doctorName': doctorName,
        'doctorSpecialization': doctorSpecialization,
        'hospitalName': hospitalName,
        'date': date,
        'diagnosis': diagnosis,
        'generalAdvice': generalAdvice,
        'medicines': medicines.map((m) => m.toJson()).toList(),
      };
}
