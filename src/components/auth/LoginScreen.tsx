import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { MedicareLogo } from '../common/MedicareLogo';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  Stethoscope,
  ShieldAlert,
  Eye,
  EyeOff,
} from 'lucide-react';

interface LoginScreenProps {
  onGoToRegister: () => void;
  onBackToWelcome?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onGoToRegister,
  onBackToWelcome,
}) => {
  const { loginAs, showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('patient@medicare.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When role tab changes, update demo email
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'patient') setEmail('patient@medicare.com');
    if (role === 'doctor') setEmail('doctor@medicare.com');
    if (role === 'admin') setEmail('admin@medicare.com');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      loginAs(selectedRole, email, password);
    }, 450);
  };

  const handleForgotPassword = () => {
    showToast(`Password reset link sent to demo inbox: ${email}`, 'info');
  };

  return (
    <div
      id="medicare-login-screen"
      className="w-full h-full flex flex-col justify-between p-6 bg-[#F5F9FC] dark:bg-[#0F172A] text-[#172B4D] dark:text-slate-100 overflow-y-auto select-none"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <MedicareLogo size="sm" showText={true} />
        </div>
        {onBackToWelcome && (
          <button
            onClick={onBackToWelcome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Main Form Section */}
      <div className="my-auto py-4 max-w-sm mx-auto w-full">
        <div className="mb-5">
          <h2 className="font-outfit text-2xl font-bold tracking-tight text-[#172B4D] dark:text-white">
            Welcome Back 👋
          </h2>
          <p className="text-xs text-[#667085] dark:text-slate-400 mt-1 font-medium">
            Log in to access your healthcare portal.
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#1565C0] dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-[#1565C0] dark:text-blue-300 leading-snug">
            <span className="font-bold">Local Demo Authentication:</span> Select any role below to pre-populate demo credentials.
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Select User Role
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-200/70 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-300/60 dark:border-slate-700">
            <button
              type="button"
              id="login-role-patient"
              onClick={() => handleRoleChange('patient')}
              className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'patient'
                  ? 'bg-white dark:bg-slate-900 text-[#1565C0] dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 mb-1" />
              <span>Patient</span>
            </button>

            <button
              type="button"
              id="login-role-doctor"
              onClick={() => handleRoleChange('doctor')}
              className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'doctor'
                  ? 'bg-white dark:bg-slate-900 text-[#00897B] dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 mb-1" />
              <span>Doctor</span>
            </button>

            <button
              type="button"
              id="login-role-admin"
              onClick={() => handleRoleChange('admin')}
              className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 mb-1" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300"
            >
              {errorMessage}
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@medicare.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-xs sm:text-sm font-medium transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] font-semibold text-[#1565C0] dark:text-blue-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1565C0] text-xs sm:text-sm font-medium transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#1565C0] hover:bg-blue-700 disabled:opacity-75 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>LOGIN AS {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Switch to Register */}
      <div className="pt-4 pb-2 text-center border-t border-slate-200/70 dark:border-slate-800/80">
        <p className="text-xs text-[#667085] dark:text-slate-400 font-medium">
          Don't have an account?{' '}
          <button
            onClick={onGoToRegister}
            className="font-bold text-[#1565C0] dark:text-blue-400 hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
