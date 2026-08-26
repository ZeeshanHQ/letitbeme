import React, { useState } from 'react';
import {
  X,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'host' | 'ambassador';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    signInWithGoogle,
    sendEmailOtp,
    verifyEmailOtp,
    signInAsGuest,
    isLoading,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'input' | 'verify_otp'>('input');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    const res = await signInWithGoogle();
    if (res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your work email');
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');

    const res = await sendEmailOtp(email.trim());
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    } else {
      if (res.devCode) {
        setDevCodeHint(res.devCode);
      }
      setSuccessMessage(`We sent a 6-digit verification code to ${email}`);
      setStep('verify_otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMessage('Please enter the full 6-digit verification code');
      return;
    }
    setErrorMessage('');

    const res = await verifyEmailOtp(email.trim(), otpCode.trim(), fullName, 'host');
    if (!res.success) {
      setErrorMessage(res.error || 'Verification failed. Please check the code.');
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-slide-up relative">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* STEP 1: INITIAL INPUT / GOOGLE LOGIN */}
        {step === 'input' && (
          <div className="space-y-5 text-left">
            {/* Header */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#0084FF]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>LETITBEME CLOUD</span>
                </span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
                {authMode === 'signin' ? 'Welcome Back' : 'Create Host Account'}
              </h3>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                {authMode === 'signin'
                  ? 'Sign in to access your persistent meeting rooms & analytics'
                  : 'Start interactive 1080p meetings with built-in Stripe sales'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage('');
                }}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage('');
                }}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
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

            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <div className="h-px flex-1 bg-slate-100" />
              <span>OR WORK EMAIL CODE</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Form */}
            <form onSubmit={handleSendOtp} className="space-y-3">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-[#0084FF] focus:outline-none font-sans"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-[#0084FF] focus:outline-none font-sans"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-shake">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full rounded-xl text-xs font-semibold py-2.5 justify-center shadow-md shadow-blue-500/20 bg-[#0084FF]"
                disabled={isLoading}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
            </form>

            {/* Quick Guest Demo Option */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  signInAsGuest('host');
                  onClose();
                }}
                className="text-[11px] text-slate-400 hover:text-slate-700 font-mono transition-colors cursor-pointer"
              >
                Or explore instantly as <span className="underline font-bold text-slate-600">Demo Guest Host</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: VERIFY OTP CODE */}
        {step === 'verify_otp' && (
          <div className="space-y-5 text-left">
            <button
              type="button"
              onClick={() => {
                setStep('input');
                setErrorMessage('');
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to email</span>
            </button>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>SECURITY CHECK</span>
                </span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
                Enter 6-Digit Code
              </h3>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                We sent a verification code to <strong className="text-slate-800 font-mono">{email}</strong>.
              </p>
            </div>

            {devCodeHint && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#0084FF]">
                <span>Dev Auto-fill Code: </span>
                <strong className="font-mono text-sm tracking-widest">{devCodeHint}</strong>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  className="w-full text-center text-2xl font-mono font-bold tracking-[8px] py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0084FF] focus:outline-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full rounded-xl text-xs font-semibold py-2.5 justify-center shadow-md shadow-blue-500/20 bg-[#0084FF]"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
