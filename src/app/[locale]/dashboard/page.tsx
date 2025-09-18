'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { StatCard, MetricCard } from '@/components/dashboard/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';

interface UserProfile {
  id: string;
  email: string;
  user_type: 'indigenous_business' | 'canadian_business';
  subscription_tier: string;
  businesses?: {
    id: string;
    business_name: string;
    indigenous_owned: boolean;
    verification_status: string;
  }[];
}

interface DashboardStats {
  activePartnerships: number;
  contractValue: string;
  searchesThisMonth: number;
  indigenousParticipation: number;
}

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  details: any;
  created_at: string;
}

export default function DashboardPage() {
  const locale = useLocale() as 'en' | 'fr';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    activePartnerships: 0,
    contractValue: '$0',
    searchesThisMonth: 0,
    indigenousParticipation: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    
    async function loadDashboardData() {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push(`/${locale}/auth/login`);
          return;
        }

        // Get user profile with business info
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select(`
            *,
            businesses(*)
          `)
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          console.error('Error loading profile:', profileError);
          return;
        }

        const typedProfile = profile as UserProfile;
        setUserProfile(typedProfile);

        // Load dashboard stats based on user type
        if (typedProfile.user_type === 'indigenous_business') {
          await loadIndigenousBusinessStats(user.id, typedProfile.businesses?.[0]?.id);
        } else {
          await loadCanadianBusinessStats(user.id, typedProfile.businesses?.[0]?.id);
        }

        // Load recent activities
        await loadRecentActivities(user.id);
        
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    async function loadIndigenousBusinessStats(userId: string, businessId?: string) {
      if (!businessId) return;
      
      const supabase = createClient();
      
      // Get partnership stats
      const { data: partnerships } = await supabase
        .from('partnership_requests')
        .select('*')
        .eq('requester_business_id', businessId)
        .eq('status', 'accepted');

      // Get search count for this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: searchCount } = await supabase
        .from('audit_log')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('action', 'search_businesses')
        .gte('created_at', startOfMonth.toISOString());

      setStats({
        activePartnerships: partnerships?.length || 0,
        contractValue: '$0', // Would come from contracts table
        searchesThisMonth: searchCount || 0,
        indigenousParticipation: 100 // Indigenous business
      });
    }

    async function loadCanadianBusinessStats(userId: string, businessId?: string) {
      if (!businessId) return;
      
      const supabase = createClient();
      
      // Get partnership requests received
      const { data: partnerships } = await supabase
        .from('partnership_requests')
        .select('*')
        .eq('requested_business_id', businessId)
        .eq('status', 'accepted');

      setStats({
        activePartnerships: partnerships?.length || 0,
        contractValue: '$0', // Would come from contracts table
        searchesThisMonth: 0, // Canadian businesses don't search
        indigenousParticipation: 0 // To be calculated based on partnerships
      });
    }

    async function loadRecentActivities(userId: string) {
      const supabase = createClient();
      
      // Get recent audit log entries
      const { data: activities } = await supabase
        .from('audit_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (activities) {
        const formattedActivities = activities.map((activity: AuditLog, index: number) => ({
          id: index + 1,
          type: activity.action === 'search_businesses' ? 'search' : 'profile',
          message: formatActivityMessage(activity.action, activity.details),
          time: formatTimeAgo(activity.created_at)
        }));
        
        setRecentActivities(formattedActivities);
      }
    }

    function formatActivityMessage(action: string, details: any) {
      const messages: Record<string, string> = {
        'search_businesses': locale === 'fr' ? 'Recherche de partenaires effectuée' : 'Searched for partners',
        'update_profile': locale === 'fr' ? 'Profil d\'entreprise mis à jour' : 'Business profile updated',
        'login': locale === 'fr' ? 'Connexion réussie' : 'Successfully logged in'
      };
      return messages[action] || action;
    }

    function formatTimeAgo(timestamp: string) {
      const now = new Date();
      const then = new Date(timestamp);
      const diffMs = now.getTime() - then.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffDays > 0) {
        return locale === 'fr' ? `${diffDays} jours` : `${diffDays} days ago`;
      } else if (diffHours > 0) {
        return locale === 'fr' ? `${diffHours} heures` : `${diffHours} hours ago`;
      } else {
        return locale === 'fr' ? `${diffMins} minutes` : `${diffMins} minutes ago`;
      }
    }

    loadDashboardData();
  }, [locale, router]);

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

  const businessName = userProfile?.businesses?.[0]?.business_name || 'Business';
  const isIndigenous = userProfile?.user_type === 'indigenous_business';

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
          {t.welcome}, {businessName}
        </h1>
        <p className="text-gray-400">
          {isIndigenous 
            ? (locale === 'fr' ? 'Entreprise autochtone' : 'Indigenous Business')
            : (locale === 'fr' ? 'Entreprise canadienne' : 'Canadian Business')
          } • {t.overview}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatCard
              title={t.activePartnerships}
              value={stats.activePartnerships.toString()}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              variant="primary"
            />
        
            <StatCard
              title={t.contractValue}
              value={stats.contractValue}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              variant="success"
            />
        
            {isIndigenous ? (
              <MetricCard
                label={t.searchesThisMonth}
                value={stats.searchesThisMonth.toString()}
                progress={stats.searchesThisMonth}
                total={100}
                locale={locale}
              />
            ) : (
              <StatCard
                title={locale === 'fr' ? 'Demandes reçues' : 'Requests Received'}
                value={stats.activePartnerships.toString()}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                }
                variant="primary"
              />
            )}
        
            <StatCard
              title={t.indigenousParticipation}
              value={`${stats.indigenousParticipation}%`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              variant="warning"
            />
          </>
        )}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t.quickActions}</h2>
          <div className="grid grid-cols-2 gap-4">
            {isIndigenous && (
              <button 
                onClick={() => router.push(`/${locale}/search`)}
                className="glass-hover rounded-lg p-4 text-center transition-all"
              >
                <svg className="w-8 h-8 mx-auto mb-2 text-primary-start" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-white">{t.findPartners}</span>
              </button>
            )}
            
            <button 
              onClick={() => router.push(`/${locale}/rfqs`)}
              className="glass-hover rounded-lg p-4 text-center transition-all"
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-white">{t.submitRfq}</span>
            </button>
            
            <button 
              onClick={() => router.push(`/${locale}/billing`)}
              className="glass-hover rounded-lg p-4 text-center transition-all"
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm text-white">{t.viewBilling}</span>
            </button>
            
            <button 
              onClick={() => router.push(`/${locale}/profile`)}
              className="glass-hover rounded-lg p-4 text-center transition-all"
            >
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
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.message}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  {locale === 'fr' ? 'Aucune activité récente' : 'No recent activity'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}