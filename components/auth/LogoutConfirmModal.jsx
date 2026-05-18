'use client';
import { LogOut, X } from 'lucide-react';

export default function LogoutConfirmModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Background backdrop - clean, transparent overlay letting the page/hero shine through */}
      <div 
        className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1.5px] transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
      />

      {/* The Single Glassmorphic Mirror Modal Card */}
      <div className="relative z-10 w-full max-w-sm rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.01] px-6 py-8 sm:px-8 shadow-[0_30px_70px_rgba(0,0,0,0.55),inset_0_1.5px_1.5px_rgba(255,255,255,0.25)] backdrop-blur-2xl transition-all duration-300 animate-slide-up text-center text-white">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 shadow-md transition hover:bg-white/15 hover:text-white"
          aria-label="Close dialog"
        >
          <X size={15} />
        </button>

        {/* Floating Glowing Warning Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 mb-4 drop-shadow-[0_8px_20px_rgba(239,68,68,0.2)]">
          <LogOut size={24} />
        </div>

        {/* Modal Headings */}
        <h2 className="text-xl font-bold tracking-wide font-sans mb-2">
          Confirm Log out
        </h2>
        <p className="text-xs sm:text-sm text-white/60 font-sans leading-relaxed mb-6">
          Are you sure you want to log out? Confirm to log out for sure or stay on the page to continue with your community experience.
        </p>

        {/* Option Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-[#9b72ff] to-[#733cf0] hover:from-[#a985ff] hover:to-[#834fff] active:scale-[0.98] transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(115,60,240,0.4)] text-xs tracking-wide"
          >
            Stay on Page
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 active:scale-[0.98] transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(239,68,68,0.3)] text-xs tracking-wide"
          >
            Yes, Exit
          </button>
        </div>
      </div>
    </div>
  );
}
