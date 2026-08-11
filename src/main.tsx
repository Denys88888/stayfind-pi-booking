import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n'
import { setPricingRates } from './lib/piPayments'

/* Adopt the server's pricing rates — it re-checks what a guest paid against
   what the stay costs, so both sides must agree. Deliberately not awaited:
   the backend sleeps on Render's free tier and can take tens of seconds to
   wake, far too long to hold up the first paint. Until it answers the
   built-in defaults apply, and those match the server's own. */
const API_URL = import.meta.env.VITE_API_URL || 'https://stayfind-api.onrender.com'
fetch(`${API_URL}/api/config`)
  .then((r) => (r.ok ? r.json() : null))
  .then((cfg) => cfg && setPricingRates(cfg))
  .catch(() => { /* keep the defaults */ })

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <I18nProvider>
      <App />
    </I18nProvider>
  </HashRouter>,
)
