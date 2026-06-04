import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
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

  const currentLanguage = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];

  return (
    <div className={cn('flex items-center', className)}>
      <Select
        value={currentLang}
        onValueChange={(value: string) => setLang(value as LangCode)}
      >
        <SelectTrigger
          className={cn(
            'border-0 bg-transparent shadow-none hover:bg-white/10 focus:ring-0 focus:ring-offset-0 cursor-pointer gap-1.5 px-2',
            variant === 'compact' && 'h-8 text-xs gap-1'
          )}
          aria-label="Select language"
        >
          <Globe
            size={variant === 'compact' ? 14 : 16}
            className="text-current shrink-0"
          />
          <span className="flex items-center gap-1.5">
            <span className="text-base leading-none" aria-hidden="true">
              {currentLanguage.flag}
            </span>
            {variant === 'navbar' && (
              <span className="hidden sm:inline font-body text-sm">
                {currentLanguage.nativeName}
              </span>
            )}
          </span>
        </SelectTrigger>
        <SelectContent
          className="min-w-[160px] rounded-xl border-[#E2E6EC]"
          align="end"
        >
          {LANGUAGES.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className={cn(
                'font-body text-sm cursor-pointer rounded-lg mx-1 my-0.5',
                currentLang === lang.code && 'bg-[#FEF2F0] text-[#E85D4A]'
              )}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-lg leading-none" aria-hidden="true">
                  {lang.flag}
                </span>
                <span>{lang.nativeName}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
