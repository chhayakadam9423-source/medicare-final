-- ================================================================
-- MEDICARE — Supabase PostgreSQL Schema & Migrations
-- Complete Hospital Management System Database Setup
-- ================================================================

-- 1. Create PROFILES Table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')) DEFAULT 'patient',
    phone TEXT,
    date_of_birth DATE,
    gender TEXT,
    address TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create HOSPITALS Table
CREATE TABLE IF NOT EXISTS public.hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    tagline TEXT,
    image TEXT,
    rating NUMERIC(2,1) DEFAULT 4.8,
    review_count INT DEFAULT 0,
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    type TEXT DEFAULT 'Multi-Specialty',
    open_hours TEXT DEFAULT '24/7',
    emergency_available BOOLEAN DEFAULT true,
    emergency_contact TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create DOCTORS Table
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
    hospital_name TEXT DEFAULT 'Apex Superspeciality Hospital',
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    specialization TEXT NOT NULL,
    qualification TEXT NOT NULL,
    experience INT NOT NULL DEFAULT 1,
    rating NUMERIC(2,1) DEFAULT 4.9,
    review_count INT DEFAULT 0,
    consultation_fee INT NOT NULL DEFAULT 500,
    avatar_url TEXT,
    about TEXT,
    available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    working_hours TEXT DEFAULT '09:00 AM - 05:00 PM',
    time_slots TEXT[] DEFAULT ARRAY['09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'],
    is_available_today BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create APPOINTMENTS Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    doctor_name TEXT NOT NULL,
    doctor_specialty TEXT NOT NULL,
    doctor_avatar TEXT,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
    hospital_name TEXT,
    hospital_address TEXT,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    amount INT DEFAULT 500,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_doctor_slot UNIQUE (doctor_id, appointment_date, appointment_time)
);

-- 5. Create MEDICAL_RECORDS Table
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    doctor_name TEXT NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    diagnosis TEXT NOT NULL,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Create PRESCRIPTIONS Table
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    doctor_name TEXT NOT NULL,
    doctor_specialization TEXT,
    hospital_name TEXT,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    diagnosis TEXT,
    general_advice TEXT,
    medicines JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, user can update own profile, insert on register
CREATE POLICY "Allow public read of profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Hospitals: Public read
CREATE POLICY "Allow public read of hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Allow admins to manage hospitals" ON public.hospitals FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Doctors: Public read, admins manage, doctors update own
CREATE POLICY "Allow public read of doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Allow admins to manage doctors" ON public.doctors FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Allow doctor to update own doctor entry" ON public.doctors FOR UPDATE USING (
    user_id = auth.uid()
);

-- Appointments:
-- Patients can view their own appointments
-- Doctors can view their appointments
-- Admins can view all appointments
CREATE POLICY "View appointments" ON public.appointments FOR SELECT USING (
    auth.uid() = patient_id OR 
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Insert appointments" ON public.appointments FOR INSERT WITH CHECK (
    auth.uid() = patient_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Update appointments" ON public.appointments FOR UPDATE USING (
    auth.uid() = patient_id OR
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Medical Records:
CREATE POLICY "View medical records" ON public.medical_records FOR SELECT USING (
    auth.uid() = patient_id OR 
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Manage medical records" ON public.medical_records FOR ALL USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Prescriptions:
CREATE POLICY "View prescriptions" ON public.prescriptions FOR SELECT USING (
    auth.uid() = patient_id OR 
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Manage prescriptions" ON public.prescriptions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE id = doctor_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, phone, date_of_birth, gender, address)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Medicare User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'patient'),
        NEW.raw_user_meta_data->>'phone',
        (NEW.raw_user_meta_data->>'date_of_birth')::date,
        NEW.raw_user_meta_data->>'gender',
        NEW.raw_user_meta_data->>'address'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- INITIAL SEED DATA (Hospitals & Doctors)
-- ================================================================
INSERT INTO public.hospitals (id, name, tagline, location, address, type, open_hours, emergency_available, emergency_contact, rating, review_count)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Apex Superspeciality Hospital', 'Center for Advanced Medical Excellence', 'Bandra West, Mumbai', 'Plot 42, Linking Road, Bandra West, Mumbai 400050', 'Super-Specialty', '24/7', true, '+91 22 2640 5500', 4.9, 1420),
('22222222-2222-2222-2222-222222222222', 'Metro General Hospital', 'Trusted Healthcare for Every Family', 'Andheri East, Mumbai', 'Crossway Junction, Andheri East, Mumbai 400069', 'Multi-Specialty', '24/7', true, '+91 22 2820 1100', 4.8, 980),
('33333333-3333-3333-3333-333333333333', 'Lifecare Children Hospital', 'Specialized Pediatric & Neonatal Care', 'Juhu, Mumbai', '12 Gulmohar Lane, Juhu, Mumbai 400049', 'Pediatric Super-Care', '24/7', true, '+91 22 2615 8899', 4.9, 740)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.doctors (id, hospital_id, hospital_name, name, email, phone, specialization, qualification, experience, rating, review_count, consultation_fee, avatar_url, about)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Apex Superspeciality Hospital', 'Dr. Rajesh Verma', 'dr.verma@medicare.com', '+91 98201 23456', 'Cardiologist', 'MBBS, MD, DM (Cardiology), FACC', 16, 4.9, 420, 800, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&fit=crop&q=80', 'Senior Consultant Interventional Cardiologist specializing in coronary interventions, preventive cardiology, and structural heart procedures.'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Apex Superspeciality Hospital', 'Dr. Ananya Sharma', 'dr.sharma@medicare.com', '+91 98202 34567', 'Pediatrician', 'MBBS, MD (Pediatrics), DNB', 12, 4.8, 380, 650, 'https://images.unsplash.com/photo-1594824813629-61848ffdd9e3?w=200&fit=crop&q=80', 'Senior Pediatrician & Neonatal Specialist dedicated to childhood immunizations, developmental care, and neonatal intensive monitoring.'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Metro General Hospital', 'Dr. Vikram Sethi', 'dr.sethi@medicare.com', '+91 98203 45678', 'Orthopedic Surgeon', 'MBBS, MS (Ortho), MCh (UK)', 14, 4.8, 290, 750, 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&fit=crop&q=80', 'Leading Joint Replacement and Arthroscopic Surgeon with extensive expertise in minimally invasive orthopedic surgeries.'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Metro General Hospital', 'Dr. Sneha Patil', 'dr.patil@medicare.com', '+91 98204 56789', 'Neurologist', 'MBBS, MD, DM (Neurology)', 10, 4.7, 210, 850, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&fit=crop&q=80', 'Expert Neuro-physician dealing with stroke management, headache disorders, epilepsy, and neuromuscular ailments.')
ON CONFLICT (id) DO NOTHING;
