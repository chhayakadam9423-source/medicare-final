class DoctorAvailability {
  final List<String> days;
  final String workingHours;
  final List<String> timeSlots;

  const DoctorAvailability({
    required this.days,
    required this.workingHours,
    required this.timeSlots,
  });

  factory DoctorAvailability.fromJson(Map<String, dynamic> json) => DoctorAvailability(
        days: List<String>.from(json['days'] as List),
        workingHours: json['workingHours'] as String,
        timeSlots: List<String>.from(json['timeSlots'] as List),
      );

  Map<String, dynamic> toJson() => {
        'days': days,
        'workingHours': workingHours,
        'timeSlots': timeSlots,
      };
}

class Doctor {
  final String id;
  final String hospitalId;
  final String hospitalName;
  final String name;
  final String specialization;
  final String qualification;
  final int experience;
  final double rating;
  final int reviewCount;
  final int consultationFee;
  final String avatarUrl;
  final String about;
  final List<String> education;
  final bool isAvailableToday;
  final DoctorAvailability availability;

  const Doctor({
    required this.id,
    required this.hospitalId,
    required this.hospitalName,
    required this.name,
    required this.specialization,
    required this.qualification,
    required this.experience,
    required this.rating,
    required this.reviewCount,
    required this.consultationFee,
    required this.avatarUrl,
    required this.about,
    required this.education,
    this.isAvailableToday = true,
    required this.availability,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) => Doctor(
        id: json['id'] as String,
        hospitalId: json['hospitalId'] as String,
        hospitalName: json['hospitalName'] as String,
        name: json['name'] as String,
        specialization: json['specialization'] as String,
        qualification: json['qualification'] as String,
        experience: (json['experience'] as num).toInt(),
        rating: (json['rating'] as num).toDouble(),
        reviewCount: (json['reviewCount'] as num).toInt(),
        consultationFee: (json['consultationFee'] as num).toInt(),
        avatarUrl: json['avatarUrl'] as String,
        about: json['about'] as String? ?? '',
        education: List<String>.from(json['education'] as List),
        isAvailableToday: json['isAvailableToday'] as bool? ?? true,
        availability: DoctorAvailability.fromJson(json['availability'] as Map<String, dynamic>),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'hospitalId': hospitalId,
        'hospitalName': hospitalName,
        'name': name,
        'specialization': specialization,
        'qualification': qualification,
        'experience': experience,
        'rating': rating,
        'reviewCount': reviewCount,
        'consultationFee': consultationFee,
        'avatarUrl': avatarUrl,
        'about': about,
        'education': education,
        'isAvailableToday': isAvailableToday,
        'availability': availability.toJson(),
      };
}
