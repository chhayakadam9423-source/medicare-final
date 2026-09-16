import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Hospital, Doctor } from '../../types';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  UserCheck,
  Calendar,
  Clock,
  Star,
  MapPin,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const AppointmentBookingModal: React.FC = () => {
  const {
    isBookingOpen,
    setIsBookingOpen,
    bookingDoctor,
    bookingHospital,
    cancelBooking,
    hospitals,
    doctors,
    bookAppointment,
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [reason, setReason] = useState<string>('General Consultation & Checkup');

  // Synchronize when modal opens with preselected doctor or hospital
  React.useEffect(() => {
    if (isBookingOpen) {
      const hosp =
        bookingHospital ||
        (bookingDoctor ? hospitals.find((h) => h.id === bookingDoctor.hospitalId) || null : null);
      setSelectedHospital(hosp);
      setSelectedDoctor(bookingDoctor || null);

      if (bookingDoctor && hosp) {
        setStep(3); // Start at date/time picker
      } else if (hosp) {
        setStep(2); // Start at doctor selection
      } else {
        setStep(1); // Start at hospital selection
      }
    }
  }, [isBookingOpen, bookingDoctor, bookingHospital, hospitals]);

  if (!isBookingOpen) return null;

  const handleClose = () => {
    if (cancelBooking) {
      cancelBooking();
    } else {
      setIsBookingOpen(false);
    }
  };

  // Next 7 days calendar generator
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return { dateStr, dayName, dayNum, month };
  });

  // Time slots grouped
  const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const afternoonSlots = ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];
  const eveningSlots = ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'];

  // Doctors filtered by selected hospital
  const filteredDoctors = selectedHospital
    ? doctors.filter((d) => d.hospitalId === selectedHospital.id)
    : doctors;

  const handleNextStep = () => {
    if (step === 1 && !selectedHospital) return;
    if (step === 2 && !selectedDoctor) return;
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      handleClose();
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedHospital) return;

    bookAppointment({
      doctorId: selectedDoctor.id,
      hospitalId: selectedHospital.id,
      date: selectedDate,
      time: selectedSlot,
      reason: reason.trim() || 'General Consultation & Checkup',
    });
  };

  return (
    <div
      id="medicare-booking-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md max-h-[90vh] bg-[#F5F9FC] dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-[#172B4D] dark:text-slate-100"
      >
        {/* Modal Top Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <span className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
              Book Appointment
            </span>
            <span className="text-[11px] text-[#00897B] font-semibold">
              Step {step} of 5
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-[#1565C0] to-[#00897B] transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* STEP 1: Select Hospital */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <h3 className="font-outfit font-bold text-base text-[#172B4D] dark:text-white">
                  Step 1: Choose Hospital
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select the hospital branch you wish to visit
                </p>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {hospitals.map((hosp) => {
                  const isSelected = selectedHospital?.id === hosp.id;
                  return (
                    <div
                      key={hosp.id}
                      onClick={() => {
                        setSelectedHospital(hosp);
                        // reset selected doctor if not in this hospital
                        if (selectedDoctor && selectedDoctor.hospitalId !== hosp.id) {
                          setSelectedDoctor(null);
                        }
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#1565C0] bg-blue-50/80 dark:bg-blue-950/50 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={hosp.image}
                        alt={hosp.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-outfit font-bold text-xs sm:text-sm text-[#172B4D] dark:text-white truncate">
                            {hosp.name}
                          </h4>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#1565C0] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {hosp.location} • {hosp.distance}
                        </p>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          ⭐ {hosp.rating} ({hosp.reviewCount})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Select Doctor */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <h3 className="font-outfit font-bold text-base text-[#172B4D] dark:text-white">
                  Step 2: Choose Doctor
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedHospital
                    ? `Specialists at ${selectedHospital.name}`
                    : 'Choose your medical consultant'}
                </p>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {filteredDoctors.map((doc) => {
                  const isSelected = selectedDoctor?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#00897B] bg-teal-50/80 dark:bg-teal-950/50 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-outfit font-bold text-xs sm:text-sm text-[#172B4D] dark:text-white truncate">
                            {doc.name}
                          </h4>
                          <p className="text-[11px] font-semibold text-[#00897B] dark:text-emerald-400 truncate">
                            {doc.specialization}
                          </p>
                          <span className="text-[10px] text-slate-500">
                            ⭐ {doc.rating} • {doc.experience} yrs exp
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#1565C0] dark:text-blue-400 block">
                          ₹{doc.consultationFee}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#00897B] ml-auto mt-1" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Select Date */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-outfit font-bold text-base text-[#172B4D] dark:text-white">
                  Step 3: Select Date
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pick a convenient appointment day
                </p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {next7Days.map((item) => {
                  const isSelected = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-[#1565C0] bg-[#1565C0] text-white shadow-md'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase opacity-80">
                        {item.dayName}
                      </span>
                      <span className="text-lg font-extrabold my-0.5">
                        {item.dayNum}
                      </span>
                      <span className="text-[10px] font-semibold opacity-90">
                        {item.month}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-[#1565C0] dark:text-blue-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Selected: <strong>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</strong></span>
              </div>
            </div>
          )}

          {/* STEP 4: Select Time Slot */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-outfit font-bold text-base text-[#172B4D] dark:text-white">
                  Step 4: Select Time Slot
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose a preferred 30-minute consultation window
                </p>
              </div>

              {/* Morning */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Morning Slots
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {morningSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        selectedSlot === slot
                          ? 'bg-[#00897B] text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Afternoon Slots
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {afternoonSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        selectedSlot === slot
                          ? 'bg-[#00897B] text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evening */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Evening Slots
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {eveningSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        selectedSlot === slot
                          ? 'bg-[#00897B] text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation & Reason */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-outfit font-bold text-base text-[#172B4D] dark:text-white">
                  Step 5: Review & Confirm
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please verify your appointment details
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                  <img
                    src={selectedDoctor?.avatarUrl}
                    alt={selectedDoctor?.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
                      {selectedDoctor?.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#00897B]">
                      {selectedDoctor?.specialization}
                    </p>
                  </div>
                </div>

                <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hospital:</span>
                    <strong className="text-slate-800 dark:text-white text-right">
                      {selectedHospital?.name}
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Date:</span>
                    <strong>{selectedDate}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Slot:</span>
                    <strong className="text-[#00897B]">{selectedSlot}</strong>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-slate-800 dark:text-white">
                      Consultation Fee:
                    </span>
                    <strong className="text-base text-[#1565C0] dark:text-blue-400">
                      ₹{selectedDoctor?.consultationFee}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Symptoms / Reason for Visit (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    placeholder="e.g. Mild fever, persistent cough, general routine checkup..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Buttons */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          {step > 1 && (
            <button
              onClick={handlePrevStep}
              className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Back
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={handleNextStep}
              disabled={(step === 1 && !selectedHospital) || (step === 2 && !selectedDoctor)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#1565C0] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirmBooking}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#1565C0] to-[#00897B] text-white text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Book Appointment</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
