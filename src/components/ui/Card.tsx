import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true 
}) => {
  const cardClassName = [
    'glass',
    hover ? 'glass-hover' : '',
    'rounded-xl',
    'p-6',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClassName}>
      {children}
    </div>
  );
};

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  value, 
  label, 
  className = '' 
}) => {
  const statCardClassName = [
    'stat-card',
    'rounded-xl',
    'p-8',
    'text-center',
    'transition-all',
    'duration-300',
    'hover:scale-105',
    'cursor-pointer',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={statCardClassName}>
      <h3 className="text-4xl md:text-5xl font-bold text-gradient mb-2 animate-float">
        {value}
      </h3>
      <p className="text-gray-300 text-lg font-medium uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
};