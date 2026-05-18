import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Youtube, Mail, Phone, MapPin, Navigation, Users, Play } from 'lucide-react';

const footerLinks = {
  pages: [
    { href: '/about',    label: 'About Us' },
    { href: '/sermons',  label: 'Sermons' },
    { href: '/events',   label: 'Events' },
    { href: '/gallery',  label: 'Gallery' },
    { href: '/articles', label: 'Articles' },
    { href: '/contact',  label: 'Contact' },
  ],
  resources: [
    { href: '/resources', label: 'Resources' },
    { href: '/history',   label: 'Our History' },
    { href: '/youth',     label: 'Youth Ministry' },
    { href: '/prayers',   label: 'Prayer Requests' },
  ],
};

const navCards = [
  {
    icon: Navigation,
    title: 'Times & Locations',
    desc: 'We have a campus near you',
    href: '/contact',
  },
  {
    icon: Users,
    title: 'Find Community',
    desc: 'There is a place for you to belong',
    href: '/about',
  },
  {
    icon: Play,
    title: 'Watch a Message',
    desc: 'Browse our past messages',
    href: '/sermons',
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative">
      {/* ── Overlapping 3-column Nav Card ─────────────────────────── */}
      <div className="relative z-20 px-4 sm:px-8 md:px-20 -mb-8">
        <div
          className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(30,30,60,0.97) 0%, rgba(10,20,45,0.98) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.08) inset',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {navCards.map(({ icon: Icon, title, desc, href }, i) => (
              <Link
                key={i}
                href={href}
                className="flex items-center gap-5 px-8 py-7 hover:bg-white/5 transition-all group"
              >
                {/* Icon bubble */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/10 border border-white/15 group-hover:bg-gold/20 group-hover:border-gold/40 transition-all duration-300 shadow-lg">
                  <Icon size={20} className="text-white/70 group-hover:text-gold transition-colors duration-300" />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-base leading-tight group-hover:text-gold transition-colors duration-200">
                    {title}
                  </p>
                  <p className="text-white/45 text-xs mt-0.5 leading-snug">{desc}</p>
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
        className="relative overflow-hidden bg-[#075e54] text-gray-300 rounded-tl-[60px] md:rounded-tl-[100px] rounded-tr-[60px] md:rounded-tr-[100px] min-h-screen flex flex-col justify-between"
      >
        {/* Watermark + grid bg */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/[0.03] font-black text-[6rem] md:text-[10rem] whitespace-nowrap tracking-tighter">
            SDA CHURCH
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
          {/* Top glow to blend with overlap card */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#075e54]/80 to-transparent" />
        </div>

        {/* Content — padded generously from the top for the overlap card */}
        <div className="relative z-10 container-custom pt-20 pb-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-t border-white/5 pt-10 mb-10">

            {/* Brand */}
            <div className="lg:col-span-3">
              <div className="flex flex-col items-start gap-3 mb-4">
                <div className="relative w-32 h-14 rounded-xl bg-white shadow-md overflow-hidden p-1">
                  <Image 
                    src="/images/logo.png" 
                    alt="Varadharajapuram SDA Church Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">Varadharajapuram CSDA Church</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400 mb-8 max-w-xs">
                Dedicated to sharing the everlasting gospel and serving the local community with grace and compassion.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all group" aria-label="Facebook">
                  <Facebook size={18} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 transition-all group" aria-label="YouTube">
                  <Youtube size={18} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="mailto:info@sdachurchvaradharajapuram.com" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-600 transition-all group" aria-label="Email">
                  <Mail size={18} className="text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest font-sans">Quick Links</h3>
              <ul className="space-y-3">
                {footerLinks.pages.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest font-sans">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Map */}
            <div className="lg:col-span-5">
              <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest font-sans">Visit Us</h3>
              <div className="space-y-3 mb-5">
                <div className="flex gap-3 text-sm text-gray-400">
                  <MapPin size={18} className="text-white/70 shrink-0 mt-0.5" />
                  <span>332J+4FP, Varadharajapuram, Poonamallee, Tamil Nadu 600123, India.</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex gap-3 text-sm text-gray-400">
                    <Phone size={18} className="text-white/70 shrink-0" />
                    <a href="tel:+919962589089" className="hover:text-white transition-colors">+91 99625 89089</a>
                  </div>
                </div>
              </div>

              {/* Map */}
              <a
                href="https://www.google.com/maps?q=13.0503,80.0812"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden border border-white/10 h-36 bg-white/5 relative group cursor-pointer shadow-2xl"
              >
                <iframe
                  title="Church Location"
                  src="https://maps.google.com/maps?q=13.0503,80.0812&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)', pointerEvents: 'none' }}
                  loading="lazy"
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all flex items-center justify-center">
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 flex items-center gap-2 text-white text-xs font-bold shadow-2xl">
                    <MapPin size={16} className="text-white" />
                    View Larger Map
                  </div>
                </div>
              </a>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col items-center justify-center gap-3 text-gray-400">
            <div className="text-sm font-medium text-center">
              © {currentYear} Varadharajapuram CSDA Church. All rights reserved.
            </div>
            <div className="flex items-center justify-center text-sm">
              <a href="mailto:info@sdachurchvaradharajapuram.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={16} className="text-white/70" />
                <span>info@sdachurchvaradharajapuram.com</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
