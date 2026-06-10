'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Facebook, Youtube, Mail, Phone, MapPin, Navigation, Users, Play, Instagram } from 'lucide-react';

const footerLinks = {
  pages: [
    { href: '/about',    label: { en: 'About Us', ta: 'எங்களை பற்றி' } },
    { href: '/sermons',  label: { en: 'Sermons', ta: 'பிரசங்கங்கள்' } },
    { href: '/events',   label: { en: 'Events', ta: 'நிகழ்வுகள்' } },
    { href: '/gallery',  label: { en: 'Gallery', ta: 'படத்தொகுப்பு' } },
    { href: '/articles', label: { en: 'Articles', ta: 'கட்டுரைகள்' } },
    { href: '/contact',  label: { en: 'Contact', ta: 'தொடர்பு' } },
  ],
  resources: [
    { href: '/resources', label: { en: 'Resources', ta: 'வளங்கள்' } },
    { href: '/history',   label: { en: 'Our History', ta: 'வரலாறு' } },
    { href: '/youth',     label: { en: 'Youth Ministry', ta: 'இளைஞர் ஊழியம்' } },
    { href: '/prayers',   label: { en: 'Prayer Requests', ta: 'ஜெப குறிப்புகள்' } },
  ],
};

const navCards = [
  {
    icon: Navigation,
    title: { en: 'Times & Locations', ta: 'நேரங்கள் மற்றும் இடங்கள்' },
    desc: { en: 'Find us across the globe', ta: 'எங்களை தொடர்பு கொள்ளுங்கள்' },
    href: '/contact',
  },
  {
    icon: Users,
    title: { en: 'Find Community', ta: 'சமூகத்தை கண்டறியுங்கள்' },
    desc: { en: 'There is a place for you to belong', ta: 'உங்களுக்கு என்று ஒரு இடம் உண்டு' },
    href: '/about',
  },
  {
    icon: Play,
    title: { en: 'Watch a Message', ta: 'செய்தியை காண்க' },
    desc: { en: 'Browse our past messages', ta: 'முந்தைய செய்திகள்' },
    href: '/sermons',
  },
];

export default function Footer() {
  const { language = 'en' } = useSelector((s) => s.ui) || {};
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative">
      {/* ── Overlapping 3-column Nav Card ─────────────────────────── */}
      <div className="relative z-20 px-4 sm:px-8 md:px-20 -mb-8">
        <div
          className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          style={{
            background: 'rgba(3,40,35,0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.08) inset',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {navCards.map(({ icon: Icon, title, desc, href }, i) => (
              <Link
                key={i}
                href={href}
                className="flex items-center gap-4 sm:gap-5 px-6 sm:px-8 py-6 sm:py-7 hover:bg-white/5 transition-all group"
              >
                {/* Icon bubble */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/10 border border-white/15 group-hover:bg-gold/20 group-hover:border-gold/40 transition-all duration-300 shadow-lg">
                  <Icon size={18} className="text-white/70 group-hover:text-gold transition-colors duration-300 sm:w-5 sm:h-5" />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm sm:text-base leading-tight group-hover:text-gold transition-colors duration-200 truncate whitespace-normal sm:whitespace-nowrap">
                    {title[language]}
                  </p>
                  <p className="text-white/45 text-[10px] sm:text-xs mt-0.5 sm:mt-1 leading-snug line-clamp-1">
                    {desc[language]}
                  </p>
                </div>
                {/* Arrow */}
                <span className="text-white/30 group-hover:text-gold group-hover:translate-x-1 transition-all duration-200 shrink-0 text-lg font-bold">›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Footer ───────────────────────────────────────────── */}
      <footer
        className="relative overflow-hidden bg-[#075e54] text-gray-300 rounded-tl-[40px] md:rounded-tl-[100px] rounded-tr-[40px] md:rounded-tr-[100px] flex flex-col justify-between"
      >
        {/* Background Grids & Top Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
          {/* Top glow to blend with overlap card */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#075e54]/80 to-transparent" />
        </div>

        {/* Content — padded generously from the top for the overlap card */}
        <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-20 pt-16 sm:pt-20 flex-1 flex flex-col justify-between mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 border-t border-white/5 pt-10 mb-4 w-full">

            {/* Brand */}
            <div className="lg:col-span-3 sm:col-span-2 lg:col-span-3 w-full">
              <div className="flex flex-col items-start gap-3 mb-4">
                <div className="relative w-32 h-14 rounded-xl bg-white shadow-md overflow-hidden p-1">
                  <Image 
                    src="/images/logo.png" 
                    alt="Varadharajapuram SDA Church Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-white font-bold text-lg sm:text-xl tracking-tight break-words max-w-full">
                  {language === 'ta' ? 'வரதராஜபுரம்' : 'Varadharajapuram'}
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-400 mb-6 sm:mb-8 w-full pr-4 sm:pr-0 break-words">
                {language === 'ta' 
                  ? 'நித்திய சுவிசேஷத்தை பகிர்ந்து கொள்வதற்கும், உள்ளூர் சமூகத்திற்கு கிருபையுடனும் இரக்கத்துடனும் சேவை செய்வதற்கும் அர்ப்பணிக்கப்பட்டுள்ளது.' 
                  : 'Dedicated to sharing the everlasting gospel and serving the local community with grace and compassion.'}
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/share/1AeHjgRr1W/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all group" aria-label="Facebook">
                  <Facebook size={18} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="https://www.instagram.com/sda_church_varadharajapuram?igsh=MWx6NWk3MDZkZ2Rmdg%3D%3D" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-600 transition-all group" aria-label="Instagram">
                  <Instagram size={18} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="https://youtube.com/@varadharajapuramsdachurch?si=bCOYhZnrY64SlaJt" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 transition-all group" aria-label="YouTube">
                  <Youtube size={18} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="mailto:varadharajapuramsdachurch@gmail.com" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-600 transition-all group" aria-label="Email">
                  <Mail size={18} className="text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 w-full">
              <h3 className="text-white font-bold mb-4 sm:mb-5 text-xs sm:text-sm uppercase tracking-widest font-sans">
                {language === 'ta' ? 'விரைவு இணைப்புகள்' : 'Quick Links'}
              </h3>
              <ul className="space-y-3">
                {footerLinks.pages.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      {label[language]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="lg:col-span-2 w-full">
              <h3 className="text-white font-bold mb-4 sm:mb-5 text-xs sm:text-sm uppercase tracking-widest font-sans">
                {language === 'ta' ? 'வளங்கள்' : 'Resources'}
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      {label[language]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Map */}
            <div className="lg:col-span-5 sm:col-span-2 lg:col-span-5 w-full">
              <h3 className="text-white font-bold mb-4 sm:mb-5 text-xs sm:text-sm uppercase tracking-widest font-sans">
                {language === 'ta' ? 'எங்களை காணுங்கள்' : 'Visit Us'}
              </h3>
              <div className="space-y-3 mb-5 pr-2 sm:pr-0">
                <div className="flex gap-3 text-xs sm:text-sm text-gray-400">
                  <MapPin size={18} className="text-white/70 shrink-0 mt-0.5" />
                  <span className="break-words">
                    {language === 'ta' 
                      ? '332J+4FP, வரதராஜபுரம், பூந்தமல்லி, தமிழ்நாடு 600123, இந்தியா.' 
                      : '332J+4FP, Varadharajapuram, Poonamallee, Tamil Nadu 600123, India.'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex gap-3 text-xs sm:text-sm text-gray-400">
                    <Phone size={18} className="text-white/70 shrink-0" />
                    <a href="tel:+919962589089" className="hover:text-white transition-colors break-all">+91 99625 89089</a>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="w-[95%] sm:w-full">
                <a
                  href="https://www.google.com/maps?q=13.0503,80.0812"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl overflow-hidden border border-white/10 h-32 sm:h-36 bg-white/5 relative group cursor-pointer shadow-2xl w-full"
                >
                  <iframe
                    title="Church Location"
                    src="https://maps.google.com/maps?q=13.0503,80.0812&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)', pointerEvents: 'none' }}
                    loading="lazy"
                    className="opacity-70 group-hover:opacity-100 transition-opacity w-full h-full"
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all flex items-center justify-center">
                    <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 flex items-center gap-2 text-white text-xs font-bold shadow-2xl">
                      <MapPin size={16} className="text-white" />
                      {language === 'ta' ? 'வரைபடத்தை காண்க' : 'View Larger Map'}
                    </div>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Watermark */}
          <div className="relative z-0 pointer-events-none select-none overflow-hidden w-full flex justify-center pb-1 pt-2 md:pt-4 mt-2">
            <div className="text-white/[0.03] font-black text-[2.2rem] min-[375px]:text-[2.8rem] sm:text-[5rem] md:text-[8rem] lg:text-[10rem] whitespace-nowrap tracking-tighter leading-none">
              SDA CHURCH
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-3 pb-6 border-t border-white/10 flex flex-col items-center justify-center text-gray-400 w-full px-2 sm:px-0">
            <div className="text-[10px] sm:text-xs font-medium text-center flex flex-col md:flex-row items-center gap-2 md:gap-4 break-words">
              <span>© {currentYear} {language === 'ta' ? 'வரதராஜபுரம் SDA திருச்சபை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'Varadharajapuram SDA Church. All rights reserved.'}</span>
              <a href="mailto:varadharajapuramsdachurch@gmail.com" className="hover:text-white transition-colors break-all">
                varadharajapuramsdachurch@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
