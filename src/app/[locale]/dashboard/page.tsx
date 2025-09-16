'use client';

import { useLocale } from 'next-intl';
import { StatCard, MetricCard } from '@/components/dashboard/StatCard';

export default function DashboardPage() {
  const locale = useLocale() as 'en' | 'fr';

  const translations = {
    en: {
      welcome: 'Welcome back',
      overview: 'Business Overview',
      activePartnerships: 'Active Partnerships',
      contractValue: 'Contract Value',
      searchesThisMonth: 'Searches This Month',
      indigenousParticipation: 'Indigenous Participation',
      quickActions: 'Quick Actions',
      findPartners: 'Find Partners',
      submitRfq: 'Submit RFQ',
      viewBilling: 'View Billing',
      updateProfile: 'Update Profile',
      recentActivity: 'Recent Activity',
      newPartnerRequest: 'New partnership request from',
      rfqSubmitted: 'RFQ submitted for',
      contractAwarded: 'Contract awarded:',
      profileUpdated: 'Business profile updated',
      timeAgo: {
        minutes: 'minutes ago',
        hours: 'hours ago',
        days: 'days ago',
      },
    },
    fr: {
      welcome: 'Bon retour',
      overview: 'Aperçu de l\'entreprise',
      activePartnerships: 'Partenariats actifs',
      contractValue: 'Valeur du contrat',
      searchesThisMonth: 'Recherches ce mois-ci',
      indigenousParticipation: 'Participation autochtone',
      quickActions: 'Actions rapides',
      findPartners: 'Trouver des partenaires',
      submitRfq: 'Soumettre une DDQ',
      viewBilling: 'Voir la facturation',
      updateProfile: 'Mettre à jour le profil',
      recentActivity: 'Activité récente',
      newPartnerRequest: 'Nouvelle demande de partenariat de',
      rfqSubmitted: 'DDQ soumise pour',
      contractAwarded: 'Contrat attribué:',
      profileUpdated: 'Profil d\'entreprise mis à jour',
      timeAgo: {
        minutes: 'minutes',
        hours: 'heures',
        days: 'jours',
      },
    },
  };

  const t = translations[locale];

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'partnership',
      message: `${t.newPartnerRequest} Northern Tech Solutions`,
      time: `2 ${t.timeAgo.hours}`,
    },
    {
      id: 2,
      type: 'rfq',
      message: `${t.rfqSubmitted} Infrastructure Development Project`,
      time: `5 ${t.timeAgo.hours}`,
    },
    {
      id: 3,
      type: 'contract',
      message: `${t.contractAwarded} $2.5M Supply Agreement`,
      time: `1 ${t.timeAgo.days}`,
    },
    {
      id: 4,
      type: 'profile',
      message: t.profileUpdated,
      time: `3 ${t.timeAgo.days}`,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'partnership':
        return (
          <svg className="w-5 h-5 text-primary-start" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'rfq':
        return (
          <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'contract':
        return (
          <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {t.welcome}, John
        </h1>
        <p className="text-gray-400">{t.overview}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title={t.activePartnerships}
          value="3"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          variant="primary"
          trend={{ value: 50, isPositive: true }}
        />
        
        <StatCard
          title={t.contractValue}
          value="$18M"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          variant="success"
          trend={{ value: 23, isPositive: true }}
        />
        
        <MetricCard
          label={t.searchesThisMonth}
          value="45"
          progress={45}
          total={100}
          locale={locale}
        />
        
        <StatCard
          title={t.indigenousParticipation}
          value="37.5%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          variant="warning"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t.quickActions}</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="glass-hover rounded-lg p-4 text-center transition-all">
              <svg className="w-8 h-8 mx-auto mb-2 text-primary-start" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-white">{t.findPartners}</span>
            </button>
            
            <button className="glass-hover rounded-lg p-4 text-center transition-all">
              <svg className="w-8 h-8 mx-auto mb-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-white">{t.submitRfq}</span>
            </button>
            
            <button className="glass-hover rounded-lg p-4 text-center transition-all">
              <svg className="w-8 h-8 mx-auto mb-2 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm text-white">{t.viewBilling}</span>
            </button>
            
            <button className="glass-hover rounded-lg p-4 text-center transition-all">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm text-white">{t.updateProfile}</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t.recentActivity}</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}