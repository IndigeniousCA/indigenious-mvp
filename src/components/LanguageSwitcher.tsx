'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      // Replace the locale in the pathname
      const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.push(newPath);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleChange('en')}
        disabled={isPending}
        className={`
          px-3 py-1 rounded-md text-sm font-medium transition-all
          ${locale === 'en' 
            ? 'bg-gradient-primary text-white' 
            : 'text-gray-300 hover:text-white hover:bg-white/10'
          }
          disabled:opacity-50
        `}
      >
        EN
      </button>
      <span className="text-gray-500">/</span>
      <button
        onClick={() => handleChange('fr')}
        disabled={isPending}
        className={`
          px-3 py-1 rounded-md text-sm font-medium transition-all
          ${locale === 'fr' 
            ? 'bg-gradient-primary text-white' 
            : 'text-gray-300 hover:text-white hover:bg-white/10'
          }
          disabled:opacity-50
        `}
      >
        FR
      </button>
    </div>
  );
}