import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { SPECIALTIES } from '../../data/mockData';
import { Doctor } from '../../types';
import {
  Search,
  Star,
  Building2,
  Calendar,
  Clock,
  ArrowUpDown,
  Filter,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

export const DoctorListScreen: React.FC = () => {
  const { doctors, hospitals, setSelectedDoctor, startBooking } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee'>('rating');

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => {
        const matchesSearch =
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSpecialty =
          selectedSpecialty === 'All' ||
          doc.specialization.toLowerCase() === selectedSpecialty.toLowerCase();

        return matchesSearch && matchesSpecialty;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'experience') return b.experience - a.experience;
        return a.consultationFee - b.consultationFee;
      });
  }, [doctors, searchQuery, selectedSpecialty, sortBy]);

  return (
    <div id="doctor-list-screen" className="w-full flex flex-col pb-24 select-none">
      {/* Top Title */}
      <div className="px-5 pt-3 pb-2">
        <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#172B4D] dark:text-white">
          Find Doctors
        </h2>
        <p className="text-xs text-[#667085] dark:text-slate-400 font-medium">
          Consult with verified healthcare specialists
        </p>
      </div>

      {/* Search Input */}
      <div className="px-5 my-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="doctor-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name or specialty..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Specialty Filter Chips */}
      <div className="w-full overflow-x-auto px-5 py-2 flex items-center gap-2 no-scrollbar">
        {SPECIALTIES.map((spec) => {
          const isSelected = selectedSpecialty === spec;
          return (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#00897B] text-white shadow-sm scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {spec}
            </button>
          );
        })}
      </div>

      {/* Sort Bar */}
      <div className="px-5 py-2 flex items-center justify-between text-xs text-[#667085] dark:text-slate-400 font-medium">
        <span>{filteredDoctors.length} doctors found</span>
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3 h-3" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-bold text-[#00897B] dark:text-emerald-400 focus:outline-none cursor-pointer"
          >
            <option value="rating">Top Rated</option>
            <option value="experience">Experience</option>
            <option value="fee">Fee (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="px-5 flex flex-col gap-3.5 mt-1">
        {filteredDoctors.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 my-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-slate-700 text-[#00897B] flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
              No doctors found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Try adjusting your search criteria or select another specialty filter.
            </p>
          </div>
        ) : (
          filteredDoctors.map((doc) => {
            return (
              <motion.div
                key={doc.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedDoctor(doc)}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-3"
              >
                {/* Doctor Header */}
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-50 dark:ring-slate-700 shadow-sm"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] flex items-center gap-0.5 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-black" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-outfit font-bold text-sm sm:text-base text-[#172B4D] dark:text-white truncate">
                        {doc.name}
                      </h3>
                      <span className="text-[11px] font-extrabold text-[#1565C0] dark:text-blue-400 shrink-0">
                        ₹{doc.consultationFee}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#00897B] dark:text-emerald-400 block truncate mt-0.5">
                      {doc.specialization}
                    </span>

                    <p className="text-[11px] text-[#667085] dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      {doc.hospitalName}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                        {doc.experience} Years Exp
                      </span>
                      <span>•</span>
                      <span>{doc.patientsTreated}+ Patients</span>
                    </div>
                  </div>
                </div>

                {/* Available Slots Preview */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Next Available: <strong className="text-emerald-600 dark:text-emerald-400">{doc.availableTimeSlots[0]}</strong></span>
                  </div>
                  <span className="text-slate-400 text-[10px]">Today</span>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDoctor(doc);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const parentHosp = hospitals.find((h) => h.id === doc.hospitalId);
                      startBooking(doc, parentHosp);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#1565C0] hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all text-center"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
