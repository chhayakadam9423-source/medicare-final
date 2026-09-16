class SupabaseConstants {
  // Configured with default or environment-injected Supabase credentials
  // Users can provide --dart-define=SUPABASE_URL=... --dart-define=SUPABASE_ANON_KEY=...
  // or configure it directly in the app.
  static const String defaultUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://xyzmedicareproject.supabase.co',
  );

  static const String defaultAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummyAnonKeyForMedicareHealthHospitalSystem',
  );

  // Table names
  static const String tableProfiles = 'profiles';
  static const String tableDoctors = 'doctors';
  static const String tableHospitals = 'hospitals';
  static const String tableAppointments = 'appointments';
  static const String tableMedicalRecords = 'medical_records';
  static const String tablePrescriptions = 'prescriptions';
}
