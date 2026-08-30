import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { NexoraLogo } from '../common/NexoraLogo';
import { hashPassword, getRegisteredAccounts, saveRegisteredAccounts } from '../../engine/storage';
import type { StoredUserAccount } from '../../engine/storage';

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

  // Reset all states whenever modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
      setSuccessNotice('');
      setIsSubmitting(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');
    
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
      if (existing.some(acc => acc.email.toLowerCase() === email.trim().toLowerCase())) {
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
      
      // Auto log in directly after account creation
      onSuccess(newAccount, true);
      onClose();
    }, 400);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessNotice('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const accounts = getRegisteredAccounts();
      const user = accounts.find(acc => acc.email.toLowerCase() === email.trim().toLowerCase());

      if (!user) {
        // If demo/first time user, provide instant registration convenience or clear message
        setErrorMsg('No account found with this email. Please switch to Create Account.');
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
    }, 350);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const accounts = getRegisteredAccounts();
      const userIndex = accounts.findIndex(acc => acc.email.toLowerCase() === email.trim().toLowerCase());

      if (userIndex === -1) {
        setErrorMsg('No registered account found with this email.');
        setIsSubmitting(false);
        return;
      }

      accounts[userIndex].passwordHash = hashPassword('nexora123');
      saveRegisteredAccounts(accounts);

      setIsSubmitting(false);
      setSuccessNotice(`Password reset successfully. Your temporary password is: nexora123`);
      setMode('signin');
      setPassword('nexora123');
    }, 450);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <NexoraLogo size="sm" showText={false} />
          </div>
          <h3 className="text-2xl font-bold font-display text-white tracking-tight">
            {mode === 'signup' 
              ? 'Create Your Account' 
              : mode === 'signin' 
              ? 'Welcome to NEXORA' 
              : 'Reset Password'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {mode === 'signup'
              ? 'Start your personalized AI career roadmap and track daily targets.'
              : mode === 'signin'
              ? 'Sign in to access your flowchart roadmap, assessments & progress.'
              : 'Enter your account email to receive your password reset key.'}
          </p>
        </div>

        {/* Tab Switcher (Sign In / Create Account) */}
        {mode !== 'forgot' && (
          <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessNotice(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessNotice(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Success Alert */}
        {successNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM: CREATE ACCOUNT */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
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
                <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-0"
              />
              <label htmlFor="terms">
                I agree to the <span className="text-slate-200">Terms of Service</span> & <span className="text-slate-200">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating Account & Loading Dashboard...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account & Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* FORM: SIGN IN */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessNotice(''); }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
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
              className="w-full mt-2 py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* FORM: FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <span>Processing...</span> : <span>Send Reset Instructions</span>}
            </button>

            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessNotice(''); }}
              className="w-full text-xs text-slate-400 hover:text-white text-center pt-2"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* Bottom Helper */}
        <div className="pt-3 border-t border-zinc-800/80 text-center text-xs text-slate-400">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessNotice(''); }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Sign In
              </button>
            </p>
          ) : mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessNotice(''); }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Create Account
              </button>
            </p>
          ) : null}
        </div>

      </div>
    </div>
  );
};
