import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function PiLogo({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="16" fill="currentColor" />
      <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">π</text>
    </svg>
  );
}

export default function Footer() {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('footer.aboutUs'),
      links: [
        { label: t('footer.aboutUs'), to: '#' },
        { label: t('footer.careers'), to: '#' },
        { label: t('footer.press'), to: '#' },
      ],
    },
    {
      title: t('footer.support'),
      links: [
        { label: t('footer.helpCenter'), to: '#' },
        { label: t('footer.safety'), to: '#' },
        { label: t('footer.cancellation'), to: '#' },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { label: t('footer.terms'), to: '/terms' },
        { label: t('footer.privacy'), to: '/privacy' },
        { label: t('footer.cookies'), to: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: InstagramIcon, label: 'Instagram' },
    { icon: TwitterIcon, label: 'Twitter' },
    { icon: FacebookIcon, label: 'Facebook' },
    { icon: YoutubeIcon, label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#0F1B2E] pt-20 pb-10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-body text-sm font-semibold text-white uppercase tracking-[0.04em] mb-5">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="font-body text-sm text-[#C5CBD4] hover:text-[#E85D4A] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-0 mb-5">
              <span className="font-display text-xl font-normal text-white">Stay</span>
              <span className="font-display text-xl font-bold text-white">Find</span>
            </Link>
            <p className="font-body text-sm text-[#C5CBD4] mb-5">
              {t('home.popularSubtitle')}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  to="#"
                  className="w-10 h-10 rounded-full bg-[#1A2B47] flex items-center justify-center text-[#C5CBD4] hover:bg-[#E85D4A] hover:text-white transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Pi Network Link */}
        <div className="mt-10 pt-8 border-t border-[#243B5D] flex flex-col sm:flex-row items-center gap-4">
          <a
            href="https://minepi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A2B47] text-[#C5CBD4] hover:text-white hover:bg-[#E85D4A] transition-all duration-200 font-body text-sm"
          >
            <PiLogo size={16} className="text-current" />
            Powered by Pi Network
          </a>
          <p className="font-body text-xs text-[#7A8494]">
            Secure payments on the Pi blockchain
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-[#243B5D] flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0">
            <span className="font-display text-xl font-normal text-white">Stay</span>
            <span className="font-display text-xl font-bold text-white">Find</span>
          </Link>

          <p className="font-body text-xs text-[#7A8494]">
            {t('footer.copyright')}
          </p>

          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                to="#"
                className="text-[#C5CBD4] hover:text-[#E85D4A] transition-colors"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
