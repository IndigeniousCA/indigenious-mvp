'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface NavItem {
  id: string;
  labelEn: string;
  labelFr: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    labelEn: 'Home',
    labelFr: 'Accueil',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'partnerships',
    labelEn: 'Partnerships',
    labelFr: 'Partenariats',
    href: '/dashboard/partnerships',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'rfqs',
    labelEn: 'RFQs',
    labelFr: 'DDQ',
    href: '/dashboard/rfqs',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'billing',
    labelEn: 'Billing',
    labelFr: 'Facturation',
    href: '/dashboard/billing',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    labelEn: 'Profile',
    labelFr: 'Profil',
    href: '/dashboard/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const locale = useLocale() as 'en' | 'fr';

  const isActive = (href: string) => {
    // Remove locale from pathname for comparison
    const cleanPathname = pathname.replace(`/${locale}`, '');
    const cleanHref = href.replace(`/${locale}`, '');
    
    if (cleanHref === '/dashboard' && cleanPathname === '/dashboard') {
      return true;
    }
    
    return cleanPathname.startsWith(cleanHref) && cleanHref !== '/dashboard';
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
      <div className="flex-1 flex flex-col glass border-r border-white/10">
        {/* Logo */}
        <div className="px-6 py-6">
          <Link href={`/${locale}`}>
            <h1 className="text-2xl font-bold text-gradient cursor-pointer">
              Indigenious
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const fullHref = item.href.startsWith('/dashboard') 
              ? `/${locale}${item.href}`
              : `/${locale}${item.href}`;
            
            return (
              <Link
                key={item.id}
                href={fullHref}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${active 
                    ? 'bg-gradient-primary text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item.icon}
                <span className="font-medium">
                  {locale === 'fr' ? item.labelFr : item.labelEn}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Language Switcher */}
        <div className="px-6 py-4 border-t border-white/10">
          <LanguageSwitcher />
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold">JD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">
                {locale === 'fr' ? 'Plan Croissance' : 'Growth Plan'}
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="px-6 py-4 border-t border-white/10">
          <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{locale === 'fr' ? 'Déconnexion' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};