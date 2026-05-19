'use client';
import { useSelector } from 'react-redux';
import { Radio, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const YOUTUBE_LIVE_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || 'live';

export default function LiveStreamSection() {
  const { language } = useSelector((s) => s.ui);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextSaturday = new Date();
      const currentDay = now.getDay(); // Saturday = 6
      let daysUntilSaturday = (6 - currentDay + 7) % 7;
      if (currentDay === 6) {
        const today730 = new Date(now);
        today730.setHours(7, 30, 0, 0);
        if (now.getTime() > today730.getTime()) daysUntilSaturday = 7;
      }
      nextSaturday.setDate(now.getDate() + daysUntilSaturday);
      nextSaturday.setHours(7, 30, 0, 0);
      const difference = nextSaturday.getTime() - now.getTime();
      if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (n) => String(n).padStart(2, '0');

  return (
    /* Outer margin wrapper — gives breathing room so the curved shape is fully visible */
    <div id="watch-live" className="px-4 sm:px-8 md:px-12 py-8">
      <section
        className="relative overflow-hidden curve-tr-bl"
        style={{
          backgroundImage: "url('/images/parallax_img1.jpeg')",
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Content — tight top padding, full width */}
        <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 pt-10 pb-10">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="text-red-400 font-semibold text-sm tracking-widest uppercase">
                {language === 'ta' ? 'நேரலை' : 'Live Stream'}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {language === 'ta' ? 'நேரலை ஆராதனை' : 'Watch Live Service'}
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-xl">
              {language === 'ta'
                ? 'எங்கிருந்தும் ஆராதனையில் பங்கு கொள்ளுங்கள்'
                : 'Join us live from anywhere in the world every Saturday'}
            </p>
          </div>

          {/* Countdown */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-1.5 mb-4 text-gold text-xs font-bold tracking-widest uppercase bg-black/30 px-4 py-1.5 rounded-full border border-white/10">
              <Clock size={12} />
              <span>{language === 'ta' ? 'அடுத்த நேரலைக்கு இன்னும்' : 'Countdown to Next Live'}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 xs:gap-3 sm:gap-5">
              {[
                { val: timeLeft.days, label: language === 'ta' ? 'நாட்கள்' : 'Days' },
                { val: timeLeft.hours, label: language === 'ta' ? 'மணி' : 'Hours' },
                { val: timeLeft.minutes, label: language === 'ta' ? 'நிமிடம்' : 'Mins' },
                { val: timeLeft.seconds, label: language === 'ta' ? 'நொடி' : 'Secs' },
              ].map((item, i, arr) => (
                <div key={i} className="flex items-center gap-1.5 xs:gap-3 sm:gap-5">
                  <div className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl w-14 h-18 xs:w-18 xs:h-22 sm:w-24 sm:h-28 shadow-2xl hover:bg-black/55 transition-all">
                    <span className="text-xl xs:text-2xl sm:text-5xl font-extrabold text-gold tracking-tight leading-none">
                      {fmt(item.val)}
                    </span>
                    <span className="text-[7px] xs:text-[9px] sm:text-[11px] uppercase font-bold text-white/50 tracking-widest mt-1 sm:mt-2">
                      {item.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-white/30 text-lg sm:text-3xl font-bold animate-pulse -mt-2 sm:-mt-4">:</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Video Player — 90% width */}
          <div className="w-[90%] mx-auto">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900"
              style={{ paddingBottom: '50.625%' /* 16:9 ratio for 90% width */ }}>
              <iframe
                src={`https://www.youtube.com/embed/live_stream?channel=${YOUTUBE_LIVE_ID}&autoplay=0`}
                title="Church Live Stream"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-white/60">
              <Radio size={15} />
              <span>{language === 'ta' ? 'ஒவ்வொரு சனிக்கிழமை காலை 7:30 மணி' : 'Every Saturday at 7:30 AM'}</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
