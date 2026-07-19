import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePiAuth } from '@/hooks/usePiAuth';
import { useTranslation } from '@/i18n';
import LanguageSwitcher from './LanguageSwitcher';

/* ─── Pi Logo SVG ─── */
function PiLogo({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="16" fill="currentColor" />
      <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">π</text>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isSandbox, authenticate, signOut } = usePiAuth();
  const { t } = useTranslation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: t('navbar.search'), path: '/search' },
    { label: t('navbar.destinations'), path: '/search' },
    { label: t('navbar.deals'), path: '/search' },
  ];

  const isOverHero = isHome && !scrolled && !isSandbox;

  return (
    <>
      {/* Sandbox Mode Banner */}
      {isSandbox && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-[#E8A838] text-[#0F1B2E] px-4 py-1.5 text-center">
          <div className="flex items-center justify-center gap-2 font-body text-xs font-semibold">
            <AlertTriangle size={14} />
            Pi Sandbox — Testing Mode
          </div>
        </div>
      )}

      <nav
        className={cn(
          'fixed left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300',
          isSandbox ? 'top-[30px]' : 'top-0',
          isOverHero
            ? 'bg-transparent text-white'
            : 'bg-white/90 backdrop-blur-xl border-b border-[#E2E6EC] text-[#243B5D]'
        )}
      >
        <div className="max-w-[1280px] mx-auto w-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0 shrink-0">
            <span
              className={cn(
                'font-display text-2xl font-normal',
                isOverHero ? 'text-white' : 'text-[#0F1B2E]'
              )}
            >
              Stay
            </span>
            <span
              className={cn(
                'font-display text-2xl font-bold',
                isOverHero ? 'text-white' : 'text-[#0F1B2E]'
              )}
            >
              Find
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path + link.label}
                to={link.path}
                className={cn(
                  'font-body text-sm font-medium uppercase tracking-[0.04em] transition-colors duration-200',
                  isOverHero
                    ? 'text-white/90 hover:text-white'
                    : 'text-[#243B5D] hover:text-[#E85D4A]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher variant={isOverHero ? 'navbar' : 'compact'} className={isOverHero ? 'text-white' : 'text-[#243B5D]'} />
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/profile"
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg font-body text-sm font-medium',
                    isOverHero
                      ? 'text-white'
                      : 'text-[#1A2B47]'
                  )}
                >
                  <User size={16} className="shrink-0" />
                  <span>@{user.username}</span>
                  {isSandbox && (
                    <span className="ml-1 px-1.5 py-0.5 rounded bg-[#E8A838]/20 text-[#B07D1A] text-[10px] font-bold uppercase">
                      Sandbox
                    </span>
                  )}
                </Link>
                <button
                  onClick={signOut}
                  className={cn(
                    'px-4 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200',
                    isOverHero
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-[#7A8494] hover:bg-[#F8F9FB] hover:text-[#E85D4A]'
                  )}
                >
                  {t('navbar.signOut')}
                </button>
              </>
            ) : (
              <button
                onClick={() => authenticate()}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200',
                  isOverHero
                    ? 'text-white hover:bg-white/10'
                    : 'text-[#1A2B47] hover:bg-[#F8F9FB] hover:text-[#E85D4A]'
                )}
              >
                <PiLogo className={isOverHero ? 'text-white' : 'text-[#E85D4A]'} />
                {t('navbar.signIn')}
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className={isOverHero ? 'text-white' : 'text-[#0F1B2E]'} size={24} />
            ) : (
              <Menu className={isOverHero ? 'text-white' : 'text-[#0F1B2E]'} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="absolute top-[72px] left-0 right-0 bg-white border-b border-[#E2E6EC] shadow-lg md:hidden">
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path + link.label}
                  to={link.path}
                  className="font-body text-base font-medium text-[#1A2B47] hover:text-[#E85D4A] py-2"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-[#E2E6EC]" />
              {/* Mobile Language Switcher */}
              <div className="py-2">
                <LanguageSwitcher variant="compact" />
              </div>
              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 font-body text-base font-medium text-[#1A2B47] py-2"
                  >
                    <User size={18} />
                    <span>@{user.username}</span>
                    {isSandbox && (
                      <span className="ml-1 px-1.5 py-0.5 rounded bg-[#E8A838]/20 text-[#B07D1A] text-[10px] font-bold uppercase">
                        Sandbox
                      </span>
                    )}
                  </Link>
                  {user.username.toLowerCase() === 'cherry19899' && (
                    <Link
                      to="/admin"
                      className="font-body text-base font-medium text-[#6366f1] py-2"
                    >
                      ⚙️ Admin
                    </Link>
                  )}
                  <button
                    onClick={signOut}
                    className="font-body text-base font-medium text-[#7A8494] py-2 text-left hover:text-[#E85D4A] transition-colors"
                  >
                    {t('navbar.signOut')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => authenticate()}
                  className="flex items-center gap-2 font-body text-base font-medium text-[#243B5D] py-2 hover:text-[#E85D4A] transition-colors"
                >
                  <PiLogo className="text-[#E85D4A]" />
                  {t('navbar.signIn')}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
