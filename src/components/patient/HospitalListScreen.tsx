import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { SPECIALTIES } from '../../data/mockData';
import { Hospital } from '../../types';
import {
  Search,
  Star,
  MapPin,
  Clock,
  ArrowUpDown,
  Filter,
  Bookmark,
  ShieldCheck,
  ChevronRight,
  Phone,
} from 'lucide-react';

export const HospitalListScreen: React.FC = () => {
  const {
    hospitals,
    setSelectedHospital,
    savedHospitalIds,
    toggleSaveHospital,
    startBooking,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'name'>('rating');

  const filteredHospitals = useMemo(() => {
    return hospitals
      .filter((h) => {
        const matchesSearch =
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSpecialty =
          selectedSpecialty === 'All' ||
          h.specialties.some((s) => s.toLowerCase() === selectedSpecialty.toLowerCase());

        return matchesSearch && matchesSpecialty;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'distance') {
          const distA = parseFloat(a.distance);
          const distB = parseFloat(b.distance);
          return distA - distB;
        }
        return a.name.localeCompare(b.name);
      });
  }, [hospitals, searchQuery, selectedSpecialty, sortBy]);

  return (
    <div id="hospital-list-screen" className="w-full flex flex-col pb-24 select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-2">
        <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#172B4D] dark:text-white">
          Discover Hospitals
        </h2>
        <p className="text-xs text-[#667085] dark:text-slate-400 font-medium">
          Accredited multi-speciality medical centers
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="px-5 my-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="hospital-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospitals by name, area..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Specialty Filter Chips (Section 18) */}
      <div className="w-full overflow-x-auto px-5 py-2 flex items-center gap-2 no-scrollbar">
        {SPECIALTIES.map((spec) => {
          const isSelected = selectedSpecialty === spec;
          return (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#1565C0] text-white shadow-sm scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {spec}
            </button>
          );
        })}
      </div>

      {/* Sort & Results Count Header */}
      <div className="px-5 py-2 flex items-center justify-between text-xs text-[#667085] dark:text-slate-400 font-medium">
        <span>{filteredHospitals.length} hospitals found</span>
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3 h-3" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-bold text-[#1565C0] dark:text-blue-400 focus:outline-none cursor-pointer"
          >
            <option value="rating">Top Rated</option>
            <option value="distance">Distance</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Hospital Cards List */}
      <div className="px-5 flex flex-col gap-3.5 mt-1">
        {filteredHospitals.length === 0 ? (
          /* Empty State (Section 48) */
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 my-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-700 text-[#1565C0] flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
              No hospitals found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Try adjusting your specialty filter or searching for another keyword.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All');
              }}
              className="mt-3 px-4 py-1.5 rounded-xl bg-[#1565C0] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredHospitals.map((hosp) => {
            const isSaved = savedHospitalIds.includes(hosp.id);
            return (
              <motion.div
                key={hosp.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedHospital(hosp)}
                className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all"
              >
                {/* Banner Thumbnail */}
                <div className="relative h-36 w-full">
                  <img
                    src={hosp.image}
                    alt={hosp.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{hosp.rating}</span>
                      <span className="text-slate-300 font-normal">({hosp.reviewCount})</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveHospital(hosp.id);
                      }}
                      className="p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-blue-600"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isSaved ? 'text-[#1565C0] fill-[#1565C0]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider block">
                        {hosp.type}
                      </span>
                      <h3 className="font-outfit font-extrabold text-sm sm:text-base leading-snug drop-shadow-sm truncate max-w-[280px]">
                        {hosp.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg shrink-0">
                      {hosp.distance}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-[#667085] dark:text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {hosp.address}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                      {hosp.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>

                  {/* Specialty Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {hosp.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startBooking(undefined, hosp);
                      }}
                      className="text-xs font-bold text-[#1565C0] dark:text-blue-400 hover:underline"
                    >
                      Book Appointment →
                    </button>

                    <button
                      onClick={() => setSelectedHospital(hosp)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-[#1565C0] hover:text-white text-[#172B4D] dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
