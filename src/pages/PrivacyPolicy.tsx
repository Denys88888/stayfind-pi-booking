import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Shield } from 'lucide-react';
import Layout from '@/components/Layout';

const easeSmooth = [0.4, 0, 0.2, 1] as [number, number, number, number];

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: `StayFind Inc. ("StayFind", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our hotel booking platform ("the Platform").

By using StayFind, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use the Platform.

This policy applies to all users of the Platform, including guests booking accommodations and hosts listing properties.`
  },
  {
    id: 'collection',
    title: 'Data We Collect',
    content: `We collect the following types of information:

Personal Information:
• Full name and contact details (email address, phone number)
• Government-issued identification (for verification and check-in purposes)
• Date of birth
• Pi Network username and wallet address
• Payment transaction history on the Pi Network blockchain

Booking Information:
• Accommodation preferences and search history
• Booking details (dates, destinations, guest counts)
• Special requests and accessibility requirements
• Reviews and ratings you submit

Technical Information:
• IP address and device identifiers
• Browser type and operating system
• Usage data and interaction with the Platform
• Cookies and similar tracking technologies`
  },
  {
    id: 'usage',
    title: 'How We Use Your Data',
    content: `We use the information we collect for the following purposes:

Providing Services:
• Processing and managing your bookings
• Facilitating payments through Pi Network
• Communicating booking confirmations and updates
• Providing customer support

Improving the Platform:
• Analyzing usage patterns to enhance user experience
• Personalizing search results and recommendations
• Detecting and preventing fraud and abuse
• Conducting research and analytics

Communications:
• Sending transactional emails (bookings, cancellations, reminders)
• Marketing communications (with your consent)
• Responding to inquiries and support requests
• Notifying you of policy changes or platform updates`
  },
  {
    id: 'sharing',
    title: 'Data Sharing and Disclosure',
    content: `We do not sell your personal information. We may share your data in the following circumstances:

With Accommodation Providers:
• Your name, contact details, and booking information are shared with the property to fulfill your reservation
• Special requests are forwarded to ensure your needs are met

With Service Providers:
• We engage trusted third-party vendors for hosting, analytics, customer support, and fraud prevention
• All vendors are contractually bound to protect your data

Legal Requirements:
• We may disclose information if required by law, regulation, or legal process
• To protect our rights, property, or safety, or that of our users
• In connection with a merger, acquisition, or sale of assets

With Your Consent:
• We may share information with third parties when you explicitly authorize us to do so`
  },
  {
    id: 'pi-network',
    title: 'Pi Network Data',
    content: `StayFind integrates with Pi Network for authentication and payments. When you use Pi-related features:

Authentication Data:
• We receive your Pi Network username and a unique identifier
• We do not have access to your Pi Wallet private keys or password

Payment Data:
• All Pi transactions are recorded on the public Pi Network blockchain
• We collect transaction IDs, amounts, timestamps, and wallet addresses
• This data is used to verify payments and process refunds

Pi Network's Privacy Practices:
• Pi Network's collection and use of your data is governed by Pi Network's own privacy policy
• We encourage you to review Pi Network's privacy policy at minepi.com
• StayFind is not responsible for Pi Network's data practices`
  },
  {
    id: 'cookies',
    title: 'Cookies and Tracking',
    content: `StayFind uses cookies and similar technologies to enhance your experience:

Types of Cookies We Use:
• Essential cookies: Required for the Platform to function properly
• Preference cookies: Remember your settings and preferences
• Analytics cookies: Help us understand how users interact with the Platform
• Marketing cookies: Used to deliver relevant advertisements

Managing Cookies:
• You can manage cookie preferences through your browser settings
• Most browsers allow you to refuse or delete cookies
• Disabling certain cookies may limit Platform functionality

Third-Party Tracking:
• We use analytics services that may set cookies to track usage patterns
• These services collect aggregated data and do not identify individual users`
  },
  {
    id: 'security',
    title: 'Data Security',
    content: `We implement industry-standard security measures to protect your information:

Technical Safeguards:
• SSL/TLS encryption for all data transmission
• Secure server infrastructure with regular security audits
• Access controls and authentication mechanisms

Organizational Measures:
• Employee training on data protection practices
• Limited access to personal data on a need-to-know basis
• Regular security assessments and penetration testing

Blockchain Security:
• Pi Network payments benefit from blockchain security properties
• Transaction data is immutable and transparent on the Pi Network
• We never store Pi Wallet private keys

No method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.`
  },
  {
    id: 'retention',
    title: 'Data Retention',
    content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy:

Active Accounts:
• Personal data is retained while your account is active
• Booking history is maintained for customer service and legal compliance

Deleted Accounts:
• Upon account deletion, we initiate a secure deletion process
• Some data may be retained for legal, tax, or regulatory requirements
• Anonymized data may be retained for analytics purposes

Specific Retention Periods:
• Booking records: 7 years (for tax and legal compliance)
• Marketing data: Until you withdraw consent
• Server logs: 90 days`
  },
  {
    id: 'rights',
    title: 'Your Rights',
    content: `Depending on your jurisdiction, you may have the following rights regarding your personal data:

Access and Portability:
• Request a copy of the personal data we hold about you
• Receive your data in a structured, machine-readable format

Correction:
• Request correction of inaccurate or incomplete data
• Update your profile information through your account settings

Deletion:
• Request deletion of your personal data
• Certain legal obligations may prevent immediate deletion

Objection and Restriction:
• Object to processing based on legitimate interests
• Request restriction of processing in certain circumstances

Withdrawing Consent:
• You may withdraw consent for marketing communications at any time
• Withdrawing consent does not affect the lawfulness of prior processing

To exercise your rights, contact us at privacy@stayfind.app.`
  },
  {
    id: 'children',
    title: "Children's Privacy",
    content: `StayFind is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18.

If we become aware that we have inadvertently collected data from a child under 18, we will take steps to delete such information as soon as possible.

Parents or guardians who believe their child has provided us with personal information should contact us at privacy@stayfind.app.`
  },
  {
    id: 'international',
    title: 'International Data Transfers',
    content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.

We ensure appropriate safeguards are in place for international transfers:
• Standard contractual clauses approved by relevant authorities
• Adequacy decisions where applicable
• Data processing agreements with all service providers

By using the Platform, you consent to the transfer of your information to countries that may not provide the same level of data protection as your jurisdiction.`
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements.

We will notify you of material changes by:
• Posting the updated policy on the Platform
• Updating the "Last Updated" date at the top of this policy
• Sending an email notification for significant changes

Your continued use of the Platform after changes take effect constitutes acceptance of the revised policy.`
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

StayFind Inc.
Email: privacy@stayfind.app
Address: 123 Blockchain Avenue, Suite 400, Wilmington, DE 19801, USA
Data Protection Officer: dpo@stayfind.app

We aim to respond to all privacy-related inquiries within 48 business hours.`
  },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -70% 0px' }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <div className="pt-[88px] pb-20 min-h-[100dvh] bg-white">
        {/* Header */}
        <div className="border-b border-[#E2E6EC]">
          <div className="max-w-[1280px] mx-auto px-6 py-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: easeSmooth }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F0F7FF] flex items-center justify-center">
                <Shield size={20} className="text-[#4A90D9]" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-semibold text-[#0F1B2E]">
                  Privacy Policy
                </h1>
                <p className="font-body text-sm text-[#7A8494] mt-0.5">
                  Last updated: June 15, 2025
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 py-10">
          <div className="flex gap-12">
            {/* Table of Contents — Desktop */}
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: easeSmooth }}
              className="hidden lg:block w-72 shrink-0"
            >
              <div className="sticky top-[100px]">
                <h2 className="font-body text-xs font-semibold text-[#7A8494] uppercase tracking-[0.08em] mb-4">
                  Table of Contents
                </h2>
                <nav className="flex flex-col gap-1">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`text-left font-body text-sm px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                        activeSection === s.id
                          ? 'bg-[#F0F7FF] text-[#4A90D9] font-medium'
                          : 'text-[#4A5468] hover:bg-[#F8F9FB] hover:text-[#1A2B47]'
                      }`}
                    >
                      {activeSection === s.id ? (
                        <ChevronRight size={14} className="shrink-0" />
                      ) : (
                        <Check size={14} className="shrink-0 text-[#C5CBD4]" />
                      )}
                      <span className="line-clamp-1">{s.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.aside>

            {/* Content */}
            <div className="flex-1 max-w-[720px]">
              {sections.map((s, idx) => (
                <motion.section
                  key={s.id}
                  id={s.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * idx, duration: 0.4, ease: easeSmooth }}
                  className="mb-10 scroll-mt-[100px]"
                >
                  <h2 className="font-display text-xl font-semibold text-[#1A2B47] mb-3">
                    {s.title}
                  </h2>
                  <div className="font-body text-sm text-[#4A5468] leading-relaxed whitespace-pre-line">
                    {s.content}
                  </div>
                </motion.section>
              ))}

              {/* Back to Home */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 pt-8 border-t border-[#E2E6EC]"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 font-body text-sm text-[#E85D4A] hover:underline"
                >
                  <ChevronRight size={16} className="rotate-180" />
                  Back to Home
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
