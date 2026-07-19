import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, ChevronLeft, ChevronRight, Star, Check, Wifi, Waves, UtensilsCrossed, Car, Dumbbell, Wine, Wind, Tv, CookingPot, Dog, Umbrella } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { Hotel } from '@/types/search';
import { usdToPi, formatPiAmount } from '@/lib/piPayments';

interface HotelCardProps {
  hotel: Hotel;
  index: number;
  viewMode: 'list' | 'map';
  isActive?: boolean;
  onHover?: () => void;
}

const AMENITY_ICONS: Record<string, React.ElementType> = {
  WiFi: Wifi,
  Pool: Waves,
  Restaurant: UtensilsCrossed,
  Parking: Car,
  Gym: Dumbbell,
  Bar: Wine,
  AC: Wind,
  Breakfast: UtensilsCrossed,
  Beachfront: Umbrella,
  Kitchen: CookingPot,
  'Pet Friendly': Dog,
  Spa: Waves,
  TV: Tv,
};

export default function HotelCard({ hotel, index, viewMode, isActive, onHover }: HotelCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  const discount = Math.round(
    ((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100
  );

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % hotel.images.length);
  };
  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  if (viewMode === 'map') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        onMouseEnter={onHover}
        className={cn(
          'flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200',
          isActive
            ? 'bg-white border-l-[3px] border-[#E85D4A] shadow-md'
            : 'bg-white border border-[#E2E6EC] hover:shadow-sm'
        )}
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-body text-sm font-semibold text-[#1A2B47] truncate">
            {hotel.name}
          </h4>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="bg-[#0F1B2E] text-white font-body text-xs font-bold px-1.5 py-0.5 rounded-md">
              {hotel.rating}
            </span>
            <span className="font-body text-xs text-[#7A8494]">{hotel.ratingLabel}</span>
          </div>
          <p className="font-body text-sm font-bold text-[#E85D4A] mt-1">
            {formatPiAmount(usdToPi(hotel.price))}
            <span className="text-xs font-normal text-[#7A8494]">/night</span>
          </p>
          <p className="font-body text-[10px] text-[#C5CBD4]">≈ ${hotel.price} USD</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      onMouseEnter={onHover}
      className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(15,27,46,0.06)] overflow-hidden hover:shadow-[0_8px_30px_rgba(15,27,46,0.1)] hover:-translate-y-0.5 transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Area */}
        <div
          className="relative w-full md:w-[40%] aspect-[16/10] md:aspect-[4/3] overflow-hidden shrink-0"
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
        >
          <img
            src={hotel.images[imgIndex]}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.03]"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-[#E85D4A] hover:bg-[#E85D4A] text-white font-body text-[11px] font-semibold px-2 py-1 rounded-md">
              -{discount}%
            </Badge>
          )}

          {/* Favorite Button */}
          <button
            onClick={() => setIsFav(!isFav)}
            className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
          >
            <motion.div
              animate={isFav ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={18}
                className={cn(
                  'transition-colors duration-200',
                  isFav ? 'fill-[#E85D4A] text-[#E85D4A]' : 'text-[#7A8494]'
                )}
              />
            </motion.div>
          </button>

          {/* Image Navigation Arrows */}
          {imgHovered && hotel.images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200"
              >
                <ChevronLeft size={18} className="text-[#1A2B47]" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200"
              >
                <ChevronRight size={18} className="text-[#1A2B47]" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {hotel.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-[rgba(15,27,46,0.7)] text-white font-body text-[11px] font-medium px-2 py-1 rounded-md">
              {imgIndex + 1}/{hotel.images.length}
            </div>
          )}

          {/* Image Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {hotel.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setImgIndex(i);
                }}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all duration-200',
                  i === imgIndex ? 'bg-white w-4' : 'bg-white/50'
                )}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          {/* Top Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-body text-base sm:text-lg font-semibold text-[#1A2B47] truncate">
                  {hotel.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className="fill-[#E8A838] text-[#E8A838]"
                    />
                  ))}
                </div>
                <Badge
                  variant="outline"
                  className="font-body text-[10px] text-[#7A8494] border-[#E2E6EC] px-1.5 py-0"
                >
                  {hotel.propertyType}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="bg-[#0F1B2E] text-white font-body text-sm font-bold px-2.5 py-1 rounded-lg rounded-bl-none">
                {hotel.rating}
              </span>
              <span className="font-body text-xs text-[#7A8494] mt-0.5">
                {hotel.ratingLabel}
              </span>
              <span className="font-body text-[11px] text-[#C5CBD4]">
                {hotel.reviewCount.toLocaleString('en-US')} reviews
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mt-2">
            <MapPin size={14} className="text-[#C5CBD4] shrink-0" />
            <span className="font-body text-sm text-[#7A8494] truncate">{hotel.location}</span>
            <span className="font-body text-xs text-[#E85D4A] shrink-0 cursor-pointer hover:underline">
              Show on map
            </span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mt-3">
            {hotel.amenities.slice(0, 5).map((amenity) => {
              const IconComp = AMENITY_ICONS[amenity];
              return (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 bg-[#FEF2F0] text-[#E85D4A] font-body text-[11px] font-medium px-2 py-1 rounded-md"
                >
                  {IconComp && <IconComp size={12} />}
                  {amenity}
                </span>
              );
            })}
            {hotel.amenities.length > 5 && (
              <span className="font-body text-[11px] text-[#7A8494] px-1 py-1">
                +{hotel.amenities.length - 5}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="font-body text-sm text-[#7A8494] mt-2 line-clamp-2 leading-relaxed">
            {hotel.description}
          </p>

          <div className="mt-auto pt-3 border-t border-[#F0F2F5]">
            <div className="flex items-end justify-between">
              {/* Left: Tags */}
              <div className="flex flex-col gap-1">
                {hotel.freeCancellation && (
                  <span className="inline-flex items-center gap-1 font-body text-xs text-[#2D9F5E]">
                    <Check size={13} />
                    Free cancellation
                  </span>
                )}
                {hotel.breakfastIncluded && (
                  <span className="inline-flex items-center gap-1 font-body text-xs text-[#2D9F5E]">
                    <Check size={13} />
                    Breakfast included
                  </span>
                )}
                {hotel.roomsLeft && hotel.roomsLeft < 5 && (
                  <span className="font-body text-xs text-[#E8A838] font-medium">
                    Only {hotel.roomsLeft} rooms left!
                  </span>
                )}
              </div>

              {/* Right: Price + CTA */}
              <div className="text-right shrink-0 ml-4">
                {hotel.originalPrice > hotel.price && (
                  <span className="font-body text-sm text-[#C5CBD4] line-through mr-2">
                    {formatPiAmount(usdToPi(hotel.originalPrice))}
                  </span>
                )}
                <span className="font-display text-xl sm:text-2xl font-bold text-[#E85D4A]">
                  {formatPiAmount(usdToPi(hotel.price))}
                </span>
                <p className="font-body text-[11px] text-[#7A8494]">per night</p>
                <p className="font-body text-[11px] text-[#C5CBD4]">≈ ${hotel.price} USD</p>
                <Link
                  to={`/property/${hotel.id}`}
                  className="inline-block mt-2 px-5 py-2.5 bg-[#E85D4A] hover:bg-[#D14A38] text-white font-body text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)]"
                >
                  View Deal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Local cn helper to avoid import issues */
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
