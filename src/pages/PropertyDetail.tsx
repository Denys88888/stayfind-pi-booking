import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getHotelById } from '@/data/propertyData';
import { formatPiAmount, usdToPi } from '@/lib/piPayments';
import type { HotelData, RoomType } from '@/data/propertyData';
import { useTranslation } from '@/i18n';
import Layout from '@/components/Layout';
import { useIsFavorite } from '@/lib/favoritesStorage';

import {
  ChevronLeft,
  Heart,
  ImageIcon,
  MapPin,
  Star,
  Shield,
  Users,
  X,
  Waves,
  Dumbbell,
  Car,
  Wifi,
  Coffee,
  Wind,
  Bath,
  Bed,
  Eye,
  TreePine,
  Utensils,
  Sofa,
  Headphones,
  Sparkles,
  ThumbsUp,
  Check,
  Maximize,
  ChevronRight,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Icon helpers                                                       */
/* ------------------------------------------------------------------ */
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Waves, Dumbbell, Car, Wifi, Coffee, Wind, Bath, Bed, Eye, TreePine,
  Utensils, Sofa, Headphones, Sparkles, Shield,
};

function DynIcon({ name, size = 18, className = '' }: { name: string; size?: number; className?: string }) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}

/* ------------------------------------------------------------------ */
/*  Animation constants                                                */
/* ------------------------------------------------------------------ */
const easeSmooth = [0.4, 0, 0.2, 1] as [number, number, number, number];
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: easeSmooth },
  }),
};

/* ------------------------------------------------------------------ */
/*  Section 1: Photo Gallery                                          */
/* ------------------------------------------------------------------ */
function PhotoGallery({ hotel }: { hotel: HotelData }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [favorited, toggleFavorited] = useIsFavorite(Number(hotel.id));
  const [mobileIdx, setMobileIdx] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const openGallery = (idx: number) => {
    setCurrentImg(idx);
    setLightboxOpen(true);
  };

  const nextImg = useCallback(() => {
    setCurrentImg((p) => (p + 1) % hotel.images.length);
  }, [hotel.images.length]);
  const prevImg = useCallback(() => {
    setCurrentImg((p) => (p - 1 + hotel.images.length) % hotel.images.length);
  }, [hotel.images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImg();
      if (e.key === 'ArrowLeft') prevImg();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, nextImg, prevImg]);

  /* Mobile carousel auto-advance */
  useEffect(() => {
    const timer = setInterval(() => {
      setMobileIdx((p) => (p + 1) % hotel.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [hotel.images.length]);

  return (
    <>
      {/* Desktop Grid */}
      <div className="hidden md:block relative w-full h-[500px]">
        <div className="grid grid-cols-5 grid-rows-2 gap-1 h-full">
          <div
            className="col-span-3 row-span-2 relative overflow-hidden cursor-pointer group"
            onClick={() => openGallery(0)}
          >
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          {hotel.images.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="col-span-2 row-span-1 relative overflow-hidden cursor-pointer group"
              onClick={() => openGallery(i + 1)}
            >
              <img
                src={img}
                alt={`${hotel.name} ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0F1B2E]/0 group-hover:bg-[#0F1B2E]/15 transition-all duration-200" />
            </div>
          ))}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(15,27,46,0.15)] hover:scale-105 transition-transform duration-200 z-10"
        >
          <ChevronLeft size={20} className="text-[#0F1B2E]" />
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorited()}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(15,27,46,0.15)] hover:scale-105 transition-transform duration-200 z-10"
        >
          <motion.div
            animate={favorited ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={20}
              className={cn(
                'transition-colors duration-300',
                favorited ? 'text-[#E85D4A] fill-[#E85D4A]' : 'text-[#7A8494]'
              )}
            />
          </motion.div>
        </button>

        {/* View All Photos */}
        <button
          onClick={() => openGallery(0)}
          className="absolute bottom-4 right-4 bg-white text-[#1A2B47] font-body text-sm font-medium px-[18px] py-2.5 rounded-[10px] shadow-[0_2px_12px_rgba(15,27,46,0.15)] hover:shadow-[0_4px_20px_rgba(15,27,46,0.2)] hover:scale-[1.02] transition-all duration-200 flex items-center gap-2 z-10"
        >
          <ImageIcon size={16} />
          {t('property.showAll')}
        </button>
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative w-full h-[350px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={mobileIdx}
            src={hotel.images[mobileIdx]}
            alt={`${hotel.name} ${mobileIdx + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>

        {/* Mobile Overlay Buttons */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(15,27,46,0.15)] z-10"
        >
          <ChevronLeft size={20} className="text-[#0F1B2E]" />
        </button>
        <button
          onClick={() => toggleFavorited()}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_2px_12px_rgba(15,27,46,0.15)] z-10"
        >
          <Heart
            size={20}
            className={cn(
              favorited ? 'text-[#E85D4A] fill-[#E85D4A]' : 'text-[#7A8494]'
            )}
          />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {hotel.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setMobileIdx(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                i === mobileIdx ? 'bg-white w-5' : 'bg-white/50'
              )}
            />
          ))}
        </div>

        {/* View All Photos - mobile */}
        <button
          onClick={() => openGallery(mobileIdx)}
          className="absolute bottom-4 right-4 bg-white/90 text-[#1A2B47] font-body text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 z-10"
        >
          <ImageIcon size={14} />
          {t('property.showAll')}
        </button>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0 bg-[#0F1B2E]/95"
              onClick={() => setLightboxOpen(false)}
            />
            {/* Close */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-body text-sm">
              {currentImg + 1} / {hotel.images.length}
            </div>

            {/* Nav Arrows */}
            <button
              onClick={prevImg}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft size={28} className="text-white" />
            </button>
            <button
              onClick={nextImg}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight size={28} className="text-white" />
            </button>

            {/* Main Image */}
            <motion.img
              key={currentImg}
              src={hotel.images[currentImg]}
              alt={`${hotel.name} ${currentImg + 1}`}
              className="relative z-[5] max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: easeSmooth }}
            />

            {/* Thumbnails */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto z-10">
              {hotel.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={cn(
                    'w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200',
                    i === currentImg
                      ? 'border-[#E85D4A] opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 2: Property Header                                        */
/* ------------------------------------------------------------------ */
function PropertyHeader({ hotel }: { hotel: HotelData }) {
  const [favorited, toggleFavorited] = useIsFavorite(Number(hotel.id));
  const { t } = useTranslation();
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.section
      className="bg-white border-b border-[#F0F2F5]"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6 pb-4">
        {/* Breadcrumb */}
        <motion.div
          className="hidden md:flex items-center gap-1 text-xs text-[#7A8494] font-body mb-3"
          variants={fadeUp}
          custom={0}
        >
          {hotel.breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-[#C5CBD4]">&gt;</span>}
              <Link
                to={i === 0 ? '/' : '#'}
                className="hover:text-[#E85D4A] hover:underline transition-colors duration-200"
              >
                {crumb}
              </Link>
            </span>
          ))}
        </motion.div>

        {/* Title Row */}
        <motion.div
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3"
          variants={fadeUp}
          custom={1}
        >
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <h1 className="font-display text-2xl sm:text-3xl md:text-[36px] font-semibold text-[#0F1B2E] leading-tight">
                {hotel.name}
              </h1>
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorited()}
                className="mt-1 md:mt-2 flex-shrink-0 w-9 h-9 rounded-full bg-[#F8F9FB] flex items-center justify-center hover:bg-[#FEF2F0] transition-colors"
                aria-label={t('common.toggleFavorite')}
              >
                <motion.div
                  animate={favorited ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    size={18}
                    className={cn(
                      'transition-colors duration-300',
                      favorited ? 'text-[#E85D4A] fill-[#E85D4A]' : 'text-[#7A8494]'
                    )}
                  />
                </motion.div>
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-[#E85D4A] fill-[#E85D4A]"
                  />
                ))}
              </div>
              <span className="text-xs text-[#7A8494] font-body">{hotel.class}</span>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center md:flex-col md:items-center gap-2 md:gap-0">
            <div className="w-16 h-16 bg-[#0F1B2E] rounded-[12px_12px_12px_0] flex flex-col items-center justify-center">
              <span className="text-white font-body text-xl font-bold">
                {hotel.rating}
              </span>
              <span className="text-white/80 font-body text-[11px] font-medium">
                {hotel.ratingLabel}
              </span>
            </div>
            <span className="text-sm text-[#7A8494] font-body md:mt-1">
              {hotel.reviewCount.toLocaleString()} {t('property.reviews')}
            </span>
          </div>
        </motion.div>

        {/* Address */}
        <motion.div
          className="flex items-center gap-2 flex-wrap"
          variants={fadeUp}
          custom={2}
        >
          <MapPin size={16} className="text-[#E85D4A] flex-shrink-0" />
          <span className="text-sm sm:text-base text-[#7A8494] font-body">
            {hotel.address}, {hotel.city}, {hotel.country}
          </span>
          <button
            onClick={() => scrollToSection('location')}
            className="text-xs sm:text-sm text-[#E85D4A] font-body font-medium hover:underline transition-colors"
          >
            {t('property.showAll')}
          </button>
        </motion.div>

        {/* Highlights */}
        <motion.div
          className="flex flex-wrap gap-2 mt-3"
          variants={fadeUp}
          custom={3}
        >
          {hotel.highlights.map((h, i) => (
            <span
              key={i}
              className="bg-[#FEF2F0] text-[#D14A38] font-body text-xs font-medium px-2.5 py-1 rounded-md"
            >
              {h}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 3: Sticky Tab Navigation                                  */
/* ------------------------------------------------------------------ */
function TabNavigation({ activeTab }: { activeTab: string }) {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const tabs = [
    { label: t('property.about'), id: 'overview' },
    { label: t('property.rooms'), id: 'rooms' },
    { label: t('property.amenities'), id: 'amenities' },
    { label: t('property.reviews'), id: 'reviews', badge: '1,240' },
    { label: t('property.location'), id: 'location' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 130;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={cn(
        'sticky top-[72px] z-[25] bg-white border-b border-[#E2E6EC] transition-shadow duration-300',
        scrolled && 'shadow-[0_2px_8px_rgba(15,27,46,0.06)]'
      )}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollTo(tab.id)}
              className={cn(
                'relative flex-shrink-0 px-4 sm:px-5 py-3.5 font-body text-sm font-medium transition-colors duration-200 whitespace-nowrap',
                activeTab === tab.id
                  ? 'text-[#0F1B2E]'
                  : 'text-[#7A8494] hover:text-[#243B5D]'
              )}
            >
              {tab.label}
              {tab.badge && (
                <span className="ml-1.5 text-[10px] text-[#7A8494] bg-[#F0F2F5] px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E85D4A]"
                  transition={{ duration: 0.25, ease: easeSmooth }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 4: Overview                                               */
/* ------------------------------------------------------------------ */
function OverviewSection({ hotel }: { hotel: HotelData }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const fullText = hotel.description;
  const truncated = fullText.slice(0, 280);

  return (
    <section id="overview" className="bg-white py-8 sm:py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - 65% */}
          <div className="lg:w-[65%]">
            <motion.h2
              className="font-display text-xl sm:text-[22px] font-semibold text-[#0F1B2E] mb-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeSmooth }}
            >
              {t('property.about')}
            </motion.h2>
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeSmooth }}
            >
              <p className="font-body text-sm sm:text-base text-[#4A5468] leading-[1.7]">
                {expanded ? fullText : `${truncated}...`}
              </p>
              <button
                onClick={() => setExpanded((p) => !p)}
                className="text-[#E85D4A] font-body text-sm font-medium mt-2 hover:underline transition-colors"
              >
                {expanded ? t('property.showLess') : t('property.showAll')}
              </button>
            </motion.div>

            {/* House Rules */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeSmooth }}
            >
              <h3 className="font-display text-lg font-semibold text-[#1A2B47] mb-4">
                {t('property.houseRules')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: 'Clock', label: t('hero.checkIn'), value: hotel.checkIn },
                  { icon: 'Clock', label: t('hero.checkOut'), value: hotel.checkOut },
                  { icon: 'Shield', label: t('checkout.bookingCond'), value: hotel.cancellation },
                  { icon: 'Users', label: t('hero.guests'), value: hotel.children },
                  { icon: 'X', label: t('property.petFriendly'), value: hotel.pets },
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <DynIcon name={rule.icon} size={18} className="text-[#E85D4A] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-body text-xs text-[#7A8494]">{rule.label}</p>
                      <p className="font-body text-sm text-[#243B5D] font-medium">{rule.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - 35% */}
          <div className="lg:w-[35%] flex flex-col gap-4">
            {/* Card 1: Popular Facilities */}
            <motion.div
              className="bg-[#F8F9FB] rounded-2xl p-5"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeSmooth }}
            >
              <h4 className="font-display text-base font-semibold text-[#0F1B2E] mb-3">
                {t('property.amenities')}
              </h4>
              <div className="flex flex-col gap-2.5">
                {hotel.popularFacilities.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <DynIcon name={f.icon} size={16} className="text-[#E85D4A] flex-shrink-0" />
                    <span className="font-body text-sm text-[#4A5468]">{f.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 2: Property Highlights */}
            <motion.div
              className="bg-[#F8F9FB] rounded-2xl p-5"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeSmooth }}
            >
              <h4 className="font-display text-base font-semibold text-[#0F1B2E] mb-3">
                {t('property.about')}
              </h4>
              <div className="flex flex-col gap-2.5">
                {hotel.propertyHighlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#2D9F5E] flex-shrink-0" />
                    <span className="font-body text-sm text-[#4A5468]">{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 3: Nearby Attractions */}
            <motion.div
              className="bg-[#F8F9FB] rounded-2xl p-5"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: easeSmooth }}
            >
              <h4 className="font-display text-base font-semibold text-[#0F1B2E] mb-3">
                {t('property.location')}
              </h4>
              <div className="flex flex-col gap-2.5">
                {hotel.nearbyAttractionsQuick.map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-[#E85D4A] flex-shrink-0" />
                    <span className="font-body text-sm text-[#4A5468]">{a.name}</span>
                    <span className="font-body text-xs text-[#7A8494] ml-auto">{a.distance}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 5: Rooms & Rates                                          */
/* ------------------------------------------------------------------ */
function RoomsSection({
  hotel,
  selectedRoom,
  onSelectRoom,
  nights,
}: {
  hotel: HotelData;
  selectedRoom: RoomType | null;
  onSelectRoom: (room: RoomType | null) => void;
  nights: number;
}) {
  const { t } = useTranslation();
  return (
    <section id="rooms" className="bg-[#F8F9FB] py-8 sm:py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeSmooth }}
        >
          <h2 className="font-display text-xl sm:text-[22px] font-semibold text-[#0F1B2E] mb-1">
            {t('property.rooms')}
          </h2>
          <p className="font-body text-sm sm:text-base text-[#7A8494] mb-6">
            {t('hero.checkIn')} — {t('hero.checkOut')}, 2026
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {hotel.roomTypes.map((room, i) => (
            <motion.div
              key={room.id}
              className={cn(
                'bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,27,46,0.06)] transition-all duration-300',
                selectedRoom?.id === room.id
                  ? 'ring-2 ring-[#E85D4A] shadow-[0_8px_30px_rgba(15,27,46,0.1)]'
                  : 'hover:shadow-[0_8px_30px_rgba(15,27,46,0.1)]'
              )}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: easeSmooth }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Room Image */}
                <div className="md:w-[280px] flex-shrink-0 overflow-hidden group">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-[200px] md:h-full object-cover transition-transform duration-400 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Room Details */}
                <div className="flex-1 p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-base sm:text-lg font-semibold text-[#1A2B47]">
                          {room.name}
                        </h3>
                        {room.badge && (
                          <span
                            className={cn(
                              'font-body text-[11px] font-semibold px-2 py-1 rounded-md flex-shrink-0',
                              room.badgeType === 'warning' && 'bg-[#E8A838]/10 text-[#B87A1F]',
                              room.badgeType === 'success' && 'bg-[#2D9F5E]/10 text-[#2D9F5E]',
                              room.badgeType === 'coral' && 'bg-[#FEF2F0] text-[#D14A38]'
                            )}
                          >
                            {room.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-[#7A8494] font-body mb-2">
                        <span className="flex items-center gap-1">
                          <Maximize size={14} className="text-[#C5CBD4]" />
                          {room.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} className="text-[#C5CBD4]" />
                          {room.capacity}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed size={14} className="text-[#C5CBD4]" />
                          {room.bed}
                        </span>
                      </div>

                      <p className="font-body text-xs sm:text-sm text-[#7A8494] mb-3">
                        {room.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.amenities.map((a) => (
                          <span
                            key={a}
                            className="bg-[#F8F9FB] text-[#4A5468] font-body text-xs px-2 py-1 rounded-md"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing + CTA */}
                    <div className="lg:w-[220px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-[#F0F2F5] pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                      <div>
                        <p className="font-display text-2xl sm:text-3xl font-semibold text-[#E85D4A]">
                          {formatPiAmount(room.priceInPi)}
                        </p>
                        <p className="font-body text-xs text-[#7A8494] mt-0.5">{t('search.perNight')}</p>
                        <p className="font-body text-[11px] text-[#C5CBD4] mt-0.5">
                          ≈ ${room.pricePerNight.toLocaleString()} USD
                        </p>
                        <p className="font-body text-sm text-[#4A5468] mt-2">
                          {formatPiAmount(room.totalPriceInPi)} {t('property.forNights').replace('{count}', String(nights))}
                        </p>
                        <p className="font-body text-xs text-[#C5CBD4] mt-0.5">
                          + {formatPiAmount(usdToPi(room.taxes))} {t('checkout.taxesFees')}
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="flex items-center gap-1 text-xs text-[#2D9F5E] font-body mb-3">
                          <Check size={14} />
                          {room.cancellation}
                        </p>
                        <button
                          onClick={() =>
                            onSelectRoom(
                              selectedRoom?.id === room.id ? null : room
                            )
                          }
                          className={cn(
                            'w-full py-3 px-5 rounded-xl font-body text-sm font-semibold transition-all duration-250',
                            selectedRoom?.id === room.id
                              ? 'bg-[#0F1B2E] text-white hover:bg-[#1A2B47]'
                              : 'bg-[#E85D4A] text-white hover:bg-[#D14A38] hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)] active:scale-[0.98]'
                          )}
                        >
                          {selectedRoom?.id === room.id ? t('property.selectRoom') : t('property.bookNow')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 6: Amenities                                              */
/* ------------------------------------------------------------------ */
function AmenitiesSection({ hotel }: { hotel: HotelData }) {
  const { t } = useTranslation();
  return (
    <section id="amenities" className="bg-white py-8 sm:py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeSmooth }}
        >
          <h2 className="font-display text-xl sm:text-[22px] font-semibold text-[#0F1B2E] mb-1">
            {t('property.amenities')}
          </h2>
          <p className="font-body text-sm sm:text-base text-[#7A8494]">
            {t('property.amenitiesSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          {hotel.amenities.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: easeSmooth }}
            >
              <div className="flex items-center gap-2 mb-3">
                <DynIcon name={cat.icon} size={18} className="text-[#E85D4A]" />
                <h4 className="font-display text-base font-semibold text-[#1A2B47]">
                  {cat.category}
                </h4>
              </div>
              <div className="flex flex-col gap-2">
                {cat.items.map((item) => (
                  <div key={item.name} className="flex items-start gap-2">
                    {item.available ? (
                      <Check size={14} className="text-[#2D9F5E] mt-0.5 flex-shrink-0" />
                    ) : (
                      <X size={14} className="text-[#C5CBD4] mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={cn(
                        'font-body text-sm',
                        item.available ? 'text-[#4A5468]' : 'text-[#C5CBD4] line-through'
                      )}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Review Card (with expandable text)                                */
/* ------------------------------------------------------------------ */
function ReviewCard({
  review,
  index,
}: {
  review: HotelData['reviews'][number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const maxChars = 180;
  const isLong = review.text.length > maxChars;
  const displayText = expanded || !isLong ? review.text : review.text.slice(0, maxChars) + '...';

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(15,27,46,0.04)] hover:shadow-[0_4px_16px_rgba(15,27,46,0.08)] transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: easeSmooth }}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-body text-sm font-semibold text-[#1A2B47]">
              {review.name}
            </p>
            <p className="font-body text-xs text-[#7A8494]">{review.date}</p>
          </div>
        </div>
        <div className="bg-[#0F1B2E] text-white font-body text-sm font-bold px-2.5 py-1 rounded-lg">
          {review.score}
        </div>
      </div>

      <h4 className="font-display text-base font-semibold text-[#1A2B47] mb-1">
        &ldquo;{review.title}&rdquo;
      </h4>
      <p className="font-body text-sm text-[#4A5468] leading-relaxed mb-3">
        {displayText}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="text-[#E85D4A] font-body text-xs font-medium mb-3 hover:underline transition-colors"
        >
          {expanded ? t('property.showLess') : t('property.showAll')}
        </button>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {review.tags.map((tag) => (
          <span
            key={tag}
            className="bg-[#FEF2F0] text-[#D14A38] font-body text-xs font-medium px-2 py-0.5 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      <button className="flex items-center gap-1.5 text-[#7A8494] hover:text-[#E85D4A] transition-colors">
        <ThumbsUp size={14} />
        <span className="font-body text-xs">{t('property.helpful').replace('{count}', String(review.helpful))}</span>
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 7: Reviews                                                */
/* ------------------------------------------------------------------ */
function ReviewsSection({ hotel }: { hotel: HotelData }) {
  const [filter, setFilter] = useState('All');
  const { t } = useTranslation();
  const filterDefs = [
    { key: 'All', label: t('property.filterAll') },
    { key: 'Couples', label: t('property.filterCouples') },
    { key: 'Families', label: t('property.filterFamilies') },
    { key: 'Solo', label: t('property.filterSolo') },
    { key: 'Business', label: t('property.filterBusiness') },
  ];

  const filteredReviews =
    filter === 'All'
      ? hotel.reviews
      : hotel.reviews.filter((r) =>
          r.tags.some((tag) =>
            filter === 'Couples'
              ? tag === 'Couple'
              : filter === 'Families'
              ? tag === 'Family'
              : filter === 'Solo'
              ? tag === 'Solo'
              : tag === 'Business'
          )
        );

  const breakdown = [
    { label: t('property.ratingStaff'), score: hotel.ratingBreakdown.staff },
    { label: t('property.ratingFacilities'), score: hotel.ratingBreakdown.facilities },
    { label: t('property.ratingCleanliness'), score: hotel.ratingBreakdown.cleanliness },
    { label: t('property.ratingComfort'), score: hotel.ratingBreakdown.comfort },
    { label: t('property.ratingValue'), score: hotel.ratingBreakdown.value },
    { label: t('property.ratingLocation'), score: hotel.ratingBreakdown.location },
    { label: t('property.ratingWifi'), score: hotel.ratingBreakdown.wifi },
  ];

  const topCategories = [
    { label: t('property.ratingCleanliness'), score: hotel.ratingBreakdown.cleanliness },
    { label: t('property.ratingLocation'), score: hotel.ratingBreakdown.location },
    { label: t('property.ratingStaff'), score: hotel.ratingBreakdown.staff },
  ];

  return (
    <section id="reviews" className="bg-[#F8F9FB] py-8 sm:py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeSmooth }}
        >
          <div>
            <h2 className="font-display text-xl sm:text-[22px] font-semibold text-[#0F1B2E]">
              {t('property.reviews')}
            </h2>
            <p className="font-body text-sm text-[#7A8494] mt-1">
              {hotel.reviews.length} {t('property.reviews')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterDefs.map((fd) => (
              <button
                key={fd.key}
                onClick={() => setFilter(fd.key)}
                className={cn(
                  'px-3 py-1.5 rounded-full font-body text-xs font-medium transition-colors duration-200',
                  filter === fd.key
                    ? 'bg-[#0F1B2E] text-white'
                    : 'bg-white text-[#4A5468] border border-[#E2E6EC] hover:border-[#C5CBD4]'
                )}
              >
                {fd.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Rating Overview */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeSmooth }}
        >
          {/* Overall Score */}
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-[#0F1B2E] rounded-[16px_16px_16px_0] flex flex-col items-center justify-center">
              <span className="text-white font-body text-3xl font-bold">{hotel.rating}</span>
              <span className="text-white/80 font-body text-xs">{hotel.ratingLabel}</span>
            </div>
            <p className="font-body text-sm text-[#7A8494] mt-3">
              {hotel.reviewCount.toLocaleString()} {t('property.reviews')}
            </p>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-2xl p-6">
            <h4 className="font-display text-sm font-semibold text-[#0F1B2E] mb-4">
              {t('property.topCategories')}
            </h4>
            <div className="flex flex-col gap-3">
              {topCategories.map((cat) => (
                <div key={cat.label} className="flex items-center gap-3">
                  <span className="font-body text-sm text-[#4A5468] w-24">{cat.label}</span>
                  <div className="flex-1 h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2D9F5E] rounded-full transition-all duration-500"
                      style={{ width: `${(cat.score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="font-body text-sm font-semibold text-[#1A2B47] w-8 text-right">
                    {cat.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white rounded-2xl p-6">
            <h4 className="font-display text-sm font-semibold text-[#0F1B2E] mb-4">
              {t('property.ratingBreakdown')}
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="font-body text-xs text-[#7A8494]">{item.label}</span>
                  <span className="font-body text-sm font-semibold text-[#1A2B47]">{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 8: Location                                               */
/* ------------------------------------------------------------------ */
function LocationSection({ hotel }: { hotel: HotelData }) {
  const { t } = useTranslation();
  return (
    <section id="location" className="bg-white py-8 sm:py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeSmooth }}
        >
          <h2 className="font-display text-xl sm:text-[22px] font-semibold text-[#0F1B2E] mb-1">
            {t('property.location')}
          </h2>
          <p className="font-body text-sm text-[#7A8494] mb-4">
            {hotel.address}, {hotel.city}, {hotel.country}
          </p>
        </motion.div>

        <motion.div
          className="aspect-[16/7] rounded-2xl overflow-hidden bg-[#F0F2F5]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeSmooth }}
        >
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20000!2d${hotel.mapCoordinates.lng}!3d${hotel.mapCoordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDUyJzE4LjAiTiAxMjHCsDQ4JzA3LjAiRQ!5e0!3m2!1sen!2sus!4v1`}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(0.2)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${hotel.name} location`}
          />
        </motion.div>

        {/* Nearby Attractions */}
        <motion.div
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: easeSmooth }}
        >
          {hotel.nearbyAttractions.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-[#F8F9FB] rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-[#FEF2F0] flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-[#E85D4A]" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-[#1A2B47]">{a.name}</p>
                <p className="font-body text-xs text-[#7A8494]">{a.type} · {a.distance}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 9: Similar Properties                                     */
/* ------------------------------------------------------------------ */
function SimilarProperties({ hotel }: { hotel: HotelData }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const similar = hotel.similarProperties || [];

  return (
    <section className="bg-[#F8F9FB] py-8 sm:py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeSmooth }}
        >
          <h2 className="font-display text-xl sm:text-[22px] font-semibold text-[#0F1B2E] mb-6">
            {t('property.similarTitle')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {similar.map((prop, i) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: easeSmooth }}
              onClick={() => navigate(`/property/${prop.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,27,46,0.06)] hover:shadow-[0_8px_24px_rgba(15,27,46,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={prop.image}
                  alt={prop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-body text-sm font-semibold text-[#1A2B47]">{prop.name}</h3>
                <p className="font-body text-xs text-[#7A8494] mt-1">{prop.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-[#E8A838] fill-[#E8A838]" />
                    <span className="font-body text-xs text-[#4A5468]">{prop.rating}</span>
                  </div>
                  <span className="font-body text-sm font-semibold text-[#E85D4A]">
                    {formatPiAmount(usdToPi(prop.price))}<span className="text-xs font-normal text-[#7A8494]">/{t('search.perNight')}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Property Detail Page                                              */
/* ------------------------------------------------------------------ */
export default function PropertyDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);

  const hotel = getHotelById(id ?? '');

  // Dates & guests from URL params (passed by HeroSection/CompactSearchBar)
  const checkInParam = searchParams.get('checkIn') || '';
  const checkOutParam = searchParams.get('checkOut') || '';
  const adultsParam = parseInt(searchParams.get('adults') || '2', 10);
  const childrenParam = parseInt(searchParams.get('children') || '0', 10);
  const roomsParam = parseInt(searchParams.get('rooms') || '1', 10);
  const nightsFromParams = (() => {
    if (!checkInParam || !checkOutParam) return 7;
    const ms = new Date(checkOutParam).getTime() - new Date(checkInParam).getTime();
    const n = Math.round(ms / 86400000);
    return n > 0 ? n : 7;
  })();
  const guestLabel = `${adultsParam} ${adultsParam === 1 ? t('hero.adult') : t('hero.adults')}${childrenParam > 0 ? ` · ${childrenParam} ${childrenParam === 1 ? t('hero.child') : t('hero.children')}` : ''}${roomsParam > 1 ? ` · ${roomsParam} ${t('hero.rooms')}` : ''}`;

  useEffect(() => {
    if (!hotel) {
      navigate('/search');
      return;
    }

    const handleScroll = () => {
      const sections = ['overview', 'rooms', 'amenities', 'reviews', 'location'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hotel, navigate]);

  if (!hotel) return null;

  return (
    <Layout>
      <div className="min-h-[100dvh]">
        <PhotoGallery hotel={hotel} />
        <PropertyHeader hotel={hotel} />
        <TabNavigation activeTab={activeTab} />
        <OverviewSection hotel={hotel} />
        <RoomsSection hotel={hotel} selectedRoom={selectedRoom} onSelectRoom={setSelectedRoom} nights={nightsFromParams} />
        <AmenitiesSection hotel={hotel} />
        <ReviewsSection hotel={hotel} />
        <LocationSection hotel={hotel} />
        <SimilarProperties hotel={hotel} />
      </div>

      {/* Sticky Checkout Bar */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E6EC] shadow-[0_-4px_20px_rgba(15,27,46,0.1)] flex items-center justify-between px-6 py-4"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div>
              <p className="font-body text-sm font-semibold text-[#1A2B47]">{selectedRoom.name}</p>
              <p className="font-display text-lg font-semibold text-[#E85D4A]">{formatPiAmount(selectedRoom.totalPriceInPi)}</p>
            </div>
            <button
              onClick={() =>
                navigate('/checkout', {
                  state: {
                    hotelId: hotel.id,
                    hotelName: hotel.name,
                    roomType: selectedRoom.name,
                    image: hotel.images[0],
                    location: hotel.city + ', ' + hotel.country,
                    pricePerNight: selectedRoom.pricePerNight,
                    totalUsd: selectedRoom.totalPrice,
                    totalPi: selectedRoom.totalPriceInPi,
                    taxes: selectedRoom.taxes,
                    checkIn: checkInParam,
                    checkOut: checkOutParam,
                    nights: nightsFromParams,
                    guests: guestLabel,
                  },
                })
              }
              className="bg-[#E85D4A] hover:bg-[#D14A38] text-white font-body font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)] active:scale-[0.98]"
            >
              {t('checkout.proceedToCheckout')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
