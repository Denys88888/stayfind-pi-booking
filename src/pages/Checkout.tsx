import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Check,
  Shield,
  Lock,
  Copy,
  Download,
  Calendar,
  AlertCircle,
  MapPin,
  Star,
  Users,
  Bed,
  Wallet,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePiAuth } from '@/hooks/usePiAuth';
import {
  createPiPayment,
  usdToPi,
  formatPiAmount,
} from '@/lib/piPayments';

/* ─── easing token ─── */

/* ─── Pi conversion rate for reference ─── */
const PI_RATE = 0.15;

/* ─── mock booking data ─── */
const bookingData = {
  hotelName: 'The Grand Palace Hotel',
  roomType: 'Deluxe King Room',
  image: '/hotel-1.jpg',
  rating: 9.4,
  reviews: 1240,
  checkIn: 'Dec 15, 2025',
  checkOut: 'Dec 22, 2025',
  nights: 7,
  guests: '2 Adults',
  pricePerNight: 285,
  taxes: 299,
  discount: 200,
  total: 2094,
  cancellationDate: 'Dec 13',
  address: '123 Luxury Avenue, Paris, France',
};

/* ─── Pi prices ─── */
const piSubtotal = usdToPi(bookingData.pricePerNight * bookingData.nights);
const piTaxes = usdToPi(bookingData.taxes);
const piDiscount = usdToPi(bookingData.discount);
const piTotal = usdToPi(bookingData.total);

/* ─── form error type ─── */
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  terms?: string;
}

/* ─── Pi Logo SVG ─── */
function PiLogoPay({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <circle cx="16" cy="16" r="16" fill="white" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fill="#E85D4A"
        fontSize="16"
        fontWeight="bold"
      >
        π
      </text>
    </svg>
  );
}

/* ─── Progress Bar Component ─── */
function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = ['Your Details', 'Pi Payment', 'Confirmation'];

  return (
    <div className="w-full max-w-[500px] mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Connecting lines */}
        <div className="absolute top-[15px] left-[16px] right-[16px] h-[2px] bg-[#E2E6EC] z-0">
          <div
            className="h-full bg-[#E85D4A]"          />
        </div>

        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;

          return (
            <div
              key={label}
              className="flex flex-col items-center gap-2 relative z-10"
            >
              <div                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300',
                  isCompleted
                    ? 'bg-[#2D9F5E] text-white'
                    : isActive
                      ? 'bg-[#E85D4A] text-white'
                      : 'bg-[#E2E6EC] text-[#7A8494]'
                )}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  isCompleted
                    ? 'text-[#2D9F5E]'
                    : isActive
                      ? 'text-[#E85D4A]'
                      : 'text-[#7A8494]'
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Property Summary Strip ─── */
function PropertySummaryStrip() {
  return (
    <div      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-5 p-4 bg-[#F8F9FB] rounded-xl"
    >
      <img
        src={bookingData.image}
        alt={bookingData.hotelName}
        className="w-16 h-16 rounded-lg object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-body text-sm font-semibold text-[#1A2B47]">
          {bookingData.hotelName}
        </h3>
        <p className="font-body text-sm text-[#7A8494]">
          {bookingData.roomType}
        </p>
        <p className="font-body text-sm text-[#7A8494]">
          {bookingData.checkIn} – {bookingData.checkOut} · {bookingData.nights}{' '}
          nights
        </p>
      </div>
      <div className="font-body text-sm text-[#7A8494] shrink-0">
        <Users size={14} className="inline mr-1" />
        {bookingData.guests}
      </div>
    </div>
  );
}

/* ─── Booking Summary Sidebar ─── */
function BookingSummarySidebar() {
  return (
    <div      className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(15,27,46,0.06)]"
    >
      <img
        src={bookingData.image}
        alt={bookingData.hotelName}
        className="w-full aspect-video object-cover rounded-xl"
      />
      <h3 className="font-display text-lg font-semibold text-[#1A2B47] mt-3">
        {bookingData.hotelName}
      </h3>
      <div className="flex items-center gap-1 mt-1">
        <Star size={14} className="text-[#E8A838] fill-[#E8A838]" />
        <span className="font-body text-sm text-[#7A8494]">
          {bookingData.rating} Wonderful · {bookingData.reviews.toLocaleString()}{' '}
          reviews
        </span>
      </div>

      <div className="mt-5 space-y-2">
        {[
          { label: 'Check-in', value: bookingData.checkIn },
          { label: 'Check-out', value: bookingData.checkOut },
          { label: 'Nights', value: `${bookingData.nights} nights` },
          { label: 'Guests', value: bookingData.guests },
          { label: 'Room', value: bookingData.roomType },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between py-2 border-b border-[#F0F2F5] last:border-0"
          >
            <span className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
              {row.label}
            </span>
            <span className="font-body text-sm text-[#4A5468]">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-[#E2E6EC]">
        <h4 className="font-display text-base font-semibold text-[#1A2B47] mb-3">
          Price Summary
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-body text-sm text-[#7A8494]">
              ${bookingData.pricePerNight} × {bookingData.nights} nights
            </span>
            <span className="font-body text-sm text-[#4A5468]">
              ${(bookingData.pricePerNight * bookingData.nights).toLocaleString()}
              <span className="text-[#7A8494] ml-1">
                ({formatPiAmount(piSubtotal)})
              </span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-body text-sm text-[#7A8494]">
              Taxes &amp; fees
            </span>
            <span className="font-body text-sm text-[#4A5468]">
              ${bookingData.taxes.toLocaleString()}
              <span className="text-[#7A8494] ml-1">
                ({formatPiAmount(piTaxes)})
              </span>
            </span>
          </div>
          {bookingData.discount > 0 && (
            <TooltipProvider>
              <div className="flex justify-between">
                <span className="font-body text-sm text-[#7A8494] flex items-center gap-1">
                  Discount
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="cursor-help">
                        <Info size={13} className="text-[#C5CBD4] hover:text-[#7A8494] transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="font-body text-xs">Early bird discount — 10% off for bookings 30+ days in advance</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
                <span className="font-body text-sm text-[#2D9F5E]">
                  - ${bookingData.discount.toLocaleString()}
                  <span className="text-[#7A8494] ml-1">
                    (-{formatPiAmount(piDiscount)})
                  </span>
                </span>
              </div>
            </TooltipProvider>
          )}
          <div className="border-t border-[#E2E6EC] pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-body text-base font-semibold text-[#1A2B47]">
                Total
              </span>
              <span className="font-display text-xl font-semibold text-[#0F1B2E]">
                {formatPiAmount(piTotal)}
              </span>
            </div>
            <p className="font-body text-xs text-[#7A8494] text-right mt-0.5">
              ≈ ${bookingData.total.toLocaleString()} USD · 1 π ≈ ${PI_RATE}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 bg-[#FEF2F0] rounded-lg p-3">
        <Shield size={16} className="text-[#E85D4A] shrink-0 mt-0.5" />
        <span className="font-body text-sm text-[#D14A38]">
          Free cancellation until {bookingData.cancellationDate}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[#C5CBD4]">
        <Lock size={14} />
        <span className="font-body text-xs text-[#7A8494]">
          Secured by Pi Blockchain
        </span>
      </div>
    </div>
  );
}

/* ─── Step 1: Your Details ─── */
function StepDetails({
  onContinue,
}: {
  onContinue: (data: Record<string, string>) => void;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requests, setRequests] = useState('');
  const [arrival, setArrival] = useState("I don't know");
  const [saveDetails, setSaveDetails] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = useCallback(() => {
    const newErrors: FormErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [firstName, lastName, email, phone]);

  const handleContinue = () => {
    if (validate()) {
      onContinue({ firstName, lastName, email, phone, requests, arrival });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Form */}
      <div        className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(15,27,46,0.06)]"
      >
        {/* Lead Guest */}
        <div>
          <h3 className="font-display text-lg font-semibold text-[#1A2B47]">
            Lead Guest
          </h3>
          <p className="font-body text-sm text-[#7A8494] mt-1">
            The person checking in must match this name
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div>
              <Label
                htmlFor="firstName"
                className="font-body text-sm text-[#4A5468]"
              >
                First Name <span className="text-[#D93838]">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="First name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName)
                    setErrors((p) => ({ ...p, firstName: undefined }));
                }}
                className={cn(
                  'mt-1.5 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]',
                  errors.firstName && 'border-[#D93838]'
                )}
              />
              {errors.firstName && (
                <p className="flex items-center gap-1 mt-1 font-body text-xs text-[#D93838]">
                  <AlertCircle size={12} />
                  {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="lastName"
                className="font-body text-sm text-[#4A5468]"
              >
                Last Name <span className="text-[#D93838]">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName)
                    setErrors((p) => ({ ...p, lastName: undefined }));
                }}
                className={cn(
                  'mt-1.5 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]',
                  errors.lastName && 'border-[#D93838]'
                )}
              />
              {errors.lastName && (
                <p className="flex items-center gap-1 mt-1 font-body text-xs text-[#D93838]">
                  <AlertCircle size={12} />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="email" className="font-body text-sm text-[#4A5468]">
              Email <span className="text-[#D93838]">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((p) => ({ ...p, email: undefined }));
              }}
              className={cn(
                'mt-1.5 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]',
                errors.email && 'border-[#D93838]'
              )}
            />
            {errors.email && (
              <p className="flex items-center gap-1 mt-1 font-body text-xs text-[#D93838]">
                <AlertCircle size={12} />
                {errors.email}
              </p>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="phone" className="font-body text-sm text-[#4A5468]">
              Phone <span className="text-[#D93838]">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone)
                  setErrors((p) => ({ ...p, phone: undefined }));
              }}
              className={cn(
                'mt-1.5 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]',
                errors.phone && 'border-[#D93838]'
              )}
            />
            {errors.phone && (
              <p className="flex items-center gap-1 mt-1 font-body text-xs text-[#D93838]">
                <AlertCircle size={12} />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Special Requests */}
        <div className="mt-8">
          <h3 className="font-display text-lg font-semibold text-[#1A2B47]">
            Special Requests
          </h3>
          <p className="font-body text-sm text-[#7A8494] mt-1">
            We&apos;ll share your requests with the property
          </p>
          <Textarea
            placeholder="Any special requests? (e.g., early check-in, specific room location, dietary requirements...)"
            rows={4}
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            className="mt-3 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)] resize-none"
          />
        </div>

        {/* Arrival Time */}
        <div className="mt-8">
          <h3 className="font-display text-lg font-semibold text-[#1A2B47]">
            Estimated Arrival Time
          </h3>
          <p className="font-body text-sm text-[#7A8494] mt-1">
            Check-in starts at 3:00 PM
          </p>
          <Select value={arrival} onValueChange={setArrival}>
            <SelectTrigger className="mt-3 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="I don't know">I don&apos;t know</SelectItem>
              <SelectItem value="12:00 PM – 2:00 PM">
                12:00 PM – 2:00 PM
              </SelectItem>
              <SelectItem value="2:00 PM – 4:00 PM">
                2:00 PM – 4:00 PM
              </SelectItem>
              <SelectItem value="4:00 PM – 6:00 PM">
                4:00 PM – 6:00 PM
              </SelectItem>
              <SelectItem value="6:00 PM – 8:00 PM">
                6:00 PM – 8:00 PM
              </SelectItem>
              <SelectItem value="After 8:00 PM">After 8:00 PM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Details */}
        <div className="flex items-center gap-3 mt-6">
          <Checkbox
            id="save"
            checked={saveDetails}
            onCheckedChange={(c) => setSaveDetails(c === true)}
            className="rounded border-[#E2E6EC] data-[state=checked]:bg-[#E85D4A] data-[state=checked]:border-[#E85D4A]"
          />
          <Label htmlFor="save" className="font-body text-sm text-[#4A5468] cursor-pointer">
            Save my details for faster checkout next time
          </Label>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          className="w-full mt-6 bg-[#E85D4A] hover:bg-[#D14A38] text-white font-body font-semibold rounded-xl py-6 text-base transition-all duration-250 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)] active:scale-[0.98]"
        >
          Continue to Pi Payment
          <ChevronRight size={18} className="ml-1" />
        </Button>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-2">
        <div className="lg:sticky lg:top-[100px]">
          <BookingSummarySidebar />
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Pi Payment ─── */
function StepPayment({
  onPay,
  onBack,
}: {
  onPay: (txId: string) => void;
  onBack: () => void;
}) {
  const { isAuthenticated, authenticate } = usePiAuth();
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const validate = useCallback(() => {
    const newErrors: FormErrors = {};
    if (!terms) newErrors.terms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [terms]);

  const handlePay = async () => {
    if (!validate()) return;

    if (!isAuthenticated) {
      await authenticate(['username', 'payments']);
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      await createPiPayment({
        amount: piTotal,
        memo: `StayFind: ${bookingData.hotelName} - ${bookingData.roomType}`,
        metadata: {
          hotelName: bookingData.hotelName,
          roomType: bookingData.roomType,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          nights: bookingData.nights,
          guests: bookingData.guests,
          totalPi: piTotal,
        },
        onTransactionId: (txid) => {
          setProcessing(false);
          onPay(txid);
        },
      });
    } catch (err: unknown) {
      setProcessing(false);
      const message =
        err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setPaymentError(message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Pi Payment Form */}
      <div        className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(15,27,46,0.06)]"
      >
        {/* Payment Method */}
        <div>
          <h3 className="font-display text-lg font-semibold text-[#1A2B47]">
            How Would You Like to Pay?
          </h3>
          <div className="mt-4 flex items-center gap-3 p-4 rounded-xl border-2 border-[#E85D4A] bg-[rgba(232,93,74,0.02)]">
            <div className="w-5 h-5 rounded-full border-2 border-[#E85D4A] flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E85D4A]" />
            </div>
            <PiLogoPay />
            <div>
              <p className="font-body text-sm font-medium text-[#1A2B47]">
                Pi Cryptocurrency
              </p>
              <p className="font-body text-xs text-[#7A8494]">
                Fast, secure blockchain payments
              </p>
            </div>
          </div>
        </div>

        {/* Pi Payment Card */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#0F1B2E] to-[#1A2B47] p-6 text-white">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Wallet size={20} className="text-white" />
            </div>
            <div>
              <p className="font-body text-sm font-medium text-white/80">
                Pay with Pi
              </p>
              <p className="font-display text-2xl font-semibold text-white">
                {formatPiAmount(piTotal)}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-white/10" />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-body text-sm text-white/60">
                ${bookingData.pricePerNight} × {bookingData.nights} nights
              </span>
              <span className="font-body text-sm text-white/80">
                {formatPiAmount(piSubtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-sm text-white/60">
                Taxes &amp; fees
              </span>
              <span className="font-body text-sm text-white/80">
                {formatPiAmount(piTaxes)}
              </span>
            </div>
            {bookingData.discount > 0 && (
              <div className="flex justify-between">
                <span className="font-body text-sm text-white/60">
                  Discount
                </span>
                <span className="font-body text-sm text-[#4ADE80]">
                  -{formatPiAmount(piDiscount)}
                </span>
              </div>
            )}
            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-body text-sm font-medium text-white">
                  Total
                </span>
                <span className="font-body text-base font-semibold text-white">
                  {formatPiAmount(piTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Conversion Note */}
          <p className="font-body text-xs text-white/40 mt-3">
            ≈ ${bookingData.total.toLocaleString()} USD · 1 π ≈ ${PI_RATE}
          </p>

          {/* Security Badge */}
          <div className="flex items-center gap-1.5 mt-4">
            <Check size={12} className="text-[#4ADE80]" />
            <span className="font-body text-xs text-white/50">
              Secured by Pi Blockchain
            </span>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={terms}
              onCheckedChange={(c) => {
                setTerms(c === true);
                if (errors.terms)
                  setErrors((p) => ({ ...p, terms: undefined }));
              }}
              className={cn(
                'rounded border-[#E2E6EC] data-[state=checked]:bg-[#E85D4A] data-[state=checked]:border-[#E85D4A] mt-0.5',
                errors.terms && 'border-[#D93838]'
              )}
            />
            <Label
              htmlFor="terms"
              className="font-body text-sm text-[#4A5468] cursor-pointer leading-relaxed"
            >
              I agree to the{' '}
              <span className="underline text-[#E85D4A] cursor-pointer">
                Booking Conditions
              </span>
              ,{' '}
              <span className="underline text-[#E85D4A] cursor-pointer">
                Privacy Policy
              </span>
              , and{' '}
              <span className="underline text-[#E85D4A] cursor-pointer">
                Terms of Service
              </span>
            </Label>
          </div>
          {errors.terms && (
            <p className="flex items-center gap-1 mt-1 font-body text-xs text-[#D93838]">
              <AlertCircle size={12} />
              {errors.terms}
            </p>
          )}
        </div>

        {/* Error Message */}
        {paymentError && (
          <div            className="mt-4 flex items-center gap-2 bg-[#FEF2F0] rounded-lg p-3 text-[#D93838]"
          >
            <AlertCircle size={16} />
            <span className="font-body text-sm">{paymentError}</span>
          </div>
        )}

        {/* Pay Button */}
        <Button
          onClick={handlePay}
          disabled={processing}
          className={cn(
            'w-full mt-6 font-body font-semibold rounded-xl py-6 text-base transition-all duration-250 flex items-center justify-center gap-2',
            processing
              ? 'bg-[#E85D4A]/80 text-white cursor-not-allowed'
              : 'bg-[#E85D4A] hover:bg-[#D14A38] text-white hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)] active:scale-[0.98]'
          )}
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : isAuthenticated ? (
            <>
              <PiLogoPay />
              Pay {formatPiAmount(piTotal)} with Pi
            </>
          ) : (
            <>
              <PiLogoPay />
              Sign In with Pi to Pay
            </>
          )}
        </Button>

        {/* Back */}
        <button
          onClick={onBack}
          className="w-full mt-3 font-body text-sm text-[#7A8494] hover:text-[#E85D4A] transition-colors py-2"
        >
          Back to Details
        </button>

        {/* Security Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[#7A8494]">
          <span className="flex items-center gap-1 font-body text-xs">
            <Lock size={12} />
            Pi Blockchain Secure
          </span>
          <span className="flex items-center gap-1 font-body text-xs">
            <Shield size={12} />
            Decentralized Payment
          </span>
          <span className="flex items-center gap-1 font-body text-xs">
            <Wallet size={12} />
            Pi Network
          </span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-2">
        <div className="lg:sticky lg:top-[100px]">
          <BookingSummarySidebar />
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Confirmation ─── */
function StepConfirmation({ txId }: { txId: string }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const bookingRef = 'SF-2025-78432';

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingRef).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div      className="max-w-[720px] mx-auto text-center"
    >
      {/* Success Animation */}
      <div        className="w-20 h-20 rounded-full bg-[#2D9F5E] flex items-center justify-center mx-auto"
      >
        <Check size={36} className="text-white" strokeWidth={3} />
      </div>
      {/* Pulse ring */}
      <div        className="w-20 h-20 rounded-full bg-[#2D9F5E] mx-auto -mt-20 pointer-events-none"
      />

      {/* Headline */}
      <h2        className="font-display text-3xl sm:text-4xl font-semibold text-[#0F1B2E] mt-6"
      >
        Booking Confirmed!
      </h2>

      <p        className="font-body text-base text-[#7A8494] mt-2"
      >
        A confirmation email has been sent to sarah.mitchell@email.com
      </p>

      {/* Booking Reference */}
      <div        className="mt-6 bg-white rounded-xl p-4 border border-[#E2E6EC] flex items-center justify-between"
      >
        <div className="text-left">
          <p className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
            Booking Reference
          </p>
          <p className="font-body text-lg font-semibold text-[#0F1B2E] font-mono">
            {bookingRef}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-sm font-medium text-[#1A2B47] hover:bg-[#F8F9FB] transition-colors"
        >
          {copied ? (
            <>
              <Check size={16} className="text-[#2D9F5E]" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Pi Transaction */}
      <div        className="mt-3 bg-gradient-to-r from-[#0F1B2E] to-[#1A2B47] rounded-xl p-4 flex items-center justify-between"
      >
        <div className="text-left">
          <p className="font-body text-xs text-white/50 uppercase tracking-wider">
            Pi Transaction
          </p>
          <p className="font-body text-sm font-semibold text-white font-mono truncate max-w-[200px] sm:max-w-[400px]">
            {txId}
          </p>
        </div>
        <div className="text-right shrink-0 ml-3">
          <p className="font-body text-xs text-white/50">Paid</p>
          <p className="font-body text-base font-semibold text-white">
            {formatPiAmount(piTotal)}
          </p>
        </div>
      </div>

      {/* Booking Details Card */}
      <div        className="mt-6 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(15,27,46,0.06)] text-left"
      >
        <img
          src={bookingData.image}
          alt={bookingData.hotelName}
          className="w-full aspect-video object-cover rounded-xl"
        />
        <h3 className="font-display text-xl font-semibold text-[#0F1B2E] mt-4">
          {bookingData.hotelName}
        </h3>
        <p className="font-body text-sm text-[#7A8494] mt-1 flex items-center gap-1">
          <MapPin size={14} />
          {bookingData.address}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <div>
            <p className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
              Check-in
            </p>
            <p className="font-body text-sm text-[#4A5468] mt-0.5">
              {bookingData.checkIn} · After 3:00 PM
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
              Check-out
            </p>
            <p className="font-body text-sm text-[#4A5468] mt-0.5">
              {bookingData.checkOut} · Before 12:00 PM
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
              Room
            </p>
            <p className="font-body text-sm text-[#4A5468] mt-0.5 flex items-center gap-1">
              <Bed size={14} />
              {bookingData.roomType}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
              Guests
            </p>
            <p className="font-body text-sm text-[#4A5468] mt-0.5 flex items-center gap-1">
              <Users size={14} />
              {bookingData.guests}
            </p>
          </div>
        </div>

        <div className="border-t border-[#F0F2F5] mt-5 pt-4 flex justify-between items-center">
          <span className="font-body text-sm text-[#7A8494]">Total paid</span>
          <div className="text-right">
            <span className="font-display text-xl font-semibold text-[#0F1B2E]">
              {formatPiAmount(piTotal)}
            </span>
            <p className="font-body text-xs text-[#7A8494]">
              ≈ ${bookingData.total.toLocaleString()} USD · 1 π ≈ ${PI_RATE}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div        className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Button
          variant="outline"
          className="rounded-xl border-[#E2E6EC] font-body font-semibold text-[#1A2B47] hover:bg-[#F8F9FB] py-5 px-6"
        >
          <Download size={18} className="mr-2" />
          Download Confirmation
        </Button>
        <Button
          variant="outline"
          className="rounded-xl border-[#E2E6EC] font-body font-semibold text-[#1A2B47] hover:bg-[#F8F9FB] py-5 px-6"
        >
          <Calendar size={18} className="mr-2" />
          Add to Calendar
        </Button>
        <Button
          onClick={() => navigate('/profile')}
          className="rounded-xl bg-[#E85D4A] hover:bg-[#D14A38] text-white font-body font-semibold py-5 px-6 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)] active:scale-[0.98] transition-all"
        >
          View My Bookings
        </Button>
      </div>

      {/* Help */}
      <div        className="mt-8"
      >
        <p className="font-body text-sm text-[#7A8494]">
          Need help with your booking?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <span className="font-body text-sm text-[#E85D4A] cursor-pointer hover:underline">
            Contact Support
          </span>
          <span className="font-body text-sm text-[#E85D4A] cursor-pointer hover:underline">
            Modify Booking
          </span>
          <span className="font-body text-sm text-[#E85D4A] cursor-pointer hover:underline">
            Cancel Booking
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Checkout Page ─── */
export default function Checkout() {
  const [step, setStep] = useState(1);
  const [, setDetailsData] = useState<Record<string, string> | null>(null);
  const [txId, setTxId] = useState('');

  const handleContinue = (data: Record<string, string>) => {
    setDetailsData(data);
    setStep(2);
  };

  const handlePay = (paymentTxId: string) => {
    setTxId(paymentTxId);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="pt-[88px] pb-20 min-h-[100dvh] bg-white">
        {/* Header with Progress */}
        {step < 3 && (
          <div className="border-b border-[#E2E6EC] py-4">
            <div className="max-w-[960px] mx-auto px-4 sm:px-6">
              <ProgressBar currentStep={step} />
              <PropertySummaryStrip />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
                      {step === 1 && (
              <div
                key="step1"              >
                <StepDetails onContinue={handleContinue} />
              </div>
            )}
            {step === 2 && (
              <div
                key="step2"              >
                <StepPayment onPay={handlePay} onBack={() => setStep(1)} />
              </div>
            )}
            {step === 3 && (
              <div
                key="step3"              >
                <StepConfirmation txId={txId} />
              </div>
            )}
                  </div>
      </div>
    </Layout>
  );
}
