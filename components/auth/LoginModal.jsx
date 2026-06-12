'use client';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import ForgotPasswordForm from './ForgotPasswordForm';

export default function LoginModal({ open, onClose }) {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'forgot-password'

  useEffect(() => {
    if (!open) return;
    setView('login'); // Always default to login when opened
    
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow || '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Background backdrop - clean, transparent overlay letting the page/hero shine through */}
      <div 
        className="absolute inset-0 bg-slate-950/25 backdrop-blur-[1.5px] transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
      />

      {/* The Single Glassmorphic Mirror Auth Card - 20% more compact */}
      <div className="relative z-10 w-full max-w-[26rem] rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.01] px-6 py-6 sm:px-8 sm:py-7 shadow-[0_30px_70px_rgba(0,0,0,0.55),inset_0_1.5px_1.5px_rgba(255,255,255,0.25)] backdrop-blur-2xl transition-all duration-300 animate-slide-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 shadow-md transition hover:bg-white/15 hover:text-white"
          aria-label="Close authentication dialog"
        >
          <X size={15} />
        </button>

        {/* Dynamic Form View Rendering */}
        {view === 'login' && <LoginForm onClose={onClose} onViewChange={setView} />}
        {view === 'register' && <RegisterForm onClose={onClose} onViewChange={setView} />}
        {view === 'forgot-password' && <ForgotPasswordForm onClose={onClose} onViewChange={setView} />}
      </div>
    </div>
  );
}


