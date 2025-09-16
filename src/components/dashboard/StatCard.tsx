'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'stat-card',
    primary: 'stat-card border-primary-start/50',
    success: 'stat-card border-success/50',
    warning: 'stat-card border-danger/50',
  };

  const iconBackgrounds = {
    default: 'bg-white/10',
    primary: 'bg-gradient-primary',
    success: 'bg-success/20',
    warning: 'bg-danger/20',
  };

  const iconColors = {
    default: 'text-white',
    primary: 'text-white',
    success: 'text-success',
    warning: 'text-danger',
  };

  return (
    <div className={`${variantStyles[variant]} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-grow">
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {subtitle && (
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        
        {icon && (
          <div className={`
            ${iconBackgrounds[variant]}
            ${iconColors[variant]}
            w-12 h-12 rounded-lg flex items-center justify-center
          `}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-2">
          <div className={`
            flex items-center gap-1 text-sm font-medium
            ${trend.isPositive ? 'text-success' : 'text-danger'}
          `}>
            <svg 
              className={`w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
              />
            </svg>
            <span>{Math.abs(trend.value)}%</span>
          </div>
          <span className="text-gray-500 text-sm">vs last month</span>
        </div>
      )}
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  progress?: number;
  total?: number;
  locale: 'en' | 'fr';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  progress,
  total,
  locale,
}) => {
  const percentage = progress && total ? Math.round((progress / total) * 100) : 0;

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm">{label}</p>
        {progress && total && (
          <p className="text-gray-500 text-xs">
            {progress} {locale === 'fr' ? 'sur' : 'of'} {total}
          </p>
        )}
      </div>
      
      <p className="text-2xl font-bold text-white mb-3">{value}</p>
      
      {progress && total && (
        <div className="relative">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">{percentage}%</p>
        </div>
      )}
    </div>
  );
};