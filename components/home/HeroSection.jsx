'use client';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { ChevronRight, Play } from 'lucide-react';

export default function HeroSection() {
  const { language } = useSelector((s) => s.ui);

  const content = {
    en: {
      tagline: 'Glorifying God. Serving People.',
      title: 'Welcome to Grace Church',
      subtitle: 'A community rooted in faith, united by love, and sent to serve. Join us every Sunday as we worship together.',
      cta: 'Watch Live',
      cta2: 'Learn More',
    },
    ta: {
      tagline: 'தேவனை மகிமைப்படுத்துதல். மனிதர்களுக்கு சேவை செய்தல்.',
      title: 'கிருபை திருச்சபைக்கு வரவேற்கிறோம்',
      subtitle: 'விசுவாசத்தில் வேரூன்றிய, அன்பால் ஒன்றிணைந்த, சேவை செய்ய அனுப்பப்பட்ட சமூகம்.',
      cta: 'நேரலை காண்க',
      cta2: 'மேலும் அறிக',
    },
  };

  const t = content[language];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-church-dark">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 py-20">
        <div className="max-w-3xl">
          <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">
            {t.tagline}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up">
            {t.title}
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed animate-slide-up">
            {t.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 animate-slide-up">
            <Link href="/sermons" className="btn-primary text-base gap-2">
              <Play size={18} />
              {t.cta}
            </Link>
            <Link href="/about" className="btn-secondary border-white/30 text-white hover:bg-white/10 gap-2">
              {t.cta2}
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>

        {/* Service times */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
          {[
            { day: 'Sunday Service', time: '10:00 AM', icon: '🙏' },
            { day: 'Prayer Meeting', time: 'Wednesday 7 PM', icon: '✝️' },
            { day: 'Youth Service', time: 'Friday 6 PM', icon: '⚡' },
          ].map((item) => (
            <div key={item.day} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <span className="text-2xl block mb-1">{item.icon}</span>
              <p className="text-white font-semibold text-sm">{item.day}</p>
              <p className="text-gray-300 text-xs mt-0.5">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
