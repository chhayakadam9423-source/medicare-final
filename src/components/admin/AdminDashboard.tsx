import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Hospital, Doctor, Advertisement } from '../../types';
import {
  ShieldAlert,
  Building2,
  UserCheck,
  Users,
  CalendarCheck,
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Sparkles,
  BarChart3,
  RefreshCw,
  Search,
  Check,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    hospitals,
    doctors,
    patients,
    appointments,
    advertisements,
    addHospital,
    updateHospital,
    deleteHospital,
    addDoctor,
    deleteDoctor,
    addAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    showToast,
  } = useApp();

  const resetDataToDefault = () => {
    localStorage.clear();
    window.location.reload();
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'hospitals' | 'doctors' | 'ads' | 'appointments'>('overview');

  // Modal states
  const [isAddHospOpen, setIsAddHospOpen] = useState(false);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [isAddAdOpen, setIsAddAdOpen] = useState(false);

  // New Hospital Form
  const [hospName, setHospName] = useState('');
  const [hospLocation, setHospLocation] = useState('Shivajinagar, Pune');
  const [hospAddress, setHospAddress] = useState('Sector 4, Pune, Maharashtra 411005');
  const [hospType, setHospType] = useState('Super Speciality Hospital');
  const [hospImage, setHospImage] = useState('https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800');

  // New Doctor Form
  const [docName, setDocName] = useState('');
  const [docSpec, setDocSpec] = useState('Cardiology');
  const [docHospId, setDocHospId] = useState(hospitals[0]?.id || '');
  const [docFee, setDocFee] = useState('1000');
  const [docExp, setDocExp] = useState('12');

  // New Ad Form
  const [adTitle, setAdTitle] = useState('');
  const [adOffer, setAdOffer] = useState('Flat 25% Off Full Body Checkup');
  const [adHospId, setAdHospId] = useState(hospitals[0]?.id || '');
  const [adImage, setAdImage] = useState('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800');
  const [adBadge, setAdBadge] = useState('25% OFF');

  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospName.trim()) return;

    addHospital({
      name: hospName.trim(),
      tagline: 'Excellence in Clinical Care',
      image: hospImage,
      rating: 4.8,
      reviewCount: 120,
      location: hospLocation,
      address: hospAddress,
      distance: '2.4 km',
      type: hospType,
      specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics'],
      openHours: 'Open 24/7',
      isOpen: true,
      emergencyAvailable: true,
      emergencyContact: '+91 20 2740 5000',
      about: 'A premier advanced medical hospital catering to multi-disciplinary healthcare services.',
      departments: ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology'],
      services: ['24/7 Trauma Care', 'MRI & CT Scans', 'Cath Lab', 'Blood Bank'],
      facilities: ['ICU Beds', 'Ventilators', 'Valet Parking', 'In-house Pharmacy'],
      featured: true,
    });

    setHospName('');
    setIsAddHospOpen(false);
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const parentHosp = hospitals.find((h) => h.id === docHospId) || hospitals[0];

    addDoctor({
      hospitalId: parentHosp.id,
      hospitalName: parentHosp.name,
      name: docName.startsWith('Dr.') ? docName : `Dr. ${docName}`,
      specialization: docSpec,
      qualification: 'MBBS, MD, DNB',
      experience: parseInt(docExp) || 10,
      rating: 4.9,
      reviewCount: 88,
      patientsTreated: 1200,
      consultationFee: parseInt(docFee) || 800,
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      about: 'Renowned consultant dedicated to holistic patient care and clinical precision.',
      education: ['MBBS - AIIMS', 'MD - Cardiology'],
      isAvailableToday: true,
      availability: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        workingHours: '09:00 AM - 05:00 PM',
        timeSlots: ['10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM'],
      },
    });

    setDocName('');
    setIsAddDocOpen(false);
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim()) return;

    const parentHosp = hospitals.find((h) => h.id === adHospId) || hospitals[0];

    addAdvertisement({
      hospitalId: parentHosp.id,
      hospitalName: parentHosp.name,
      title: adTitle.trim(),
      offer: adOffer,
      description: 'Book preventive executive diagnostics with certified pathologists and digital reports.',
      bannerImage: adImage,
      ctaText: 'Claim Offer →',
      discountBadge: adBadge,
      status: 'active',
      isSponsored: true,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
    });

    setAdTitle('');
    setIsAddAdOpen(false);
  };

  return (
    <div id="admin-dashboard-screen" className="w-full flex flex-col pb-24 select-none">
      {/* 1. Header (Section 36) */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shadow-md">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                System Administration
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <h2 className="font-outfit font-extrabold text-base sm:text-lg text-[#172B4D] dark:text-white leading-tight">
              Hospital Master Console
            </h2>
          </div>
        </div>

        <button
          onClick={resetDataToDefault}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
          title="Reset sample data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="px-5 my-2">
        <div className="grid grid-cols-5 gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-2xl border border-slate-300/50 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'hospitals'
                ? 'bg-white dark:bg-slate-900 text-[#1565C0] dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Hospitals
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'doctors'
                ? 'bg-white dark:bg-slate-900 text-[#00897B] dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'ads'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Ads ({advertisements.length})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === 'appointments'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Bookings
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Grid (Section 37) */}
      <div className="px-5 my-2">
        <div className="grid grid-cols-5 gap-1.5">
          <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex flex-col items-center text-center shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-[#1565C0] mb-0.5" />
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white">
              {hospitals.length}
            </span>
            <span className="text-[8px] text-slate-400 font-medium">Hospitals</span>
          </div>

          <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex flex-col items-center text-center shadow-sm">
            <UserCheck className="w-3.5 h-3.5 text-[#00897B] mb-0.5" />
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white">
              {doctors.length}
            </span>
            <span className="text-[8px] text-slate-400 font-medium">Doctors</span>
          </div>

          <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex flex-col items-center text-center shadow-sm">
            <Users className="w-3.5 h-3.5 text-indigo-600 mb-0.5" />
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white">
              {patients.length}
            </span>
            <span className="text-[8px] text-slate-400 font-medium">Patients</span>
          </div>

          <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex flex-col items-center text-center shadow-sm">
            <CalendarCheck className="w-3.5 h-3.5 text-rose-600 mb-0.5" />
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white">
              {appointments.length}
            </span>
            <span className="text-[8px] text-slate-400 font-medium">Appts</span>
          </div>

          <div className="p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex flex-col items-center text-center shadow-sm">
            <Megaphone className="w-3.5 h-3.5 text-amber-500 mb-0.5" />
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white">
              {advertisements.length}
            </span>
            <span className="text-[8px] text-slate-400 font-medium">Live Ads</span>
          </div>
        </div>
      </div>

      {/* OVERVIEW TAB: SYSTEM HEALTH & CHARTS (Section 42) */}
      {activeTab === 'overview' && (
        <div className="px-5 flex flex-col gap-4 mt-2">
          {/* Quick Add Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setIsAddHospOpen(true)}
              className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#1565C0] dark:text-blue-300 font-bold text-xs flex flex-col items-center gap-1 shadow-sm hover:bg-blue-100"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Hospital</span>
            </button>

            <button
              onClick={() => setIsAddDocOpen(true)}
              className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900 text-[#00897B] dark:text-emerald-300 font-bold text-xs flex flex-col items-center gap-1 shadow-sm hover:bg-teal-100"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Doctor</span>
            </button>

            <button
              onClick={() => setIsAddAdOpen(true)}
              className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 font-bold text-xs flex flex-col items-center gap-1 shadow-sm hover:bg-amber-100"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Ad Banner</span>
            </button>
          </div>

          {/* System Analytics: Hospital Distribution */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h4 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#1565C0]" />
              <span>Hospital Patient Load Distribution</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              {hospitals.slice(0, 5).map((hosp, i) => {
                const percentage = [85, 72, 60, 48, 35][i];
                return (
                  <div key={hosp.id}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                        {hosp.name}
                      </span>
                      <strong className="text-slate-800 dark:text-slate-200">{percentage}% capacity</strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1565C0] to-[#00897B] rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* HOSPITALS TAB (Section 38) */}
      {activeTab === 'hospitals' && (
        <div className="px-5 flex flex-col gap-3 mt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
              Manage Hospitals ({hospitals.length})
            </h3>
            <button
              onClick={() => setIsAddHospOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#1565C0] text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Hospital</span>
            </button>
          </div>

          {hospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-3"
            >
              <img
                src={hosp.image}
                alt={hosp.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h4 className="font-outfit font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {hosp.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {hosp.location} • {hosp.type}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-emerald-600 font-bold">⭐ {hosp.rating}</span>
                  {hosp.featured && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => updateHospital(hosp.id, { featured: !hosp.featured })}
                  className={`p-1.5 rounded-lg text-xs font-bold ${
                    hosp.featured ? 'text-amber-500' : 'text-slate-400'
                  }`}
                  title="Toggle Featured"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteHospital(hosp.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                  title="Delete Hospital"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DOCTORS TAB (Section 39) */}
      {activeTab === 'doctors' && (
        <div className="px-5 flex flex-col gap-3 mt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
              Manage Doctors ({doctors.length})
            </h3>
            <button
              onClick={() => setIsAddDocOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#00897B] text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Doctor</span>
            </button>
          </div>

          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-3"
            >
              <img
                src={doc.avatarUrl}
                alt={doc.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h4 className="font-outfit font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {doc.name}
                </h4>
                <p className="text-[11px] font-semibold text-[#00897B] truncate">
                  {doc.specialization}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {doc.hospitalName} • Fee ₹{doc.consultationFee}
                </p>
              </div>

              <button
                onClick={() => deleteDoctor(doc.id)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                title="Delete Doctor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADS TAB (Section 40) */}
      {activeTab === 'ads' && (
        <div className="px-5 flex flex-col gap-3 mt-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
                Hospital Ad Carousel ({advertisements.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Sponsored banners shown on patient home
              </p>
            </div>
            <button
              onClick={() => setIsAddAdOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Ad</span>
            </button>
          </div>

          {advertisements.map((ad) => (
            <div
              key={ad.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded uppercase">
                      SPONSORED
                    </span>
                    <span className="text-xs font-bold text-[#1565C0] truncate">
                      {ad.hospitalName}
                    </span>
                  </div>
                  <h4 className="font-outfit font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {ad.title}
                  </h4>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                    {ad.offer}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      updateAdvertisement(ad.id, {
                        status: ad.status === 'active' ? 'expired' : 'active',
                      })
                    }
                    className="text-xs font-bold text-slate-600"
                  >
                    {ad.status === 'active' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                        Paused
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => deleteAdvertisement(ad.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700">
                <span>CTA: <strong>{ad.ctaText}</strong></span>
                <span>Badge: <strong>{ad.discountBadge}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* APPOINTMENTS TAB (Section 41) */}
      {activeTab === 'appointments' && (
        <div className="px-5 flex flex-col gap-3 mt-1">
          <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
            Global Appointments Oversight ({appointments.length})
          </h3>

          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-sm font-bold text-slate-900 dark:text-white">
                    {appt.patientName}
                  </strong>
                  <p className="text-[11px] text-slate-500">
                    Dr. {appt.doctorName} • {appt.doctorSpecialty}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1565C0] font-bold text-[10px]">
                  {appt.status.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <span>{appt.hospitalName}</span>
                <span className="font-bold">{appt.date} at {appt.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Hospital */}
      {isAddHospOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-3">
            <h4 className="font-outfit font-bold text-base">Add New Hospital</h4>
            <form onSubmit={handleCreateHospital} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Hospital Name</label>
                <input
                  type="text"
                  value={hospName}
                  onChange={(e) => setHospName(e.target.value)}
                  placeholder="e.g. Apollo Spectra Hospital"
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Location Area</label>
                <input
                  type="text"
                  value={hospLocation}
                  onChange={(e) => setHospLocation(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Hospital Type</label>
                <input
                  type="text"
                  value={hospType}
                  onChange={(e) => setHospType(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddHospOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#1565C0] text-white font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Doctor */}
      {isAddDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-3">
            <h4 className="font-outfit font-bold text-base">Add New Doctor</h4>
            <form onSubmit={handleCreateDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Sameer Kulkarni"
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Specialization</label>
                <input
                  type="text"
                  value={docSpec}
                  onChange={(e) => setDocSpec(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Assign Hospital</label>
                <select
                  value={docHospId}
                  onChange={(e) => setDocHospId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Fee (₹)</label>
                  <input
                    type="number"
                    value={docFee}
                    onChange={(e) => setDocFee(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Exp (Yrs)</label>
                  <input
                    type="number"
                    value={docExp}
                    onChange={(e) => setDocExp(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDocOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#00897B] text-white font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Ad Banner */}
      {isAddAdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-3">
            <h4 className="font-outfit font-bold text-base">Create Hospital Ad Banner</h4>
            <form onSubmit={handleCreateAd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Headline Title</label>
                <input
                  type="text"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="e.g. Heart Health Diagnostic Camp"
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Offer Summary</label>
                <input
                  type="text"
                  value={adOffer}
                  onChange={(e) => setAdOffer(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Sponsoring Hospital</label>
                <select
                  value={adHospId}
                  onChange={(e) => setAdHospId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Discount Tag</label>
                <input
                  type="text"
                  value={adBadge}
                  onChange={(e) => setAdBadge(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAdOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-white font-bold"
                >
                  Publish Ad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
