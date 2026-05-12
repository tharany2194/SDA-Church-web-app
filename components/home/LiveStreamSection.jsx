'use client';
import { useSelector } from 'react-redux';
import { Radio } from 'lucide-react';

const YOUTUBE_LIVE_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || 'live';

export default function LiveStreamSection() {
  const { language } = useSelector((s) => s.ui);

  return (
    <section 
      className="py-24 parallax-section"
      style={{ backgroundImage: "url('/images/parallax_img1.jpg')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container-custom relative z-10">
        <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 curve-tl-br border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-red-400 font-semibold text-sm tracking-wide uppercase">
              {language === 'ta' ? 'நேரலை' : 'Live Stream'}
            </span>
          </div>
          <h2 className="section-title !text-white">
            {language === 'ta' ? 'நேரலை ஆராதனை' : 'Watch Live Service'}
          </h2>
          <p className="section-subtitle !text-white/80">
            {language === 'ta'
              ? 'எங்கிருந்தும் ஆராதனையில் பங்கு கொள்ளுங்கள்'
              : 'Join us live from anywhere in the world every Sunday'}
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-white/10">
              <iframe
                src={`https://www.youtube.com/embed/live_stream?channel=${YOUTUBE_LIVE_ID}&autoplay=0`}
                title="Church Live Stream"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
              <Radio size={15} />
              <span>{language === 'ta' ? 'ஞாயிறு காலை 10:00 மணி' : 'Every Sunday at 10:00 AM'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
