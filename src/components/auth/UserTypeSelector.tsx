'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

interface UserTypeSelectorProps {
  value: 'indigenous_business' | 'canadian_business' | null;
  onChange: (type: 'indigenous_business' | 'canadian_business') => void;
}

export function UserTypeSelector({ value, onChange }: UserTypeSelectorProps) {
  const locale = useLocale();
  
  const options = [
    {
      id: 'indigenous_business',
      title: locale === 'fr' ? 'Entreprise Autochtone' : 'Indigenous Business',
      description: locale === 'fr' 
        ? 'Je suis une entreprise détenue par des Autochtones'
        : 'I am an Indigenous-owned business',
      icon: '🦅',
      benefits: locale === 'fr'
        ? ['Aucune carte requise (gratuit)', 'Rechercher des partenaires', 'Voir les appels d\'offres', 'Demander des partenariats']
        : ['No card required (free)', 'Search for partners', 'View government RFQs', 'Request partnerships'],
      highlight: locale === 'fr' ? '✨ Aucune carte de crédit requise' : '✨ No credit card required'
    },
    {
      id: 'canadian_business',
      title: locale === 'fr' ? 'Entreprise Canadienne' : 'Canadian Business',
      description: locale === 'fr'
        ? 'Je suis une entreprise canadienne ouverte aux partenariats'
        : 'I am a Canadian business open to partnerships',
      icon: '🍁',
      benefits: locale === 'fr'
        ? ['Recevoir des demandes de partenariat', 'Profil vérifiable', 'Accès prioritaire']
        : ['Receive partnership requests', 'Verifiable profile', 'Priority access'],
      requirement: locale === 'fr' ? '💳 Carte de crédit requise' : '💳 Credit card required'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        {locale === 'fr' ? 'Choisissez votre type de compte' : 'Choose your account type'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id as 'indigenous_business' | 'canadian_business')}
            className={`
              relative p-6 rounded-xl text-left transition-all duration-300
              ${value === option.id 
                ? 'bg-primary-start/20 border-2 border-primary-start' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }
            `}
          >
            {value === option.id && (
              <div className="absolute top-4 right-4">
                <svg className="w-6 h-6 text-primary-start" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <div className="text-4xl mb-3">{option.icon}</div>
            <h4 className="text-lg font-semibold text-white mb-2">{option.title}</h4>
            <p className="text-sm text-gray-400 mb-4">{option.description}</p>
            
            <ul className="space-y-1">
              {option.benefits.map((benefit, index) => (
                <li key={index} className="text-xs text-gray-500 flex items-center">
                  <span className="text-success mr-2">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
            
            {option.highlight && (
              <div className="mt-3 text-sm text-success font-medium">
                {option.highlight}
              </div>
            )}
            
            {option.requirement && (
              <div className="mt-3 text-sm text-warning font-medium">
                {option.requirement}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {value && (
        <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-lg">
          <p className="text-sm text-success">
            {locale === 'fr' 
              ? `✓ Vous avez sélectionné: ${value === 'indigenous_business' ? 'Entreprise Autochtone' : 'Entreprise Canadienne'}`
              : `✓ You selected: ${value === 'indigenous_business' ? 'Indigenous Business' : 'Canadian Business'}`
            }
          </p>
        </div>
      )}
    </div>
  );
}