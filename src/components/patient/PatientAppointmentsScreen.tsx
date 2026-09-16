import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  Building2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  CalendarX,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react';

export const PatientAppointmentsScreen: React.FC = () => {
  const { appointments, cancelAppointment, startBooking } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter((a) => a.status === activeTab);

  const handleConfirmCancel = () => {
    if (cancellingAppt) {
      cancelAppointment(cancellingAppt.id);
      setCancellingAppt(null);
    }
  };

  return (
    <div id="patient-appointments-screen" className="w-full flex flex-col pb-24 select-none">
      {/* Title */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <div>
          <h2 className="font-outfit text-xl sm:text-2xl font-extrabold text-[#172B4D] dark:text-white">
            My Appointments
          </h2>
          <p className="text-xs text-[#667085] dark:text-slate-400 font-medium">
            Manage your doctor consultations & bookings
          </p>
        </div>

        <button
          onClick={() => startBooking()}
          className="px-3 py-1.5 rounded-xl bg-[#1565C0] hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1"
        >
          <span>+ Book</span>
        </button>
      </div>

      {/* Segmented Filter Tabs */}
      <div className="px-5 my-2">
        <div className="grid grid-cols-3 gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-2xl border border-slate-300/50 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white dark:bg-slate-900 text-[#1565C0] dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'completed'
                ? 'bg-white dark:bg-slate-900 text-[#00897B] dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'cancelled'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="px-5 flex flex-col gap-3 mt-2">
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 my-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-700 text-[#1565C0] flex items-center justify-center mx-auto mb-3">
              <CalendarX className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
              No {activeTab} appointments
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {activeTab === 'upcoming'
                ? 'You do not have any upcoming doctor appointments scheduled.'
                : `No ${activeTab} visits in your history.`}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => startBooking()}
                className="mt-3 px-4 py-2 rounded-xl bg-[#1565C0] text-white text-xs font-bold shadow-sm"
              >
                Schedule Now
              </button>
            )}
          </div>
        ) : (
          filteredAppointments.map((appt) => {
            const statusBadge =
              appt.status === 'upcoming' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[10px] font-bold text-[#1565C0] dark:text-blue-300 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  Upcoming
                </span>
              ) : appt.status === 'completed' ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Completed
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[10px] font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                  <XCircle className="w-2.5 h-2.5" />
                  Cancelled
                </span>
              );

            return (
              <motion.div
                key={appt.id}
                whileHover={{ y: -2 }}
                className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={appt.doctorAvatar}
                      alt={appt.doctorName}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h3 className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
                        {appt.doctorName}
                      </h3>
                      <span className="text-[11px] font-semibold text-[#00897B] dark:text-emerald-400 block">
                        {appt.doctorSpecialty}
                      </span>
                    </div>
                  </div>

                  {statusBadge}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{appt.hospitalName}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-[#1565C0] dark:text-blue-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{appt.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Fee: <strong className="text-slate-800 dark:text-white">₹{appt.amount}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {appt.status === 'upcoming' && (
                      <button
                        onClick={() => setCancellingAppt(appt)}
                        className="px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-[11px] transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedAppointment(appt)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-[11px] transition-colors flex items-center gap-1"
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

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-outfit font-bold text-sm text-[#172B4D] dark:text-white">
                Appointment Details
              </span>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p><strong>Appointment ID:</strong> {selectedAppointment.id}</p>
              <p><strong>Doctor:</strong> {selectedAppointment.doctorName} ({selectedAppointment.doctorSpecialty})</p>
              <p><strong>Hospital:</strong> {selectedAppointment.hospitalName}</p>
              <p><strong>Address:</strong> {selectedAppointment.hospitalAddress}</p>
              <p><strong>Date & Time:</strong> {selectedAppointment.date} at {selectedAppointment.time}</p>
              <p><strong>Consultation Reason:</strong> {selectedAppointment.reason}</p>
              <p><strong>Fee Status:</strong> ₹{selectedAppointment.amount} (Paid / Offline Verified)</p>
            </div>

            <button
              onClick={() => setSelectedAppointment(null)}
              className="w-full py-2.5 rounded-xl bg-[#1565C0] text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal (Section 24) */}
      {cancellingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900 p-5 space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-outfit font-bold text-base text-slate-900 dark:text-white">
              Cancel Appointment?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to cancel your consultation with{' '}
              <strong>{cancellingAppt.doctorName}</strong> on {cancellingAppt.date}?
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setCancellingAppt(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-md"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
