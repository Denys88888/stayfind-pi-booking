import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from '@/i18n';
import type { PaymentDTO } from '@/hooks/usePiAuth';

interface IncompletePaymentDialogProps {
  payment: PaymentDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (payment: PaymentDTO) => void;
  onDismiss: () => void;
}

export default function IncompletePaymentDialog({
  payment,
  open,
  onOpenChange,
  onComplete,
  onDismiss,
}: IncompletePaymentDialogProps) {
  const { t } = useTranslation();
  if (!payment) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md rounded-2xl border-[#E2E6EC]">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FEF2F0] flex items-center justify-center shrink-0">
              <AlertCircle size={16} className="text-[#E85D4A]" />
            </div>
            <AlertDialogTitle className="font-display text-lg font-semibold text-[#1A2B47]">
              {t('common.error')}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="font-body text-sm text-[#7A8494] mt-2">
            {t('checkout.processing')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Payment Details Card */}
        <div className="mt-2 rounded-xl bg-[#F8F9FB] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
              {t('checkout.total')}
            </span>
            <span className="font-body text-sm font-semibold text-[#1A2B47] flex items-center gap-1">
              <span className="text-[#E85D4A] font-bold text-xs">π</span>
              {payment.amount} π
            </span>
          </div>
          {payment.memo && (
            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
                {t('checkout.specialRequests')}
              </span>
              <span className="font-body text-sm text-[#4A5468] text-right max-w-[200px] truncate">
                {payment.memo}
              </span>
            </div>
          )}
          {payment.identifier && (
            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
                {t('checkout.piTransaction')}
              </span>
              <span className="font-body text-xs text-[#4A5468] font-mono truncate max-w-[160px]">
                {payment.identifier}
              </span>
            </div>
          )}
          {payment.status && (
            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
                {t('profile.status')}
              </span>
              <span className="font-body text-xs font-medium px-2 py-0.5 rounded-full bg-[#E8A838]/15 text-[#B07D1A]">
                {payment.status.developer_approved ? t('checkout.paid') : t('checkout.processing')}
              </span>
            </div>
          )}
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            onClick={onDismiss}
            className="rounded-xl border-[#E2E6EC] font-body text-sm text-[#4A5468] hover:bg-[#F8F9FB] hover:text-[#E85D4A]"
          >
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onComplete(payment)}
            className="rounded-xl bg-[#E85D4A] hover:bg-[#D14A38] text-white font-body text-sm font-semibold"
          >
            {t('checkout.payBtn').replace('{amount}', String(payment.amount))}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
