import Link from 'next/link';
import { Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  pages: [
    { href: '/about', label: 'About Us' },
    { href: '/sermons', label: 'Sermons' },
    { href: '/events', label: 'Events' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/articles', label: 'Articles' },
    { href: '/contact', label: 'Contact' },
  ],
  resources: [
    { href: '/resources', label: 'Resources' },
    { href: '/history', label: 'Our History' },
    { href: '/youth', label: 'Youth Ministry' },
    { href: '/prayers', label: 'Prayer Requests' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#075e54] text-gray-300">
      {/* Background Parallax Watermark */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div 
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/[0.03] font-black text-[6rem] md:text-[10rem] whitespace-nowrap tracking-tighter transition-transform duration-700 ease-out"
          style={{ transform: 'translateX(-50%) translateY(0)' }}
        >
          SDA CHURCH
        </div>
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
      </div>

      <div className="relative z-10 container-custom pt-6 pb-4">
        {/* Existing Grid (Modernized) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 border-t border-white/5 pt-6 mb-6">
          {/* Brand & Socials */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-xl">✝</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Varadharajapuram SDA</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-8 max-w-xs">
              Dedicated to sharing the everlasting gospel and serving the local community with grace and compassion.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366] transition-all group" aria-label="Facebook">
                <Facebook size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 transition-all group" aria-label="YouTube">
                <Youtube size={18} className="text-gray-400 group-hover:text-white" />
              </a>
              <a href="mailto:info@gracechurch.com" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366] transition-all group" aria-label="Email">
                <Mail size={18} className="text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest font-sans">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.pages.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest font-sans">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Map */}
          <div className="lg:col-span-5">
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest font-sans">Visit Us</h3>
            <div className="space-y-3 mb-4">
              <div className="flex gap-3 text-sm text-gray-400">
                <MapPin size={18} className="text-white/70 shrink-0" />
                <span>332J+4FP, Varadharajapuram, Poonamallee, Tamil Nadu 600123, India.</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex gap-3 text-sm text-gray-400">
                  <Phone size={18} className="text-white/70 shrink-0" />
                  <a href="tel:+919962589089" className="hover:text-white transition-colors">+91 99625 89089</a>
                </div>
                <div className="flex gap-3 text-sm text-gray-400">
                  <Mail size={18} className="text-white/70 shrink-0" />
                  <a href="mailto:info@sdachurchvaradharajapuram.com" className="hover:text-white transition-colors text-[11px] sm:text-sm">info@sdachurchvaradharajapuram.com</a>
                </div>
              </div>
            </div>

            {/* Google Maps Embed - Clickable Box */}
            <a
              href="https://www.google.com/maps?q=13.0503,80.0812"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden border border-white/10 h-24 bg-white/5 relative group cursor-pointer shadow-2xl"
            >
              <iframe
                title="Church Location"
                src="https://maps.google.com/maps?q=13.0503,80.0812&z=15&output=embed"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)',
                  pointerEvents: 'none'
                }}
                loading="lazy"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              ></iframe>
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
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
          <div className="text-sm font-medium">
            © {currentYear} Varadharajapuram SDA Church. All rights reserved.
          </div>
          
          <div className="hidden md:block"></div>

          <div className="flex items-center gap-6 text-sm">
            <a href="mailto:info@sdachurchvaradharajapuram.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={16} className="text-white/70" />
              <span>info@sdachurchvaradharajapuram.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
