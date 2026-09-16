import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { HospitalAdCarousel } from './HospitalAdCarousel';
import {
  Bell,
  Search,
  Building2,
  UserCheck,
  CalendarCheck,
  FileText,
  Star,
  MapPin,
  Clock,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  Sparkles,
} from 'lucide-react';

export const PatientHome: React.FC = () => {
  const {
    currentUser,
    notifications,
    setIsNotificationOpen,
    setIsSearchOpen,
    setPatientTab,
    hospitals,
    doctors,
    setSelectedHospital,
    setSelectedDoctor,
    startBooking,
    savedHospitalIds,
    toggleSaveHospital,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const quickServices = [
    {
      id: 'qs-hospitals',
      title: 'Hospitals',
      subtitle: 'Nearby centers',
      icon: Building2,
      color: 'from-blue-600 to-indigo-600',
      action: () => setPatientTab('hospitals'),
    },
    {
      id: 'qs-doctors',
      title: 'Doctors',
      subtitle: 'Top specialists',
      icon: UserCheck,
      color: 'from-teal-600 to-emerald-600',
      action: () => setPatientTab('doctors'),
    },
    {
      id: 'qs-appointments',
      title: 'Appointments',
      subtitle: 'Track visits',
      icon: CalendarCheck,
      color: 'from-amber-500 to-orange-600',
      action: () => setPatientTab('appointments'),
    },
    {
      id: 'qs-records',
      title: 'Medical Records',
      subtitle: 'Rx & Lab tests',
      icon: FileText,
      color: 'from-rose-500 to-pink-600',
      action: () => setPatientTab('records'),
    },
  ];

  const featuredHospitals = hospitals.filter((h) => h.featured || h.rating >= 4.7).slice(0, 4);
  const featuredDoctors = doctors.slice(0, 4);

  return (
    <div id="patient-home-screen" className="w-full flex flex-col pb-20 select-none">
      {/* 1. Header (Section 14) */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setPatientTab('profile')}
            className="w-11 h-11 rounded-2xl overflow-hidden cursor-pointer ring-2 ring-[#1565C0]/20 hover:ring-[#1565C0] transition-all shadow-sm"
          >
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#667085] dark:text-slate-400">
                Good Morning,
              </span>
              <span className="text-xs">👋</span>
            </div>
            <h2 className="font-outfit font-extrabold text-lg sm:text-xl text-[#172B4D] dark:text-white leading-tight">
              {currentUser.name}
            </h2>
          </div>
        </div>

        {/* Notification Bell with animated counter */}
        <button
          id="patient-notifications-btn"
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </header>

      {/* 2. Global Search Trigger Bar */}
      <div className="px-5 my-2">
        <div
          id="patient-search-trigger"
          onClick={() => setIsSearchOpen(true)}
          className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#1565C0]/60 transition-all text-slate-400"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#1565C0] dark:text-blue-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Search doctors, hospitals, specialties...
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            Find
          </span>
        </div>
      </div>

      {/* 3. Hospital Advertisement Carousel (Section 15) */}
      <HospitalAdCarousel />

      {/* 4. Quick Services (Section 16) */}
      <section className="px-5 my-3">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
            Quick Services
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Instant Access</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {quickServices.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                whileTap={{ scale: 0.94 }}
                whileHover={{ y: -2 }}
                onClick={service.action}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${service.color} flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:shadow-lg transition-all`}
                >
                  <Icon className="w-6 h-6" strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-bold text-[#172B4D] dark:text-slate-200 mt-1.5 text-center leading-tight">
                  {service.title}
                </span>
                <span className="text-[9px] text-[#667085] dark:text-slate-400 text-center truncate max-w-[65px]">
                  {service.subtitle}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. Emergency 24/7 Helpline Banner */}
      <section className="px-5 my-2">
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-200/80 dark:border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <PhoneCall className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">
                24/7 Medical Emergency Response
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Immediate ambulance & trauma triage: <span className="font-bold">108</span>
              </p>
            </div>
          </div>
          <a
            href="tel:108"
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-sm"
          >
            Call
          </a>
        </div>
      </section>

      {/* 6. Featured / Nearby Hospitals (Section 17) */}
      <section className="px-5 my-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-outfit font-bold text-base text-[#172B4D] dark:text-white">
              Featured Hospitals
            </h3>
            <p className="text-[11px] text-[#667085] dark:text-slate-400">
              NABH accredited centers near Pune
            </p>
          </div>
          <button
            id="see-all-hospitals-btn"
            onClick={() => setPatientTab('hospitals')}
            className="text-xs font-bold text-[#1565C0] dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {featuredHospitals.map((hosp) => {
            const isSaved = savedHospitalIds.includes(hosp.id);
            return (
              <motion.div
                key={hosp.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedHospital(hosp)}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3 relative"
              >
                {/* Hospital Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={hosp.image}
                    alt={hosp.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span>{hosp.rating}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-outfit font-bold text-xs sm:text-sm text-[#172B4D] dark:text-white truncate">
                        {hosp.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveHospital(hosp.id);
                        }}
                        className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-0.5"
                        aria-label="Save hospital"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isSaved ? 'text-[#1565C0] fill-[#1565C0]' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#667085] dark:text-slate-400 mt-0.5">
                      <span className="flex items-center gap-0.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {hosp.location}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {hosp.distance}
                      </span>
                    </div>

                    {/* Specialties Pill List */}
                    <div className="flex items-center gap-1.5 mt-1.5 overflow-hidden text-[10px]">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#1565C0] dark:text-blue-300 font-semibold truncate">
                        {hosp.type}
                      </span>
                      <span className="text-slate-400 truncate">
                        {hosp.specialties.slice(0, 2).join(' • ')}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-700/60 mt-1">
                    <div className="flex items-center gap-1 text-[10px]">
                      <Clock className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {hosp.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHospital(hosp);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-[#1565C0] dark:text-blue-300 text-[10px] font-bold hover:bg-[#1565C0] hover:text-white transition-colors"
                    >
                      View Hospital
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 7. Top Rated Specialists */}
      <section className="px-5 my-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-outfit font-bold text-base text-[#172B4D] dark:text-white">
              Top Specialists
            </h3>
            <p className="text-[11px] text-[#667085] dark:text-slate-400">
              Experienced doctors ready for consultation
            </p>
          </div>
          <button
            onClick={() => setPatientTab('doctors')}
            className="text-xs font-bold text-[#00897B] dark:text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featuredDoctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <img
                  src={doc.avatarUrl}
                  alt={doc.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div className="min-w-0">
                  <h4 className="font-outfit font-bold text-xs text-[#172B4D] dark:text-white truncate">
                    {doc.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-[#00897B] dark:text-emerald-400 block truncate">
                    {doc.specialization}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <span>{doc.rating}</span>
                    <span className="text-slate-400 font-normal">({doc.experience} yrs)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  ₹{doc.consultationFee}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startBooking(doc);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#1565C0] hover:bg-blue-700 text-white text-[10px] font-bold transition-colors"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
