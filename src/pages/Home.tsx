import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Search, MapPin, Calendar, Users, Heart, Star, ChevronLeft, ChevronRight,
  Check, Sparkles, Shield, Clock, CreditCard, ArrowRight, ArrowUp,
  Wifi, Car, Coffee, Utensils, ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { usdToPi, formatPiAmount } from '@/lib/piPayments';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTranslation } from '@/i18n';
import Layout from '@/components/Layout';

/* ───────── Animation helpers ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

function useScrollReveal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  return { ref, inView };
}

/* ───────── Guest Selector ───────── */
interface GuestCounts {
  adults: number;
  children: number;
  rooms: number;
}

function GuestSelector({ guests, onChange }: { guests: GuestCounts; onChange: (g: GuestCounts) => void }) {
  const update = (key: keyof GuestCounts, delta: number) => {
    const next = { ...guests, [key]: Math.max(0, guests[key] + delta) };
    if (key === 'adults' && next.adults < 1) next.adults = 1;
    onChange(next);
  };

  return (
    <div className="p-4 w-[280px]">
      {[
        { key: 'adults' as const, label: 'Adults', sub: 'Age 13+' },
        { key: 'children' as const, label: 'Children', sub: 'Age 2-12' },
        { key: 'rooms' as const, label: 'Rooms', sub: '' },
      ].map((item) => (
        <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#F0F2F5] last:border-0">
          <div>
            <p className="font-body text-sm font-medium text-[#1A2B47]">{item.label}</p>
            {item.sub && <p className="font-body text-xs text-[#7A8494]">{item.sub}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => update(item.key, -1)}
              className="w-8 h-8 rounded-full border border-[#E2E6EC] flex items-center justify-center text-[#7A8494] hover:border-[#E85D4A] hover:text-[#E85D4A] transition-colors"
            >
              -
            </button>
            <span className="w-6 text-center font-body text-sm font-semibold text-[#1A2B47]">
              {guests[item.key]}
            </span>
            <button
              onClick={() => update(item.key, 1)}
              className="w-8 h-8 rounded-full border border-[#E2E6EC] flex items-center justify-center text-[#7A8494] hover:border-[#E85D4A] hover:text-[#E85D4A] transition-colors"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────── Section 1: Hero ───────── */
function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState<GuestCounts>({ adults: 2, children: 0, rooms: 1 });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (checkIn) params.set('checkIn', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.set('checkOut', format(checkOut, 'yyyy-MM-dd'));
    params.set('adults', String(guests.adults));
    params.set('children', String(guests.children));
    params.set('rooms', String(guests.rooms));
    navigate(`/search?${params.toString()}`);
  };

  const guestLabel = `${guests.adults} Adult${guests.adults !== 1 ? 's' : ''}${guests.children > 0 ? ` \u00B7 ${guests.children} Child${guests.children !== 1 ? 'ren' : ''}` : ''}`;

  return (
    <section className="relative min-h-[100dvh] min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt="Hero background"
          className="w-full h-full object-cover scale-105 animate-[heroZoom_8s_ease-out_forwards]"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(15,27,46,0.45) 0%, rgba(15,27,46,0.15) 50%, rgba(15,27,46,0.65) 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(15,27,46,0.3) 100%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32 w-full max-w-[960px]">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold text-white leading-[1.1] tracking-[-0.02em] max-w-[700px]"
          style={{ textShadow: '0 2px 20px rgba(15,27,46,0.3)' }}
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="mt-4 font-body text-base sm:text-lg text-white/85 max-w-[520px] leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="mt-8 w-full max-w-[960px]"
        >
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(15,27,46,0.15)] p-2 flex flex-col md:flex-row gap-2">
            {/* Destination */}
            <div className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-text">
              <MapPin className="text-[#E85D4A] shrink-0" size={20} />
              <div className="flex-1 text-left">
                <label className="block font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7A8494]">
                  {t('hero.where')}
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={t('hero.where')}
                  className="w-full font-body text-sm text-[#0F1B2E] placeholder:text-[#C5CBD4] bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="hidden md:block w-px bg-[#F0F2F5] my-2" />

            {/* Check-in */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="md:w-[160px] flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer">
                  <Calendar className="text-[#E85D4A] shrink-0" size={20} />
                  <div className="text-left">
                    <label className="block font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7A8494]">
                      {t('hero.checkIn')}
                    </label>
                    <span className="font-body text-sm text-[#0F1B2E]">
                      {checkIn ? format(checkIn, 'MMM dd') : 'Add date'}
                    </span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="hidden md:block w-px bg-[#F0F2F5] my-2" />

            {/* Check-out */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="md:w-[160px] flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer">
                  <Calendar className="text-[#E85D4A] shrink-0" size={20} />
                  <div className="text-left">
                    <label className="block font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7A8494]">
                      {t('hero.checkOut')}
                    </label>
                    <span className="font-body text-sm text-[#0F1B2E]">
                      {checkOut ? format(checkOut, 'MMM dd') : 'Add date'}
                    </span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => date <= (checkIn || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="hidden md:block w-px bg-[#F0F2F5] my-2" />

            {/* Guests */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="md:w-[200px] flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer">
                  <Users className="text-[#E85D4A] shrink-0" size={20} />
                  <div className="text-left">
                    <label className="block font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7A8494]">
                      {t('hero.guests')}
                    </label>
                    <span className="font-body text-sm text-[#0F1B2E] truncate block max-w-[140px]">
                      {guestLabel}
                    </span>
                  </div>
                  <ChevronDown className="text-[#C5CBD4] shrink-0" size={16} />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto" align="end">
                <GuestSelector guests={guests} onChange={setGuests} />
              </PopoverContent>
            </Popover>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-[#E85D4A] hover:bg-[#D14A38] text-white font-body font-semibold text-base rounded-xl px-6 py-6 h-auto transition-all duration-250 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)] active:scale-[0.98]"
            >
              <Search size={20} className="mr-2" />
              {t('hero.searchBtn')}
            </Button>
          </div>
        </motion.div>

        {/* Trust Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-8 left-0 right-0 flex flex-wrap justify-center gap-x-8 gap-y-3 px-6"
        >
          {[t('hero.trust1'), t('hero.trust2'), t('hero.trust3'), t('hero.trust4')].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check size={14} className="text-white/70" />
              <span className="font-body text-xs font-medium uppercase tracking-[0.06em] text-white/70">
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1); }
        }
      `}</style>
    </section>
  );
}

/* ───────── Section 2: Popular Destinations ───────── */
function DestinationsSection() {
  const { t } = useTranslation();
  const { ref, inView } = useScrollReveal();
  const navigate = useNavigate();

  const destinations = [
    { city: 'Paris', country: 'France', properties: '12,400+', image: '/dest-paris.jpg', featured: true },
    { city: 'Tokyo', country: 'Japan', properties: '8,200+', image: '/dest-tokyo.jpg', featured: false },
    { city: 'Bali', country: 'Indonesia', properties: '6,800+', image: '/dest-bali.jpg', featured: false },
    { city: 'New York', country: 'United States', properties: '15,600+', image: '/dest-newyork.jpg', featured: false },
    { city: 'London', country: 'United Kingdom', properties: '10,300+', image: '/dest-london.jpg', featured: false },
    { city: 'Dubai', country: 'UAE', properties: '7,500+', image: '/dest-dubai.jpg', featured: false },
  ];

  return (
    <section ref={ref} className="bg-[#F8F9FB] pt-24 pb-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mb-10"
        >
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E85D4A]">
            {t('home.popularTitle')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[48px] font-bold text-[#0F1B2E] leading-[1.15] tracking-[-0.02em] mt-2">
            {t('home.popularTitle')}
          </h2>
          <p className="font-body text-base text-[#7A8494] mt-3">
            {t('home.popularSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 auto-rows-[280px]">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.city}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              onClick={() => navigate(`/search?destination=${dest.city}`)}
              className={cn(
                'relative rounded-3xl overflow-hidden cursor-pointer group hover:scale-[1.03] hover:shadow-2xl transition-all duration-300',
                dest.featured ? 'sm:col-span-2 sm:row-span-2' : ''
              )}
            >
              <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,27,46,0.75)] via-transparent to-transparent" />
              {dest.featured && (
                <span className="absolute top-4 right-4 bg-[#E85D4A] text-white font-body text-xs font-semibold px-3 py-1 rounded-md">
                  Popular
                </span>
              )}
              <div className="absolute bottom-5 left-5 transition-transform duration-[400ms] group-hover:-translate-y-1">
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">
                  {dest.city}
                </h3>
                <p className="font-body text-xs text-white/80 mt-1">
                  {dest.country} &middot; {dest.properties} properties
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Section 3: Property Types ───────── */
function PropertyTypesSection() {
  const { t } = useTranslation();
  const { ref, inView } = useScrollReveal();
  const navigate = useNavigate();

  const types = [
    { name: 'Hotels', count: '850,000+', image: '/prop-type-hotel.jpg' },
    { name: 'Apartments', count: '1,200,000+', image: '/prop-type-apartment.jpg' },
    { name: 'Resorts', count: '180,000+', image: '/prop-type-resort.jpg' },
    { name: 'Villas', count: '95,000+', image: '/prop-type-villa.jpg' },
    { name: 'Cabins', count: '65,000+', image: '/prop-type-cabin.jpg' },
  ];

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F1B2E] leading-[1.2]">
            {t('home.typesTitle')}
          </h2>
          <p className="font-body text-base text-[#7A8494] mt-2">
            From boutique hotels to private villas, find the perfect accommodation
          </p>
        </motion.div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {types.map((type, i) => (
            <motion.div
              key={type.name}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              onClick={() => navigate(`/search?type=${type.name.toLowerCase()}`)}
              className="w-[200px] sm:w-[240px] flex-shrink-0 cursor-pointer group snap-start"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-full object-cover transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                />
              </div>
              <h3 className="font-body text-base font-semibold text-[#1A2B47] mt-3 group-hover:text-[#E85D4A] transition-colors">
                {type.name}
              </h3>
              <p className="font-body text-sm text-[#7A8494]">{type.count}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Section 4: Featured Deals ───────── */
function DealsSection() {
  const { t } = useTranslation();
  const { ref, inView } = useScrollReveal();
  const navigate = useNavigate();

  const deals = [
    { title: 'Romantic Paris Getaway', location: 'Paris, France', discount: 'Save 30%', image: '/dest-paris.jpg' },
    { title: 'Tokyo Adventure', location: 'Tokyo, Japan', discount: 'Save 25%', image: '/dest-tokyo.jpg' },
    { title: 'Bali Wellness Retreat', location: 'Ubud, Bali', discount: 'Save 35%', image: '/dest-bali.jpg' },
    { title: 'NYC Weekend Special', location: 'New York, USA', discount: 'Save 20%', image: '/dest-newyork.jpg' },
  ];

  return (
    <section ref={ref} className="py-24" style={{ background: 'linear-gradient(135deg, #0F1B2E 0%, #1A2B47 50%, #243B5D 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mb-10">
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E85D4A]">
            {t('home.dealsTitle')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[48px] font-bold text-white leading-[1.15] tracking-[-0.02em] mt-2">
            {t('home.dealsTitle')}
          </h2>
          <p className="font-body text-base text-white/70 mt-3">
            {t('home.dealsSubtitle')}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Featured Deal */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="lg:w-[55%] relative rounded-3xl overflow-hidden h-[400px] lg:h-[480px] cursor-pointer group shrink-0"
          >
            <img
              src="/deal-beach.jpg"
              alt="Summer Escape"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,27,46,0.85)] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="inline-block bg-[#E85D4A] text-white font-body text-xs font-semibold px-3 py-1 rounded-md mb-3">
                SAVE 40%
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">
                Summer Escape to the Maldives
              </h3>
              <p className="font-body text-sm text-white/80 mt-2 max-w-md">
                7 nights all-inclusive resort with private beach access and complimentary spa treatments
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="font-body text-sm text-white/50 line-through">{formatPiAmount(usdToPi(2400))}</span>
                <span className="font-display text-2xl font-semibold text-[#E85D4A]">{formatPiAmount(usdToPi(1440))}</span>
              </div>
              <p className="font-body text-[11px] text-white/50 mt-1">≈ $1,440 USD</p>
              <button
                onClick={() => navigate('/search?destination=Maldives')}
                className="mt-4 bg-white text-[#1A2B47] font-body text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[#F8F9FB] transition-colors"
              >
                {t('home.ctaBtn')}
              </button>
            </div>
          </motion.div>

          {/* Deal Grid */}
          <div className="lg:w-[45%] grid grid-cols-2 gap-4">
            {deals.map((deal, i) => (
              <motion.div
                key={deal.title}
                custom={i + 2}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                onClick={() => navigate(`/search?destination=${deal.location.split(',')[0]}`)}
                className="relative rounded-2xl overflow-hidden aspect-[16/10] cursor-pointer group"
              >
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,27,46,0.7)] to-transparent" />
                <span className="absolute top-3 left-3 bg-[#E85D4A] text-white font-body text-[11px] font-semibold px-2 py-1 rounded">
                  {deal.discount}
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="font-body text-sm font-semibold text-white leading-tight">{deal.title}</h4>
                  <p className="font-body text-[11px] text-white/70 mt-1">{deal.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Section 5: Featured Properties ───────── */
function PropertiesSection() {
  const { t } = useTranslation();
  const { ref, inView } = useScrollReveal();

  const properties = [
    { name: 'The Grand Palace Hotel', location: 'Paris, France', rating: 9.4, price: 285, image: '/hotel-1.jpg', tag: 'Luxury' },
    { name: 'Skyline Resort & Spa', location: 'Dubai, UAE', rating: 9.1, price: 420, image: '/hotel-2.jpg', tag: 'Trending' },
    { name: 'Zen Garden Retreat', location: 'Bali, Indonesia', rating: 9.6, price: 195, image: '/hotel-3.jpg', tag: 'Top Rated' },
    { name: 'Metropolitan Suites', location: 'New York, USA', rating: 8.9, price: 350, image: '/hotel-4.jpg', tag: 'Best Value' },
    { name: 'Oceanview Paradise', location: 'Maldives', rating: 9.8, price: 680, image: '/hotel-5.jpg', tag: 'Luxury' },
    { name: 'Historic Central Inn', location: 'London, UK', rating: 9.2, price: 240, image: '/hotel-6.jpg', tag: 'Boutique' },
    { name: 'Sakura Boutique Hotel', location: 'Tokyo, Japan', rating: 9.3, price: 180, image: '/hotel-1.jpg', tag: 'Trending' },
    { name: 'Coastal Escape Resort', location: 'Santorini, Greece', rating: 9.5, price: 310, image: '/hotel-2.jpg', tag: 'Top Rated' },
  ];

  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (i: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F1B2E] leading-[1.2]">
            {t('home.popularTitle')}
          </h2>
          <p className="font-body text-base text-[#7A8494] mt-2">
            {t('home.popularSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((prop, i) => (
            <motion.div
              key={`${prop.name}-${i}`}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,27,46,0.06)] hover:shadow-[0_12px_40px_rgba(15,27,46,0.12)] hover:-translate-y-1 transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={prop.image}
                  alt={prop.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-[#FEF2F0] text-[#D14A38] font-body text-xs font-medium px-2.5 py-1 rounded-md">
                  {prop.tag}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(i); }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Heart
                    size={16}
                    className={favorites.has(i) ? 'text-[#E85D4A] fill-[#E85D4A]' : 'text-[#7A8494]'}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-body text-base font-semibold text-[#1A2B47] truncate">{prop.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={14} className="text-[#C5CBD4]" />
                  <span className="font-body text-sm text-[#7A8494]">{prop.location}</span>
                </div>
                <div className="w-full h-px bg-[#F0F2F5] my-3" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#0F1B2E] text-white font-body text-sm font-bold px-2.5 py-1 rounded-lg rounded-bl-none">
                      {prop.rating}
                    </span>
                    <span className="font-body text-xs text-[#7A8494]">{t('property.excellent')}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-body text-lg font-semibold text-[#E85D4A]">{formatPiAmount(usdToPi(prop.price))}</span>
                    <span className="font-body text-xs text-[#7A8494]">/{t('property.night')}</span>
                    <p className="font-body text-[11px] text-[#C5CBD4]">≈ ${prop.price} USD</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  {[Wifi, Car, Coffee, Utensils].map((Icon, j) => (
                    <Icon key={j} size={16} className="text-[#7A8494]" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Section 6: Why Choose StayFind ───────── */
function FeaturesSection() {
  const { t } = useTranslation();
  const { ref, inView } = useScrollReveal();

  const features = [
    { icon: Sparkles, title: t('home.statHotels'), desc: t('home.popularSubtitle') },
    { icon: Shield, title: t('home.dealsTitle'), desc: t('home.dealsSubtitle') },
    { icon: Star, title: t('home.reviewsTitle'), desc: t('home.reviewers') },
    { icon: Clock, title: t('home.statCountries'), desc: t('home.popularSubtitle') },
    { icon: Users, title: t('home.statTravelers'), desc: t('home.reviewers') },
    { icon: CreditCard, title: t('home.ctaTitle'), desc: t('home.ctaSubtitle') },
  ];

  return (
    <section ref={ref} className="bg-[#F8F9FB] py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F1B2E] leading-[1.2]">
            {t('home.trustTitle')}
          </h2>
          <p className="font-body text-base text-[#7A8494] mt-2">
            {t('home.trustSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="bg-white rounded-2xl p-8 text-center shadow-[0_2px_8px_rgba(15,27,46,0.04)] hover:shadow-[0_8px_24px_rgba(15,27,46,0.08)] hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            >
              <div className="w-14 h-14 rounded-full bg-[#FEF2F0] flex items-center justify-center mx-auto">
                <feat.icon size={24} className="text-[#E85D4A]" />
              </div>
              <h3 className="font-body text-base font-semibold text-[#1A2B47] mt-4">{feat.title}</h3>
              <p className="font-body text-sm text-[#7A8494] mt-2 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Section 7: Testimonials ───────── */
function TestimonialsSection() {
  const { t } = useTranslation();
  const { ref, inView } = useScrollReveal();
  const [current, setCurrent] = useState(0);

  const testimonials = [
    { name: 'Sarah Mitchell', location: 'Sydney, Australia', rating: 5, quote: 'StayFind made planning our honeymoon effortless. Found an incredible resort in Bali at 30% less than other sites. The verified reviews were spot on!', avatar: '/reviewer-1.jpg' },
    { name: 'James Chen', location: 'Toronto, Canada', rating: 5, quote: 'I travel for work monthly and StayFind is my go-to. The filters are intuitive, prices are transparent, and their support team helped me rebook during a flight cancellation.', avatar: '/reviewer-2.jpg' },
    { name: 'Maria & Carlos Rodriguez', location: 'Madrid, Spain', rating: 5, quote: 'We booked a family villa in Tuscany through StayFind. The property exceeded every expectation. Free cancellation gave us peace of mind when our dates shifted.', avatar: '/reviewer-3.jpg' },
    { name: 'Emily Watson', location: 'London, UK', rating: 5, quote: 'The best price guarantee actually works! I found a lower rate elsewhere and they matched it plus gave an extra discount. Outstanding service.', avatar: '/reviewer-1.jpg' },
    { name: 'David Park', location: 'Seoul, South Korea', rating: 5, quote: "Clean interface, honest reviews, no hidden fees. StayFind is how booking should be. I've recommended it to all my friends and family.", avatar: '/reviewer-2.jpg' },
    { name: 'Anna Schmidt', location: 'Berlin, Germany', rating: 5, quote: 'From search to checkout in under 5 minutes. The map view helped us find the perfect location. Will definitely use again for our next trip!', avatar: '/reviewer-3.jpg' },
  ];

  const perPage = typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 2 : 3;
  const maxIndex = Math.max(0, testimonials.length - perPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  const next = () => setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="mb-10">
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-[#E85D4A]">
            {t('home.reviewsTitle')}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F1B2E] leading-[1.2] mt-2">
            {t('home.reviewsTitle')}
          </h2>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${current * (100 / perPage + 2)}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className="min-w-[calc(33.333%-16px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] bg-white border border-[#F0F2F5] rounded-2xl p-7 shadow-[0_2px_8px_rgba(15,27,46,0.04)] hover:shadow-[0_8px_24px_rgba(15,27,46,0.08)] transition-shadow duration-300"
                >
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} size={16} className="text-[#E85D4A] fill-[#E85D4A]" />
                    ))}
                  </div>
                  <p className="font-body text-sm text-[#243B5D] mt-4 italic leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-5">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-body text-sm font-semibold text-[#1A2B47]">{testimonial.name}</p>
                      <p className="font-body text-xs text-[#7A8494]">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-[#F0F2F5] flex items-center justify-center text-[#1A2B47] hover:bg-[#FEF2F0] hover:text-[#E85D4A] transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    i === current ? 'bg-[#E85D4A]' : 'bg-[#E2E6EC]'
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-[#F0F2F5] flex items-center justify-center text-[#1A2B47] hover:bg-[#FEF2F0] hover:text-[#E85D4A] transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── Section 8: CTA ───────── */
function CTASection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { ref, inView } = useScrollReveal();

  return (
    <section ref={ref} className="bg-[#E85D4A] py-16">
      <div className="max-w-[720px] mx-auto px-6 text-center">
        <motion.h2
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-[1.2]"
        >
          {t('home.ctaTitle')}
        </motion.h2>
        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="font-body text-base text-white/85 mt-3"
        >
          {t('home.ctaSubtitle')}
        </motion.p>

        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-7"
        >
          <Button
            onClick={() => navigate('/search')}
            className="bg-white text-[#E85D4A] hover:bg-white/90 font-body font-semibold text-base rounded-xl px-8 py-6 h-auto transition-all duration-250 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('home.ctaBtn')}
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </motion.div>

        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="font-body text-xs text-white/60 mt-3"
        >
          {t('home.reviewers')}
        </motion.p>
      </div>
    </section>
  );
}

/* ───────── Scroll to Top Button ───────── */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 right-6 z-50 w-12 h-12 rounded-full bg-[#E85D4A] text-white flex items-center justify-center shadow-lg hover:bg-[#D14A38] hover:scale-110 transition-all duration-300"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}

/* ───────── Home Page ───────── */
export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <DestinationsSection />
      <PropertyTypesSection />
      <DealsSection />
      <PropertiesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <ScrollToTop />
    </Layout>
  );
}
