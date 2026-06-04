import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type { LangCode, TextDir, TranslationSet } from './types';
import en from './translations/en';
import ru from './translations/ru';
import uk from './translations/uk';
import es from './translations/es';
import fr from './translations/fr';
import de from './translations/de';
import it from './translations/it';
import pt from './translations/pt';
import pl from './translations/pl';
import tr from './translations/tr';
import ar from './translations/ar';
import zh from './translations/zh';

/* ─── All translations map ─── */
const translationsMap: Record<LangCode, TranslationSet> = {
  en,
  ru,
  uk,
  es,
  fr,
  de,
  it,
  pt,
  pl,
  tr,
  ar,
  zh,
};

const STORAGE_KEY = 'stayfind_lang';
const DEFAULT_LANG: LangCode = 'en';

/* ─── Get nested value from object by dot-path ─── */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

/* ─── Language info for UI ─── */
export interface LanguageInfo {
  code: LangCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'ru', name: 'Russian', nativeName: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439', flag: '\u{1F1F7}\u{1F1FA}' },
  { code: 'uk', name: 'Ukrainian', nativeName: '\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430', flag: '\u{1F1FA}\u{1F1E6}' },
  { code: 'es', name: 'Spanish', nativeName: 'Espa\u00f1ol', flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'fr', name: 'French', nativeName: 'Fran\u00e7ais', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '\u{1F1EE}\u{1F1F9}' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Portugu\u00eas', flag: '\u{1F1F5}\u{1F1F9}' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '\u{1F1F5}\u{1F1F1}' },
  { code: 'tr', name: 'Turkish', nativeName: 'T\u00fcrk\u00e7e', flag: '\u{1F1F9}\u{1F1F7}' },
  { code: 'ar', name: 'Arabic', nativeName: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', flag: '\u{1F1F8}\u{1F1E6}' },
  { code: 'zh', name: 'Chinese', nativeName: '\u4e2d\u6587', flag: '\u{1F1E8}\u{1F1F3}' },
];

/* ─── Context type ─── */
interface I18nContextType {
  currentLang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string) => string;
  dir: TextDir;
  languages: LanguageInfo[];
}

const I18nContext = createContext<I18nContextType | null>(null);

/* ─── Resolve initial language ─── */
function getInitialLang(): LangCode {
  // Check URL parameter first
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && urlLang in translationsMap) return urlLang as LangCode;
  } catch { /* ignore */ }
  // Check localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in translationsMap) return stored as LangCode;
  } catch {
    // localStorage not available
  }
  return DEFAULT_LANG;
}

/* ─── Provider ─── */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<LangCode>(getInitialLang);

  const setLang = useCallback((lang: LangCode) => {
    console.log('[I18nContext] setLang called:', lang, 'available:', lang in translationsMap);
    if (lang in translationsMap) {
      setCurrentLang(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // localStorage not available
      }
      // Update html dir attribute for RTL support
      const tSet = translationsMap[lang];
      if (tSet) {
        document.documentElement.dir = tSet.dir;
        console.log('[I18nContext] Language changed to:', lang, 'dir:', tSet.dir);
      }
    }
  }, []);

  /* Sync html lang/dir on mount and language change */
  useEffect(() => {
    const tSet = translationsMap[currentLang];
    if (tSet) {
      document.documentElement.lang = currentLang;
      document.documentElement.dir = tSet.dir;
    }
  }, [currentLang]);

  /* Sync language with URL parameter (?lang=ru) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && urlLang in translationsMap && urlLang !== currentLang) {
      setCurrentLang(urlLang as LangCode);
    }
  }, []); // Run once on mount

  /* Update URL when language changes */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('lang', currentLang);
    const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState(null, '', newUrl);
  }, [currentLang]);

  /* Translation function with nested key support and fallback */
  const t = useCallback(
    (key: string): string => {
      const currentSet = translationsMap[currentLang];
      // Try current language first
      let value = getNestedValue(currentSet as unknown as Record<string, unknown>, key);
      if (value !== undefined) return value;
      // Fall back to English
      if (currentLang !== DEFAULT_LANG) {
        const enSet = translationsMap[DEFAULT_LANG];
        value = getNestedValue(enSet as unknown as Record<string, unknown>, key);
        if (value !== undefined) return value;
      }
      // Return the key as last resort
      return key;
    },
    [currentLang]
  );

  const dir = useMemo(() => translationsMap[currentLang]?.dir ?? 'ltr', [currentLang]);

  const value = useMemo(
    () => ({
      currentLang,
      setLang,
      t,
      dir,
      languages: LANGUAGES,
    }),
    [currentLang, setLang, t, dir]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/* ─── Hook ─── */
export function useTranslation(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return ctx;
}

/* ─── Get translations for a specific language (for static use) ─── */
export function getTranslations(lang: LangCode): TranslationSet {
  return translationsMap[lang] ?? translationsMap[DEFAULT_LANG];
}
