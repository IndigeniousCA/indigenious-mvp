'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

interface MobileNavItem {
  id: string;
  labelEn: string;
  labelFr: string;
  href: string;
  icon: React.ReactNode;
}

const mobileNavItems: MobileNavItem[] = [
  {
    id: 'home',
    labelEn: 'Home',
    labelFr: 'Accueil',
    href: '/dashboard',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'search',
    labelEn: 'Search',
    labelFr: 'Recherche',
    href: '/search',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'partnerships',
    labelEn: 'Partners',
    labelFr: 'Partenaires',
    href: '/dashboard/partnerships',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    labelEn: 'Profile',
    labelFr: 'Profil',
    href: '/dashboard/profile',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const locale = useLocale() as 'en' | 'fr';

  const isActive = (href: string) => {
    const cleanPathname = pathname.replace(`/${locale}`, '');
    const cleanHref = href.replace(`/${locale}`, '');
    
    if (cleanHref === '/dashboard' && cleanPathname === '/dashboard') {
      return true;
    }
    
    return cleanPathname.startsWith(cleanHref) && cleanHref !== '/dashboard';
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="glass border-t border-white/10">
        <div className="grid grid-cols-4 gap-1">
          {mobileNavItems.map((item) => {
            const active = isActive(item.href);
            const fullHref = item.href.startsWith('/dashboard') 
              ? `/${locale}${item.href}`
              : `/${locale}${item.href}`;
            
            return (
              <Link
                key={item.id}
                href={fullHref}
                className={`
                  flex flex-col items-center justify-center py-3 px-2
                  transition-all duration-200
                  ${active 
                    ? 'text-primary-start' 
                    : 'text-gray-400'
                  }
                `}
              >
                <div className={`
                  ${active ? 'transform scale-110' : ''}
                  transition-transform duration-200
                `}>
                  {item.icon}
                </div>
                <span className="text-xs mt-1 font-medium">
                  {locale === 'fr' ? item.labelFr : item.labelEn}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};