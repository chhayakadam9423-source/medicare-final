import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Doctor } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Star,
  Building2,
  Calendar,
  Clock,
  GraduationCap,
  Award,
  Users,
  CheckCircle2,
  CalendarCheck,
  Share2,
} from 'lucide-react';

interface DoctorProfileScreenProps {
  doctor: Doctor;
  onBack: () => void;
}

export const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({
  doctor,
  onBack,
}) => {
  const { hospitals, startBooking, showToast } = useApp();
  const parentHospital = hospitals.find((h) => h.id === doctor.hospitalId);

  const availableDays = doctor.availability?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const availableSlots = doctor.availability?.timeSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM'];

  const [selectedDate, setSelectedDate] = useState(availableDays[0] || 'Today');
  const [selectedSlot, setSelectedSlot] = useState(availableSlots[0] || '10:00 AM');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: doctor.name,
        text: `Consult with ${doctor.name} (${doctor.specialization}) on MEDICARE`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('Doctor profile link copied!', 'info');
    }
  };

  return (
    <motion.div
      id="doctor-profile-screen"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col pb-28 bg-[#F5F9FC] dark:bg-[#0F172A] text-[#172B4D] dark:text-slate-100 select-none min-h-full"
    >
      {/* Top Header Bar */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F5F9FC]/90 dark:bg-[#0F172A]/90 backdrop-blur-md z-20">
        <button
          onClick={onBack}
          className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          aria-label="Back to doctors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
          Doctor Profile
        </span>

        <button
          onClick={handleShare}
          className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          aria-label="Share doctor"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Doctor Summary Hero Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col items-center text-center relative">
          <div className="relative mb-3">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-50 dark:ring-slate-700 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified</span>
            </div>
          </div>

          <h2 className="font-outfit text-lg sm:text-xl font-extrabold text-[#172B4D] dark:text-white">
            {doctor.name}
          </h2>

          <span className="text-xs font-bold text-[#00897B] dark:text-emerald-400 mt-0.5">
            {doctor.specialization} • {doctor.qualification}
          </span>

          <p className="text-xs text-[#667085] dark:text-slate-400 flex items-center gap-1 mt-1 font-medium">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{doctor.hospitalName}</span>
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80">
            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-extrabold text-[#1565C0] dark:text-blue-400">
                {doctor.experience}+ Yrs
              </span>
              <span className="text-[10px] text-slate-400">Experience</span>
            </div>

            <div className="flex flex-col items-center border-x border-slate-100 dark:border-slate-700/80">
              <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{doctor.rating}</span>
              </div>
              <span className="text-[10px] text-slate-400">Rating</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {doctor.patientsTreated}+
              </span>
              <span className="text-[10px] text-slate-400">Patients</span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm">
          <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white mb-1.5 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#1565C0]" />
            <span>About Specialist</span>
          </h3>
          <p className="text-xs text-[#667085] dark:text-slate-300 leading-relaxed">
            {doctor.about}
          </p>
        </div>

        {/* Education & Qualifications */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm">
          <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#00897B]" />
            <span>Education & Credentials</span>
          </h3>
          <div className="text-xs text-slate-700 dark:text-slate-300 font-medium space-y-1">
            <p>• {doctor.qualification}</p>
            <p>• Certified Medical Board of India</p>
            <p>• Registered Senior Consultant at {doctor.hospitalName}</p>
          </div>
        </div>

        {/* Available Dates */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm">
          <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#1565C0]" />
            <span>Available Days</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableDays.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDate === day
                    ? 'bg-[#1565C0] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm">
          <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#00897B]" />
            <span>Select Time Slot</span>
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSlot === slot
                    ? 'bg-[#00897B] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Consultation Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-30 max-w-[420px] mx-auto flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#667085] dark:text-slate-400 font-semibold block">
            Consultation Fee
          </span>
          <span className="text-lg font-extrabold text-[#172B4D] dark:text-white">
            ₹{doctor.consultationFee}
          </span>
        </div>

        <button
          onClick={() => startBooking(doctor, parentHospital)}
          className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#1565C0] to-[#00897B] text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>
    </motion.div>
  );
};
