'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface Business {
  id: string;
  businessName: string;
  description: string;
  indigenousOwnershipPercentage?: number;
  openToPartnership: boolean;
  location: {
    city: string;
    province: string;
  };
  industry: string;
  verified: boolean;
}

interface BusinessCardProps {
  business: Business;
  onRequestPartnership: (businessId: string) => void;
  locale: 'en' | 'fr';
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onRequestPartnership,
  locale,
}) => {
  const translations = {
    en: {
      requestPartnership: 'Request Partnership',
      openToPartnership: 'Open to Partnership',
      indigenousOwned: 'Indigenous Owned',
      verified: 'Verified',
      location: 'Location',
      industry: 'Industry',
    },
    fr: {
      requestPartnership: 'Demander un partenariat',
      openToPartnership: 'Ouvert aux partenariats',
      indigenousOwned: 'Propriété autochtone',
      verified: 'Vérifié',
      location: 'Emplacement',
      industry: 'Industrie',
    },
  };

  const t = translations[locale];

  // Get province label
  const getProvinceName = (code: string) => {
    const provinces: { [key: string]: { en: string; fr: string } } = {
      AB: { en: 'Alberta', fr: 'Alberta' },
      BC: { en: 'British Columbia', fr: 'Colombie-Britannique' },
      MB: { en: 'Manitoba', fr: 'Manitoba' },
      NB: { en: 'New Brunswick', fr: 'Nouveau-Brunswick' },
      NL: { en: 'Newfoundland and Labrador', fr: 'Terre-Neuve-et-Labrador' },
      NT: { en: 'Northwest Territories', fr: 'Territoires du Nord-Ouest' },
      NS: { en: 'Nova Scotia', fr: 'Nouvelle-Écosse' },
      NU: { en: 'Nunavut', fr: 'Nunavut' },
      ON: { en: 'Ontario', fr: 'Ontario' },
      PE: { en: 'Prince Edward Island', fr: 'Île-du-Prince-Édouard' },
      QC: { en: 'Quebec', fr: 'Québec' },
      SK: { en: 'Saskatchewan', fr: 'Saskatchewan' },
      YT: { en: 'Yukon', fr: 'Yukon' },
    };
    
    return provinces[code]?.[locale] || code;
  };

  return (
    <Card className="p-4 sm:p-6 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 active:scale-[0.99]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2 flex-wrap">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {business.businessName}
            </h3>
            {business.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-start/20 text-primary-start text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t.verified}
              </span>
            )}
          </div>
          
          <p className="text-sm sm:text-base text-gray-400 mb-4 line-clamp-3">
            {business.description}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {business.openToPartnership && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {t.openToPartnership}
          </span>
        )}
        
        {business.indigenousOwnershipPercentage && business.indigenousOwnershipPercentage > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-primary/20 text-white text-sm font-medium">
            {business.indigenousOwnershipPercentage}% {t.indigenousOwned}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 sm:mb-6 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">
            {business.location.city}, {getProvinceName(business.location.province)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="capitalize">{business.industry}</span>
        </div>
      </div>

      {/* CTA Button */}
      {business.openToPartnership && (
        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => onRequestPartnership(business.id)}
        >
          {t.requestPartnership}
        </Button>
      )}
    </Card>
  );
};