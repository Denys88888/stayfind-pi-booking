import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { getHotelById } from '@/data/propertyData';
import { formatPiAmount, usdToPi } from '@/lib/piPayments';
import type { HotelData, RoomType } from '@/data/propertyData';

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
  const [favorited, setFavorited] = useState(false);
  const [mobileIdx, setMobileIdx] = useState(0);
  const navigate = useNavigate();

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
          onClick={() => setFavorited((p) => !p)}
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
          View All Photos
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
          onClick={() => setFavorited((p) => !p)}
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
          View All
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
  const [favorited, setFavorited] = useState(false);
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
                onClick={() => setFavorited((p) => !p)}
                className="mt-1 md:mt-2 flex-shrink-0 w-9 h-9 rounded-full bg-[#F8F9FB] flex items-center justify-center hover:bg-[#FEF2F0] transition-colors"
                aria-label="Toggle favorite"
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
              {hotel.reviewCount.toLocaleString()} reviews
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
            Show on map
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
  const tabs = [
    { label: 'Overview', id: 'overview' },
    { label: 'Rooms & Rates', id: 'rooms' },
    { label: 'Amenities', id: 'amenities' },
    { label: 'Reviews', id: 'reviews', badge: '1,240' },
    { label: 'Location', id: 'location' },
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
              About This Property
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
                {expanded ? 'Show less' : 'Read more'}
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
                House Rules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: 'Clock', label: 'Check-in', value: hotel.checkIn },
                  { icon: 'Clock', label: 'Check-out', value: hotel.checkOut },
                  { icon: 'Shield', label: 'Cancellation', value: hotel.cancellation },
                  { icon: 'Users', label: 'Children', value: hotel.children },
                  { icon: 'X', label: 'Pets', value: hotel.pets },
                  { icon: 'X', label: 'Smoking', value: hotel.smoking },
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
            {/* Quick Info Cards */}
            {/* Card 1: Popular Facilities */}
            <motion.div
              className="bg-[#F8F9FB] rounded-2xl p-5"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: easeSmooth }}
            >
              <h4 className="font-display text-base font-semibold text-[#0F1B2E] mb-3">
                Most Popular Facilities
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
                Property Highlights
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
                Nearby Attractions
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
}: {
  hotel: HotelData;
  selectedRoom: RoomType | null;
  onSelectRoom: (room: RoomType | null) => void;
}) {
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
            Available Rooms
          </h2>
          <p className="font-body text-sm sm:text-base text-[#7A8494] mb-6">
            Select your preferred room for Dec 15 – Dec 22, 2025
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
                        <p className="font-body text-xs text-[#7A8494] mt-0.5">per night</p>
                        <p className="font-body text-[11px] text-[#C5CBD4] mt-0.5">
                          ≈ ${room.pricePerNight.toLocaleString()} USD
                        </p>
                        <p className="font-body text-sm text-[#4A5468] mt-2">
                          {formatPiAmount(room.totalPriceInPi)} for 7 nights
                        </p>
                        <p className="font-body text-xs text-[#C5CBD4] mt-0.5">
                          + {formatPiAmount(usdToPi(room.taxes))} taxes and fees
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
                          {selectedRoom?.id === room.id ? 'Selected' : 'Reserve'}
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
            What This Place Offers
          </h2>
          <p className="font-body text-sm sm:text-base text-[#7A8494]">
            Everything you need for a comfortable stay
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
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {review.tags.map((t) => (
          <span
            key={t}
            className="bg-[#FEF2F0] text-[#D14A38] font-body text-xs font-medium px-2 py-0.5 rounded-md"
          >
            {t}
          </span>
        ))}
      </div>

      <button className="flex items-center gap-1.5 text-[#7A8494] hover:text-[#E85D4A] transition-colors">
        <ThumbsUp size={14} />
        <span className="font-body text-xs">Helpful ({review.helpful})</span>
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 7: Reviews                                                */
/* ------------------------------------------------------------------ */
function ReviewsSection({ hotel }: { hotel: HotelData }) {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Couples', 'Families', 'Solo', 'Business'];

  const filteredReviews =
    filter === 'All'
      ? hotel.reviews
      : hotel.reviews.filter((r) =>
          r.tags.some((t) =>
            filter === 'Couples'
              ? t === 'Couple'
              : filter === 'Families'
              ? t === 'Family'
              : filter === 'Solo'
              ? t === 'Solo'
              : t === 'Business'
          )
        );

  const breakdown = [
    { label: 'Staff', score: hotel.ratingBreakdown.staff },
    { label: 'Facilities', score: hotel.ratingBreakdown.facilities },
    { label: 'Cleanliness', score: hotel.ratingBreakdown.cleanliness },
    { label: 'Comfort', score: hotel.ratingBreakdown.comfort },
    { label: 'Value for money', score: hotel.ratingBreakdown.value },
    { label: 'Location', score: hotel.ratingBreakdown.location },
    { label: 'Free WiFi', score: hotel.ratingBreakdown.wifi },
  ];

  const topCategories = [
    { label: 'Cleanliness', score: hotel.ratingBreakdown.cleanliness },
    { label: 'Location', score: hotel.ratingBreakdown.location },
    { label: 'Staff', score: hotel.ratingBreakdown.staff },
  ];

  return (
    <section id="reviews" className="bg-[#F8F9FB] py-8 sm:py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeSmooth }}
        >
          <h2 className="font-display text-xl sm:text-[22px] font-semibold text-[#0F1B2E] mb-3">
            Guest Reviews
          </h2>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-display text-3xl sm:text-4xl font-semibold text-[#0F1B2E]">
              {hotel.rating}
            </span>
            <div>
              <p className="font-display text-base font-semibold text-[#1A2B47]">
                {hotel.ratingLabel}
              </p>
              <p className="font-body text-sm text-[#7A8494]">
                {hotel.reviewCount.toLocaleString()} verified reviews
              </p>
            </div>
          </div>
        </motion.div>

        {/* Rating Breakdown */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeSmooth }}
        >
          {/* Left: Bars */}
          <div className="flex flex-col gap-3">
            {breakdown.map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="font-body text-sm text-[#7A8494] w-28 flex-shrink-0">
                  {item.label}
                </span>
                <div className="flex-1 h-1 bg-[#E2E6EC] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#E85D4A] rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.score * 10}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: easeSmooth }}
                  />
                </div>
                <span className="font-body text-sm text-[#1A2B47] font-medium w-10 text-right">
                  {item.score}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Top Score Badges */}
          <div className="flex flex-wrap content-start gap-3">
            {topCategories.map((cat) => (
              <div
                key={cat.label}
                className="bg-[#2D9F5E]/10 text-[#2D9F5E] font-body text-sm font-medium px-4 py-2 rounded-xl"
              >
                {cat.label}: {cat.score}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'font-body text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200',
                filter === f
                  ? 'bg-[#0F1B2E] text-white border-[#0F1B2E]'
                  : 'bg-white text-[#243B5D] border-[#E2E6EC] hover:border-[#C5CBD4]'
              )}
            >
              {f}
            </button>
          ))}
        </div>

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
  return (
    <section id="location" className="bg-white py-8 sm:py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeSmooth }}
        >
          <h2 className="font-display text-xl sm:text-[22px] font-semibold text-[#0F1B2E] mb-2">
            Where You&apos;ll Be
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <MapPin size={16} className="text-[#E85D4A]" />
            <span className="font-body text-sm sm:text-base text-[#7A8494]">
              {hotel.address}, {hotel.city}, {hotel.country}
            </span>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          className="relative h-[300px] sm:h-[400px] rounded-2xl overflow-hidden mb-6"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeSmooth }}
        >
          <iframe
            title={`Map of ${hotel.name}`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${
              hotel.mapCoordinates.lng - 0.02
            }%2C${hotel.mapCoordinates.lat - 0.02}%2C${
              hotel.mapCoordinates.lng + 0.02
            }%2C${hotel.mapCoordinates.lat + 0.02}&layer=mapnik&marker=${
              hotel.mapCoordinates.lat
            }%2C${hotel.mapCoordinates.lng}`}
            className="w-full h-full border-0"
          />
          {/* Hotel Marker Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
            <div className="relative">
              <div className="w-12 h-12 bg-[#E85D4A] rounded-full flex items-center justify-center shadow-lg">
                <MapPin size={22} className="text-white" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#E85D4A] rotate-45" />
            </div>
          </div>
        </motion.div>

        {/* Nearby Attractions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotel.nearbyAttractions.map((attr, i) => (
            <motion.div
              key={attr.name}
              className="flex items-center gap-3 p-4 bg-[#F8F9FB] rounded-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: easeSmooth }}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <MapPin size={18} className="text-[#E85D4A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-[#1A2B47] truncate">
                  {attr.name}
                </p>
                <p className="font-body text-xs text-[#7A8494]">
                  {attr.type} · {attr.distance} · {attr.walkTime}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Similar Properties Carousel                                       */
/* ------------------------------------------------------------------ */
function SimilarProperties({ hotel }: { hotel: HotelData }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-[#F8F9FB] py-8 sm:py-10 border-t border-[#E2E6EC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            className="font-display text-xl sm:text-[22px] font-semibold text-[#0F1B2E]"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeSmooth }}
          >
            Similar Properties
          </motion.h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white border border-[#E2E6EC] flex items-center justify-center hover:border-[#C5CBD4] transition-colors"
            >
              <ChevronLeft size={18} className="text-[#1A2B47]" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white border border-[#E2E6EC] flex items-center justify-center hover:border-[#C5CBD4] transition-colors"
            >
              <ChevronRight size={18} className="text-[#1A2B47]" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {hotel.similarProperties.map((prop, i) => (
            <motion.div
              key={prop.id}
              className="min-w-[280px] max-w-[300px] flex-1 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,27,46,0.06)] hover:shadow-[0_12px_40px_rgba(15,27,46,0.12)] hover:-translate-y-1 transition-all duration-350 cursor-pointer flex-shrink-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: easeSmooth }}
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={prop.image}
                  alt={prop.name}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {prop.tags.map((t) => (
                    <span
                      key={t}
                      className="bg-[#FEF2F0] text-[#D14A38] font-body text-[10px] font-medium px-2 py-0.5 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-semibold text-[#1A2B47] mb-1">
                  {prop.name}
                </h3>
                <p className="font-body text-xs text-[#7A8494] mb-2">{prop.location}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#0F1B2E] text-white font-body text-xs font-bold px-1.5 py-0.5 rounded-md">
                      {prop.rating}
                    </div>
                    <span className="font-body text-xs text-[#7A8494]">
                      ({prop.reviewCount.toLocaleString()})
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold text-[#E85D4A]">
                      {formatPiAmount(usdToPi(prop.price))}
                    </p>
                    <p className="font-body text-[10px] text-[#C5CBD4]">≈ ${prop.price.toLocaleString()} USD</p>
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
/*  Sticky Booking Sidebar (Desktop)                                  */
/* ------------------------------------------------------------------ */
function BookingSidebar({
  hotel,
  selectedRoom,
}: {
  hotel: HotelData;
  selectedRoom: RoomType | null;
}) {
  const navigate = useNavigate();

  if (!selectedRoom) return null;

  return (
    <motion.div
      className="hidden lg:block sticky top-[140px] z-20"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: easeSmooth }}
    >
      <div className="bg-white rounded-2xl border border-[#E2E6EC] shadow-[0_4px_20px_rgba(15,27,46,0.08)] p-5">
        <h3 className="font-display text-base font-semibold text-[#0F1B2E] mb-4">
          Booking Summary
        </h3>

        <div className="flex gap-3 mb-4">
          <img
            src={selectedRoom.image}
            alt={selectedRoom.name}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          />
          <div>
            <p className="font-body text-sm font-semibold text-[#1A2B47]">
              {selectedRoom.name}
            </p>
            <p className="font-body text-xs text-[#7A8494]">{hotel.name}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-[#F0F2F5]">
          <div className="flex justify-between font-body text-sm">
            <span className="text-[#7A8494]">7 nights</span>
            <span className="text-[#1A2B47]">{formatPiAmount(selectedRoom.totalPriceInPi)}</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span className="text-[#7A8494]">Taxes & fees</span>
            <span className="text-[#1A2B47]">{formatPiAmount(usdToPi(selectedRoom.taxes))}</span>
          </div>
        </div>

        <div className="flex justify-between mb-5">
          <span className="font-body text-base font-semibold text-[#0F1B2E]">Total</span>
          <div className="text-right">
            <span className="font-display text-xl font-semibold text-[#E85D4A]">
              {formatPiAmount(selectedRoom.totalPriceInPi + usdToPi(selectedRoom.taxes))}
            </span>
            <p className="font-body text-[11px] text-[#C5CBD4]">
              ≈ ${(selectedRoom.totalPrice + selectedRoom.taxes).toLocaleString()} USD
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3.5 bg-[#E85D4A] text-white font-body text-base font-semibold rounded-xl hover:bg-[#D14A38] hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)] active:scale-[0.98] transition-all duration-250"
        >
          Reserve Now
        </button>

        <p className="flex items-center justify-center gap-1 mt-3 text-xs text-[#2D9F5E] font-body">
          <Check size={14} />
          {selectedRoom.cancellation}
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Sticky Booking Bar                                         */
/* ------------------------------------------------------------------ */
function MobileBookingBar({
  selectedRoom,
  onScrollToRooms,
}: {
  selectedRoom: RoomType | null;
  onScrollToRooms: () => void;
}) {
  if (!selectedRoom) return null;

  return (
    <motion.div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E6EC] shadow-[0_-4px_20px_rgba(15,27,46,0.08)] px-4 py-3"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: easeSmooth }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-[#E85D4A]">
            {formatPiAmount(selectedRoom.priceInPi)}
            <span className="font-body text-xs text-[#7A8494] font-normal">/night</span>
          </p>
          <p className="font-body text-[10px] text-[#C5CBD4]">≈ ${selectedRoom.pricePerNight.toLocaleString()} USD</p>
          <p className="font-body text-xs text-[#2D9F5E]">{selectedRoom.name} selected</p>
        </div>
        <button
          onClick={onScrollToRooms}
          className="px-6 py-3 bg-[#E85D4A] text-white font-body text-sm font-semibold rounded-xl hover:bg-[#D14A38] active:scale-[0.98] transition-all"
        >
          Change Room
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                               */
/* ------------------------------------------------------------------ */
export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const hotel = getHotelById(id || '1');
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  /* Active tab tracking via IntersectionObserver */
  useEffect(() => {
    const sections = ['overview', 'rooms', 'amenities', 'reviews', 'location'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [id]);

  const scrollToRooms = () => {
    const el = document.getElementById('rooms');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      <PhotoGallery hotel={hotel} />
      <PropertyHeader hotel={hotel} />
      <TabNavigation activeTab={activeTab} />

      <div className="relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <OverviewSection hotel={hotel} />
              <RoomsSection
                hotel={hotel}
                selectedRoom={selectedRoom}
                onSelectRoom={setSelectedRoom}
              />
              <AmenitiesSection hotel={hotel} />
              <ReviewsSection hotel={hotel} />
              <LocationSection hotel={hotel} />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-[300px] flex-shrink-0">
              <BookingSidebar hotel={hotel} selectedRoom={selectedRoom} />
            </div>
          </div>
        </div>
      </div>

      <SimilarProperties hotel={hotel} />

      {/* Mobile Bottom Bar */}
      <MobileBookingBar selectedRoom={selectedRoom} onScrollToRooms={scrollToRooms} />

      {/* Mobile bottom padding when bar is shown */}
      {selectedRoom && <div className="lg:hidden h-20" />}
    </Layout>
  );
}
