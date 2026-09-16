class Hospital {
  final String id;
  final String name;
  final String tagline;
  final String image;
  final double rating;
  final int reviewCount;
  final String location;
  final String address;
  final String distance;
  final String type;
  final String openHours;
  final bool isOpen;
  final bool emergencyAvailable;
  final String emergencyContact;
  final String about;
  final List<String> departments;
  final List<String> services;
  final List<String> facilities;
  final bool featured;

  const Hospital({
    required this.id,
    required this.name,
    required this.tagline,
    required this.image,
    required this.rating,
    required this.reviewCount,
    required this.location,
    required this.address,
    required this.distance,
    required this.type,
    required this.openHours,
    required this.isOpen,
    required this.emergencyAvailable,
    required this.emergencyContact,
    required this.about,
    required this.departments,
    required this.services,
    required this.facilities,
    this.featured = false,
  });

  String get imageUrl => image;
  String get phone => emergencyContact.isNotEmpty ? emergencyContact : '+91 22 2640 5500';

  factory Hospital.fromJson(Map<String, dynamic> json) => Hospital(
        id: (json['id'] as String?) ?? '',
        name: (json['name'] as String?) ?? '',
        tagline: (json['tagline'] as String?) ?? '',
        image: (json['image_url'] ?? json['image'] ?? '') as String,
        rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
        reviewCount: (json['review_count'] ?? json['reviewCount'] as num?)?.toInt() ?? 100,
        location: (json['location'] as String?) ?? '',
        address: (json['address'] as String?) ?? '',
        distance: (json['distance'] as String?) ?? '1.2 km',
        type: (json['type'] as String?) ?? 'Multispeciality Hospital',
        openHours: (json['open_hours'] ?? json['openHours'] ?? '24/7 Open') as String,
        isOpen: (json['is_open'] ?? json['isOpen']) as bool? ?? true,
        emergencyAvailable: (json['emergency_available'] ?? json['emergencyAvailable']) as bool? ?? true,
        emergencyContact: (json['emergency_contact'] ?? json['emergencyContact'] ?? '+91 22 2640 5500') as String,
        about: (json['about'] as String?) ?? '',
        departments: json['departments'] != null ? List<String>.from(json['departments'] as List) : ['Cardiology', 'Neurology', 'Orthopedics'],
        services: json['services'] != null ? List<String>.from(json['services'] as List) : ['Emergency ICU', 'OPD Consultations', 'Radiology'],
        facilities: json['facilities'] != null ? List<String>.from(json['facilities'] as List) : ['Pharmacy', 'Cafeteria', 'Parking'],
        featured: (json['featured'] as bool?) ?? false,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'tagline': tagline,
        'image': image,
        'image_url': image,
        'rating': rating,
        'review_count': reviewCount,
        'location': location,
        'address': address,
        'distance': distance,
        'type': type,
        'open_hours': openHours,
        'is_open': isOpen,
        'emergency_available': emergencyAvailable,
        'emergency_contact': emergencyContact,
        'about': about,
        'departments': departments,
        'services': services,
        'facilities': facilities,
        'featured': featured,
      };
}
