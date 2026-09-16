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

  factory Hospital.fromJson(Map<String, dynamic> json) => Hospital(
        id: json['id'] as String,
        name: json['name'] as String,
        tagline: json['tagline'] as String? ?? '',
        image: json['image'] as String,
        rating: (json['rating'] as num).toDouble(),
        reviewCount: (json['reviewCount'] as num).toInt(),
        location: json['location'] as String,
        address: json['address'] as String,
        distance: json['distance'] as String,
        type: json['type'] as String,
        openHours: json['openHours'] as String,
        isOpen: json['isOpen'] as bool? ?? true,
        emergencyAvailable: json['emergencyAvailable'] as bool? ?? false,
        emergencyContact: json['emergencyContact'] as String? ?? '',
        about: json['about'] as String? ?? '',
        departments: List<String>.from(json['departments'] as List),
        services: List<String>.from(json['services'] as List),
        facilities: List<String>.from(json['facilities'] as List),
        featured: json['featured'] as bool? ?? false,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'tagline': tagline,
        'image': image,
        'rating': rating,
        'reviewCount': reviewCount,
        'location': location,
        'address': address,
        'distance': distance,
        'type': type,
        'openHours': openHours,
        'isOpen': isOpen,
        'emergencyAvailable': emergencyAvailable,
        'emergencyContact': emergencyContact,
        'about': about,
        'departments': departments,
        'services': services,
        'facilities': facilities,
        'featured': featured,
      };
}
