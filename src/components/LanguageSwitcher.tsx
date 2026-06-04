import { useTranslation, LANGUAGES } from '@/i18n';
import type { LangCode } from '@/i18n';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'compact';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'navbar', className }: LanguageSwitcherProps) {
  const { currentLang, setLang } = useTranslation();

  return (
    <div className={cn('relative flex items-center', className)}>
      <Globe
        size={variant === 'compact' ? 14 : 16}
        className="text-current shrink-0 absolute left-2 pointer-events-none z-10"
      />
      <select
        value={currentLang}
        onChange={(e) => {
          console.log('[LanguageSwitcher] selected:', e.target.value, 'current:', currentLang);
          setLang(e.target.value as LangCode);
        }}
        className={cn(
          'appearance-none bg-transparent border border-current/20 rounded-lg pl-8 pr-6 font-body text-sm cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E85D4A]/30',
          variant === 'compact' ? 'h-8 text-xs' : 'h-9'
        )}
        aria-label="Select language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName}
          </option>
        ))}
      </select>
      {/* Custom arrow */}
      <svg
        className="absolute right-2 pointer-events-none text-current/60"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
