'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../store/slices/authSlice';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterForm({ onClose, onViewChange }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(clearError());
    const result = await dispatch(register({ name: form.name, email: form.email, password: form.password }));
    if (register.fulfilled.match(result)) {
      toast.success('Account created! Welcome!');
      if (onClose) {
        onClose();
      } else {
        router.replace('/');
      }
    }
  };

  const field = (key) => ({
    onChange: (e) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (fieldErrors[key]) setFieldErrors((fe) => ({ ...fe, [key]: undefined }));
      dispatch(clearError());
    },
  });

  return (
    <div className="space-y-5">
      {/* Top Welcome Quote & Title Group */}
      <div className="flex flex-col items-center text-center">
        <p className="text-[11px] font-bold tracking-[0.18em] text-[#e2b755] uppercase font-sans mb-3 max-w-[18rem] leading-normal text-center">
          Welcome to Varadharajapuram SDA Church
        </p>

        <h1 className="text-lg sm:text-xl font-semibold text-white tracking-wide font-sans mb-0.5">
          Create Account
        </h1>
      </div>

      {/* API / network error banner */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          <div className="flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-xs text-white/60 font-medium ml-1">
            Full Name
          </label>
          <input
            type="text"
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border ${
              fieldErrors.name ? 'border-red-400' : 'border-white/[0.12]'
            } text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#e2b755]/30 focus:border-[#e2b755] transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] text-xs`}
            placeholder="Your full name"
            value={form.name}
            autoComplete="name"
            {...field('name')}
            required
          />
          {fieldErrors.name && <p className="text-[10px] text-red-400 ml-1 mt-0.5">{fieldErrors.name}</p>}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs text-white/60 font-medium ml-1">
            Email address
          </label>
          <input
            type="email"
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border ${
              fieldErrors.email ? 'border-red-400' : 'border-white/[0.12]'
            } text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#e2b755]/30 focus:border-[#e2b755] transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] text-xs`}
            placeholder="your@email.com"
            value={form.email}
            autoComplete="email"
            {...field('email')}
            required
          />
          {fieldErrors.email && <p className="text-[10px] text-red-400 ml-1 mt-0.5">{fieldErrors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1 relative">
          <label className="block text-xs text-white/60 font-medium ml-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`w-full pl-4 pr-10 py-2.5 rounded-xl bg-white/[0.04] border ${
                fieldErrors.password ? 'border-red-400' : 'border-white/[0.12]'
              } text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#e2b755]/30 focus:border-[#e2b755] transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] text-xs`}
              placeholder="Min. 8 characters"
              value={form.password}
              autoComplete="new-password"
              {...field('password')}
              required
            />
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {fieldErrors.password && <p className="text-[10px] text-red-400 ml-1 mt-0.5">{fieldErrors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block text-xs text-white/60 font-medium ml-1">
            Confirm Password
          </label>
          <input
            type="password"
            className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border ${
              fieldErrors.confirmPassword ? 'border-red-400' : 'border-white/[0.12]'
            } text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#e2b755]/30 focus:border-[#e2b755] transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] text-xs`}
            placeholder="Repeat password"
            value={form.confirmPassword}
            autoComplete="new-password"
            {...field('confirmPassword')}
            required
          />
          {fieldErrors.confirmPassword && <p className="text-[10px] text-red-400 ml-1 mt-0.5">{fieldErrors.confirmPassword}</p>}
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
              'Create Account'
            )}
          </button>
        </div>
      </form>

      {/* Footer Sign In Link */}
      <div className="text-center text-xs text-white/50 tracking-wide mt-1">
        Already have an account?{' '}
        <Link 
          href="/login" 
          className="font-bold text-white hover:text-[#9b72ff] transition-colors"
          onClick={(e) => {
            e.preventDefault();
            if (onViewChange) {
              onViewChange('login');
            } else {
              router.push('/login');
            }
          }}
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
