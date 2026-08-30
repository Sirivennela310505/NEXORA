import React, { useState } from 'react';
import { X, Lock, Mail, User, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { NexoraLogo } from '../common/NexoraLogo';
import { hashPassword, getRegisteredAccounts, saveRegisteredAccounts } from '../../engine/storage';
import type { StoredUserAccount } from '../../engine/storage';
import { 
  firebaseSignInWithGoogle, 
  isFirebaseConfigured 
} from '../../engine/firebase';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'signup' | 'forgot';
  onClose: () => void;
  onSuccess: (account: StoredUserAccount, isNewSignUp: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess
}) => {
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status and feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone OTP flow state
  const [phoneMode, setPhoneMode] = useState<'idle' | 'phone' | 'otp'>('idle');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [phoneName, setPhoneName] = useState('');

  // Adjust state during render when initialMode changes
  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    setMode(initialMode);
    setErrorMsg('');
    setSuccessNotice('');
  }

  if (!isOpen) return null;

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const existing = getRegisteredAccounts();
      if (existing.some(acc => acc.email.toLowerCase() === email.toLowerCase())) {
        setErrorMsg('An account with this email already exists. Please Sign In.');
        setIsSubmitting(false);
        return;
      }

      const newAccount: StoredUserAccount = {
        id: `usr_${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString()
      };

      saveRegisteredAccounts([...existing, newAccount]);
      setIsSubmitting(false);
      
      setSuccessNotice('Account created successfully! Please sign in with your credentials.');
      setMode('signin');
      setPassword('');
      setConfirmPassword('');
    }, 450);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const accounts = getRegisteredAccounts();
      const user = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        setErrorMsg('No account found with this email. Please create an account.');
        setIsSubmitting(false);
        return;
      }

      if (user.passwordHash !== hashPassword(password)) {
        setErrorMsg('Incorrect password. Please try again or reset your password.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      onSuccess(user, false);
      onClose();
    }, 400);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address to reset your password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const accounts = getRegisteredAccounts();
      const userIndex = accounts.findIndex(acc => acc.email.toLowerCase() === email.toLowerCase());

      if (userIndex === -1) {
        setErrorMsg('No registered account found with this email.');
        setIsSubmitting(false);
        return;
      }

      accounts[userIndex].passwordHash = hashPassword('nexora123');
      saveRegisteredAccounts(accounts);

      setIsSubmitting(false);
      setSuccessNotice(`Password reset instructions sent. Your temporary password is set to: nexora123`);
      setMode('signin');
    }, 500);
  };

  // Google prompt state
  const [googlePromptOpen, setGooglePromptOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // ---- Google Auth (Firebase / Dynamic Account Selector) ----
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsSubmitting(true);

    if (isFirebaseConfigured) {
      try {
        const user = await firebaseSignInWithGoogle();
        const existing = getRegisteredAccounts();
        const gEmail = user.email || 'google.user@gmail.com';
        let account = existing.find(a => a.email.toLowerCase() === gEmail.toLowerCase());
        if (!account) {
          account = {
            id: `ggl_${user.uid}`,
            fullName: user.displayName || 'Google User',
            email: gEmail,
            passwordHash: hashPassword(user.uid),
            createdAt: new Date().toISOString()
          };
          saveRegisteredAccounts([...existing, account]);
        }
        setIsSubmitting(false);
        onSuccess(account, false);
        onClose();
        return;
      } catch (err: any) {
        console.warn('Firebase Google Auth error/fallback:', err);
      }
    }

    // Open Google Account Picker view
    setIsSubmitting(false);
    setGooglePromptOpen(true);
  };

  const handleConfirmGoogleAccount = (selectedEmail: string, selectedName: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const existing = getRegisteredAccounts();
      let account = existing.find(a => a.email.toLowerCase() === selectedEmail.toLowerCase());
      if (!account) {
        account = {
          id: `ggl_${Date.now()}`,
          fullName: selectedName || selectedEmail.split('@')[0],
          email: selectedEmail.toLowerCase(),
          passwordHash: hashPassword('google-oauth'),
          createdAt: new Date().toISOString()
        };
        saveRegisteredAccounts([...existing, account]);
      }
      setIsSubmitting(false);
      setGooglePromptOpen(false);
      onSuccess(account, false);
      onClose();
    }, 400);
  };


  // ---- Phone OTP Sign In (simulated) ----
  const handleSendOtp = () => {
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    setErrorMsg('');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setPhoneMode('otp');
    setSuccessNotice(`OTP sent to ${phoneNumber}. For demo, your OTP is: ${otp}`);
  };

  const handleVerifyOtp = () => {
    if (otpCode !== generatedOtp) {
      setErrorMsg('Invalid OTP. Please try again.');
      return;
    }
    setErrorMsg('');
    const existing = getRegisteredAccounts();
    const phoneEmail = `phone_${phoneNumber.replace(/\D/g, '')}@nexora.app`;
    let account = existing.find(a => a.email === phoneEmail);
    if (!account) {
      account = {
        id: `ph_${Date.now()}`,
        fullName: phoneName || `User ${phoneNumber.slice(-4)}`,
        email: phoneEmail,
        passwordHash: hashPassword(phoneNumber),
        createdAt: new Date().toISOString()
      };
      saveRegisteredAccounts([...existing, account]);
    }
    onSuccess(account, !existing.find(a => a.email === phoneEmail));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0c101c] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <NexoraLogo size="sm" showText={false} />
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            {googlePromptOpen ? 'Sign in with Google' : mode === 'signup' ? 'Create your NEXORA account' : mode === 'signin' ? 'Welcome back to NEXORA' : 'Reset your password'}
          </h3>
          <p className="text-xs text-slate-400">
            {googlePromptOpen ? 'Choose an account to continue to NEXORA' : mode === 'signup' ? 'Join serious learners charting adaptive career paths.' : mode === 'signin' ? 'Sign in to access your personalized roadmap.' : 'Enter your verified email to receive a password reset link.'}
          </p>
        </div>

        {/* GOOGLE ACCOUNT CHOOSER SCREEN */}
        {googlePromptOpen ? (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleConfirmGoogleAccount('alex.morgan@gmail.com', 'Alex Morgan')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-bold text-cyan-300 text-xs">
                    AM
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300">Alex Morgan</div>
                    <div className="text-[11px] text-slate-400">alex.morgan@gmail.com</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-cyan-400">Select →</span>
              </button>
            </div>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] text-slate-500">or use another Gmail account</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Connor"
                  value={customGoogleName}
                  onChange={e => setCustomGoogleName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Google Email Address</label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={customGoogleEmail}
                  onChange={e => setCustomGoogleEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!customGoogleEmail.includes('@')) {
                    setErrorMsg('Please enter a valid Gmail address.');
                    return;
                  }
                  handleConfirmGoogleAccount(customGoogleEmail, customGoogleName);
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue with {customGoogleEmail || 'Google Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setGooglePromptOpen(false)}
              className="w-full text-xs text-slate-400 hover:text-white text-center pt-2"
            >
              ← Cancel Google Sign-In
            </button>
          </div>
        ) : (
          <>
            {/* Social Login Buttons — shown on signup & signin */}
            {mode !== 'forgot' && phoneMode === 'idle' && (
              <div className="space-y-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-semibold text-xs transition-all shadow-md disabled:opacity-50"
                >
                  {/* Google SVG icon */}
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Phone Number */}
                <button
                  type="button"
                  onClick={() => { setPhoneMode('phone'); setErrorMsg(''); setSuccessNotice(''); }}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition-all"
                >
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
                  </svg>
                  Continue with Phone Number
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-[11px] text-slate-500 font-medium">or continue with email</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
              </div>
            )}

        {/* Phone OTP UI */}
        {(phoneMode === 'phone' || phoneMode === 'otp') && mode !== 'forgot' && (
          <div className="space-y-4">
            {phoneMode === 'phone' ? (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Your Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={phoneName}
                    onChange={e => setPhoneName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300">+91</span>
                    <input
                      type="tel"
                      placeholder="10-digit number"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition-all"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="______"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-[0.5em] px-3 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition-all"
                >
                  Verify & Sign In
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => { setPhoneMode('idle'); setErrorMsg(''); setSuccessNotice(''); setOtpCode(''); setPhoneNumber(''); }}
              className="w-full text-xs text-slate-400 hover:text-white text-center"
            >
              ← Back to email sign in
            </button>
          </div>
        )}

        {/* Success Alert */}
        {successNotice && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ---------------- SIGN UP FORM ---------------- */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-0"
              />
              <label htmlFor="terms">
                I agree to the <span className="text-slate-200">Terms of Service</span> and <span className="text-slate-200">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-lg transition-all shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ---------------- SIGN IN FORM ---------------- */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-brand-400 hover:text-brand-300"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-lg transition-all shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ---------------- FORGOT PASSWORD FORM ---------------- */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-lg transition-all shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <span>Processing...</span> : <span>Send Reset Instructions</span>}
            </button>
          </form>
        )}

        {/* Footer switch */}
        <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessNotice(''); }}
                className="text-brand-400 hover:text-brand-300 font-semibold"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === 'signin' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessNotice(''); }}
                className="text-brand-400 hover:text-brand-300 font-semibold"
              >
                Create Account
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); }}
              className="text-brand-400 hover:text-brand-300 font-semibold"
            >
              Back to Sign In
            </button>
          )}
        </div>

          </>
        )}

      </div>
    </div>
  );
};
