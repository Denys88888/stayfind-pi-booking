import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Check, ChevronLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { fetchListing, type Listing } from '@/lib/listingsStorage';
import { formatPiAmount, usdToPi } from '@/lib/piPayments';

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
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchListing(id).then((l) => {
      setListing(l);
      setLoading(false);
    });
  }, [id]);

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

  const handleBook = () => {
    const checkIn = addDays(new Date(), 7);
    const checkOut = addDays(new Date(), 8);
    navigate('/checkout', {
      state: {
        hotelId: String(listing.id),
        hotelName: listing.name,
        roomType: t('search.propHotel'),
        image: listing.images[0],
        location: listing.location,
        pricePerNight: listing.price,
        taxes: Math.round(listing.price * 0.1 * 100) / 100,
        totalUsd: Math.round(listing.price * 1.1 * 100) / 100,
        nights: 1,
        guests: '2 Adults',
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
              <p className="font-body text-sm text-[#7A8494] flex items-center gap-1 mb-6">
                <MapPin size={14} />
                {listing.address}, {listing.location}
              </p>

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
            </div>

            <div>
              <div className="bg-white border border-[#E2E6EC] rounded-2xl p-6 sticky top-[90px]">
                <p className="font-display text-2xl font-semibold text-[#E85D4A]">
                  {formatPiAmount(piPrice)}
                </p>
                <p className="font-body text-sm text-[#7A8494] mb-4">
                  {t('listing.perNight')} · ≈ ${listing.price} USD
                </p>
                <Button
                  onClick={handleBook}
                  className="w-full bg-[#E85D4A] hover:bg-[#D14A38] font-body rounded-xl py-6"
                >
                  {t('listing.bookNow')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
