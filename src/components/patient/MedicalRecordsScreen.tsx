import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Prescription, MedicalRecord } from '../../types';
import {
  FileText,
  Pill,
  Activity,
  ClipboardList,
  Download,
  Calendar,
  UserCheck,
  Building2,
  CheckCircle2,
  Share2,
  Printer,
  ChevronRight,
} from 'lucide-react';

export const MedicalRecordsScreen: React.FC = () => {
  const { prescriptions, medicalRecords, showToast } = useApp();

  const [activeCategory, setActiveCategory] = useState<
    'Prescriptions' | 'Medical History' | 'Lab Reports' | 'Diagnosis' | 'Doctor Notes'
  >('Prescriptions');

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const categories = [
    'Prescriptions',
    'Medical History',
    'Lab Reports',
    'Diagnosis',
    'Doctor Notes',
  ] as const;

  const filteredHistory = medicalRecords.filter(
    (item) => item.category === activeCategory
  );

  const handlePrintDownload = () => {
    showToast('Prescription PDF downloaded to local storage!', 'success');
  };

  return (
    <div id="medical-records-screen" className="w-full flex flex-col pb-24 select-none">
      {/* Top Header */}
      <div className="px-5 pt-3 pb-2">
        <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#172B4D] dark:text-white">
          Medical Records
        </h2>
        <p className="text-xs text-[#667085] dark:text-slate-400 font-medium">
          Digital health records, prescriptions & lab reports
        </p>
      </div>

      {/* Category Pills (Section 25) */}
      <div className="w-full overflow-x-auto px-5 py-2 flex items-center gap-2 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#1565C0] text-white shadow-sm scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="px-5 flex flex-col gap-3 mt-2">
        {activeCategory === 'Prescriptions' ? (
          /* Prescriptions List */
          prescriptions.map((rx) => (
            <motion.div
              key={rx.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedPrescription(rx)}
              className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1565C0] dark:text-blue-400 flex items-center justify-center font-bold text-sm font-outfit">
                    Rx
                  </div>
                  <div>
                    <h3 className="font-outfit font-bold text-xs sm:text-sm text-[#172B4D] dark:text-white">
                      {rx.diagnosis}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#00897B] dark:text-emerald-400">
                      {rx.doctorName}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  {rx.date}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{rx.hospitalName}</span>
              </p>

              {/* Medicines Preview Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {rx.medicines.map((med, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                  >
                    💊 {med.name} ({med.dosage})
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/80 text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  {rx.medicines.length} prescribed items
                </span>
                <span className="text-[#1565C0] dark:text-blue-400 font-bold flex items-center gap-1 text-[11px]">
                  View Full Rx Document <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          /* General Medical Records List */
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
              </div>

              <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
                {item.title}
              </h3>

              <p className="text-xs text-[#667085] dark:text-slate-300 leading-relaxed">
                {item.summary}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Doctor: <strong className="text-slate-700 dark:text-slate-200">{item.doctorName}</strong></span>
                <span>{item.hospitalName}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Prescription Document Modal (Section 26) */}
      <AnimatePresence>
        {selectedPrescription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-[#172B4D] dark:text-slate-100"
            >
              {/* Top Document Header */}
              <div className="p-4 bg-[#1565C0] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
                    Rx
                  </div>
                  <div>
                    <h3 className="font-outfit font-bold text-sm leading-none">
                      Medical Prescription Document
                    </h3>
                    <span className="text-[10px] opacity-80">
                      ID: {selectedPrescription.id}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Document Printable Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                {/* Hospital Header Banner */}
                <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="font-outfit font-extrabold text-base text-[#1565C0] dark:text-blue-400">
                    {selectedPrescription.hospitalName}
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    Multi-Speciality Healthcare & Research Institute
                  </p>
                </div>

                {/* Patient & Doctor Meta Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">PATIENT</span>
                    <strong className="text-xs">{selectedPrescription.patientName}</strong>
                    <span className="text-[10px] text-slate-500 block">Age: 32 Yrs • Male</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">ATTENDING DOCTOR</span>
                    <strong className="text-xs text-[#00897B]">{selectedPrescription.doctorName}</strong>
                    <span className="text-[10px] text-slate-500 block">Date: {selectedPrescription.date}</span>
                  </div>
                </div>

                {/* Diagnosis */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Clinical Diagnosis
                  </span>
                  <p className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white mt-0.5">
                    {selectedPrescription.diagnosis}
                  </p>
                </div>

                {/* Rx Medicines Table */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2 font-bold text-[#1565C0] text-sm">
                    <span className="text-lg font-outfit">℞</span>
                    <span>Prescribed Medications</span>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        <tr>
                          <th className="p-2">Medicine</th>
                          <th className="p-2">Dosage</th>
                          <th className="p-2">Frequency</th>
                          <th className="p-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                        {selectedPrescription.medicines.map((med, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="p-2 font-bold text-slate-800 dark:text-slate-200">
                              {med.name}
                              <span className="block text-[9px] text-slate-400 font-normal">
                                {med.instructions}
                              </span>
                            </td>
                            <td className="p-2">{med.dosage}</td>
                            <td className="p-2 text-[#00897B] font-semibold">{med.frequency}</td>
                            <td className="p-2">{med.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-900/60">
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                    SPECIAL INSTRUCTIONS & ADVICE:
                  </span>
                  <p className="text-xs text-amber-900 dark:text-amber-200">
                    {selectedPrescription.generalAdvice}
                  </p>
                </div>

                {/* Digital Signature */}
                <div className="pt-4 flex justify-between items-end border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                  <span>Digitally verified by MEDICARE Health Vault</span>
                  <div className="text-right">
                    <span className="font-outfit text-sm italic font-serif block text-slate-800 dark:text-slate-200">
                      {selectedPrescription.doctorName}
                    </span>
                    <span>Authorized Physician Signature</span>
                  </div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={handlePrintDownload}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#1565C0] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Prescription PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

