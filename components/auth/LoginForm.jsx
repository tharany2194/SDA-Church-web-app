'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginForm({ onClose, onViewChange }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
      if (onClose) {
        onClose();
      } else {
        router.replace('/');
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Welcome Quote & Title Group */}
      <div className="flex flex-col items-center text-center">
        <p className="text-[11px] font-bold tracking-[0.18em] text-white uppercase font-sans mb-3 max-w-[18rem] leading-normal text-center">
          Welcome to Varadharajapuram SDA Church
        </p>

        <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide font-sans mb-0.5">
          Welcome Back
        </h1>
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

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs text-white font-bold ml-1">
            Email address
          </label>
          <input
            type="email"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#e2b755]/30 focus:border-[#e2b755] transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] text-xs"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              dispatch(clearError());
            }}
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="space-y-1 relative">
          <label className="block text-xs text-white font-bold ml-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#e2b755]/30 focus:border-[#e2b755] transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] text-xs"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                dispatch(clearError());
              }}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {/* Forget Password ? Link */}
          <div className="flex justify-start pt-0.5">
            <Link 
              href="/forgot-password" 
              className="text-white hover:text-white/80 transition-colors text-xs font-bold ml-1"
              onClick={() => {
                if (onClose) onClose();
              }}
            >
              Forget Password ?
            </Link>
          </div>
        </div>

        {/* Submit Button (Satin Purple Gradient) */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-[#9b72ff] to-[#733cf0] hover:from-[#a985ff] hover:to-[#834fff] active:scale-[0.98] transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(115,60,240,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs tracking-wide"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'Login'
            )}
          </button>
        </div>
      </form>

      {/* Footer Sign Up Link */}
      <div className="text-center text-xs text-white/50 tracking-wide mt-1">
        Are You New Member ?{' '}
        <Link 
          href="/register" 
          className="font-bold text-white hover:text-[#9b72ff] transition-colors"
          onClick={(e) => {
            e.preventDefault();
            if (onViewChange) {
              onViewChange('register');
            } else {
              if (onClose) onClose();
              router.push('/register');
            }
          }}
        >
          Sign UP
        </Link>
      </div>
    </div>
  );
}


