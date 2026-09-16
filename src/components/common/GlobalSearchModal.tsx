import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  Building2,
  UserCheck,
  Star,
  MapPin,
  ChevronRight,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    hospitals,
    doctors,
    setSelectedHospital,
    setSelectedDoctor,
    startBooking,
  } = useApp();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return { matchedHospitals: [], matchedDoctors: [] };

    const q = query.toLowerCase();

    const matchedHospitals = hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.specialties.some((s) => s.toLowerCase().includes(q))
    );

    const matchedDoctors = doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.hospitalName.toLowerCase().includes(q)
    );

    return { matchedHospitals, matchedDoctors };
  }, [query, hospitals, doctors]);

  if (!isSearchOpen) return null;

  return (
    <div
      id="medicare-global-search-modal"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden mt-6 flex flex-col max-h-[85vh]"
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
          <Search className="w-5 h-5 text-[#1565C0] dark:text-blue-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors, hospitals, treatments..."
            className="flex-1 text-sm font-medium bg-transparent focus:outline-none text-slate-800 dark:text-white"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="text-center py-8 text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#1565C0]" />
              <p className="text-xs">Type doctor name, hospital, or specialty to search</p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {['Cardiology', 'Sahyadri', 'Orthopedic', 'Dr. Rajesh', 'Pediatrics'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Matched Hospitals */}
              {searchResults.matchedHospitals.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#1565C0]" />
                    Hospitals ({searchResults.matchedHospitals.length})
                  </h4>
                  <div className="space-y-2">
                    {searchResults.matchedHospitals.map((hosp) => (
                      <div
                        key={hosp.id}
                        onClick={() => {
                          setSelectedHospital(hosp);
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-slate-700 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={hosp.image}
                            alt={hosp.name}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <h5 className="font-outfit font-bold text-xs text-slate-800 dark:text-white truncate">
                              {hosp.name}
                            </h5>
                            <span className="text-[10px] text-slate-500 truncate block">
                              {hosp.location} • {hosp.distance}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Doctors */}
              {searchResults.matchedDoctors.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#00897B]" />
                    Doctors ({searchResults.matchedDoctors.length})
                  </h4>
                  <div className="space-y-2">
                    {searchResults.matchedDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200/60 dark:border-slate-700 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={doc.avatarUrl}
                            alt={doc.name}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <h5 className="font-outfit font-bold text-xs text-slate-800 dark:text-white truncate">
                              {doc.name}
                            </h5>
                            <span className="text-[10px] text-[#00897B] font-semibold truncate block">
                              {doc.specialization} • {doc.hospitalName}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.matchedHospitals.length === 0 &&
                searchResults.matchedDoctors.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No hospitals or doctors match "{query}".
                  </div>
                )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
