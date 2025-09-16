import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n';
import type { Metadata } from 'next';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { ToastProvider } from '@/components/ui/ToastContainer';
import '../globals.css';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  
  return {
    title: 'Indigenious - Indigenous Business Platform',
    description: isEn 
      ? 'Connect, verify, and prosper with Canada\'s Indigenous business network' 
      : 'Connectez, vérifiez et prospérez avec le réseau d\'entreprises autochtones du Canada',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
      userScalable: true,
      viewportFit: 'cover',
    },
    keywords: isEn 
      ? 'Indigenous business, procurement, partnerships, Canada, verification, B2B network'
      : 'entreprise autochtone, approvisionnement, partenariats, Canada, vérification, réseau B2B',
    authors: [{ name: 'Indigenious' }],
    creator: 'Indigenious',
    publisher: 'Indigenious',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://app.indigenious.ca'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'fr': '/fr',
      },
    },
    openGraph: {
      title: 'Indigenious - Indigenous Business Platform',
      description: isEn 
        ? 'Connect, verify, and prosper with Canada\'s Indigenous business network' 
        : 'Connectez, vérifiez et prospérez avec le réseau d\'entreprises autochtones du Canada',
      url: `https://app.indigenious.ca/${locale}`,
      siteName: 'Indigenious',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Indigenious - Indigenous Business Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Indigenious - Indigenous Business Platform',
      description: isEn 
        ? 'Connect, verify, and prosper with Canada\'s Indigenous business network' 
        : 'Connectez, vérifiez et prospérez avec le réseau d\'entreprises autochtones du Canada',
      creator: '@indigenious',
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png' },
      ],
    },
    manifest: '/manifest.json',
    verification: {
      google: 'google-site-verification-code',
      yandex: 'yandex-verification-code',
      yahoo: 'yahoo-verification-code',
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Indigenious',
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <ServiceWorkerRegistration />
            {children}
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}