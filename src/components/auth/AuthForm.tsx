'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface AuthFormProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  isLoading?: boolean;
  error?: string;
  success?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  children,
  title,
  subtitle,
  onSubmit,
  submitText,
  isLoading = false,
  error,
  success
}) => {
  const locale = useLocale();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 safe-bottom safe-top">
      {/* Background effects */}
      <div className="absolute inset-0 bg-mesh-gradient animate-mesh opacity-10 blur-3xl" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <Link href={`/${locale}`} className="block text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient">Indigenious</h1>
        </Link>

        <Card className="p-6 sm:p-8">
          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            {subtitle && (
              <p className="text-gray-400">{subtitle}</p>
            )}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {children}
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : submitText}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        className={`
          w-full px-4 py-4 rounded-lg
          bg-white/5 border border-white/10
          text-white placeholder-gray-500
          focus:outline-none focus:border-primary-start
          transition-colors
          text-base
          min-h-[48px]
          touch-manipulation
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  error,
  options,
  className = '',
  ...props
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <select
        className={`
          w-full px-4 py-4 rounded-lg
          bg-white/5 border border-white/10
          text-white
          focus:outline-none focus:border-primary-start
          transition-colors
          text-base
          min-h-[48px]
          touch-manipulation
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-dark-middle">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className={`
            mt-0.5 w-6 h-6 rounded
            bg-white/5 border border-white/20
            text-primary-start
            focus:ring-2 focus:ring-primary-start/50
            focus:outline-none
            touch-manipulation
            ${className}
          `}
          {...props}
        />
        <span className="text-sm text-gray-300">
          {label}
        </span>
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};