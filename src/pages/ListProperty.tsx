import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, CheckCircle2, Home as HomeIcon } from 'lucide-react';
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
import { usePiAuth } from '@/hooks/usePiAuth';
import { useTranslation } from '@/i18n';
import { createListing } from '@/lib/listingsStorage';

const PROPERTY_TYPES = ['Hotel', 'Apartment', 'Resort', 'Villa', 'Hostel', 'B&B', 'Cabin', 'Cottage'];
const AMENITIES = ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Bar', 'AC', 'Breakfast', 'Kitchen', 'Parking', 'Pet Friendly'];

export default function ListProperty() {
  const { t } = useTranslation();
  const { user, isAuthenticated, authenticate } = usePiAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Hotel');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>(['']);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const propertyTypeLabels: Record<string, string> = {
    Hotel: t('search.propHotel'),
    Apartment: t('search.propApartment'),
    Resort: t('search.propResort'),
    Villa: t('search.propVilla'),
    Hostel: t('search.propHostel'),
    'B&B': t('search.propBnB'),
    Cabin: t('search.propCabin'),
    Cottage: t('search.propCottage'),
  };

  const amenityLabels: Record<string, string> = {
    WiFi: t('search.amenWifi'),
    Pool: t('search.amenPool'),
    Spa: t('search.amenSpa'),
    Restaurant: t('search.amenRestaurant'),
    Gym: t('search.amenGym'),
    Bar: t('search.amenBar'),
    AC: t('search.amenAC'),
    Breakfast: t('search.amenBreakfast'),
    Kitchen: t('search.amenKitchen'),
    Parking: t('search.amenParking'),
    'Pet Friendly': t('search.amenPetFriendly'),
  };

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const updateImage = (i: number, value: string) => {
    setImages((prev) => prev.map((img, idx) => (idx === i ? value : img)));
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const isValid =
    name.trim() && location.trim() && address.trim() && Number(price) > 0 && description.trim();

  const handleSubmit = async () => {
    if (!isValid || !user?.uid) return;
    setSubmitting(true);
    setError('');
    const result = await createListing({
      ownerUid: user.uid,
      name: name.trim(),
      location: location.trim(),
      address: address.trim(),
      price: Number(price),
      description: description.trim(),
      images: images.map((i) => i.trim()).filter(Boolean),
      amenities,
      propertyType,
    });
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.error || t('common.error'));
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="min-h-[calc(100dvh-100px)] flex items-center justify-center px-6 pt-[72px]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-[#F0F2F5] rounded-full flex items-center justify-center mx-auto mb-6">
              <HomeIcon size={32} className="text-[#C5CBD4]" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#0F1B2E] mb-2">
              {t('listing.heroTitle')}
            </h2>
            <p className="font-body text-[#7A8494] mb-8">{t('listing.signInRequired')}</p>
            <Button
              onClick={() => authenticate()}
              className="bg-[#E85D4A] hover:bg-[#D14A38] font-body rounded-xl px-8"
            >
              {t('navbar.signIn')}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[calc(100dvh-100px)] flex items-center justify-center px-6 pt-[72px]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#0F1B2E] mb-2">
              {t('listing.successTitle')}
            </h2>
            <p className="font-body text-[#7A8494] mb-8">{t('listing.successDesc')}</p>
            <Button
              onClick={() => navigate('/profile')}
              className="bg-[#E85D4A] hover:bg-[#D14A38] font-body rounded-xl px-8"
            >
              {t('listing.backToProfile')}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100dvh-100px)] bg-[#F8F9FB] pt-[72px] pb-20">
        <div className="max-w-[720px] mx-auto px-6 py-10">
          <h1 className="font-display text-3xl font-semibold text-[#0F1B2E] mb-2">
            {t('listing.heroTitle')}
          </h1>
          <p className="font-body text-[#7A8494] mb-8">{t('listing.heroSubtitle')}</p>

          <div className="bg-white border border-[#E2E6EC] rounded-2xl p-6 space-y-5">
            <div className="space-y-2">
              <Label className="font-body text-sm text-[#4A5468]">{t('listing.formName')}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border-[#E2E6EC]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-sm text-[#4A5468]">{t('listing.formLocation')}</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('listing.formLocationPlaceholder')}
                  className="rounded-xl border-[#E2E6EC]"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm text-[#4A5468]">{t('listing.formPrice')}</Label>
                <Input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="rounded-xl border-[#E2E6EC]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm text-[#4A5468]">{t('listing.formAddress')}</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('listing.formAddressPlaceholder')}
                className="rounded-xl border-[#E2E6EC]"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm text-[#4A5468]">{t('listing.formPropertyType')}</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="rounded-xl border-[#E2E6EC] w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((pt) => (
                    <SelectItem key={pt} value={pt}>
                      {propertyTypeLabels[pt]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm text-[#4A5468]">{t('listing.formDescription')}</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('listing.formDescriptionPlaceholder')}
                className="rounded-xl border-[#E2E6EC] min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm text-[#4A5468]">{t('listing.formAmenities')}</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-2 font-body text-sm text-[#4A5468] cursor-pointer">
                    <Checkbox checked={amenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
                    {amenityLabels[a]}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm text-[#4A5468]">{t('listing.formImages')}</Label>
              <p className="font-body text-xs text-[#7A8494]">{t('listing.formImagesHint')}</p>
              {images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={img}
                    onChange={(e) => updateImage(i, e.target.value)}
                    placeholder="https://..."
                    className="rounded-xl border-[#E2E6EC]"
                  />
                  {images.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeImage(i)}
                      className="rounded-xl border-[#E2E6EC] shrink-0"
                    >
                      <Trash2 size={16} className="text-rose-500" />
                    </Button>
                  )}
                </div>
              ))}
              {images.length < 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImages((prev) => [...prev, ''])}
                  className="rounded-xl font-body text-xs"
                >
                  <Plus size={14} className="mr-1" />
                  {t('listing.addImage')}
                </Button>
              )}
            </div>

            {error && <p className="font-body text-sm text-rose-600">{error}</p>}

            <Button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="w-full bg-[#E85D4A] hover:bg-[#D14A38] font-body rounded-xl py-6"
            >
              {submitting ? t('listing.submitting') : t('listing.submit')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
