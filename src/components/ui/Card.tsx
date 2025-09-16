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
  return (
    <div
      className={`
        glass
        ${hover ? 'glass-hover' : ''}
        rounded-xl
        p-6
        ${className}
      `}
    >
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
  return (
    <div
      className={`
        stat-card
        rounded-xl
        p-8
        text-center
        transition-all
        duration-300
        hover:scale-105
        cursor-pointer
        ${className}
      `}
    >
      <h3 className="text-4xl md:text-5xl font-bold text-gradient mb-2 animate-float">
        {value}
      </h3>
      <p className="text-gray-300 text-lg font-medium uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
};