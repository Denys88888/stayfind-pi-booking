import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePiAuth } from '@/hooks/usePiAuth';
import { useTranslation } from '@/i18n';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarDays,
  MapPin,
  Clock,
  BedDouble,
  CreditCard,
  User,
  Heart,
  Settings,
  Star,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Home as HomeIcon,
  Plus,
} from 'lucide-react';
import {
  formatPiAmount,
  usdToPi,
} from '@/lib/piPayments';
import { getBookings, fetchBookingsRemote, cancelBookingRemote, type Booking as StoredBooking } from '@/lib/bookingStorage';
import { useFavoriteIds, toggleFavorite } from '@/lib/favoritesStorage';
import { hotels } from '@/data/hotelData';
import { getProfileSettings, saveProfileSettings, type ProfileSettings } from '@/lib/profileSettings';
import { fetchMyListings, type Listing } from '@/lib/listingsStorage';

/* ─── Animated section wrapper ─── */
function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stat card ─── */
function StatCard({
  label,
  value,
  icon: Icon,
  color = 'blue',
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color?: 'blue' | 'green' | 'amber' | 'rose';
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0 flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorMap[color])}>
          <Icon size={20} />
        </div>
        <div>
          <p className="font-display text-xl font-semibold text-[#0F1B2E]">{value}</p>
          <p className="font-body text-xs text-[#7A8494]">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* bookings are loaded from localStorage via bookingStorage */

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  switch (status) {
    case 'confirmed':
    case 'upcoming':
      return (
        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-body text-xs font-medium">
          {t('profile.upcoming')}
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 font-body text-xs font-medium">
          {t('profile.pending')}
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-body text-xs font-medium">
          {t('profile.completed')}
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 font-body text-xs font-medium">
          {t('profile.cancelled')}
        </Badge>
      );
    default:
      return null;
  }
}

/* ─── Tab: Bookings ─── */
function BookingsTab({ piUid }: { piUid: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeSub, setActiveSub] = useState('all');
  const [bookings, setBookings] = useState<StoredBooking[]>(getBookings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchBookingsRemote(piUid).then((list) => {
      if (!cancelled) {
        setBookings(list);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [piUid]);

  const handleCancel = async (id: string) => {
    const updated = await cancelBookingRemote(piUid, id);
    setBookings(updated);
  };

  const filtered =
    activeSub === 'all'
      ? bookings
      : bookings.filter((b) => b.status === activeSub);

  return (
    <AnimatedSection>
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'confirmed', 'pending', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSub(tab)}
            className={cn(
              'px-4 py-2 rounded-full font-body text-sm font-medium transition-all',
              activeSub === tab
                ? 'bg-[#E85D4A] text-white'
                : 'bg-white text-[#4A5468] hover:bg-[#F0F2F5]'
            )}
          >
            {tab === 'all'
              ? t('profile.bookings')
              : tab === 'confirmed'
              ? t('profile.upcoming')
              : tab === 'pending'
              ? t('profile.pending')
              : t('profile.cancelled')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 font-body text-sm text-[#7A8494]">
          {t('common.loading')}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDays size={48} className="mx-auto text-[#C5CBD4] mb-4" />
          <h3 className="font-display text-lg font-semibold text-[#0F1B2E] mb-2">
            {t('profile.noBookingsExplore')}
          </h3>
          <p className="font-body text-sm text-[#7A8494] mb-6">
            {t('home.ctaSubtitle')}
          </p>
          <Button
            onClick={() => navigate('/search')}
            className="bg-[#E85D4A] hover:bg-[#D14A38] font-body rounded-xl"
          >
            {t('profile.searchHotels')}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <Card
              key={booking.id}
              className="border border-[#E2E6EC] rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 relative">
                  <img
                    src={booking.image}
                    alt={booking.hotelName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
                <CardContent className="flex-1 p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[#0F1B2E]">
                        {booking.hotelName}
                      </h3>
                      <p className="font-body text-sm text-[#7A8494] flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {booking.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-xs text-[#7A8494]">{t('checkout.priceSummary')}</p>
                      <p className="font-display text-lg font-semibold text-[#E85D4A]">
                        {formatPiAmount(booking.totalPi)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm text-[#4A5468]">
                      <CalendarDays size={16} className="text-[#E85D4A]" />
                      <span className="font-body">{t('profile.checkIn')}: {booking.checkIn}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#4A5468]">
                      <CalendarDays size={16} className="text-[#E85D4A]" />
                      <span className="font-body">{t('profile.checkOut')}: {booking.checkOut}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#4A5468]">
                      <Clock size={16} className="text-[#E85D4A]" />
                      <span className="font-body">{booking.nights} {t('profile.nights')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#4A5468]">
                      <BedDouble size={16} className="text-[#E85D4A]" />
                      <span className="font-body">{booking.roomType}</span>
                    </div>
                  </div>

                  {booking.status === 'cancelled' && booking.refundStatus && (
                    <p className="font-body text-xs mt-3">
                      {booking.refundStatus === 'completed' && (
                        <span className="text-emerald-600">{t('profile.refundCompleted')}</span>
                      )}
                      {booking.refundStatus === 'processing' && (
                        <span className="text-amber-600">{t('profile.refundProcessing')}</span>
                      )}
                      {(booking.refundStatus === 'pending_manual' || booking.refundStatus === 'failed') && (
                        <span className="text-[#7A8494]">{t('profile.refundPending')}</span>
                      )}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F0F2F5]">
                    <div className="flex items-center gap-2 text-sm text-[#4A5468]">
                      <span className="font-body text-[#7A8494]">{booking.guests}</span>
                    </div>
                    <div className="flex gap-2">
                      {booking.status !== 'cancelled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                          className="font-body text-xs rounded-lg text-rose-600 border-rose-200 hover:bg-rose-50"
                        >
                          {t('profile.cancelBooking')}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/property/${booking.hotelId}`)}
                        className="font-body text-xs rounded-lg"
                      >
                        {t('profile.viewDetails')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

    </AnimatedSection>
  );
}

/* ─── Tab: Favorites ─── */
function FavoritesTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const favoriteIds = useFavoriteIds();
  const favorites = hotels
    .filter((h) => favoriteIds.includes(h.id))
    .map((h) => ({
      id: h.id,
      name: h.name,
      location: h.location,
      rating: h.rating,
      piPrice: usdToPi(h.price),
      image: h.images[0],
    }));

  return (
    <AnimatedSection>
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto text-[#C5CBD4] mb-4" />
          <h3 className="font-display text-lg font-semibold text-[#0F1B2E] mb-2">
            {t('profile.favorites')}
          </h3>
          <p className="font-body text-sm text-[#7A8494] mb-6">
            {t('home.ctaSubtitle')}
          </p>
          <Button
            onClick={() => navigate('/search')}
            className="bg-[#E85D4A] hover:bg-[#D14A38] font-body rounded-xl"
          >
            {t('home.ctaBtn')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <Card
              key={fav.id}
              className="border border-[#E2E6EC] rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => navigate(`/property/${fav.id}`)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={fav.image}
                  alt={fav.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(fav.id); }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                >
                  <Heart size={16} className="text-[#E85D4A] fill-[#E85D4A]" />
                </button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-display text-base font-semibold text-[#0F1B2E]">
                  {fav.name}
                </h3>
                <p className="font-body text-sm text-[#7A8494] flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {fav.location}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-[#E8A838] fill-[#E8A838]" />
                    <span className="font-body text-sm font-semibold text-[#0F1B2E]">
                      {fav.rating}
                    </span>
                  </div>
                  <p className="font-body text-sm">
                    <span className="font-semibold text-[#E85D4A]">
                      {formatPiAmount(fav.piPrice)}
                    </span>
                    <span className="text-[#7A8494]">/{t('search.perNight')}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AnimatedSection>
  );
}

/* ─── Tab: My Listings ─── */
function MyListingsTab({ piUid }: { piUid: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchMyListings(piUid).then((l) => {
      if (!cancelled) {
        setListings(l);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [piUid]);

  const statusBadge = (status: Listing['status']) => {
    if (status === 'approved') {
      return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-body text-xs font-medium">{t('listing.statusApproved')}</Badge>;
    }
    if (status === 'rejected') {
      return <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 font-body text-xs font-medium">{t('listing.statusRejected')}</Badge>;
    }
    return <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 font-body text-xs font-medium">{t('listing.statusPending')}</Badge>;
  };

  return (
    <AnimatedSection>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => navigate('/list-property')}
          className="bg-[#E85D4A] hover:bg-[#D14A38] font-body rounded-xl text-sm"
        >
          <Plus size={16} className="mr-1" />
          {t('listing.heroTitle')}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 font-body text-sm text-[#7A8494]">{t('common.loading')}</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <HomeIcon size={48} className="mx-auto text-[#C5CBD4] mb-4" />
          <h3 className="font-display text-lg font-semibold text-[#0F1B2E] mb-2">
            {t('listing.noListings')}
          </h3>
          <p className="font-body text-sm text-[#7A8494] mb-6">{t('listing.noListingsDesc')}</p>
          <Button
            onClick={() => navigate('/list-property')}
            className="bg-[#E85D4A] hover:bg-[#D14A38] font-body rounded-xl"
          >
            {t('listing.heroTitle')}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((l) => (
            <Card
              key={l.id}
              className="border border-[#E2E6EC] rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => l.status === 'approved' && navigate(`/listing/${l.id}`)}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-40 h-40 sm:h-auto shrink-0">
                  <img src={l.images[0]} alt={l.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="flex-1 p-5">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[#0F1B2E]">{l.name}</h3>
                      <p className="font-body text-sm text-[#7A8494] flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {l.location}
                      </p>
                    </div>
                    {statusBadge(l.status)}
                  </div>
                  <p className="font-body text-sm font-semibold text-[#E85D4A] mt-3">
                    {formatPiAmount(usdToPi(l.price))} <span className="text-[#7A8494] font-normal">{t('listing.perNight')}</span>
                  </p>
                  {l.status === 'rejected' && l.rejectReason && (
                    <p className="font-body text-xs text-rose-600 mt-2">
                      {t('listing.rejectedReason')}: {l.rejectReason}
                    </p>
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AnimatedSection>
  );
}

/* ─── Tab: Account Settings ─── */
function AccountTab() {
  const { t } = useTranslation();
  const { user, signOut, isSandbox } = usePiAuth();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<ProfileSettings>(() =>
    user?.uid ? getProfileSettings(user.uid) : { firstName: '', lastName: '', email: '', phone: '', piAddress: '' }
  );

  const update = (field: keyof ProfileSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings((s) => ({ ...s, [field]: e.target.value }));

  const handleSave = () => {
    if (!user?.uid) return;
    saveProfileSettings(user.uid, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AnimatedSection className="space-y-6">
      {/* Personal Information */}
      <Card className="border border-[#E2E6EC] rounded-2xl">
        <CardHeader>
          <CardTitle className="font-display text-lg text-[#0F1B2E] flex items-center gap-2">
            <User size={20} className="text-[#E85D4A]" />
            {t('profile.personalInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-sm text-[#4A5468]">
                {t('profile.firstName')}
              </Label>
              <Input
                value={settings.firstName || user?.username || ''}
                onChange={update('firstName')}
                className="rounded-xl border-[#E2E6EC]"
                placeholder={t('profile.firstName')}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm text-[#4A5468]">
                {t('profile.lastName')}
              </Label>
              <Input
                value={settings.lastName}
                onChange={update('lastName')}
                className="rounded-xl border-[#E2E6EC]"
                placeholder={t('profile.lastName')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm text-[#4A5468]">{t('profile.email')}</Label>
            <Input
              type="email"
              value={settings.email}
              onChange={update('email')}
              className="rounded-xl border-[#E2E6EC]"
              placeholder={t('profile.email')}
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm text-[#4A5468]">{t('profile.phone')}</Label>
            <Input
              type="tel"
              value={settings.phone}
              onChange={update('phone')}
              className="rounded-xl border-[#E2E6EC]"
              placeholder={t('profile.phone')}
            />
          </div>
          <Button
            onClick={handleSave}
            className="bg-[#E85D4A] hover:bg-[#D14A38] font-body rounded-xl"
          >
            {saved ? (
              <>
                <CheckCircle2 size={16} className="mr-2" />
                {t('common.save')}
              </>
            ) : (
              t('profile.saveChanges')
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Pi Wallet */}
      <Card className="border border-[#E2E6EC] rounded-2xl">
        <CardHeader>
          <CardTitle className="font-display text-lg text-[#0F1B2E] flex items-center gap-2">
            <CreditCard size={20} className="text-[#E85D4A]" />
            {t('checkout.piCrypto')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSandbox && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="font-body text-xs text-amber-700">
                Pi Sandbox Mode: payments use test Pi, not real
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label className="font-body text-sm text-[#4A5468]">
              {t('checkout.piCrypto')} {t('profile.address')}
            </Label>
            <Input
              value={settings.piAddress}
              onChange={update('piAddress')}
              className="rounded-xl border-[#E2E6EC] font-mono text-sm"
              placeholder={t('profile.walletPlaceholder')}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleSave}
            className="font-body rounded-xl"
          >
            {t('profile.saveChanges')}
          </Button>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="border border-[#E2E6EC] rounded-2xl">
        <CardContent className="p-6">
          <Button
            variant="outline"
            onClick={signOut}
            className="w-full font-body text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl"
          >
            <LogOut size={16} className="mr-2" />
            {t('profile.signOut')}
          </Button>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}


/* ─── Main Profile Page ─── */
export default function Profile() {
  const { t } = useTranslation();
  const { user, isAuthenticated, isSandbox } = usePiAuth();
  const navigate = useNavigate();
  const [profileBookings, setProfileBookings] = useState<StoredBooking[]>(getBookings);
  const favoriteIds = useFavoriteIds();

  useEffect(() => {
    if (!user?.uid) return;
    fetchBookingsRemote(user.uid).then(setProfileBookings);
  }, [user?.uid]);

  /* ─── Unauthenticated state ─── */
  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="min-h-[calc(100dvh-100px)] flex items-center justify-center px-6 pt-[72px]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-[#F0F2F5] rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={32} className="text-[#C5CBD4]" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#0F1B2E] mb-2">
              {t('profile.notSignedIn')}
            </h2>
            <p className="font-body text-[#7A8494] mb-8">
              {t('profile.signIn')}
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-[#E85D4A] hover:bg-[#D14A38] font-body rounded-xl px-8"
            >
              {t('navbar.signIn')}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const tabList = [
    { value: 'bookings', label: t('profile.bookings'), icon: CalendarDays },
    { value: 'favorites', label: t('profile.favorites'), icon: Heart },
    { value: 'listings', label: t('listing.myListings'), icon: HomeIcon },
    { value: 'account', label: t('profile.account'), icon: Settings },
  ];

  return (
    <Layout>
      <div className="min-h-[calc(100dvh-100px)] bg-[#F8F9FB] pt-[72px]">
        {/* Profile Hero */}
        <div className="bg-white border-b border-[#E2E6EC] mb-6">
          <div className="max-w-[960px] mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="w-20 h-20 border-4 border-[#FEF2F0]">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-[#FEF2F0] text-[#E85D4A] font-display text-2xl">
                  {user.username?.charAt(0).toUpperCase() ?? 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="font-display text-2xl font-semibold text-[#0F1B2E]">
                    @{user.username ?? t('profile.guest')}
                  </h1>
                  {isSandbox && (
                    <Badge className="bg-amber-50 text-amber-700 font-body text-xs">
                      Sandbox
                    </Badge>
                  )}
                </div>
                <p className="font-body text-sm text-[#7A8494] mt-1">
                  {t('profile.member')}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                  <StatCard
                    label={t('profile.labelBookings')}
                    value={String(profileBookings.length)}
                    icon={CalendarDays}
                    color="blue"
                  />
                  <StatCard
                    label={t('profile.labelSaved')}
                    value={String(favoriteIds.length)}
                    icon={Heart}
                    color="rose"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-[960px] mx-auto px-6 pb-20">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="w-full bg-white border border-[#E2E6EC] rounded-xl p-1 h-auto flex-wrap mb-6">
              {tabList.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 font-body text-sm rounded-lg data-[state=active]:bg-[#E85D4A] data-[state=active]:text-white py-2.5"
                >
                  <tab.icon size={16} className="mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="bookings">
              <BookingsTab piUid={user.uid} />
            </TabsContent>
            <TabsContent value="favorites">
              <FavoritesTab />
            </TabsContent>
            <TabsContent value="listings">
              <MyListingsTab piUid={user.uid} />
            </TabsContent>
            <TabsContent value="account">
              <AccountTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
