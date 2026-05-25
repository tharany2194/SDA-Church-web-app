'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, Globe, ChevronDown, User, LogOut } from 'lucide-react';
import { toggleMobileMenu, closeMobileMenu, openLoginModal, setLanguage } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import LogoutConfirmModal from '../auth/LogoutConfirmModal';
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
  const router = useRouter();
  const dispatch = useDispatch();
  const { isMobileMenuOpen, language } = useSelector((s) => s.ui);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [pathname, dispatch]);

  const handleLogout = () => {
    setLogoutModalOpen(true);
    setUserMenuOpen(false);
  };

  const confirmLogout = async () => {
    setLogoutModalOpen(false);
    await dispatch(logout());
    router.replace('/');
  };

  const isHome = pathname === '/';
  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        className={clsx(
          'sticky top-0 z-50 transition-all duration-300',
          transparent
            ? 'bg-transparent'
            : 'bg-white/70 backdrop-blur-md shadow-md'
        )}
      >
        <nav className="container-custom flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-center gap-1.5">
            <div className="relative w-28 h-12 rounded-xl bg-white shadow-md overflow-hidden p-1">
              <Image 
                src="/images/logo.png" 
                alt="Varatharajapuram SDA Church Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className={clsx('font-bold text-xs hidden sm:block leading-tight text-center tracking-wide', transparent ? 'text-white' : 'text-gray-800')}>
              Varadharajapuram
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
                    transparent
                      ? pathname === href
                        ? 'text-white bg-white/20'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      : pathname === href
                        ? 'text-primary-600 bg-primary-50 font-semibold'
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
              className={clsx(
                'flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors',
                transparent
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              )}
              title="Toggle language"
            >
              <Globe size={15} />
              <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <div className="relative flex items-center justify-center p-[4px] rounded-full overflow-hidden shadow-md cursor-pointer group/authbox">
                  {/* Revolving Background Effect around the entire pill */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square w-[300%] pointer-events-none">
                    <div className={clsx(
                      "w-full h-full animate-spin [animation-duration:4s] opacity-90 group-hover/authbox:opacity-100 transition-opacity",
                      transparent 
                        ? "bg-[conic-gradient(from_0deg,transparent_40%,#d4af37_100%)]" 
                        : "bg-[conic-gradient(from_0deg,transparent_40%,#6d28d9_100%)]"
                    )} />
                  </div>

                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={clsx(
                      "relative flex items-center gap-2 sm:gap-2.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full transition-all duration-300 w-full h-full",
                      transparent 
                        ? "bg-black/80 hover:bg-black/90 backdrop-blur-xl" 
                        : "bg-white hover:bg-gray-50/90"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      {/* Deep Blinking glow effect inside the box */}
                      <div className="absolute inset-0 rounded-full animate-ping opacity-40 bg-primary-400 blur-[2px] [animation-duration:2.5s]" />
                      
                      <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-inner group-hover/authbox:scale-105 transition-transform duration-300">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Pulsating Online Dot */}
                      <span className={clsx("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 rounded-full z-10", transparent ? "border-transparent" : "border-white")}></span>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75 z-0 [animation-duration:1.5s]"></span>
                    </div>
                    
                    <div className="hidden sm:flex flex-col items-start leading-none mr-1 relative">
                      <span className={clsx(
                        "text-sm font-bold tracking-tight transition-colors z-10 relative",
                        transparent ? "text-white group-hover/authbox:text-gold" : "text-gray-900 group-hover/authbox:text-primary-700"
                      )}>
                        {user?.name || "User"}
                      </span>
                      <span className={clsx(
                        "text-[9px] uppercase tracking-wider font-bold mt-0.5 animate-pulse z-10 relative",
                        transparent ? "text-white/80" : "text-primary-600"
                      )}>
                        {user?.role?.replace('_', ' ') || "Member"}
                      </span>
                    </div>
                    
                    <ChevronDown size={14} className={clsx(
                      "transition-transform duration-300",
                      userMenuOpen ? "rotate-180" : "rotate-0",
                      transparent ? "text-white/60 group-hover/authbox:text-white" : "text-gray-400 group-hover/authbox:text-primary-600"
                    )} />
                  </button>
                </div>
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
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => dispatch(openLoginModal())}
                className={clsx('hidden sm:flex text-sm py-2 px-3 sm:px-4 rounded-lg font-medium transition-all whitespace-nowrap', transparent ? 'border border-white/40 text-white hover:bg-white/10' : 'btn-primary')}
              >
                {language === 'ta' ? 'உள்நுழை' : 'Sign In'}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className={clsx('lg:hidden p-1.5 sm:p-2 rounded-lg transition-colors', transparent ? 'text-white hover:bg-white/10' : 'hover:bg-gray-100')}
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} className="sm:w-[22px] sm:h-[22px]" /> : <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />}
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
              {!isAuthenticated && (
                <li className="sm:hidden border-t border-gray-100 mt-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(openLoginModal());
                      dispatch(closeMobileMenu());
                    }}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-primary-600 bg-primary-50"
                  >
                    {language === 'ta' ? 'உள்நுழை' : 'Sign In'}
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </header>

      <LogoutConfirmModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}
