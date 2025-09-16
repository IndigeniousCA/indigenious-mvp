'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { Filters, FilterOptions } from '@/components/search/Filters';
import { BusinessCard, Business } from '@/components/search/BusinessCard';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { BusinessCardSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/ToastContainer';

// Mock data for 10 sample businesses
const mockBusinesses: Business[] = [
  {
    id: '1',
    businessName: 'Northern Tech Solutions',
    description: 'Leading Indigenous technology company specializing in software development and IT consulting for remote communities.',
    indigenousOwnershipPercentage: 100,
    openToPartnership: true,
    location: { city: 'Winnipeg', province: 'MB' },
    industry: 'technology',
    verified: true,
  },
  {
    id: '2',
    businessName: 'Maple Construction Ltd.',
    description: 'Full-service construction company with expertise in sustainable building practices and community infrastructure.',
    indigenousOwnershipPercentage: 0,
    openToPartnership: false,
    location: { city: 'Toronto', province: 'ON' },
    industry: 'construction',
    verified: true,
  },
  {
    id: '3',
    businessName: 'Spirit Bear Hospitality',
    description: 'Boutique hospitality group operating eco-lodges and cultural tourism experiences across Canada.',
    indigenousOwnershipPercentage: 75,
    openToPartnership: true,
    location: { city: 'Vancouver', province: 'BC' },
    industry: 'hospitality',
    verified: true,
  },
  {
    id: '4',
    businessName: 'Prairie Financial Advisors',
    description: 'Independent financial planning and investment advisory firm serving businesses and individuals.',
    indigenousOwnershipPercentage: 0,
    openToPartnership: true,
    location: { city: 'Calgary', province: 'AB' },
    industry: 'finance',
    verified: false,
  },
  {
    id: '5',
    businessName: 'Great Lakes Manufacturing',
    description: 'Precision manufacturing and fabrication services for aerospace and automotive industries.',
    indigenousOwnershipPercentage: 51,
    openToPartnership: true,
    location: { city: 'Thunder Bay', province: 'ON' },
    industry: 'manufacturing',
    verified: true,
  },
  {
    id: '6',
    businessName: 'Aurora Healthcare Services',
    description: 'Community-focused healthcare provider offering traditional and modern medical services.',
    indigenousOwnershipPercentage: 100,
    openToPartnership: false,
    location: { city: 'Yellowknife', province: 'NT' },
    industry: 'healthcare',
    verified: true,
  },
  {
    id: '7',
    businessName: 'East Coast Seafood Co.',
    description: 'Sustainable seafood harvesting and distribution throughout Atlantic Canada.',
    indigenousOwnershipPercentage: 0,
    openToPartnership: true,
    location: { city: 'Halifax', province: 'NS' },
    industry: 'agriculture',
    verified: false,
  },
  {
    id: '8',
    businessName: 'Raven Arts Collective',
    description: 'Indigenous arts and crafts marketplace supporting artists from across North America.',
    indigenousOwnershipPercentage: 100,
    openToPartnership: true,
    location: { city: 'Montreal', province: 'QC' },
    industry: 'arts',
    verified: true,
  },
  {
    id: '9',
    businessName: 'Summit Energy Solutions',
    description: 'Renewable energy development and consulting with focus on solar and wind projects.',
    indigenousOwnershipPercentage: 60,
    openToPartnership: false,
    location: { city: 'Regina', province: 'SK' },
    industry: 'energy',
    verified: true,
  },
  {
    id: '10',
    businessName: 'Educators Without Borders',
    description: 'Educational consulting and curriculum development for Indigenous and remote communities.',
    indigenousOwnershipPercentage: 0,
    openToPartnership: true,
    location: { city: 'Ottawa', province: 'ON' },
    industry: 'education',
    verified: false,
  },
];

export default function SearchPage() {
  const locale = useLocale() as 'en' | 'fr';
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    openToPartnership: false,
    province: '',
    industry: '',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const translations = {
    en: {
      title: 'Find Business Partners',
      subtitle: 'Connect with verified Indigenous and allied businesses across Canada',
      searchPlaceholder: 'Search for partners open to collaboration',
      resultsCount: (count: number) => `${count} businesses found`,
      noResults: 'No businesses found matching your criteria',
      requestSent: 'Partnership request sent!',
      filters: 'Filters',
      refreshing: 'Refreshing...',
    },
    fr: {
      title: 'Trouver des partenaires commerciaux',
      subtitle: 'Connectez-vous avec des entreprises autochtones et alliées vérifiées à travers le Canada',
      searchPlaceholder: 'Rechercher des partenaires ouverts à la collaboration',
      resultsCount: (count: number) => `${count} entreprises trouvées`,
      noResults: 'Aucune entreprise trouvée correspondant à vos critères',
      requestSent: 'Demande de partenariat envoyée!',
      filters: 'Filtres',
      refreshing: 'Actualisation...',
    },
  };

  const t = translations[locale];

  // Filter businesses based on search query and filters
  const filteredBusinesses = useMemo(() => {
    return mockBusinesses.filter((business) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          business.businessName.toLowerCase().includes(query) ||
          business.description.toLowerCase().includes(query) ||
          business.location.city.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Open to partnership filter
      if (filters.openToPartnership && !business.openToPartnership) {
        return false;
      }

      // Province filter
      if (filters.province && business.location.province !== filters.province) {
        return false;
      }

      // Industry filter
      if (filters.industry && business.industry !== filters.industry) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  const handleRequestPartnership = (businessId: string) => {
    // In real implementation, this would send a partnership request
    showToast(t.requestSent, 'success');
  };

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Pull to refresh functionality
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndY.current = e.touches[0].clientY;
      const pullDistance = touchEndY.current - touchStartY.current;
      
      // Only trigger refresh if pulled down from the top
      if (scrollRef.current?.scrollTop === 0 && pullDistance > 0) {
        e.preventDefault();
        
        // Show refresh indicator if pulled enough
        if (pullDistance > 100 && !isRefreshing) {
          setIsRefreshing(true);
          handleRefresh();
        }
      }
    };

    const handleRefresh = async () => {
      // Simulate refresh with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsRefreshing(false);
      showToast(
        locale === 'fr' ? 'Actualisation terminée' : 'Refresh complete',
        'success'
      );
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isRefreshing]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-mesh-gradient animate-mesh opacity-20 blur-3xl" />
      
      {/* Pull to refresh indicator */}
      <div className={`pull-to-refresh glass rounded-full px-6 py-3 ${isRefreshing ? 'active' : ''}`}>
        <p className="text-white text-sm">{t.refreshing}</p>
      </div>
      
      <div ref={scrollRef} className="relative z-10 w-full h-screen overflow-y-auto smooth-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12 safe-bottom">
          {/* Mobile-optimized Navigation */}
          <nav className="flex justify-between items-center mb-8 sm:mb-12 glass rounded-full px-4 sm:px-8 py-3 sm:py-4">
            <Link href={`/${locale}`}>
              <h1 className="text-xl sm:text-2xl font-bold text-gradient cursor-pointer">Indigenious</h1>
            </Link>
            <div className="flex gap-2 sm:gap-4 items-center">
              <LanguageSwitcher />
              <Link href={`/${locale}/dashboard`} className="hidden sm:block">
                <button className="px-4 py-2 text-white hover:text-primary-start transition-colors">
                  Dashboard
                </button>
              </Link>
            </div>
          </nav>

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              {t.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              {t.subtitle}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t.searchPlaceholder}
              locale={locale}
            />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full glass rounded-lg px-4 py-3 flex items-center justify-between touch-target"
            >
              <span className="text-white font-medium">{t.filters}</span>
              <svg className={`w-5 h-5 text-white transform transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="glass rounded-xl p-4 lg:sticky lg:top-4">
                <Filters
                  filters={filters}
                  onFilterChange={setFilters}
                  locale={locale}
                />
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="mb-4 sm:mb-6">
                <p className="text-gray-400">
                  {t.resultsCount(filteredBusinesses.length)}
                </p>
              </div>

              {/* Business Cards Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <BusinessCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {filteredBusinesses.map((business) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      onRequestPartnership={handleRequestPartnership}
                      locale={locale}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg mb-2">{t.noResults}</p>
                  <p className="text-gray-500 text-sm">
                    {locale === 'fr' 
                      ? 'Essayez de modifier vos filtres ou votre recherche'
                      : 'Try adjusting your filters or search query'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile-optimized Footer */}
          <footer className="w-full glass border-t border-white/10 mt-12 -mx-4 sm:mx-0 sm:rounded-t-2xl">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 sm:py-6 text-center text-gray-400">
              <p className="text-sm sm:text-base">&copy; 2024 Indigenious. {locale === 'fr' ? 'Bâtir des ponts, honorer l\'héritage.' : 'Building bridges, honoring heritage.'}</p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}