import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Appointment, Prescription, Medicine } from '../../types';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Plus,
  Search,
  FileText,
  AlertCircle,
  Settings,
  Users,
  Activity,
  Trash2,
  Send,
  Building2,
  Check,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const {
    currentUser,
    appointments,
    completeAppointment,
    cancelAppointment,
    patients,
    addPrescription,
    doctors,
    showToast,
  } = useApp();

  // Find the doctor record or default to Dr. Rajesh Verma
  const doctorProfile =
    doctors.find((d) => d.name === currentUser.name) || doctors[0];

  const [activeTab, setActiveTab] = useState<'appointments' | 'consultation' | 'patients' | 'availability'>('appointments');
  const [apptFilter, setApptFilter] = useState<'today' | 'upcoming' | 'completed'>('today');

  // Active consultation state
  const [activeConsultationAppt, setActiveConsultationAppt] = useState<Appointment | null>(
    appointments[0] || null
  );

  // Prescription creation form state
  const [diagnosisInput, setDiagnosisInput] = useState('Acute Bronchitis & Allergic Cough');
  const [instructionsInput, setInstructionsInput] = useState('Drink warm water, steam inhalation twice daily for 5 days. Avoid cold beverages.');
  const [medicinesList, setMedicinesList] = useState<Medicine[]>([
    { id: 'm-1', name: 'Augmentin 625 Duo', dosage: '625 mg', frequency: 'Twice daily after meals', duration: '5 days', instructions: 'Take with food' },
    { id: 'm-2', name: 'Montair LC', dosage: '10 mg', frequency: 'Once daily at bedtime', duration: '7 days', instructions: 'Night only' },
  ]);

  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('Twice daily');
  const [newMedDur, setNewMedDur] = useState('5 days');

  // Availability state
  const [isAvailableNow, setIsAvailableNow] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>(doctorProfile.availability?.days || ['Mon', 'Tue', 'Wed']);
  const [workingSlots, setWorkingSlots] = useState<string[]>(doctorProfile.availability?.timeSlots || ['09:00 AM', '10:00 AM']);

  // Doctor metrics calculations (Section 29)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => a.date === todayDateStr || a.status === 'upcoming');
  const completedAppts = appointments.filter((a) => a.status === 'completed');
  const pendingAppts = appointments.filter((a) => a.status === 'upcoming');

  const filteredAppts =
    apptFilter === 'today'
      ? appointments.filter((a) => a.status === 'upcoming')
      : apptFilter === 'upcoming'
      ? appointments.filter((a) => a.status === 'upcoming')
      : appointments.filter((a) => a.status === 'completed');

  const handleAddMedicine = () => {
    if (!newMedName.trim()) {
      showToast('Please enter medicine name', 'warning');
      return;
    }
    setMedicinesList([
      ...medicinesList,
      {
        id: `med-${Date.now()}`,
        name: newMedName.trim(),
        dosage: newMedDosage.trim() || '500 mg',
        frequency: newMedFreq,
        duration: newMedDur,
        instructions: 'As advised',
      },
    ]);
    setNewMedName('');
    setNewMedDosage('');
    showToast('Medicine added to prescription', 'info');
  };

  const handleRemoveMed = (idx: number) => {
    setMedicinesList(medicinesList.filter((_, i) => i !== idx));
  };

  const handleIssuePrescription = () => {
    if (!activeConsultationAppt) return;
    if (medicinesList.length === 0) {
      showToast('Please add at least one medication', 'warning');
      return;
    }

    addPrescription({
      appointmentId: activeConsultationAppt.id,
      patientId: activeConsultationAppt.patientId,
      patientName: activeConsultationAppt.patientName,
      doctorId: doctorProfile.id,
      doctorName: doctorProfile.name,
      doctorSpecialization: doctorProfile.specialization,
      hospitalName: doctorProfile.hospitalName,
      date: new Date().toISOString().split('T')[0],
      diagnosis: diagnosisInput,
      generalAdvice: instructionsInput,
      medicines: medicinesList,
    });

    completeAppointment(activeConsultationAppt.id);
    setActiveTab('appointments');
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const allSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

  return (
    <div id="doctor-dashboard-screen" className="w-full flex flex-col pb-20 select-none">
      {/* 1. Header (Section 28) */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={doctorProfile.avatarUrl}
            alt={doctorProfile.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#00897B]/30 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#667085] dark:text-slate-400">
                Doctor Portal
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            </div>
            <h2 className="font-outfit font-extrabold text-base sm:text-lg text-[#172B4D] dark:text-white leading-tight">
              {doctorProfile.name}
            </h2>
            <p className="text-[11px] text-[#00897B] font-semibold">
              {doctorProfile.specialization} • {doctorProfile.hospitalName}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAvailableNow(!isAvailableNow)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            isAvailableNow
              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-slate-100 text-slate-500 border border-slate-300'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isAvailableNow ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          <span>{isAvailableNow ? 'On Duty' : 'Off Duty'}</span>
        </button>
      </header>

      {/* Doctor Navigation Tabs */}
      <div className="px-5 my-2">
        <div className="grid grid-cols-4 gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-2xl border border-slate-300/50 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'appointments'
                ? 'bg-white dark:bg-slate-900 text-[#00897B] dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Visits
          </button>
          <button
            onClick={() => setActiveTab('consultation')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'consultation'
                ? 'bg-white dark:bg-slate-900 text-[#00897B] dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Consult
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'patients'
                ? 'bg-white dark:bg-slate-900 text-[#00897B] dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Patients
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'availability'
                ? 'bg-white dark:bg-slate-900 text-[#00897B] dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Schedule
          </button>
        </div>
      </div>

      {/* 2. Doctor Metric Cards (Section 29) */}
      <div className="px-5 my-2">
        <div className="grid grid-cols-4 gap-2">
          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex flex-col items-center text-center shadow-sm">
            <Calendar className="w-4 h-4 text-[#1565C0] mb-1" />
            <span className="text-sm font-extrabold text-slate-800 dark:text-white">
              {todayAppts.length}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">Today's</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex flex-col items-center text-center shadow-sm">
            <Users className="w-4 h-4 text-[#00897B] mb-1" />
            <span className="text-sm font-extrabold text-slate-800 dark:text-white">
              {doctorProfile.patientsTreated}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">Total</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex flex-col items-center text-center shadow-sm">
            <Clock className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-sm font-extrabold text-slate-800 dark:text-white">
              {pendingAppts.length}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">Pending</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex flex-col items-center text-center shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
            <span className="text-sm font-extrabold text-slate-800 dark:text-white">
              {completedAppts.length}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">Completed</span>
          </div>
        </div>
      </div>

      {/* CONTENT TAB: APPOINTMENTS (Section 30) */}
      {activeTab === 'appointments' && (
        <div className="px-5 flex flex-col gap-3 mt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
              Patient Queue
            </h3>
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setApptFilter('today')}
                className={`px-2 py-0.5 rounded-lg font-bold ${
                  apptFilter === 'today' ? 'bg-[#00897B] text-white' : 'text-slate-400'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setApptFilter('completed')}
                className={`px-2 py-0.5 rounded-lg font-bold ${
                  apptFilter === 'completed' ? 'bg-[#00897B] text-white' : 'text-slate-400'
                }`}
              >
                Done
              </button>
            </div>
          </div>

          {filteredAppts.map((appt) => (
            <div
              key={appt.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
                    {appt.patientName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Age 32 • Male • Blood O+
                  </p>
                </div>

                <span className="text-xs font-bold text-[#00897B] bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-full">
                  {appt.time}
                </span>
              </div>

              <div className="text-xs bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-700 dark:text-slate-200">Reason: </span>
                <span>{appt.reason}</span>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[10px] text-slate-400">Appt: {appt.id}</span>

                <div className="flex items-center gap-2">
                  {appt.status === 'upcoming' ? (
                    <>
                      <button
                        onClick={() => {
                          setActiveConsultationAppt(appt);
                          setActiveTab('consultation');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#00897B] hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Start Consult</span>
                      </button>
                      <button
                        onClick={() => cancelAppointment(appt.id)}
                        className="px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Consultation Finished
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTENT TAB: CONSULTATION & PRESCRIPTION GENERATOR (Section 31 & 32) */}
      {activeTab === 'consultation' && activeConsultationAppt && (
        <div className="px-5 flex flex-col gap-4 mt-1">
          {/* Active Patient Card */}
          <div className="p-4 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1565C0] dark:text-blue-400">
                  IN CONSULTATION
                </span>
                <h3 className="font-outfit font-bold text-base text-[#172B4D] dark:text-white">
                  {activeConsultationAppt.patientName}
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[#1565C0]">
                {activeConsultationAppt.time}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-blue-200/60 dark:border-blue-900/60 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">BLOOD GROUP</span>
                <strong className="text-xs">O Positive</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">ALLERGIES</span>
                <strong className="text-xs text-rose-600">Penicillin</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">HISTORY</span>
                <strong className="text-xs">Hypertension</strong>
              </div>
            </div>
          </div>

          {/* Clinical Diagnosis Input */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Clinical Diagnosis
            </label>
            <input
              type="text"
              value={diagnosisInput}
              onChange={(e) => setDiagnosisInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#00897B]"
            />
          </div>

          {/* Prescription Creator (Section 32) */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white flex items-center gap-1.5">
                <span className="text-[#1565C0] font-serif font-bold text-base">℞</span>
                <span>Prescription Generator</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                {medicinesList.length} items added
              </span>
            </div>

            {/* Added Medicines List */}
            <div className="space-y-2">
              {medicinesList.map((med, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="font-bold text-slate-800 dark:text-white">
                      {med.name}
                    </strong>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {med.dosage} • {med.frequency} • {med.duration}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMed(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Medicine Inline Form */}
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700/40 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Add Medication
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Medicine name (e.g. Paracetamol)"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-xs font-medium"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 500mg)"
                  value={newMedDosage}
                  onChange={(e) => setNewMedDosage(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Frequency (e.g. Twice daily)"
                  value={newMedFreq}
                  onChange={(e) => setNewMedFreq(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-xs font-medium"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 5 days)"
                  value={newMedDur}
                  onChange={(e) => setNewMedDur(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-xs font-medium"
                />
              </div>

              <button
                type="button"
                onClick={handleAddMedicine}
                className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 font-bold text-xs flex items-center justify-center gap-1 text-slate-800 dark:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine to Rx</span>
              </button>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Advice & Instructions
              </label>
              <textarea
                value={instructionsInput}
                onChange={(e) => setInstructionsInput(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00897B]"
              />
            </div>

            {/* Issue Rx Button */}
            <button
              onClick={handleIssuePrescription}
              className="w-full py-3 px-4 rounded-2xl bg-[#00897B] hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Issue Digital Prescription & Complete Visit</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTENT TAB: PATIENT DIRECTORY (Section 33) */}
      {activeTab === 'patients' && (
        <div className="px-5 flex flex-col gap-3 mt-1">
          <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
            Patient Directory ({patients.length})
          </h3>
          {patients.map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  className="w-11 h-11 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-outfit font-bold text-xs sm:text-sm text-slate-800 dark:text-white">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Age {p.age} • {p.gender} • Blood {p.bloodGroup}
                  </p>
                  <span className="text-[10px] text-[#00897B] font-semibold">
                    Status: Registered Patient
                  </span>
                </div>
              </div>

              <button
                onClick={() => showToast(`Opening patient history for ${p.name}`, 'info')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-bold text-[#00897B]"
              >
                History
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CONTENT TAB: AVAILABILITY & SLOTS SCHEDULER (Section 34) */}
      {activeTab === 'availability' && (
        <div className="px-5 flex flex-col gap-4 mt-1">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h4 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
                  Consultation Status
                </h4>
                <p className="text-[11px] text-slate-500">
                  Allow patients to book new slots
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAvailableNow(!isAvailableNow);
                  showToast(
                    !isAvailableNow ? 'Doctor status set to ACTIVE' : 'Doctor status set to AWAY',
                    'success'
                  );
                }}
                className="text-2xl text-[#00897B]"
              >
                {isAvailableNow ? (
                  <ToggleRight className="w-8 h-8 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Working Days
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => {
                  const isSel = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (isSel) setSelectedDays(selectedDays.filter((d) => d !== day));
                        else setSelectedDays([...selectedDays, day]);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSel
                          ? 'bg-[#00897B] text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Available Consultation Slots
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {allSlots.map((slot) => {
                  const isSel = workingSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => {
                        if (isSel) setWorkingSlots(workingSlots.filter((s) => s !== slot));
                        else setWorkingSlots([...workingSlots, slot]);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        isSel
                          ? 'bg-teal-50 dark:bg-teal-950/60 border-[#00897B] text-[#00897B]'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => showToast('Working hours & schedule updated!', 'success')}
              className="w-full py-3 rounded-2xl bg-[#00897B] text-white font-bold text-xs shadow-md"
            >
              Save Schedule Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
