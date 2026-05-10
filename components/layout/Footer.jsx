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
    <footer className="bg-church-dark text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold">✝</span>
              </div>
              <span className="text-white font-bold text-lg">Grace Church</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-4">
              A community of faith, hope, and love. Glorifying God through worship, fellowship, and service.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-600 transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors" aria-label="YouTube">
                <Youtube size={16} />
              </a>
              <a href="mailto:info@gracechurch.com" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-600 transition-colors" aria-label="Email">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.pages.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-primary-400 shrink-0 mt-0.5" />
                <span>123 Church Street, City, State 600001</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-primary-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-primary-400 shrink-0" />
                <a href="mailto:info@gracechurch.com" className="hover:text-white transition-colors">info@gracechurch.com</a>
              </li>
            </ul>

            {/* Google Maps placeholder */}
            <div className="mt-4 rounded-lg overflow-hidden border border-white/10 h-32 bg-white/5 flex items-center justify-center">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
              >
                <MapPin size={18} />
                View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {currentYear} Grace Church. All rights reserved.</p>
          <p>Built with love for the Kingdom of God.</p>
        </div>
      </div>
    </footer>
  );
}
