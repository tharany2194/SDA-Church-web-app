'use client';
import { useSelector } from 'react-redux';
import { Radio, Clock, BookOpen, Heart, Calendar, Edit3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import InteractiveSidebar from '../bible/InteractiveSidebar';
import YouTubeEmbed from '../YouTubeEmbed';

const YOUTUBE_LIVE_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || 'live';

export default function LiveStreamSection() {
  const { language } = useSelector((s) => s.ui);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [liveInfo, setLiveInfo] = useState({
    isLive: false,
    hasScheduled: false,
    videoId: null,
    title: null,
    scheduledStartTime: null
  });
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const res = await fetch('/api/v1/youtube/live-status');
        const data = await res.json();
        if (data.success) {
          setLiveInfo({
            isLive: data.isLive,
            hasScheduled: data.hasScheduled,
            videoId: data.videoId,
            title: data.title,
            scheduledStartTime: data.scheduledStartTime
          });
        }
      } catch (err) {
        console.error('Error fetching live status:', err);
      } finally {
        setLoadingLive(false);
      }
    };

    checkLiveStatus();
    const liveTimer = setInterval(checkLiveStatus, 2 * 60 * 1000);

    return () => clearInterval(liveTimer);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let targetTime;

      if (liveInfo.hasScheduled && liveInfo.scheduledStartTime) {
        targetTime = new Date(liveInfo.scheduledStartTime);
      } else {
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
        targetTime = nextSaturday;
      }

      const difference = targetTime.getTime() - now.getTime();
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
  }, [liveInfo]);

  const fmt = (n) => String(n).padStart(2, '0');


  return (
    /* Outer margin wrapper — gives breathing room so the curved shape is fully visible */
    <div id="watch-live" className="px-4 sm:px-8 md:px-12 pt-4 pb-8 md:pt-6 md:pb-8">
      <section
        className="relative overflow-hidden curve-tr-bl"
        style={{
          backgroundImage: "url('/images/parallax_img1.jpg')",
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
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center gap-1.5 mb-4 text-gold text-xs font-bold tracking-widest uppercase bg-black/30 px-4 py-1.5 rounded-full border border-white/10 max-w-full">
              <Clock size={12} className="flex-shrink-0" />
              <span className="truncate">
                {liveInfo.hasScheduled && liveInfo.title 
                  ? `${language === 'ta' ? 'திட்டமிடப்பட்ட நேரலை' : 'Scheduled Live'}: ${liveInfo.title}` 
                  : (language === 'ta' ? 'அடுத்த நேரலைக்கு இன்னும்' : 'Countdown to Next Live')}
              </span>
            </div>
            <div className="flex items-center justify-center gap-0.5 min-[360px]:gap-1 sm:gap-5">
              {[
                { val: timeLeft.days, label: language === 'ta' ? 'நாட்கள்' : 'Days' },
                { val: timeLeft.hours, label: language === 'ta' ? 'மணி' : 'Hours' },
                { val: timeLeft.minutes, label: language === 'ta' ? 'நிமிடம்' : 'Mins' },
                { val: timeLeft.seconds, label: language === 'ta' ? 'நொடி' : 'Secs' },
              ].map((item, i, arr) => (
                <div key={i} className="flex items-center gap-0.5 min-[360px]:gap-1 sm:gap-5">
                  <div className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-md border border-white/15 rounded-xl sm:rounded-2xl w-[53px] h-[64px] min-[360px]:w-[58px] min-[360px]:h-[70px] min-[390px]:w-[64px] min-[390px]:h-[78px] sm:w-[78px] sm:h-[90px] shadow-2xl hover:bg-black/55 transition-all">
                    <span className="text-[1.3rem] min-[360px]:text-[1.5rem] sm:text-4xl font-extrabold text-gold tracking-tight leading-none">
                      {fmt(item.val)}
                    </span>
                    <span className="text-[7px] min-[360px]:text-[8px] sm:text-[9.5px] uppercase font-bold text-white/50 tracking-widest mt-1 sm:mt-2">
                      {item.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-white/30 text-base sm:text-2xl font-bold animate-pulse -mt-2 sm:-mt-4">:</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Video Player and Sidebar (Permanently Docked) */}
          <div className="mx-auto flex flex-col lg:flex-row gap-6 w-[95%] lg:w-full">
            {/* Video Side */}
            <div className="w-full lg:w-[65%] ease-in-out">
              {loadingLive ? (
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center"
                  style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              ) : (liveInfo.isLive || liveInfo.hasScheduled) ? (
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-md"
                  style={{ paddingBottom: '56.25%' }}>
                  <YouTubeEmbed
                    videoId={liveInfo.videoId}
                    title={liveInfo.title || "Church Live Stream"}
                    autoplay={true}
                    mute={true}
                  />
                </div>
              ) : (
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                  style={{ paddingBottom: '56.25%', minHeight: '350px' }}>
                  <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/images/parallax_img1.jpg')" }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/45 mb-4">
                      <Radio size={24} className="text-gold animate-pulse" />
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white tracking-wide mb-2">
                      {language === 'ta' ? 'நேரலை ஆராதனை இன்னும் தொடங்கவில்லை' : 'Live Stream is Offline'}
                    </h3>
                    <p className="text-white/60 text-xs sm:text-sm max-w-md mb-4 leading-relaxed">
                      {language === 'ta'
                        ? 'எங்கள் அடுத்த நேரலை ஆராதனை சனிக்கிழமை காலை 7:30 மணிக்கு தொடங்கும். பிரசங்கங்கள் பிரிவில் எங்களது கடந்த கால செய்திகளை நீங்கள் பார்க்கலாம்.'
                        : 'Our next livestreamed service will begin on Saturday at 7:30 AM. In the meantime, browse our Sermons section for previous messages.'}
                    </p>
                    <a href="/sermons" className="px-5 py-2 bg-gold hover:bg-gold-light text-black font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all text-xs sm:text-sm uppercase tracking-wider">
                      {language === 'ta' ? 'பிரசங்கங்களை பார்க்கவும்' : 'Browse Sermons'}
                    </a>
                  </div>
                </div>
              )}
              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-white/60">
                <Radio size={15} />
                <span>{language === 'ta' ? 'ஒவ்வொரு சனிக்கிழமை காலை 7:30 மணி' : 'Every Saturday at 7:30 AM'}</span>
              </div>
            </div>


            {/* Sidebar Side */}
            <div className="w-full lg:w-[35%] flex flex-col h-[500px]">
              <InteractiveSidebar theme="dark" initialTab="pray" />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
