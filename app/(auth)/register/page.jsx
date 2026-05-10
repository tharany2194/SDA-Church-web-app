'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../../store/slices/authSlice';
import { Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

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
      router.replace('/');
    }
    // error is already in Redux state and shown inline below
  };

  const field = (key) => ({
    onChange: (e) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (fieldErrors[key]) setFieldErrors((fe) => ({ ...fe, [key]: undefined }));
    },
  });

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">✝</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join our church community</p>
        </div>

        {/* API / network error banner */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
            <AlertCircle size={17} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              className={`input ${fieldErrors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="Your full name"
              value={form.name}
              autoComplete="name"
              {...field('name')}
              required
            />
            {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className={`input ${fieldErrors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="your@email.com"
              value={form.email}
              autoComplete="email"
              {...field('email')}
              required
            />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`input pr-10 ${fieldErrors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="Min. 8 characters"
                value={form.password}
                autoComplete="new-password"
                {...field('password')}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className={`input ${fieldErrors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="Repeat password"
              value={form.confirmPassword}
              autoComplete="new-password"
              {...field('confirmPassword')}
              required
            />
            {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn-primary w-full gap-2 mt-2" disabled={isLoading}>
            <UserPlus size={18} />
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
