import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Check, CreditCard, Ban, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/i18n';
import Layout from '@/components/Layout';

export default function TermsOfService() {
  const { t } = useTranslation();

  const sections = [
    {
      icon: FileText,
      title: t('footer.terms'),
      content:
        'These Terms of Service ("Terms") govern your access to and use of StayFind, operated by StayFind Inc. By using our platform, you agree to these Terms.',
    },
    {
      icon: Check,
      title: 'Acceptance of Terms',
      content:
        'By accessing or using StayFind, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, you may not use our services.',
    },
    {
      icon: CreditCard,
      title: 'Pi Network Payments',
      content:
        'All payments on StayFind are processed through the Pi Network. By making a payment, you authorize us to charge the specified amount in Pi from your Pi wallet. All transactions are final and recorded on the Pi blockchain.',
    },
    {
      icon: Ban,
      title: 'Cancellations & Refunds',
      content:
        'Cancellation policies vary by property and are displayed at checkout. Free cancellation is available until the specified deadline. Refunds, when applicable, are processed in Pi to the original payment wallet.',
    },
    {
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      content:
        'StayFind acts as an intermediary between travelers and accommodation providers. We are not liable for the quality of accommodations, but we will assist in resolving disputes between users and properties.',
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
              <FileText size={24} className="text-[#E85D4A]" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F1B2E]">
              {t('footer.terms')}
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
              If you have any questions about these Terms, please contact us.
            </p>
            <Link
              to="mailto:support@stayfind.app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E85D4A] text-white font-body text-sm font-medium rounded-xl hover:bg-[#D14A38] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
