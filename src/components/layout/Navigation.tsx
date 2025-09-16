'use client';

import { Button } from '@/components/ui/Button';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Link, usePathname } from '@/i18n/routing';
import { useEffect, useState } from 'react';

export function Navigation() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated (mock for now)
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(auth === 'true');
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const isAuthPage = pathname.includes('/auth/');

  return (
    <nav className="flex justify-between items-center mb-8 glass rounded-full px-8 py-4">
      <Link href="/">
        <h1 className="text-2xl font-bold text-gradient cursor-pointer">
          {t('navigation.brandName')}
        </h1>
      </Link>
      
      <div className="flex gap-4 items-center">
        {!isAuthPage && (
          <>
            <Link href="/search">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                {locale === 'fr' ? 'Explorer' : 'Explore'}
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                {locale === 'fr' ? 'Tarifs' : 'Pricing'}
              </Button>
            </Link>
          </>
        )}
        
        <LanguageSwitcher />
        
        {isAuthenticated ? (
          <>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                {locale === 'fr' ? 'Tableau de bord' : 'Dashboard'}
              </Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              {locale === 'fr' ? 'Déconnexion' : 'Logout'}
            </Button>
          </>
        ) : (
          <>
            {!pathname.includes('/auth/login') && (
              <Link href="/auth/login">
                <Button variant="secondary" size="sm">
                  {t('navigation.signIn')}
                </Button>
              </Link>
            )}
            {!pathname.includes('/auth/register') && (
              <Link href="/auth/register">
                <Button variant="primary" size="sm">
                  {t('navigation.getStarted')}
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
}