import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  HelpCircle,
  MapPin,
  Star,
  Users,
  Bed,
  Clock,
  Mail,
  Phone,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

/* ─── easing token ─── */
const easeSmooth = [0.4, 0, 0.2, 1] as [number, number, number, number];
const easeBounce = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

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

/* ─── form error type ─── */
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  cardName?: string;
  terms?: string;
}

/* ─── Progress Bar Component ─── */
function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = ['Your Details', 'Payment', 'Confirmation'];

  return (
    <div className="w-full max-w-[500px] mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Connecting lines */}
        <div className="absolute top-[15px] left-[16px] right-[16px] h-[2px] bg-[#E2E6EC] z-0">
          <motion.div
            className="h-full bg-[#E85D4A]"
            initial={{ width: '0%' }}
            animate={{
              width:
                currentStep === 1
                  ? '0%'
                  : currentStep === 2
                    ? '50%'
                    : '100%',
            }}
            transition={{ duration: 0.4, ease: easeSmooth }}
          />
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
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.15, duration: 0.3 }}
                className={cn(
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
              </motion.div>
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
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4, ease: easeSmooth }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-5 p-4 bg-[#F8F9FB] rounded-xl"
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
    </motion.div>
  );
}

/* ─── Booking Summary Sidebar ─── */
function BookingSummarySidebar() {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: easeSmooth }}
      className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(15,27,46,0.06)]"
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
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-body text-sm text-[#7A8494]">
              Taxes &amp; fees
            </span>
            <span className="font-body text-sm text-[#4A5468]">
              ${bookingData.taxes}
            </span>
          </div>
          {bookingData.discount > 0 && (
            <div className="flex justify-between">
              <span className="font-body text-sm text-[#7A8494]">Discount</span>
              <span className="font-body text-sm text-[#2D9F5E]">
                - ${bookingData.discount}
              </span>
            </div>
          )}
          <div className="border-t border-[#E2E6EC] pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-body text-base font-semibold text-[#1A2B47]">
                Total
              </span>
              <span className="font-display text-xl font-semibold text-[#0F1B2E]">
                ${bookingData.total.toLocaleString()}
              </span>
            </div>
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
          Secure SSL encryption
        </span>
      </div>
    </motion.div>
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
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: easeSmooth }}
        className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(15,27,46,0.06)]"
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
          Continue to Payment
          <ChevronRight size={18} className="ml-1" />
        </Button>
      </motion.div>

      {/* Sidebar */}
      <div className="lg:col-span-2">
        <div className="lg:sticky lg:top-[100px]">
          <BookingSummarySidebar />
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Payment ─── */
function StepPayment({
  onPay,
  onBack,
}: {
  onPay: () => void;
  onBack: () => void;
}) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [terms, setTerms] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [processing, setProcessing] = useState(false);

  const validate = useCallback(() => {
    const newErrors: FormErrors = {};
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 13)
      newErrors.cardNumber = 'Enter a valid card number';
    if (!expiry.trim() || !/^\d{2}\s\/\s\d{2}$/.test(expiry))
      newErrors.expiry = 'Enter valid expiry (MM / YY)';
    if (!cvv.trim() || cvv.length < 3) newErrors.cvv = 'Enter valid CVV';
    if (!cardName.trim()) newErrors.cardName = 'Enter cardholder name';
    if (!terms) newErrors.terms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [cardNumber, expiry, cvv, cardName, terms]);

  const handlePay = () => {
    if (validate()) {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        onPay();
      }, 2000);
    }
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
    return digits;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Payment Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: easeSmooth }}
        className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(15,27,46,0.06)]"
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
            <CreditCard size={24} className="text-[#1A2B47]" />
            <div>
              <p className="font-body text-sm font-medium text-[#1A2B47]">
                Credit or Debit Card
              </p>
              <p className="font-body text-xs text-[#7A8494]">Most popular</p>
            </div>
          </div>
        </div>

        {/* Card Details */}
        <div className="mt-6">
          <Label
            htmlFor="cardNumber"
            className="font-body text-sm text-[#4A5468]"
          >
            Card Number
          </Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(formatCardNumber(e.target.value));
              if (errors.cardNumber)
                setErrors((p) => ({ ...p, cardNumber: undefined }));
            }}
            className={cn(
              'mt-1.5 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]',
              errors.cardNumber && 'border-[#D93838]'
            )}
          />
          {errors.cardNumber && (
            <p className="flex items-center gap-1 mt-1 font-body text-xs text-[#D93838]">
              <AlertCircle size={12} />
              {errors.cardNumber}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label
                htmlFor="expiry"
                className="font-body text-sm text-[#4A5468]"
              >
                Expiry Date
              </Label>
              <Input
                id="expiry"
                placeholder="MM / YY"
                value={expiry}
                onChange={(e) => {
                  setExpiry(formatExpiry(e.target.value));
                  if (errors.expiry)
                    setErrors((p) => ({ ...p, expiry: undefined }));
                }}
                className={cn(
                  'mt-1.5 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]',
                  errors.expiry && 'border-[#D93838]'
                )}
              />
              {errors.expiry && (
                <p className="flex items-center gap-1 mt-1 font-body text-xs text-[#D93838]">
                  <AlertCircle size={12} />
                  {errors.expiry}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="cvv"
                className="font-body text-sm text-[#4A5468] flex items-center gap-1"
              >
                CVV
                <span title="3 digits on back of card" className="cursor-help">
                  <HelpCircle size={14} className="text-[#C5CBD4]" />
                </span>
              </Label>
              <Input
                id="cvv"
                placeholder="CVV"
                maxLength={4}
                value={cvv}
                onChange={(e) => {
                  setCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                  if (errors.cvv)
                    setErrors((p) => ({ ...p, cvv: undefined }));
                }}
                className={cn(
                  'mt-1.5 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]',
                  errors.cvv && 'border-[#D93838]'
                )}
              />
              {errors.cvv && (
                <p className="flex items-center gap-1 mt-1 font-body text-xs text-[#D93838]">
                  <AlertCircle size={12} />
                  {errors.cvv}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Label
              htmlFor="cardName"
              className="font-body text-sm text-[#4A5468]"
            >
              Name on Card
            </Label>
            <Input
              id="cardName"
              placeholder="Name as it appears on card"
              value={cardName}
              onChange={(e) => {
                setCardName(e.target.value);
                if (errors.cardName)
                  setErrors((p) => ({ ...p, cardName: undefined }));
              }}
              className={cn(
                'mt-1.5 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]',
                errors.cardName && 'border-[#D93838]'
              )}
            />
            {errors.cardName && (
              <p className="flex items-center gap-1 mt-1 font-body text-xs text-[#D93838]">
                <AlertCircle size={12} />
                {errors.cardName}
              </p>
            )}
          </div>
        </div>

        {/* Save Card */}
        <div className="flex items-center gap-3 mt-6">
          <Checkbox
            id="saveCard"
            checked={saveCard}
            onCheckedChange={(c) => setSaveCard(c === true)}
            className="rounded border-[#E2E6EC] data-[state=checked]:bg-[#E85D4A] data-[state=checked]:border-[#E85D4A]"
          />
          <Label
            htmlFor="saveCard"
            className="font-body text-sm text-[#4A5468] cursor-pointer"
          >
            Save this card for future bookings
          </Label>
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

        {/* Pay Button */}
        <Button
          onClick={handlePay}
          disabled={processing}
          className={cn(
            'w-full mt-6 font-body font-semibold rounded-xl py-6 text-base transition-all duration-250',
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
          ) : (
            <span>Complete Booking · ${bookingData.total.toLocaleString()}</span>
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
            SSL Secure
          </span>
          <span className="flex items-center gap-1 font-body text-xs">
            <Shield size={12} />
            256-bit Encryption
          </span>
          <span className="flex items-center gap-1 font-body text-xs">
            <CreditCard size={12} />
            Visa · Mastercard · Amex
          </span>
        </div>
      </motion.div>

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
function StepConfirmation() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const bookingRef = 'SF-2025-78432';

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingRef).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[720px] mx-auto text-center"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.6, ease: easeBounce }}
        className="w-20 h-20 rounded-full bg-[#2D9F5E] flex items-center justify-center mx-auto"
      >
        <Check size={36} className="text-white" strokeWidth={3} />
      </motion.div>
      {/* Pulse ring */}
      <motion.div
        initial={{ scale: 1, opacity: 0.3 }}
        animate={{ scale: 1.3, opacity: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="w-20 h-20 rounded-full bg-[#2D9F5E] mx-auto -mt-20 pointer-events-none"
      />

      {/* Headline */}
      <motion.h2
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5, ease: easeSmooth }}
        className="font-display text-3xl sm:text-4xl font-semibold text-[#0F1B2E] mt-6"
      >
        Booking Confirmed!
      </motion.h2>

      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: easeSmooth }}
        className="font-body text-base text-[#7A8494] mt-2"
      >
        A confirmation email has been sent to sarah.mitchell@email.com
      </motion.p>

      {/* Booking Reference */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-6 bg-white rounded-xl p-4 border border-[#E2E6EC] flex items-center justify-between"
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
      </motion.div>

      {/* Booking Details Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5, ease: easeSmooth }}
        className="mt-6 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(15,27,46,0.06)] text-left"
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
          <span className="font-display text-xl font-semibold text-[#0F1B2E]">
            ${bookingData.total.toLocaleString()}
          </span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
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
      </motion.div>

      {/* Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.4 }}
        className="mt-8"
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
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Checkout Page ─── */
export default function Checkout() {
  const [step, setStep] = useState(1);
  const [detailsData, setDetailsData] = useState<Record<string, string> | null>(
    null
  );

  const handleContinue = (data: Record<string, string>) => {
    setDetailsData(data);
    setStep(2);
  };

  const handlePay = () => {
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
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepDetails onContinue={handleContinue} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepPayment onPay={handlePay} onBack={() => setStep(1)} />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <StepConfirmation />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
