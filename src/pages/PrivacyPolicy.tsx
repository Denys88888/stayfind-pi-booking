import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, Eye, Database, Globe, Mail, UserCheck } from 'lucide-react';
import { useTranslation } from '@/i18n';
import Layout from '@/components/Layout';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  const sections = [
    {
      icon: Database,
      title: t('footer.privacy'),
      content:
        'StayFind ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard your personal information when you use our platform.',
    },
    {
      icon: UserCheck,
      title: 'Information We Collect',
      content:
        'We collect information you provide directly (name, email, phone, booking details), information from your Pi Network account (username, wallet address), and automatically collected information (IP address, browser type, usage data).',
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content:
        'We use your information to process bookings, facilitate Pi payments, improve our services, send booking confirmations and updates, and comply with legal obligations.',
    },
    {
      icon: Lock,
      title: 'Data Security',
      content:
        'We implement industry-standard security measures including encryption, secure servers, and regular security audits. All Pi Network transactions are secured by the Pi blockchain.',
    },
    {
      icon: Globe,
      title: 'Data Sharing',
      content:
        'We share information with hotels to process your bookings and with Pi Network for payment processing. We do not sell your personal data to third parties for marketing purposes.',
    },
    {
      icon: Mail,
      title: 'Your Rights',
      content:
        'You have the right to access, correct, or delete your personal information. Contact us at privacy@stayfind.app to exercise these rights.',
    },
  ];

  return (
    <Layout>
      <div className="min-h-[100dvh] bg-[#F8F9FB] pt-[88px]">
        <div className="max-w-[800px] mx-auto px-6 pb-20">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-sm text-[#7A8494] hover:text-[#E85D4A] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            {t('common.cancel')}
          </Link>

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF2F0] flex items-center justify-center">
              <Shield size={24} className="text-[#E85D4A]" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F1B2E]">
              {t('footer.privacy')}
            </h1>
          </div>
          <p className="font-body text-sm text-[#7A8494] mb-10">
            Last updated: January 1, 2026
          </p>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#E2E6EC]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <section.icon size={20} className="text-[#E85D4A]" />
                  <h2 className="font-display text-lg font-semibold text-[#0F1B2E]">
                    {section.title}
                  </h2>
                </div>
                <p className="font-body text-sm text-[#4A5468] leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-8 bg-[#0F1B2E] rounded-2xl p-6 text-center">
            <h3 className="font-display text-lg font-semibold text-white mb-2">
              Questions?
            </h3>
            <p className="font-body text-sm text-white/70 mb-4">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
            <Link
              to="mailto:privacy@stayfind.app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E85D4A] text-white font-body text-sm font-medium rounded-xl hover:bg-[#D14A38] transition-colors"
            >
              <Mail size={16} />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
