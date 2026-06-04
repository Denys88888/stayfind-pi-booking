import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Calendar,
  Heart,
  Settings,
  MapPin,
  Bed,
  Users,
  Star,
  Pencil,
  Check,
  CreditCard,
  Bell,
  Trash2,
  AlertTriangle,
  LogOut,
  X,
} from 'lucide-react';

/* ─── easing ─── */
const easeSmooth = [0.4, 0, 0.2, 1] as [number, number, number, number];
const easeBounce = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

/* ─── mock data ─── */
const userData = {
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@email.com',
  avatar: '/reviewer-1.jpg',
  memberSince: 2021,
  tier: 'Gold' as const,
  stats: {
    bookings: 12,
    nights: 47,
    saved: 28,
    savings: '$1,240',
  },
};

const bookingsData = [
  {
    id: '1',
    hotelName: 'The Grand Palace Hotel',
    location: 'Paris, France',
    dates: 'Dec 15 – Dec 22, 2025',
    room: 'Deluxe King Room',
    guests: '2 Adults',
    status: 'upcoming' as const,
    price: '$2,094',
    image: '/hotel-1.jpg',
    ref: 'SF-2025-78432',
  },
  {
    id: '2',
    hotelName: 'Zen Garden Retreat',
    location: 'Bali, Indonesia',
    dates: 'Feb 10 – Feb 17, 2026',
    room: 'Premier Suite',
    guests: '2 Adults',
    status: 'upcoming' as const,
    price: '$3,780',
    image: '/hotel-3.jpg',
    ref: 'SF-2026-12345',
  },
  {
    id: '3',
    hotelName: 'Metropolitan Suites',
    location: 'New York, USA',
    dates: 'Sep 5 – Sep 8, 2025',
    room: 'Standard King',
    guests: '1 Adult',
    status: 'completed' as const,
    price: '$1,050',
    image: '/hotel-4.jpg',
    ref: 'SF-2025-67890',
  },
  {
    id: '4',
    hotelName: 'Skyline Resort & Spa',
    location: 'Dubai, UAE',
    dates: 'Jul 20 – Jul 25, 2025',
    room: 'Ocean View Room',
    guests: '2 Adults',
    status: 'cancelled' as const,
    price: '—',
    image: '/hotel-2.jpg',
    ref: 'SF-2025-45678',
  },
];

const savedPropertiesData = [
  {
    id: '1',
    name: 'The Grand Palace Hotel',
    location: 'Paris, France',
    rating: 9.4,
    price: 285,
    image: '/hotel-1.jpg',
    savedOn: 'Nov 15, 2025',
  },
  {
    id: '2',
    name: 'Zen Garden Retreat',
    location: 'Bali, Indonesia',
    rating: 9.6,
    price: 195,
    image: '/hotel-3.jpg',
    savedOn: 'Oct 28, 2025',
  },
  {
    id: '3',
    name: 'Oceanview Paradise',
    location: 'Maldives',
    rating: 9.8,
    price: 680,
    image: '/hotel-5.jpg',
    savedOn: 'Sep 10, 2025',
  },
  {
    id: '4',
    name: 'Sakura Boutique Hotel',
    location: 'Tokyo, Japan',
    rating: 9.3,
    price: 180,
    image: '/hotel-1.jpg',
    savedOn: 'Aug 22, 2025',
  },
  {
    id: '5',
    name: 'Coastal Escape Resort',
    location: 'Santorini, Greece',
    rating: 9.5,
    price: 310,
    image: '/hotel-2.jpg',
    savedOn: 'Jul 15, 2025',
  },
  {
    id: '6',
    name: 'Historic Central Inn',
    location: 'London, UK',
    rating: 9.2,
    price: 240,
    image: '/hotel-6.jpg',
    savedOn: 'Jun 30, 2025',
  },
];

const notificationSettings = [
  { id: 'confirmations', label: 'Booking confirmations', defaultOn: true },
  { id: 'priceDrop', label: 'Price drop alerts', defaultOn: true },
  { id: 'deals', label: 'Special deals & offers', defaultOn: true },
  { id: 'reviews', label: 'Review reminders', defaultOn: false },
  { id: 'newsletter', label: 'Newsletter', defaultOn: true },
  { id: 'sms', label: 'SMS notifications', defaultOn: false },
];

const paymentMethods = [
  { id: '1', type: 'Visa', last4: '4242', expiry: '09/27', default: true },
  { id: '2', type: 'Mastercard', last4: '8888', expiry: '12/26', default: false },
];

const loyaltyBenefits = [
  'Priority check-in',
  'Room upgrades',
  'Late checkout',
  'Exclusive deals',
];

/* ─── Profile Header ─── */
function ProfileHeader() {
  const stats = [
    { value: userData.stats.bookings, label: 'Total Bookings' },
    { value: userData.stats.nights, label: 'Nights Stayed' },
    { value: userData.stats.saved, label: 'Saved Properties' },
    { value: userData.stats.savings, label: 'Total Savings' },
  ];

  return (
    <section className="bg-gradient-to-br from-[#0F1B2E] via-[#1A2B47] to-[#243B5D]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: easeBounce }}
          >
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-20 h-20 rounded-full object-cover border-[3px] border-white/30"
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: easeSmooth }}
            className="text-center sm:text-left flex-1"
          >
            <p className="font-body text-base text-white/75">
              Welcome back,
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-0.5">
              {userData.name}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="font-body text-xs font-medium uppercase tracking-wider text-amber-400">
                {userData.tier} Member
              </span>
              <span className="font-body text-xs text-white/50">
                Since {userData.memberSince}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-2 sm:flex sm:flex-row gap-4 sm:gap-0 mt-6 sm:mt-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.08, duration: 0.4 }}
              className={cn(
                'text-center sm:text-left sm:px-8',
                idx > 0 && 'sm:border-l sm:border-white/15'
              )}
            >
              <p className="font-display text-xl font-semibold text-white">
                {stat.value}
              </p>
              <p className="font-body text-xs text-white/60 mt-0.5">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Tab Navigation ─── */
function TabNav({
  activeTab,
  onChange,
}: {
  activeTab: string;
  onChange: (tab: string) => void;
}) {
  const tabs = [
    { id: 'bookings', label: 'My Bookings', icon: Calendar, badge: '2 upcoming' },
    { id: 'saved', label: 'Saved Properties', icon: Heart, badge: '28' },
    { id: 'settings', label: 'Account Settings', icon: Settings, badge: null },
  ];

  return (
    <div className="bg-white border-b border-[#E2E6EC]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 px-4 sm:px-6 py-4 font-body text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'text-[#0F1B2E]'
                    : 'text-[#7A8494] hover:text-[#1A2B47]'
                )}
              >
                <tab.icon size={16} className="shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge && (
                  <span className="bg-[#FEF2F0] text-[#E85D4A] text-xs font-medium px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E85D4A]"
                    transition={{ duration: 0.25, ease: easeSmooth }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── My Bookings Tab ─── */
function MyBookingsTab() {
  const [filter, setFilter] = useState('Upcoming');
  const filters = ['All', 'Upcoming', 'Completed', 'Cancelled'];

  const filtered =
    filter === 'All'
      ? bookingsData
      : bookingsData.filter((b) => b.status === filter.toLowerCase());

  const statusConfig = {
    upcoming: {
      color: 'bg-[#E8F5EE] text-[#2D9F5E]',
      border: 'border-l-[#2D9F5E]',
      label: 'Upcoming',
    },
    completed: {
      color: 'bg-[#F0F2F5] text-[#7A8494]',
      border: 'border-l-[#C5CBD4]',
      label: 'Completed',
    },
    cancelled: {
      color: 'bg-[#FDEBEB] text-[#D93838]',
      border: 'border-l-[#D93838]',
      label: 'Cancelled',
    },
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200',
              filter === f
                ? 'bg-[#0F1B2E] text-white'
                : 'bg-white text-[#4A5468] border border-[#E2E6EC] hover:border-[#C5CBD4]'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-[#F0F2F5] flex items-center justify-center mx-auto">
              <Calendar size={36} className="text-[#C5CBD4]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#0F1B2E] mt-4">
              No bookings yet
            </h3>
            <p className="font-body text-base text-[#7A8494] mt-1">
              Start exploring and book your first stay!
            </p>
            <Button className="mt-4 bg-[#E85D4A] hover:bg-[#D14A38] text-white rounded-xl px-6 py-5 font-body font-semibold hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)] active:scale-[0.98] transition-all">
              Explore Destinations
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((booking, idx) => {
              const config = statusConfig[booking.status];
              return (
                <motion.div
                  key={booking.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: idx * 0.08,
                    duration: 0.4,
                    ease: easeSmooth,
                  }}
                  whileHover={{ y: -2 }}
                  className={cn(
                    'bg-white rounded-2xl shadow-[0_1px_3px_rgba(15,27,46,0.06)] overflow-hidden flex flex-col sm:flex-row border-l-4 transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(15,27,46,0.08)]',
                    config.border
                  )}
                >
                  {/* Image */}
                  <div className="sm:w-[240px] shrink-0">
                    <img
                      src={booking.image}
                      alt={booking.hotelName}
                      className="w-full h-full object-cover aspect-video sm:aspect-[4/3]"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-base font-semibold text-[#1A2B47]">
                        {booking.hotelName}
                      </h3>
                      <span
                        className={cn(
                          'shrink-0 px-3 py-1 rounded-full font-body text-xs font-medium',
                          config.color
                        )}
                      >
                        {config.label}
                      </span>
                    </div>

                    <p className="flex items-center gap-1 mt-1 font-body text-sm text-[#7A8494]">
                      <MapPin size={14} />
                      {booking.location}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                      <span className="flex items-center gap-1 font-body text-sm text-[#4A5468]">
                        <Calendar size={14} className="text-[#7A8494]" />
                        {booking.dates}
                      </span>
                      <span className="flex items-center gap-1 font-body text-sm text-[#7A8494]">
                        <Bed size={14} />
                        {booking.room}
                      </span>
                      <span className="flex items-center gap-1 font-body text-sm text-[#7A8494]">
                        <Users size={14} />
                        {booking.guests}
                      </span>
                    </div>

                    <div className="border-t border-[#F0F2F5] mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <span className="font-body text-sm text-[#4A5468]">
                          Total:{' '}
                          <span className="font-semibold">{booking.price}</span>
                        </span>
                        <span className="font-body text-xs text-[#7A8494]">
                          Ref: {booking.ref}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-body text-xs text-[#1A2B47] hover:text-[#E85D4A] hover:bg-[#F8F9FB] rounded-lg"
                        >
                          View Details
                        </Button>
                        {booking.status === 'upcoming' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="font-body text-xs rounded-lg border-[#E2E6EC] text-[#1A2B47] hover:bg-[#F8F9FB]"
                            >
                              Modify
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="font-body text-xs text-[#D93838] hover:text-[#D93838] hover:bg-[#FDEBEB] rounded-lg"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === 'completed' && (
                          <Button
                            size="sm"
                            className="font-body text-xs bg-[#E85D4A] hover:bg-[#D14A38] text-white rounded-lg"
                          >
                            Write Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Saved Properties Tab ─── */
function SavedPropertiesTab() {
  const [properties, setProperties] = useState(savedPropertiesData);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setPendingRemoveId(id);
    setDialogOpen(true);
  };

  const confirmRemove = () => {
    if (pendingRemoveId) {
      setRemovingId(pendingRemoveId);
      setDialogOpen(false);
      setTimeout(() => {
        setProperties((prev) => prev.filter((p) => p.id !== pendingRemoveId));
        setRemovingId(null);
        setPendingRemoveId(null);
      }, 300);
    }
  };

  const cancelRemove = () => {
    setDialogOpen(false);
    setPendingRemoveId(null);
  };

  if (properties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 rounded-full bg-[#F0F2F5] flex items-center justify-center mx-auto">
          <Heart size={36} className="text-[#C5CBD4]" />
        </div>
        <h3 className="font-display text-xl font-semibold text-[#0F1B2E] mt-4">
          No saved properties
        </h3>
        <p className="font-body text-base text-[#7A8494] mt-1">
          Tap the heart icon on any property to save it here
        </p>
        <Button className="mt-4 bg-[#E85D4A] hover:bg-[#D14A38] text-white rounded-xl px-6 py-5 font-body font-semibold hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,93,74,0.35)] active:scale-[0.98] transition-all">
          Explore Properties
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {properties.map((prop, idx) => (
            <motion.div
              key={prop.id}
              initial={{ y: 30, opacity: 0 }}
              animate={
                removingId === prop.id
                  ? { scale: 0.95, opacity: 0, x: 50 }
                  : { y: 0, opacity: 1 }
              }
              exit={{ scale: 0.95, opacity: 0, x: 50 }}
              transition={{
                delay: removingId === prop.id ? 0 : idx * 0.08,
                duration: removingId === prop.id ? 0.3 : 0.5,
                ease: easeSmooth,
              }}
              className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(15,27,46,0.06)] overflow-hidden group transition-shadow duration-350 hover:shadow-[0_12px_40px_rgba(15,27,46,0.12)]"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={prop.image}
                  alt={prop.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => handleRemove(prop.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#D93838] hover:bg-[#FDEBEB] transition-colors shadow-sm"
                  aria-label="Remove from saved"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-3 left-3 bg-[#0F1B2E] text-white font-body text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Star size={12} className="fill-[#E8A838] text-[#E8A838]" />
                  {prop.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-base font-semibold text-[#1A2B47]">
                  {prop.name}
                </h3>
                <p className="flex items-center gap-1 mt-1 font-body text-sm text-[#7A8494]">
                  <MapPin size={14} />
                  {prop.location}
                </p>
                <p className="font-body text-xs text-[#C5CBD4] mt-1">
                  Saved on {prop.savedOn}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="font-display text-lg font-semibold text-[#0F1B2E]">
                      ${prop.price.toLocaleString()}
                    </span>
                    <span className="font-body text-sm text-[#7A8494]">
                      /night
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#E85D4A] hover:bg-[#D14A38] text-white font-body text-sm font-semibold rounded-xl px-4 py-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this property from your saved list?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemove} variant="outline">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              variant="destructive"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const nationalities = [
  'US', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy',
  'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Russia', 'UAE', 'South Korea',
  'Netherlands',
];

/* ─── Account Settings Tab ─── */
function AccountSettingsTab() {
  const [editMode, setEditMode] = useState(false);
  const defaultProfile = {
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '+61 412 345 678',
    dob: '1990-03-15',
    nationality: 'Australian',
  };
  const [profile, setProfile] = useState({ ...defaultProfile });
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    () =>
      notificationSettings.reduce(
        (acc, s) => ({ ...acc, [s.id]: s.defaultOn }),
        {}
      )
  );

  const handleToggle = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    setEditMode(false);
  };

  const handleCancel = () => {
    setProfile({ ...defaultProfile });
    setEditMode(false);
  };

  const formatDobDisplay = (dob: string) => {
    if (!dob) return '';
    const d = new Date(dob);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-[720px] mx-auto space-y-4">
      {/* Personal Information */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: easeSmooth }}
        className="bg-white rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-[#1A2B47]">
            Personal Information
          </h3>
          {!editMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditMode(true)}
              className="font-body text-sm text-[#1A2B47] hover:text-[#E85D4A] hover:bg-[#F8F9FB] rounded-lg"
            >
              <Pencil size={16} className="mr-1" />
              Edit
            </Button>
          )}
          {editMode && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="font-body text-sm text-[#4A5468] border-[#E2E6EC] hover:bg-[#F8F9FB] rounded-lg"
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="font-body text-sm text-white bg-[#E85D4A] hover:bg-[#D14A38] hover:text-white rounded-lg"
              >
                <Check size={16} className="mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>

        {editMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
                First Name
              </Label>
              <Input
                value={profile.firstName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, firstName: e.target.value }))
                }
                className="mt-1 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]"
              />
            </div>
            <div>
              <Label className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
                Last Name
              </Label>
              <Input
                value={profile.lastName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, lastName: e.target.value }))
                }
                className="mt-1 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]"
              />
            </div>
            <div>
              <Label className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
                Email
              </Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
                className="mt-1 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]"
              />
            </div>
            <div>
              <Label className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
                Phone
              </Label>
              <Input
                value={profile.phone}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, phone: e.target.value }))
                }
                className="mt-1 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]"
              />
            </div>
            <div>
              <Label className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
                Date of Birth
              </Label>
              <Input
                type="date"
                value={profile.dob}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, dob: e.target.value }))
                }
                className="mt-1 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]"
              />
            </div>
            <div>
              <Label className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
                Nationality
              </Label>
              <Select
                value={profile.nationality}
                onValueChange={(val) =>
                  setProfile((p) => ({ ...p, nationality: val }))
                }
              >
                <SelectTrigger className="mt-1 rounded-xl border-[#E2E6EC] focus:border-[#E85D4A] focus:ring-[3px] focus:ring-[rgba(232,93,74,0.12)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {nationalities.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'First Name', value: profile.firstName },
              { label: 'Last Name', value: profile.lastName },
              { label: 'Email', value: profile.email },
              { label: 'Phone', value: profile.phone },
              { label: 'Date of Birth', value: formatDobDisplay(profile.dob) },
              { label: 'Nationality', value: profile.nationality },
            ].map((field) => (
              <div key={field.label}>
                <p className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
                  {field.label}
                </p>
                <p className="font-body text-sm text-[#4A5468] mt-0.5">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Password & Security */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08, duration: 0.4, ease: easeSmooth }}
        className="bg-white rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-[#1A2B47]">
            Password &amp; Security
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="font-body text-sm text-[#1A2B47] hover:text-[#E85D4A] hover:bg-[#F8F9FB] rounded-lg"
          >
            Change Password
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
              Current Password
            </p>
            <p className="font-body text-sm text-[#4A5468] mt-0.5">
              &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-[#7A8494] uppercase tracking-wider">
              Last Changed
            </p>
            <p className="font-body text-sm text-[#7A8494] mt-0.5">
              3 months ago
            </p>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Check size={14} className="text-[#2D9F5E]" />
            <span className="font-body text-sm text-[#2D9F5E]">2FA Enabled</span>
          </div>
        </div>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.16, duration: 0.4, ease: easeSmooth }}
        className="bg-white rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-[#1A2B47]">
            Payment Methods
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="font-body text-sm text-[#1A2B47] hover:text-[#E85D4A] hover:bg-[#F8F9FB] rounded-lg"
          >
            <CreditCard size={16} className="mr-1" />
            Add Card
          </Button>
        </div>
        <div className="space-y-3">
          {paymentMethods.map((card) => (
            <div
              key={card.id}
              className="flex items-center gap-4 p-3 rounded-xl border border-[#E2E6EC]"
            >
              <div className="w-10 h-7 bg-[#1A2B47] rounded flex items-center justify-center shrink-0">
                <CreditCard size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-body text-sm text-[#4A5468]">
                  {card.type} &bull;&bull;&bull;&bull; {card.last4}
                </p>
                <p className="font-body text-xs text-[#7A8494]">
                  Expires {card.expiry}
                </p>
              </div>
              {card.default && (
                <span className="px-2 py-0.5 bg-[#FEF2F0] text-[#E85D4A] font-body text-xs font-medium rounded-full">
                  Default
                </span>
              )}
              <div className="flex items-center gap-2">
                <button className="font-body text-xs text-[#7A8494] hover:text-[#E85D4A] transition-colors">
                  Edit
                </button>
                <button className="font-body text-xs text-[#D93838] hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.24, duration: 0.4, ease: easeSmooth }}
        className="bg-white rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Bell size={18} className="text-[#1A2B47]" />
          <h3 className="font-display text-lg font-semibold text-[#1A2B47]">
            Notifications
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {notificationSettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between"
            >
              <span className="font-body text-sm text-[#4A5468]">
                {setting.label}
              </span>
              <Switch
                checked={notifications[setting.id]}
                onCheckedChange={() => handleToggle(setting.id)}
                className="data-[state=checked]:bg-[#E85D4A] data-[state=unchecked]:bg-[#C5CBD4]"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Loyalty Program */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.32, duration: 0.4, ease: easeSmooth }}
        className="bg-white rounded-2xl p-6"
      >
        <h3 className="font-display text-lg font-semibold text-[#1A2B47] mb-4">
          StayFind Rewards
        </h3>
        <div className="rounded-2xl p-6 bg-gradient-to-br from-[#D4AF37] via-[#F2D06B] to-[#D4AF37]">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-xl font-semibold text-white">
                {userData.name}
              </p>
              <p className="font-body text-sm text-white/80 mt-0.5">
                SF-GOLD-78432
              </p>
            </div>
            <Star size={24} className="text-white fill-white" />
          </div>
          <p className="font-display text-4xl font-semibold text-white mt-4">
            2,450
          </p>
          <p className="font-body text-xs text-white/70">points</p>
          <p className="font-body text-xs text-white/70 mt-2">
            Earn 1 point per $1 spent
          </p>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-body text-xs text-white/80">
                550 points to Platinum
              </span>
              <span className="font-body text-xs text-white/80">82%</span>
            </div>
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full w-[82%] bg-white rounded-full" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-body text-xs text-[#7A8494] uppercase tracking-wider mb-2">
            Gold Benefits
          </p>
          <div className="flex flex-wrap gap-2">
            {loyaltyBenefits.map((benefit) => (
              <span
                key={benefit}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#F8F9FB] rounded-full font-body text-xs text-[#4A5468]"
              >
                <Check size={12} className="text-[#2D9F5E]" />
                {benefit}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4, ease: easeSmooth }}
        className="bg-white rounded-2xl p-6 border border-[rgba(217,56,56,0.2)]"
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-[#D93838]" />
          <h3 className="font-display text-lg font-semibold text-[#D93838]">
            Danger Zone
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-body text-sm text-[#4A5468]">
              Delete your account and all associated data
            </p>
            <p className="font-body text-xs text-[#D93838] mt-0.5">
              This action cannot be undone
            </p>
          </div>
          <Button
            variant="ghost"
            className="font-body text-sm text-[#D93838] hover:text-[#D93838] hover:bg-[#FDEBEB] rounded-lg shrink-0"
          >
            <Trash2 size={16} className="mr-1" />
            Delete Account
          </Button>
        </div>
      </motion.div>

      {/* Log Out */}
      <div className="pt-4 pb-8 text-center">
        <Button
          variant="ghost"
          className="font-body text-sm text-[#7A8494] hover:text-[#D93838] hover:bg-[#FDEBEB] rounded-lg"
        >
          <LogOut size={16} className="mr-1" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

/* ─── Main Profile Page ─── */
export default function Profile() {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <Layout>
      <div className="min-h-[100dvh] bg-[#F8F9FB]">
        <ProfileHeader />
        <TabNav activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MyBookingsTab />
              </motion.div>
            )}
            {activeTab === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SavedPropertiesTab />
              </motion.div>
            )}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AccountSettingsTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
