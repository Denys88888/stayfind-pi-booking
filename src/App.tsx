import { Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import Home from './pages/Home';
import Search from './pages/Search';
import PropertyDetail from './pages/PropertyDetail';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Admin from './pages/Admin';

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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
