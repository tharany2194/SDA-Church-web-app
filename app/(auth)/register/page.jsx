'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RegisterForm from '../../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-[#080415] text-white relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Glowing Neon Blobs in Background (mimics the 3D wave in the mockup) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blob 1: Violet glow top-left */}
        <div className="absolute -top-[10%] -left-[10%] w-[45rem] h-[45rem] rounded-full bg-violet-600/20 blur-[130px] animate-pulse duration-[8000ms] pointer-events-none" />
        {/* Blob 2: Fuchsia glow bottom-right */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[45rem] h-[45rem] rounded-full bg-fuchsia-600/15 blur-[130px] animate-pulse duration-[10000ms] pointer-events-none" />
        {/* Blob 3: Indigo glow center-left */}
        <div className="absolute top-[30%] left-[20%] w-[35rem] h-[35rem] rounded-full bg-indigo-500/10 blur-[110px] pointer-events-none" />
      </div>

      {/* Back to Home Navigation */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-semibold shadow-md transition hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      {/* The Single Glassmorphic Mirror Auth Card - 20% more compact */}
      <div className="relative z-10 w-full max-w-[26rem] rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.01] px-6 py-6 sm:px-8 sm:py-7 shadow-[0_30px_70px_rgba(0,0,0,0.55),inset_0_1.5px_1.5px_rgba(255,255,255,0.25)] backdrop-blur-2xl transition-all duration-300 animate-slide-up">
        <RegisterForm />
      </div>
    </div>
  );
}

