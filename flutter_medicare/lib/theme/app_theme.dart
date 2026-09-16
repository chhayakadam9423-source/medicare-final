import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryBlue = Color(0xFF1565C0);
  static const Color medicalTeal = Color(0xFF00897B);
  static const Color mintAccent = Color(0xFF26A69A);
  static const Color iceBackground = Color(0xFFF5F9FC);
  static const Color darkBackground = Color(0xFF0F172A);
  static const Color darkSurface = Color(0xFF1E293B);

  static ThemeData lightTheme([BuildContext? context]) {
    final baseTextTheme = context != null
        ? Theme.of(context).textTheme
        : ThemeData.light().textTheme;

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: primaryBlue,
      scaffoldBackgroundColor: iceBackground,
      colorScheme: const ColorScheme.light(
        primary: primaryBlue,
        secondary: medicalTeal,
        tertiary: mintAccent,
        surface: Colors.white,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(baseTextTheme),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: IconThemeData(color: Color(0xFF172B4D)),
        titleTextStyle: TextStyle(
          color: Color(0xFF172B4D),
          fontSize: 18,
          fontWeight: FontWeight.w800,
        ),
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 1,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
    );
  }

  static ThemeData darkTheme([BuildContext? context]) {
    final baseTextTheme = context != null
        ? Theme.of(context).textTheme
        : ThemeData.dark().textTheme;

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: primaryBlue,
      scaffoldBackgroundColor: darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: Color(0xFF42A5F5),
        secondary: mintAccent,
        tertiary: Color(0xFF80CBC4),
        surface: darkSurface,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(
        baseTextTheme.apply(bodyColor: Colors.white, displayColor: Colors.white),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkSurface,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.white),
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.w800,
        ),
      ),
      cardTheme: CardThemeData(
        color: darkSurface,
        elevation: 1,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
    );
  }
}
