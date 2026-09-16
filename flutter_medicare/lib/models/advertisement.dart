class Advertisement {
  final String id;
  final String? hospitalId;
  final String title;
  final String subtitle;
  final String bannerImage;
  final String ctaText;
  final String? discountBadge;
  final String status;
  final bool isSponsored;
  final String startDate;
  final String endDate;

  const Advertisement({
    required this.id,
    this.hospitalId,
    required this.title,
    required this.subtitle,
    required this.bannerImage,
    required this.ctaText,
    this.discountBadge,
    this.status = 'active',
    this.isSponsored = true,
    required this.startDate,
    required this.endDate,
  });

  factory Advertisement.fromJson(Map<String, dynamic> json) => Advertisement(
        id: json['id'] as String,
        hospitalId: json['hospitalId'] as String?,
        title: json['title'] as String,
        subtitle: json['subtitle'] as String,
        bannerImage: json['bannerImage'] as String,
        ctaText: json['ctaText'] as String,
        discountBadge: json['discountBadge'] as String?,
        status: json['status'] as String? ?? 'active',
        isSponsored: json['isSponsored'] as bool? ?? true,
        startDate: json['startDate'] as String,
        endDate: json['endDate'] as String,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'hospitalId': hospitalId,
        'title': title,
        'subtitle': subtitle,
        'bannerImage': bannerImage,
        'ctaText': ctaText,
        'discountBadge': discountBadge,
        'status': status,
        'isSponsored': isSponsored,
        'startDate': startDate,
        'endDate': endDate,
      };
}
