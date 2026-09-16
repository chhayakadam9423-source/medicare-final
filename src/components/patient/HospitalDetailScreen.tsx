import React from 'react';
import { motion } from 'motion/react';
import { Hospital } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  CalendarCheck,
  Stethoscope,
  Share2,
} from 'lucide-react';

interface HospitalDetailScreenProps {
  hospital: Hospital;
  onBack: () => void;
}

export const HospitalDetailScreen: React.FC<HospitalDetailScreenProps> = ({
  hospital,
  onBack,
}) => {
  const {
    doctors,
    setSelectedDoctor,
    startBooking,
    savedHospitalIds,
    toggleSaveHospital,
    showToast,
  } = useApp();

  const isSaved = savedHospitalIds.includes(hospital.id);
  const hospitalDoctors = doctors.filter((d) => d.hospitalId === hospital.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hospital.name,
        text: `Check out ${hospital.name} on MEDICARE!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('Hospital link copied to clipboard!', 'info');
    }
  };

  return (
    <motion.div
      id="hospital-detail-screen"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col pb-28 bg-[#F5F9FC] dark:bg-[#0F172A] text-[#172B4D] dark:text-slate-100 select-none min-h-full"
    >
      {/* Large Banner Image Header with Floating Controls */}
      <div className="relative h-64 sm:h-72 w-full">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

        {/* Top Floating Action Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            id="hospital-detail-back-btn"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-white hover:bg-white shadow-md transition-all active:scale-95"
            aria-label="Back to hospitals"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-white hover:bg-white shadow-md transition-all active:scale-95"
              aria-label="Share hospital"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleSaveHospital(hospital.id)}
              className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-white hover:bg-white shadow-md transition-all active:scale-95"
              aria-label="Bookmark hospital"
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isSaved ? 'text-[#1565C0] fill-[#1565C0]' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Hero Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00897B] text-white text-[10px] font-extrabold uppercase tracking-wider">
              {hospital.type}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold">
              {hospital.openHours}
            </span>
          </div>

          <h1 className="font-outfit text-xl sm:text-2xl font-extrabold text-white leading-tight drop-shadow-md">
            {hospital.name}
          </h1>

          <p className="text-xs text-slate-200/90 mt-1 font-medium italic">
            "{hospital.tagline}"
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
            <div className="flex items-center gap-1 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>{hospital.rating}</span>
              <span className="text-slate-300 font-normal">({hospital.reviewCount} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-200">
              <MapPin className="w-3.5 h-3.5" />
              <span>{hospital.distance} away</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Content Body */}
      <div className="p-5 flex flex-col gap-5">
        {/* Address Card */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#1565C0] dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                Hospital Address
              </h4>
              <p className="text-[11px] text-[#667085] dark:text-slate-400 mt-0.5">
                {hospital.address}
              </p>
            </div>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-slate-700 text-[#1565C0] dark:text-blue-300 text-[10px] font-bold shrink-0"
          >
            Directions
          </a>
        </div>

        {/* Emergency Card */}
        {hospital.emergencyAvailable && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300">
                  24/7 Trauma & Emergency Hotline
                </h4>
                <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                  {hospital.emergencyContact}
                </p>
              </div>
            </div>
            <a
              href={`tel:${hospital.emergencyContact}`}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
            >
              Call
            </a>
          </div>
        )}

        {/* About Hospital */}
        <div>
          <h3 className="font-outfit text-base font-bold text-[#172B4D] dark:text-white mb-2">
            About Hospital
          </h3>
          <p className="text-xs sm:text-sm text-[#667085] dark:text-slate-300 leading-relaxed">
            {hospital.about}
          </p>
        </div>

        {/* Specialties / Departments */}
        <div>
          <h3 className="font-outfit text-base font-bold text-[#172B4D] dark:text-white mb-2">
            Clinical Departments
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {hospital.departments.map((dept) => (
              <div
                key={dept}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00897B] shrink-0" />
                <span className="truncate">{dept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Specialized Services */}
        <div>
          <h3 className="font-outfit text-base font-bold text-[#172B4D] dark:text-white mb-2">
            Advanced Medical Services
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {hospital.services.map((srv) => (
              <span
                key={srv}
                className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200/50 dark:border-blue-800/40 text-xs font-medium text-[#1565C0] dark:text-blue-300"
              >
                {srv}
              </span>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="font-outfit text-base font-bold text-[#172B4D] dark:text-white mb-2">
            Hospital Facilities & Amenities
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {hospital.facilities.map((fac) => (
              <div
                key={fac}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{fac}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Available Doctors Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-outfit text-base font-bold text-[#172B4D] dark:text-white">
              Available Doctors ({hospitalDoctors.length})
            </h3>
            <span className="text-xs text-[#00897B] font-bold">Verified Medical Staff</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {hospitalDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctor(doc)}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#1565C0]/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div>
                    <h4 className="font-outfit font-bold text-xs sm:text-sm text-[#172B4D] dark:text-white">
                      {doc.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-[#00897B] dark:text-emerald-400">
                      {doc.specialization}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>⭐ {doc.rating}</span>
                      <span>•</span>
                      <span>₹{doc.consultationFee} fee</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startBooking(doc, hospital);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#1565C0] hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Buttons Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-30 max-w-[420px] mx-auto flex items-center gap-3">
        <button
          onClick={() => {
            const firstDoc = hospitalDoctors[0];
            startBooking(firstDoc, hospital);
          }}
          className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#1565C0] to-[#00897B] text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>
    </motion.div>
  );
};
