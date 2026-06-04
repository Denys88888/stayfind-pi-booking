import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight, FileText } from 'lucide-react';
import Layout from '@/components/Layout';

const easeSmooth = [0.4, 0, 0.2, 1] as [number, number, number, number];

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: `By accessing or using StayFind ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Platform. These Terms constitute a legally binding agreement between you and StayFind Inc.

We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on the Platform and updating the "Last Updated" date. Your continued use of the Platform after such changes constitutes your acceptance of the modified Terms.`
  },
  {
    id: 'services',
    title: 'Description of Services',
    content: `StayFind is a hotel booking platform that enables users to discover, compare, and reserve accommodations worldwide using Pi Network cryptocurrency as a payment method.

The Platform provides:
• Access to a curated marketplace of hotels, resorts, vacation rentals, and other accommodations
• Real-time availability and pricing information
• Secure payment processing through the Pi Network blockchain
• Booking management tools for travelers
• Host dashboards for property managers

StayFind acts as an intermediary between guests and accommodation providers. We do not own, operate, or control any listed properties.`
  },
  {
    id: 'eligibility',
    title: 'User Eligibility and Accounts',
    content: `To use StayFind, you must:
• Be at least 18 years of age
• Have the legal capacity to enter into binding contracts
• Possess a valid Pi Network account in good standing
• Provide accurate, current, and complete information during registration

You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.`
  },
  {
    id: 'payments',
    title: 'Payments and Pi Network',
    content: `StayFind accepts payments exclusively through Pi Network cryptocurrency. All prices displayed on the Platform are denominated in Pi (π) and represent the total amount payable for the booking.

Payment Processing:
• Payments are processed on the Pi Network blockchain
• Transaction fees may apply and are displayed before confirmation
• Exchange rates between Pi and fiat currencies are approximate and provided for reference only
• All Pi transactions are final and irreversible once confirmed on the blockchain

Payment Authorization:
By initiating a booking, you authorize StayFind to charge your Pi Wallet the total amount due. You confirm that you have sufficient Pi balance to complete the transaction.`
  },
  {
    id: 'bookings',
    title: 'Booking Terms',
    content: `When you make a booking through StayFind, you enter into a direct contractual relationship with the accommodation provider. StayFind facilitates the transaction but is not a party to the accommodation agreement.

Confirmation:
• A booking is confirmed only after payment is successfully processed on the Pi Network
• You will receive a confirmation email with your booking reference number
• The confirmation email serves as proof of reservation

Check-in Requirements:
• You must present a valid government-issued photo ID at check-in
• The name on the reservation must match the name on the ID
• Some properties may require a credit card for incidental charges`
  },
  {
    id: 'cancellations',
    title: 'Cancellations and Refunds',
    content: `Cancellation policies vary by property and are clearly displayed on each listing before booking. By completing a booking, you agree to the specific cancellation policy applicable to that reservation.

Refund Processing:
• Refunds are issued in Pi cryptocurrency to the original payment wallet
• Refund amounts are determined by the property's cancellation policy
• Processing times may vary depending on Pi Network confirmation speeds
• StayFind reserves the right to retain service fees in the event of cancellation

No-show Policy:
If you fail to check in on the scheduled arrival date without prior cancellation, the property may charge the full reservation amount. No refunds will be issued for no-shows unless covered by the property's specific policy.`
  },
  {
    id: 'host-obligations',
    title: 'Host Obligations',
    content: `Accommodation providers listing on StayFind agree to:
• Maintain accurate and up-to-date property information, including photos, amenities, and availability
• Honor all confirmed bookings at the stated price and conditions
• Provide accommodations that match the description and standards advertised
• Respond to guest inquiries in a timely and professional manner
• Comply with all applicable laws, regulations, and tax obligations

StayFind reserves the right to remove listings that violate these obligations or receive consistent negative feedback.`
  },
  {
    id: 'prohibited',
    title: 'Prohibited Conduct',
    content: `You agree not to:
• Use the Platform for any unlawful purpose or in violation of any applicable law
• Create false or misleading listings or reviews
• Circumvent StayFind's payment system or attempt to transact off-platform
• Use automated systems, bots, or scrapers to access the Platform
• Harass, abuse, or harm other users
• Upload malicious code, viruses, or harmful content
• Impersonate any person or entity

Violation of these prohibitions may result in immediate account termination and legal action.`
  },
  {
    id: 'intellectual',
    title: 'Intellectual Property',
    content: `All content on the StayFind Platform, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of StayFind Inc. or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.

You are granted a limited, non-exclusive, non-transferable license to access and use the Platform for personal, non-commercial purposes. You may not reproduce, distribute, modify, create derivative works from, or exploit any content without prior written consent.`
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by applicable law, StayFind Inc. and its officers, directors, employees, and agents shall not be liable for:
• Any indirect, incidental, special, consequential, or punitive damages
• Loss of profits, data, or goodwill
• Service interruptions or platform unavailability
• The acts, omissions, or negligence of accommodation providers
• Personal injury or property damage occurring at listed properties
• Any disputes between guests and hosts

In no event shall our total liability exceed the amount paid by you for the specific booking giving rise to the claim.`
  },
  {
    id: 'disputes',
    title: 'Dispute Resolution',
    content: `Any dispute arising from these Terms or your use of the Platform shall first be addressed through good-faith negotiation between the parties.

If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the International Chamber of Commerce (ICC). Arbitration shall take place in Delaware, USA, and shall be conducted in English.

You agree that any arbitration will be conducted on an individual basis and not as a class action. You waive any right to participate in class or representative proceedings.`
  },
  {
    id: 'termination',
    title: 'Termination',
    content: `StayFind reserves the right to suspend or terminate your account and access to the Platform at any time, with or without cause, and with or without notice.

Upon termination:
• All licenses granted to you will immediately cease
• You remain liable for all outstanding payments and obligations
• Sections of these Terms that by their nature should survive termination shall remain in effect

You may terminate your account at any time by contacting support. Termination does not relieve you of obligations incurred prior to termination.`
  },
  {
    id: 'contact',
    title: 'Contact Information',
    content: `If you have any questions about these Terms, please contact us:

StayFind Inc.
Email: legal@stayfind.app
Address: 123 Blockchain Avenue, Suite 400, Wilmington, DE 19801, USA

We aim to respond to all inquiries within 48 business hours.`
  },
];

export default function TermsOfService() {
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
              <div className="w-10 h-10 rounded-xl bg-[#FEF2F0] flex items-center justify-center">
                <FileText size={20} className="text-[#E85D4A]" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-semibold text-[#0F1B2E]">
                  Terms of Service
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
                          ? 'bg-[#FEF2F0] text-[#E85D4A] font-medium'
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
