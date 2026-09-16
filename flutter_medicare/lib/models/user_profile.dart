class UserProfile {
  final String id;
  final String email;
  final String fullName;
  final String role; // 'patient', 'doctor', 'admin'
  final String? phone;
  final String? dateOfBirth;
  final String? gender;
  final String? address;
  final String? avatarUrl;
  final bool isActive;
  final String? createdAt;

  const UserProfile({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    this.phone,
    this.dateOfBirth,
    this.gender,
    this.address,
    this.avatarUrl,
    this.isActive = true,
    this.createdAt,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        id: json['id'] as String,
        email: json['email'] as String? ?? '',
        fullName: (json['full_name'] ?? json['fullName']) as String? ?? 'Medicare User',
        role: (json['role'] as String? ?? 'patient').toLowerCase(),
        phone: (json['phone']) as String?,
        dateOfBirth: (json['date_of_birth'] ?? json['dateOfBirth']) as String?,
        gender: (json['gender']) as String?,
        address: (json['address']) as String?,
        avatarUrl: (json['avatar_url'] ?? json['avatarUrl']) as String?,
        isActive: (json['is_active'] ?? json['isActive']) as bool? ?? true,
        createdAt: (json['created_at'] ?? json['createdAt']) as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'email': email,
        'full_name': fullName,
        'role': role,
        'phone': phone,
        'date_of_birth': dateOfBirth,
        'gender': gender,
        'address': address,
        'avatar_url': avatarUrl,
        'is_active': isActive,
        'created_at': createdAt,
      };

  UserProfile copyWith({
    String? id,
    String? email,
    String? fullName,
    String? role,
    String? phone,
    String? dateOfBirth,
    String? gender,
    String? address,
    String? avatarUrl,
    bool? isActive,
    String? createdAt,
  }) {
    return UserProfile(
      id: id ?? this.id,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      role: role ?? this.role,
      phone: phone ?? this.phone,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      gender: gender ?? this.gender,
      address: address ?? this.address,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
