'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, Globe, ChevronDown, User, LogOut } from 'lucide-react';
import { toggleMobileMenu, closeMobileMenu, setLanguage } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import clsx from 'clsx';

const navLinks = [
  { href: '/', label: { en: 'Home', ta: 'முகப்பு' } },
  { href: '/about', label: { en: 'About', ta: 'எங்களை பற்றி' } },
  { href: '/sermons', label: { en: 'Sermons', ta: 'பிரசங்கங்கள்' } },
  { href: '/events', label: { en: 'Events', ta: 'நிகழ்வுகள்' } },
  { href: '/gallery', label: { en: 'Gallery', ta: 'படத்தொகுப்பு' } },
  { href: '/articles', label: { en: 'Articles', ta: 'கட்டுரைகள்' } },
  { href: '/contact', label: { en: 'Contact', ta: 'தொடர்பு' } },
];

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isMobileMenuOpen, language } = useSelector((s) => s.ui);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [pathname, dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    setUserMenuOpen(false);
  };

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
      )}
    >
      <nav className="container-custom flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">✝</span>
          </div>
          <span className="font-bold text-xl text-primary-700 hidden sm:block">
            {language === 'ta' ? 'கிருபை திருச்சபை' : 'Grace Church'}
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                )}
              >
                {label[language]}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => dispatch(setLanguage(language === 'en' ? 'ta' : 'en'))}
            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-primary-600 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            title="Toggle language"
          >
            <Globe size={15} />
            <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
                <ChevronDown size={14} className="text-gray-500" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {['super_admin', 'admin', 'editor', 'volunteer'].includes(user?.role) && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={15} /> My Dashboard
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-sm py-2">
              {language === 'ta' ? 'உள்நுழை' : 'Sign In'}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-4 animate-slide-up">
          <ul className="flex flex-col gap-1 pt-2">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={clsx(
                    'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {label[language]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
