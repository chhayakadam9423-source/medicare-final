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
        days: json['days'] != null
            ? List<String>.from(json['days'] as List)
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        workingHours: (json['working_hours'] ?? json['workingHours']) as String? ?? '09:00 AM - 05:00 PM',
        timeSlots: json['time_slots'] != null
            ? List<String>.from(json['time_slots'] as List)
            : (json['timeSlots'] != null
                ? List<String>.from(json['timeSlots'] as List)
                : ['09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM']),
      );

  Map<String, dynamic> toJson() => {
        'days': days,
        'working_hours': workingHours,
        'time_slots': timeSlots,
      };
}

class Doctor {
  final String id;
  final String? userId;
  final String hospitalId;
  final String hospitalName;
  final String name;
  final String? email;
  final String? phone;
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
  final bool isActive;
  final DoctorAvailability availability;

  const Doctor({
    required this.id,
    this.userId,
    required this.hospitalId,
    required this.hospitalName,
    required this.name,
    this.email,
    this.phone,
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
    this.isActive = true,
    required this.availability,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    DoctorAvailability avail;
    if (json['availability'] is Map<String, dynamic>) {
      avail = DoctorAvailability.fromJson(json['availability'] as Map<String, dynamic>);
    } else {
      avail = DoctorAvailability(
        days: json['available_days'] != null
            ? List<String>.from(json['available_days'] as List)
            : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: json['working_hours'] as String? ?? '09:00 AM - 05:00 PM',
        timeSlots: json['time_slots'] != null
            ? List<String>.from(json['time_slots'] as List)
            : ['09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'],
      );
    }

    return Doctor(
      id: json['id'] as String? ?? '',
      userId: (json['user_id'] ?? json['userId']) as String?,
      hospitalId: (json['hospital_id'] ?? json['hospitalId']) as String? ?? '',
      hospitalName: (json['hospital_name'] ?? json['hospitalName']) as String? ?? 'Apex Superspeciality Hospital',
      name: json['name'] as String? ?? 'Dr. Specialist',
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      specialization: json['specialization'] as String? ?? 'Specialist',
      qualification: json['qualification'] as String? ?? 'MBBS, MD',
      experience: (json['experience'] as num?)?.toInt() ?? 5,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
      reviewCount: (json['review_count'] ?? json['reviewCount'] as num?)?.toInt() ?? 100,
      consultationFee: (json['consultation_fee'] ?? json['consultationFee'] as num?)?.toInt() ?? 500,
      avatarUrl: (json['avatar_url'] ?? json['avatarUrl']) as String? ??
          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&fit=crop&q=80',
      about: json['about'] as String? ?? '',
      education: json['education'] != null
          ? List<String>.from(json['education'] as List)
          : [(json['qualification'] as String? ?? 'MBBS, MD')],
      isAvailableToday: (json['is_available_today'] ?? json['isAvailableToday']) as bool? ?? true,
      isActive: (json['is_active'] ?? json['isActive']) as bool? ?? true,
      availability: avail,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'user_id': userId,
        'hospital_id': hospitalId,
        'hospital_name': hospitalName,
        'name': name,
        'email': email,
        'phone': phone,
        'specialization': specialization,
        'qualification': qualification,
        'experience': experience,
        'rating': rating,
        'review_count': reviewCount,
        'consultation_fee': consultationFee,
        'avatar_url': avatarUrl,
        'about': about,
        'education': education,
        'is_available_today': isAvailableToday,
        'is_active': isActive,
        'availability': availability.toJson(),
      };
}
