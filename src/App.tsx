import { lazy, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import Home from './pages/Home';

/* Home is the landing page and stays in the main bundle; everything else is
   fetched on first visit to that route. Otherwise every guest downloads the
   admin panel, the checkout flow and the map library (leaflet) just to look
   at the home page — which is slow over mobile data in Pi Browser. */
const Search = lazy(() => import('./pages/Search'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Admin = lazy(() => import('./pages/Admin'));
const ListProperty = lazy(() => import('./pages/ListProperty'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));

function NotFound() {
  const { t } = useTranslation();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', gap: 16, padding: 24 }}>
      <div style={{ fontSize: 72, fontWeight: 700, color: '#E85D4A', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: '#0F1B2E', margin: 0 }}>{t('common.notFound')}</h1>
      <p style={{ color: '#7A8494', margin: 0, textAlign: 'center' }}>{t('common.notFoundDesc')}</p>
      <Link to="/" style={{ marginTop: 8, background: '#E85D4A', color: '#fff', padding: '10px 24px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
        {t('checkout.backHome')}
      </Link>
    </div>
  );
}

/* Holds the page's background while a route chunk loads, so navigation shows
   a steady surface rather than a flash of white. */
function RouteFallback() {
  return <div className="min-h-[100dvh] bg-[#F8F9FB]" />;
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/list-property" element={<ListProperty />} />
      <Route path="/listing/:id" element={<ListingDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
}
