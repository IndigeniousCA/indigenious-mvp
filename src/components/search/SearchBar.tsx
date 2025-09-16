'use client';

import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  locale: 'en' | 'fr';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
  locale
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg 
          className="h-5 w-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          pl-12 pr-12 py-4
          bg-white/5
          border border-white/10
          rounded-xl
          text-white
          placeholder-gray-400
          focus:outline-none
          focus:border-primary-start
          focus:bg-white/10
          transition-all
          text-base sm:text-lg
          min-h-[56px]
          touch-manipulation
        "
      />
      
      {value && (
        <button
          onClick={() => onChange('')}
          className="
            absolute inset-y-0 right-0 pr-4
            flex items-center
            text-gray-400 hover:text-white
            transition-colors
            touch-target
          "
          aria-label={locale === 'fr' ? 'Effacer la recherche' : 'Clear search'}
        >
          <svg 
            className="h-6 w-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </div>
  );
};