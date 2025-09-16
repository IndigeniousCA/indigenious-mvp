'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export interface FilterOptions {
  openToPartnership: boolean;
  province: string;
  industry: string;
}

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  locale: 'en' | 'fr';
}

// Canadian provinces/territories
const provinces = {
  en: [
    { value: '', label: 'All Provinces' },
    { value: 'AB', label: 'Alberta' },
    { value: 'BC', label: 'British Columbia' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'NB', label: 'New Brunswick' },
    { value: 'NL', label: 'Newfoundland and Labrador' },
    { value: 'NT', label: 'Northwest Territories' },
    { value: 'NS', label: 'Nova Scotia' },
    { value: 'NU', label: 'Nunavut' },
    { value: 'ON', label: 'Ontario' },
    { value: 'PE', label: 'Prince Edward Island' },
    { value: 'QC', label: 'Quebec' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'YT', label: 'Yukon' },
  ],
  fr: [
    { value: '', label: 'Toutes les provinces' },
    { value: 'AB', label: 'Alberta' },
    { value: 'BC', label: 'Colombie-Britannique' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'NB', label: 'Nouveau-Brunswick' },
    { value: 'NL', label: 'Terre-Neuve-et-Labrador' },
    { value: 'NT', label: 'Territoires du Nord-Ouest' },
    { value: 'NS', label: 'Nouvelle-Écosse' },
    { value: 'NU', label: 'Nunavut' },
    { value: 'ON', label: 'Ontario' },
    { value: 'PE', label: 'Île-du-Prince-Édouard' },
    { value: 'QC', label: 'Québec' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'YT', label: 'Yukon' },
  ],
};

// Industry sectors
const industries = {
  en: [
    { value: '', label: 'All Industries' },
    { value: 'construction', label: 'Construction' },
    { value: 'technology', label: 'Technology' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'energy', label: 'Energy' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'finance', label: 'Finance' },
  ],
  fr: [
    { value: '', label: 'Toutes les industries' },
    { value: 'construction', label: 'Construction' },
    { value: 'technology', label: 'Technologie' },
    { value: 'retail', label: 'Commerce de détail' },
    { value: 'manufacturing', label: 'Fabrication' },
    { value: 'hospitality', label: 'Hôtellerie' },
    { value: 'consulting', label: 'Consultation' },
    { value: 'healthcare', label: 'Santé' },
    { value: 'education', label: 'Éducation' },
    { value: 'energy', label: 'Énergie' },
    { value: 'arts', label: 'Arts et culture' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'finance', label: 'Finance' },
  ],
};

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  locale,
}) => {
  const translations = {
    en: {
      filters: 'Filters',
      openToPartnership: 'Open to Partnership',
      province: 'Province',
      industry: 'Industry',
      clearAll: 'Clear All',
    },
    fr: {
      filters: 'Filtres',
      openToPartnership: 'Ouvert aux partenariats',
      province: 'Province',
      industry: 'Industrie',
      clearAll: 'Effacer tout',
    },
  };

  const t = translations[locale];
  const provinceOptions = provinces[locale];
  const industryOptions = industries[locale];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      openToPartnership: false,
      province: '',
      industry: '',
    });
  };

  const hasActiveFilters = filters.openToPartnership || filters.province || filters.industry;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{t.filters}</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-start hover:text-primary-end transition-colors touch-target px-2"
          >
            {t.clearAll}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Open to Partnership Filter */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer p-2 -m-2 touch-target">
            <input
              type="checkbox"
              checked={filters.openToPartnership}
              onChange={(e) => handleFilterChange('openToPartnership', e.target.checked)}
              className="
                w-6 h-6 rounded
                bg-white/5 border border-white/20
                text-primary-start
                focus:ring-2 focus:ring-primary-start/50
                focus:outline-none
                touch-manipulation
              "
            />
            <span className="text-white select-none">
              {t.openToPartnership}
            </span>
          </label>
        </div>

        {/* Province Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t.province}
          </label>
          <select
            value={filters.province}
            onChange={(e) => handleFilterChange('province', e.target.value)}
            className="
              w-full px-4 py-4 rounded-lg
              bg-white/5 border border-white/10
              text-white
              focus:outline-none focus:border-primary-start
              transition-colors
              min-h-[48px]
              touch-manipulation
              text-base
            "
          >
            {provinceOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-dark-middle">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Industry Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t.industry}
          </label>
          <select
            value={filters.industry}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
            className="
              w-full px-4 py-4 rounded-lg
              bg-white/5 border border-white/10
              text-white
              focus:outline-none focus:border-primary-start
              transition-colors
              min-h-[48px]
              touch-manipulation
              text-base
            "
          >
            {industryOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-dark-middle">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};