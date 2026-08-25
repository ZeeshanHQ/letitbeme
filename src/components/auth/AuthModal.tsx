import React, { useState } from 'react';
import {
  X,
  Mail,
  User,
  Radio,
  Share2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  Zap,
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
  initialRole = 'host',
}) => {
  const {
    signInWithGoogle,
    sendEmailOtp,
    verifyEmailOtp,
    signInAsGuest,
    updateProfile,
    isLoading,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<'input' | 'verify_otp' | 'onboarding'>('input');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'host' | 'ambassador'>(initialRole);
  const [otpCode, setOtpCode] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [streamTopic, setStreamTopic] = useState('Tech & Product Demos');
  
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
    if (otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the full 6-digit code');
      return;
    }
    setErrorMessage('');

    const res = await verifyEmailOtp(email.trim(), otpCode.trim(), fullName, role);
    if (!res.success) {
      setErrorMessage(res.error || 'Invalid code');
    } else {
      if (res.isNewUser && authMode === 'signup') {
        setCustomSlug(email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''));
        setStep('onboarding');
      } else {
        onClose();
      }
    }
  };

  const handleOnboardingComplete = async () => {
    await updateProfile({
      customSlug: customSlug.trim() || 'my-live',
      pricingMode: 'free',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans text-left">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5 animate-slide-up relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-obsidian hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Auth Mode Tabs: Sign In vs Sign Up */}
        {step === 'input' && (
          <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'signin'
                  ? 'bg-white text-obsidian shadow-sm'
                  : 'text-slate-500 hover:text-obsidian'
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
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMode === 'signup'
                  ? 'bg-white text-obsidian shadow-sm'
                  : 'text-slate-500 hover:text-obsidian'
              }`}
            >
              Create Free Account
            </button>
          </div>
        )}

        {/* STEP 1: AUTH INPUT */}
        {step === 'input' && (
          <>
            <div className="space-y-1">
              <h3 className="text-2xl font-heading font-bold text-obsidian tracking-tight">
                {authMode === 'signin' ? 'Sign in to LetItBeMe' : 'Create your workspace'}
              </h3>
              <p className="text-xs text-slate-500 font-light">
                {authMode === 'signin'
                  ? 'Access your saved broadcast channel and analytics'
                  : 'Launch interactive streams with 0% platform fees'}
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-obsidian font-semibold text-xs shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
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
              <span>OR USE WORK EMAIL CODE</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Form */}
            <form onSubmit={handleSendOtp} className="space-y-3">
              {/* Only show Full Name in Sign Up mode */}
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
                      placeholder="e.g. Liam Chen"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-obsidian focus:bg-white focus:border-solar-500 focus:outline-none font-sans"
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
                    placeholder="liam@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-obsidian focus:bg-white focus:border-solar-500 focus:outline-none font-sans"
                  />
                </div>
              </div>

              {/* Only show Role Selection in Sign Up mode */}
              {authMode === 'signup' && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Select Your Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('host')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        role === 'host'
                          ? 'border-solar-500 bg-solar-50/80 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-obsidian">
                        <Radio className="h-3.5 w-3.5 text-solar-500" />
                        <span>Host / Presenter</span>
                      </div>
                      <span className="block text-[10px] text-slate-500 font-light mt-0.5">
                        Broadcast live, share screen & sell in-stream
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('ambassador')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        role === 'ambassador'
                          ? 'border-solar-500 bg-solar-50/80 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-obsidian">
                        <Share2 className="h-3.5 w-3.5 text-solar-amber" />
                        <span>Ambassador</span>
                      </div>
                      <span className="block text-[10px] text-slate-500 font-light mt-0.5">
                        Share referral links & track commissions
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-xl font-semibold text-xs py-2.5 shadow-solar-sm hover:shadow-solar-md"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {authMode === 'signin' ? 'Sign In with 6-Digit Code' : 'Create Free Account'}
              </Button>
            </form>
          </>
        )}

        {/* STEP 2: VERIFY OTP CODE */}
        {step === 'verify_otp' && (
          <div className="space-y-5 animate-fade-in">
            <button
              type="button"
              onClick={() => {
                setStep('input');
                setErrorMessage('');
              }}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-obsidian cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to email</span>
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-heading font-bold text-obsidian tracking-tight">
                Enter verification code
              </h3>
              <p className="text-xs text-slate-500 font-light">
                We sent a 6-digit code to <strong className="text-obsidian">{email}</strong>
              </p>
            </div>

            {/* Dev Hint if testing */}
            {devCodeHint && (
              <div className="p-2.5 rounded-xl bg-solar-50 border border-solar-200 text-solar-900 text-xs flex items-center justify-between font-mono">
                <span>Code for quick test: <strong>{devCodeHint}</strong></span>
                <button
                  type="button"
                  onClick={() => setOtpCode(devCodeHint)}
                  className="text-[11px] underline text-solar-700 font-sans font-semibold cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[12px] text-2xl font-mono py-3 rounded-2xl border border-slate-300 bg-slate-50 text-obsidian focus:bg-white focus:border-solar-500 focus:outline-none"
                />
              </div>

              {errorMessage && (
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-xl py-2.5 text-xs font-semibold shadow-solar-sm hover:shadow-solar-md"
                isLoading={isLoading}
                rightIcon={<ShieldCheck className="h-4 w-4" />}
              >
                {authMode === 'signin' ? 'Verify & Sign In' : 'Verify & Setup Channel'}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs text-solar-600 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Resend code</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: CREATOR ONBOARDING (SIGN UP ONLY) */}
        {step === 'onboarding' && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <h3 className="text-2xl font-heading font-bold text-obsidian tracking-tight">
                Customize your stream channel
              </h3>
              <p className="text-xs text-slate-500 font-light">
                Claim your personal broadcast link and start streaming
              </p>
            </div>

            {/* Custom URL Slug */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Your Public Live Stream URL
              </label>
              <div className="flex items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-500">
                <span className="text-slate-400">letitbe.me/@</span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-solar-600 font-bold w-full pl-0.5"
                  placeholder="your-name"
                />
              </div>
            </div>

            {/* Stream Topic */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Primary Broadcast Category
              </label>
              <select
                value={streamTopic}
                onChange={(e) => setStreamTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-obsidian focus:outline-none focus:border-solar-500 font-sans"
              >
                <option value="Tech & Product Demos">Tech & Product Demos</option>
                <option value="Founder Masterclasses">Founder Masterclasses</option>
                <option value="Interactive Workshops">Interactive Workshops</option>
                <option value="Sales & VIP Consultations">Sales & VIP Consultations</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full rounded-xl shadow-solar-sm hover:shadow-solar-md"
              onClick={handleOnboardingComplete}
              rightIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Launch My Workspace
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};
