import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Check, ChevronLeft, Star, Minus, Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { fetchListing, type Listing } from '@/lib/listingsStorage';
import { fetchReviews, type Review } from '@/lib/reviewsStorage';
import { formatPiAmount, usdToPi } from '@/lib/piPayments';
import { checkAvailability } from '@/lib/bookingStorage';

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [checkIn, setCheckIn] = useState(addDays(new Date(), 7));
  const [checkOut, setCheckOut] = useState(addDays(new Date(), 8));
  const [availability, setAvailability] = useState<'checking' | 'available' | 'unavailable'>('available');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchListing(id), fetchReviews(id)]).then(([l, r]) => {
      setListing(l);
      setReviews(r);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!id || !listing || !checkIn || !checkOut || checkOut <= checkIn) return;
    setAvailability('checking');
    let cancelled = false;
    checkAvailability(id, listing.propertyType, checkIn, checkOut).then((ok) => {
      if (!cancelled) setAvailability(ok ? 'available' : 'unavailable');
    });
    return () => { cancelled = true; };
  }, [id, listing, checkIn, checkOut]);

  const nights = checkIn && checkOut && checkOut > checkIn
    ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
    : 0;

  const guestLabel = `${adults} ${adults === 1 ? t('hero.adult') : t('hero.adults')}${
    children > 0 ? ` · ${children} ${children === 1 ? t('hero.child') : t('hero.children')}` : ''
  }`;

  const avgRating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : null;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[calc(100dvh-100px)] pt-[72px] flex items-center justify-center">
          <p className="font-body text-[#7A8494]">{t('common.loading')}</p>
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="min-h-[calc(100dvh-100px)] pt-[72px] flex items-center justify-center">
          <p className="font-body text-[#7A8494]">{t('listing.notFound')}</p>
        </div>
      </Layout>
    );
  }

  const piPrice = usdToPi(listing.price);
  const subtotal = listing.price * Math.max(nights, 1);
  const taxes = Math.round(subtotal * 0.1 * 100) / 100;

  const handleBook = () => {
    if (availability !== 'available' || nights < 1) return;
    navigate('/checkout', {
      state: {
        hotelId: String(listing.id),
        hotelName: listing.name,
        roomType: listing.propertyType,
        image: listing.images[0],
        location: listing.location,
        pricePerNight: listing.price,
        taxes,
        totalUsd: Math.round((subtotal + taxes) * 100) / 100,
        nights,
        guests: guestLabel,
        checkIn,
        checkOut,
      },
    });
  };

  return (
    <Layout>
      <div className="min-h-[calc(100dvh-100px)] bg-[#F8F9FB] pt-[72px] pb-20">
        <div className="max-w-[960px] mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 font-body text-sm text-[#7A8494] hover:text-[#E85D4A] mb-4"
          >
            <ChevronLeft size={16} />
            {t('common.back')}
          </button>

          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6">
            <img
              src={listing.images[activeImg]}
              alt={listing.name}
              className="w-full h-full object-cover"
            />
          </div>

          {listing.images.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {listing.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 ${
                    i === activeImg ? 'border-[#E85D4A]' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F1B2E] mb-2">
                {listing.name}
              </h1>
              <p className="font-body text-sm text-[#7A8494] flex items-center gap-1 mb-2">
                <MapPin size={14} />
                {listing.address}, {listing.location}
              </p>
              {avgRating != null && (
                <p className="font-body text-sm text-[#4A5468] flex items-center gap-1 mb-6">
                  <Star size={14} className="text-[#E8A838] fill-[#E8A838]" />
                  <span className="font-semibold">{avgRating}</span>
                  <span className="text-[#7A8494]">
                    · {reviews.length} {t('property.reviews')}
                  </span>
                </p>
              )}

              <div className="bg-white border border-[#E2E6EC] rounded-2xl p-6 mb-6">
                <h2 className="font-display text-lg font-semibold text-[#0F1B2E] mb-3">
                  {t('property.about')}
                </h2>
                <p className="font-body text-sm text-[#4A5468] whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {listing.amenities.length > 0 && (
                <div className="bg-white border border-[#E2E6EC] rounded-2xl p-6">
                  <h2 className="font-display text-lg font-semibold text-[#0F1B2E] mb-4">
                    {t('property.amenities')}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {listing.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2 font-body text-sm text-[#4A5468]">
                        <Check size={16} className="text-emerald-600 shrink-0" />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reviews.length > 0 && (
                <div className="bg-white border border-[#E2E6EC] rounded-2xl p-6 mt-6">
                  <h2 className="font-display text-lg font-semibold text-[#0F1B2E] mb-4">
                    {t('property.reviews')} ({reviews.length})
                  </h2>
                  <div className="space-y-5">
                    {reviews.map((r) => (
                      <div key={r.id} className="border-b border-[#F0F2F5] last:border-0 pb-5 last:pb-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-body text-sm font-semibold text-[#0F1B2E]">{r.authorName}</span>
                          <div className="flex items-center gap-1">
                            <Star size={13} className="text-[#E8A838] fill-[#E8A838]" />
                            <span className="font-body text-sm text-[#4A5468]">{r.rating}</span>
                          </div>
                        </div>
                        <p className="font-body text-sm text-[#4A5468] whitespace-pre-line">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="bg-white border border-[#E2E6EC] rounded-2xl p-6 sticky top-[90px]">
                <p className="font-display text-2xl font-semibold text-[#E85D4A]">
                  {formatPiAmount(piPrice)}
                </p>
                <p className="font-body text-sm text-[#7A8494] mb-4">
                  {t('listing.perNight')} · ≈ ${listing.price} USD
                </p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="font-body text-[11px] text-[#7A8494] uppercase tracking-wider">
                      {t('profile.checkIn')}
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min={addDays(new Date(), 0)}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full mt-1 px-2 py-2 rounded-lg border border-[#E2E6EC] font-body text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-body text-[11px] text-[#7A8494] uppercase tracking-wider">
                      {t('profile.checkOut')}
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full mt-1 px-2 py-2 rounded-lg border border-[#E2E6EC] font-body text-sm"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="font-body text-[11px] text-[#7A8494] uppercase tracking-wider">
                    {t('hero.guests')}
                  </label>
                  <div className="flex items-center justify-between mt-1 px-3 py-2 rounded-lg border border-[#E2E6EC]">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm text-[#0F1B2E]">{t('hero.adults')}</span>
                      <button
                        onClick={() => setAdults((a) => Math.max(1, a - 1))}
                        className="w-6 h-6 rounded-full border border-[#E2E6EC] flex items-center justify-center text-[#7A8494] hover:border-[#E85D4A] hover:text-[#E85D4A]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-body text-sm w-4 text-center">{adults}</span>
                      <button
                        onClick={() => setAdults((a) => a + 1)}
                        className="w-6 h-6 rounded-full border border-[#E2E6EC] flex items-center justify-center text-[#7A8494] hover:border-[#E85D4A] hover:text-[#E85D4A]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm text-[#0F1B2E]">{t('hero.children')}</span>
                      <button
                        onClick={() => setChildren((c) => Math.max(0, c - 1))}
                        className="w-6 h-6 rounded-full border border-[#E2E6EC] flex items-center justify-center text-[#7A8494] hover:border-[#E85D4A] hover:text-[#E85D4A]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-body text-sm w-4 text-center">{children}</span>
                      <button
                        onClick={() => setChildren((c) => c + 1)}
                        className="w-6 h-6 rounded-full border border-[#E2E6EC] flex items-center justify-center text-[#7A8494] hover:border-[#E85D4A] hover:text-[#E85D4A]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {nights > 0 && (
                  <p className="font-body text-xs text-[#7A8494] mb-3">
                    {nights} {t('property.nights')} · {formatPiAmount(usdToPi(subtotal + taxes))}
                  </p>
                )}

                {availability === 'unavailable' && (
                  <p className="font-body text-xs text-rose-600 mb-3">{t('checkout.roomUnavailable')}</p>
                )}

                <Button
                  onClick={handleBook}
                  disabled={availability !== 'available' || nights < 1}
                  className="w-full bg-[#E85D4A] hover:bg-[#D14A38] font-body rounded-xl py-6 disabled:opacity-50"
                >
                  {availability === 'checking' ? t('common.loading') : t('listing.bookNow')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
