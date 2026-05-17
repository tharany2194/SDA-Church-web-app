'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Play, MapPin, ChevronRight, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import api from '@/lib/api';

const IMAGES = [
  '/images/c_1.img.jpeg',
  '/images/c_2.img.jpeg',
  '/images/c_3.img.jpeg',
  '/images/c_4.img.jpeg',
  '/images/c_5.img.jpeg',
  '/images/c_6.img.jpeg',
  '/images/c_7.img.jpeg',
  '/images/c_8.img.jpeg',
  '/images/c_9.img.jpeg',
  '/images/c_10.img.jpeg',
  '/images/c_11.img.jpeg',
  '/images/c_12.img.jpeg',
  '/images/c_13.img.jpeg',
];

const SOCIAL = [
  { Icon: Instagram, label: 'ig' },
  { Icon: Facebook, label: 'fb' },
  { Icon: Twitter, label: 'tw' },
  { Icon: Linkedin, label: 'in' },
];

export default function HeroSection() {
  const { language } = useSelector((s) => s.ui);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await api.get('/gallery?category=carousel');
        if (data?.success && data?.data?.length > 0) {
          const urls = data.data.map(item => {
            if (item.url.startsWith('http')) return item.url;
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || '';
            if (item.url.startsWith('/images/')) {
              return `${baseUrl}/api/v1/media${item.url}`;
            }
            return `${baseUrl}${item.url}`;
          });
          setCarouselImages(urls);
        }
      } catch (err) {
        console.error('Failed to fetch admin carousel images, using fallbacks', err);
      }
    };
    fetchImages();
  }, []);

  const activeImages = carouselImages.length > 0 ? carouselImages : IMAGES;

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % activeImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, activeImages.length]);

  const content = {
    en: {
      location: 'Varadharajapuram,Poonamallee, TN',
      title: 'Welcome to Varadharajapuram',
      subtitle: 'Seventh-Day Adventist Church',
      desc: 'Discover a community rooted in faith, united by love, and sent to serve. Join us every Saturday as we worship together.',
      cta: 'Join Us',
      cta2: 'Watch Service',
      card1: 'Saturday Worship',
      card1sub: 'Weekly Service',
      card2: 'Prayer Meeting',
      card2sub: 'Wednesday Evening',
    },
    ta: {
      location: 'வரதராஜபுரம், தமிழ்நாடு',
      title: 'வரதராஜபுரம் திருச்சபைக்கு வரவேற்கிறோம்',
      subtitle: 'ஏழாம் நாள் அட்வென்டிஸ்ட் திருச்சபை',
      desc: 'விசுவாசத்தில் வேரூன்றிய, அன்பால் ஒன்றிணைந்த, சேவை செய்ய அனுப்பப்பட்ட சமூகம்.',
      cta: 'எங்களுடன் சேருங்கள்',
      cta2: 'ஆராதனை காண்க',
      card1: 'சனி ஆராதனை',
      card1sub: 'வாராந்திர சேவை',
      card2: 'ஜெப கூட்டம்',
      card2sub: 'புதன் மாலை',
    },
  };

  const t = content[language];

  return (
    <section
      className="relative w-full -mt-20 overflow-hidden rounded-b-[40px] md:rounded-b-[80px] shadow-lg"
      style={{
        minHeight: 'calc(100vh + 5rem)',
      }}
    >
      {/* Outer Backdrop Carousel */}
      {activeImages.map((img, idx) => (
        <div
          key={`outer-${img}`}
          className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
            idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{
            backgroundImage: `url('${img}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Outer vignette */}
      <div className="absolute inset-0 bg-black/15 z-0" />

      {/* Inner glass card — starts beneath navbar (top: 10rem = navbar bottom) */}
      <div
        className="absolute z-10 inset-x-3 sm:inset-x-4 md:inset-x-6 lg:inset-x-8 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
        style={{ top: '10rem', bottom: '1.5rem' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card background image carousel */}
        {activeImages.map((img, idx) => (
          <div
            key={`inner-${img}`}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
              idx === currentImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={img}
              alt="bg"
              fill
              className={`object-cover object-center ${
                idx === currentImageIndex ? 'scale-105 animate-kenburns-active' : 'scale-100'
              }`}
              priority={idx === 0}
            />
          </div>
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />

        {/* Content wrapper */}
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center md:items-end justify-between px-4 sm:px-6 md:px-10 lg:px-14 pb-4 sm:pb-5 md:pb-8 lg:pb-10 pt-4 sm:pt-6">

          {/* ── LEFT: Text block ── */}
          <div className="w-full md:w-3/5 lg:w-1/2 text-center md:text-left flex flex-col justify-center md:justify-end h-full md:h-auto mb-3 md:mb-0">

            {/* Location badge */}
            <div className="inline-flex items-center gap-1 mb-2 sm:mb-3 self-center md:self-start">
              <MapPin size={11} className="text-white/70 flex-shrink-0" />
              <span className="text-white/70 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase truncate">
                {t.location}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-2 sm:mb-3 drop-shadow-lg">
              {t.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base md:text-lg lg:text-xl font-semibold text-white/80 mb-3 md:mb-5">
              {t.subtitle}
            </p>

            {/* Description — hidden on mobile to keep layout tight */}
            <p className="hidden md:block text-sm lg:text-base text-white/50 mb-6 lg:mb-8 max-w-md leading-relaxed">
              {t.desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-row items-center justify-center md:justify-start gap-3 mt-1 md:mt-0">
              <Link
                href="/about"
                className="px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-white/95 text-gray-900 text-[10px] sm:text-xs md:text-sm font-bold hover:bg-white transition-all shadow-xl whitespace-nowrap"
              >
                {t.cta}
              </Link>
              <Link
                href="/sermons"
                className="flex items-center gap-2 text-white text-[10px] sm:text-xs md:text-sm font-semibold group px-3 sm:px-5 py-2.5 rounded-full hover:bg-white/10 transition-all"
              >
                <span className="w-7 h-7 sm:w-9 sm:h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center group-hover:bg-white/30 transition-all flex-shrink-0">
                  <Play size={10} fill="white" className="text-white ml-0.5" />
                </span>
                <span className="whitespace-nowrap">{t.cta2}</span>
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Cards + Social Icons ── */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3 sm:gap-4 md:gap-6">

            {/* Image Cards */}
            <div className="flex flex-col items-center gap-3 min-[425px]:flex-row min-[425px]:items-end min-[425px]:gap-2 sm:gap-4 justify-center md:justify-end w-full">

              {/* Card 1 — Saturday Worship */}
              <div className="relative w-[80%] min-[425px]:w-[44%] xs:w-[110px] sm:w-[150px] md:w-48 lg:w-56 h-40 min-[425px]:h-32 xs:h-36 sm:h-48 md:h-60 lg:h-72 rounded-xl sm:rounded-2xl overflow-hidden border border-white/30 shadow-2xl group cursor-pointer transition-transform hover:-translate-y-1">
                <Image src="/images/img1.jpeg" alt={t.card1} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/40 transition-all">
                  <ChevronRight size={14} className="text-white" />
                </div>
                <div className="absolute bottom-0 left-0 p-2 sm:p-4">
                  <div className="flex items-center gap-1 mb-0.5">
                    <MapPin size={8} className="text-white/70" />
                    <p className="text-white font-bold text-[9px] sm:text-xs leading-tight">{t.card1}</p>
                  </div>
                  <p className="text-white/60 text-[7px] sm:text-[9px]">{t.card1sub}</p>
                </div>
              </div>

              {/* Card 2 — Prayer Meeting */}
              <div className="relative w-[80%] min-[425px]:w-[44%] xs:w-[110px] sm:w-[150px] md:w-48 lg:w-56 h-36 min-[425px]:h-24 xs:h-28 sm:h-40 md:h-52 lg:h-64 rounded-xl sm:rounded-2xl overflow-hidden border border-white/30 shadow-2xl group cursor-pointer transition-transform hover:-translate-y-1">
                <Image src="/images/img2.jpeg" alt={t.card2} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/40 transition-all">
                  <ChevronRight size={14} className="text-white" />
                </div>
                <div className="absolute bottom-0 left-0 p-2 sm:p-4">
                  <div className="flex items-center gap-1 mb-0.5">
                    <MapPin size={8} className="text-white/70" />
                    <p className="text-white font-bold text-[9px] sm:text-xs leading-tight">{t.card2}</p>
                  </div>
                  <p className="text-white/60 text-[7px] sm:text-[9px]">{t.card2sub}</p>
                </div>
              </div>

            </div>

            {/* Carousel Indicators & Social Icons */}
            <div className="flex gap-4 items-center">
              {/* Modern Minimalist Indicators */}
              <div className="flex gap-1.5 items-center bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {activeImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex 
                        ? 'w-4 bg-white' 
                        : 'w-1.5 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <span className="h-px w-6 bg-white/20 hidden md:block" />

              <div className="flex gap-2 sm:gap-3 items-center">
                {SOCIAL.map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/25 transition-all"
                  >
                    <Icon size={12} />
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
