'use client';
import { useState } from 'react';
import { Mail, CheckCircle2, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordForm({ onClose, onViewChange }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      toast.success(data.message || 'OTP sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');
      toast.success('OTP verified successfully');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      toast.success('Password reset successfully. You can now login.');
      if (onViewChange) {
        onViewChange('login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Welcome Quote & Title Group */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide font-sans mb-0.5 mt-2">
          {step === 1 && 'Reset Password'}
          {step === 2 && 'Verify OTP'}
          {step === 3 && 'New Password'}
        </h1>
        <p className="text-[11px] font-bold tracking-[0.18em] text-white/70 uppercase font-sans mb-3 max-w-[18rem] leading-normal text-center mt-2">
          {step === 1 && 'Enter your email to receive an OTP'}
          {step === 2 && 'Enter the 6-digit OTP sent to your email'}
          {step === 3 && 'Enter your new password below'}
        </p>
      </div>

      {/* Error alert banner */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          <div className="flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Step 1: Email */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs text-white font-bold ml-1">Email address</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#e2b755]/30 focus:border-[#e2b755] transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] text-xs"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              required
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#9b72ff] to-[#733cf0] hover:from-[#a985ff] hover:to-[#834fff] transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(115,60,240,0.4)] disabled:opacity-50 flex items-center justify-center text-xs tracking-wide"
              disabled={isLoading || !email}
            >
              {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Send OTP'}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: verify OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs text-white font-bold ml-1">OTP from Email</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#e2b755]/30 focus:border-[#e2b755] transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] text-xs"
              placeholder="123456"
              value={otp}
              onChange={(e) => { setOtp(e.target.value); setError(null); }}
              required
              maxLength={6}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#e2b755] to-[#c69b3b] hover:from-[#eccf83] hover:to-[#dba120] transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(226,183,85,0.4)] disabled:opacity-50 flex items-center justify-center text-xs tracking-wide"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Verify OTP'}
            </button>
          </div>
          
          <div className="text-center mt-2">
            <button 
              type="button" 
              className="text-xs text-white/50 hover:text-white transition-colors"
              onClick={() => {setStep(1); setOtp(''); setError(null);}}
            >
              Wrong email? Go back
            </button>
          </div>
        </form>
      )}

      {/* Step 3: New Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-1 relative">
            <label className="block text-xs text-white font-bold ml-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#e2b755]/30 focus:border-[#e2b755] transition-all text-xs"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError(null); }}
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className="block text-xs text-white font-bold ml-1">Re-enter Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#e2b755]/30 focus:border-[#e2b755] transition-all text-xs"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#047857] transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)] disabled:opacity-50 flex items-center justify-center text-xs tracking-wide"
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Set New Password'}
            </button>
          </div>
        </form>
      )}

      {/* Back to Login Link */}
      <div className="text-center text-xs text-white/50 tracking-wide mt-1">
        Remembered your password?{' '}
        <button 
          className="font-bold text-white hover:text-[#e2b755] transition-colors"
          onClick={(e) => {
            e.preventDefault();
            if (onViewChange) onViewChange('login');
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
