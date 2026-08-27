import React, { useState } from 'react';
import {
  X,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    signInWithGoogle,
    signInWithEmailOtp,
    verifyEmailOtp,
    signInWithDemoExecutive,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const res = await signInWithEmailOtp(email.trim());
    setIsLoading(false);

    if (res.success) {
      if (res.devCode) {
        setDevCode(res.devCode);
      }
      setStep('otp');
    } else {
      setErrorMessage(res.error || 'Failed to send one-time verification code.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const res = await verifyEmailOtp(email.trim(), otpCode.trim(), fullName.trim());
    setIsLoading(false);

    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setErrorMessage(res.error || 'Invalid verification code. Please check and retry.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const res = await signInWithGoogle();
    setIsLoading(false);
    if (res.error) {
      setErrorMessage(res.error);
    } else {
      onSuccess?.();
      onClose();
    }
  };

  const handleSelectDemoExecutive = (idx: number) => {
    signInWithDemoExecutive(idx);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col font-sans">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        {/* Brand Header */}
        <div className="space-y-2 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-slate-900 text-white font-medium flex items-center justify-center text-xs shadow-sm">
              3M
            </div>
            <span className="text-sm font-medium text-slate-900 tracking-tight">
              Triple Motive Access
            </span>
          </div>

          <h2 className="text-xl font-medium text-slate-950 tracking-tight">
            {step === 'email' ? 'Request or Sign In' : 'Enter Verification Code'}
          </h2>
          <p className="text-xs font-light text-slate-500 leading-relaxed">
            {step === 'email'
              ? 'Access your sovereign executive node and organization workspace.'
              : `We sent a single-use access code to ${email}`}
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 my-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-light">
            {errorMessage}
          </div>
        )}

        {/* Dev Mode Code Preview */}
        {devCode && step === 'otp' && (
          <div className="p-3 my-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono">
            Demo OTP Code: <strong className="font-bold">{devCode}</strong>
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 'email' && (
          <div className="pt-6 space-y-4">
            {/* Google Authentication Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium tracking-tight shadow-sm transition-all cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-[1px] bg-slate-200" />
              <span className="text-[11px] font-mono text-slate-400 uppercase">or work email</span>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alexander Vance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1">
                  Executive / Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-medium tracking-tight shadow-sm transition-all cursor-pointer"
              >
                <span>{isLoading ? 'Sending Access Code...' : 'Continue with One-Time Code'}</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </form>

            {/* Instant Demo Executive Access Switcher */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block text-center uppercase">
                Instant Exploratory Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoExecutive(0)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all cursor-pointer"
                >
                  <span className="text-xs font-medium text-slate-900 block truncate">Alexander Vance</span>
                  <span className="text-[10px] text-slate-500 block truncate">CEO • Quantum</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoExecutive(1)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all cursor-pointer"
                >
                  <span className="text-xs font-medium text-slate-900 block truncate">Dr. Elena Rostova</span>
                  <span className="text-[10px] text-slate-500 block truncate">AI Scientist • Bio</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Verification Code Input */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="pt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1">
                6-Digit Access Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-lg font-mono tracking-widest text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-medium tracking-tight shadow-sm transition-all cursor-pointer"
            >
              <span>{isLoading ? 'Verifying...' : 'Authenticate & Enter'}</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-900 cursor-pointer pt-1"
            >
              ← Use a different email address
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
