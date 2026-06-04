import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  const columns = [
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Blog', 'Sustainability'],
    },
    {
      title: 'Support',
      links: ['Help Center', 'Safety Information', 'Cancellation Options', 'Coronavirus FAQ'],
    },
    {
      title: 'Discover',
      links: ['Destinations', 'Property Types', 'Travel Guides', 'Seasonal Deals', 'Partner Program'],
    },
    {
      title: 'Legal',
      links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Accessibility'],
    },
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Facebook, label: 'Facebook' },
    { icon: Youtube, label: 'YouTube' },
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
                  <li key={link}>
                    <Link
                      to="#"
                      className="font-body text-sm text-[#C5CBD4] hover:text-[#E85D4A] transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#243B5D] flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0">
            <span className="font-display text-xl font-normal text-white">Stay</span>
            <span className="font-display text-xl font-bold text-white">Find</span>
          </Link>

          <p className="font-body text-xs text-[#7A8494]">
            &copy; 2025 StayFind. All rights reserved.
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
    </footer>
  );
}
