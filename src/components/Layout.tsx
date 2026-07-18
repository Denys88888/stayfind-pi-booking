import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import IncompletePaymentDialog from './IncompletePaymentDialog';
import { usePiAuth } from '@/hooks/usePiAuth';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export default function Layout({ children, showFooter = true }: LayoutProps) {
  const { incompletePayment, setIncompletePayment } = usePiAuth();

  const handleComplete = () => {
    /* In production, this would redirect to checkout or resume the payment flow */
    console.log('[IncompletePayment] Completing payment:', incompletePayment);
    setIncompletePayment(null);
  };

  const handleDismiss = () => {
    setIncompletePayment(null);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
      <IncompletePaymentDialog
        payment={incompletePayment}
        open={!!incompletePayment}
        onOpenChange={(open) => {
          if (!open) setIncompletePayment(null);
        }}
        onComplete={handleComplete}
        onDismiss={handleDismiss}
      />
    </div>
  );
}
