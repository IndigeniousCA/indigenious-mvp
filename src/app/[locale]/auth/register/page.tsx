'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { AuthForm, InputField, SelectField, CheckboxField } from '@/components/auth/AuthForm';
import { 
  validateRegistrationForm, 
  RegisterFormData, 
  ValidationError,
  mockRegister,
  formatPhoneNumber 
} from '@/lib/auth';
import { useToast } from '@/components/ui/ToastContainer';

export default function RegisterPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    phone: '',
    password: '',
    businessName: '',
    locale: locale as 'en' | 'fr',
    termsAccepted: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});

    // Validate form
    const errors = validateRegistrationForm(formData);
    if (errors.length > 0) {
      const errorMap: Record<string, string> = {};
      errors.forEach(err => {
        errorMap[err.field] = err.message;
      });
      setFieldErrors(errorMap);
      showToast(
        locale === 'fr' 
          ? 'Veuillez corriger les erreurs dans le formulaire' 
          : 'Please correct the errors in the form',
        'error'
      );
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock registration (would connect to Supabase in real implementation)
      const result = await mockRegister(formData);
      
      if (result.success) {
        setSuccess(result.message);
        showToast(result.message, 'success');
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(`/${locale}/auth/login`);
        }, 2000);
      } else {
        setError(result.message);
        showToast(result.message, 'error');
      }
    } catch (err) {
      const errorMessage = locale === 'fr' 
        ? 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
        : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: e.target.value });
  };

  // Translation keys for the form
  const translations = {
    title: locale === 'fr' ? 'Créer un compte' : 'Create Account',
    subtitle: locale === 'fr' ? 'Rejoignez la communauté des entreprises autochtones' : 'Join the Indigenous business community',
    email: locale === 'fr' ? 'Courriel' : 'Email',
    phone: locale === 'fr' ? 'Téléphone (requis pour 2FA)' : 'Phone (required for 2FA)',
    password: locale === 'fr' ? 'Mot de passe' : 'Password',
    businessName: locale === 'fr' ? 'Nom de l\'entreprise' : 'Business Name',
    languagePreference: locale === 'fr' ? 'Préférence linguistique' : 'Language Preference',
    english: locale === 'fr' ? 'Anglais' : 'English',
    french: locale === 'fr' ? 'Français' : 'French',
    warningText: locale === 'fr' ? 'FAUSSES DÉCLARATIONS = BANNISSEMENT À VIE' : 'FALSE CLAIMS = LIFETIME BAN',
    termsText: locale === 'fr' ? 
      'J\'accepte les conditions d\'utilisation et je comprends que les fausses déclarations entraîneront un bannissement permanent' : 
      'I accept the terms and conditions and understand that false claims will result in a permanent ban',
    submitText: locale === 'fr' ? 'Créer mon compte' : 'Create Account',
    hasAccount: locale === 'fr' ? 'Vous avez déjà un compte?' : 'Already have an account?',
    signIn: locale === 'fr' ? 'Se connecter' : 'Sign in'
  };

  return (
    <AuthForm
      title={translations.title}
      subtitle={translations.subtitle}
      onSubmit={handleSubmit}
      submitText={translations.submitText}
      isLoading={isLoading}
      error={error}
      success={success}
    >
      {/* Email Field */}
      <InputField
        type="email"
        label={translations.email}
        placeholder="name@company.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={fieldErrors.email}
        required
      />

      {/* Phone Field */}
      <InputField
        type="tel"
        label={translations.phone}
        placeholder="(555) 123-4567"
        value={formData.phone}
        onChange={handlePhoneChange}
        error={fieldErrors.phone}
        required
      />

      {/* Password Field */}
      <InputField
        type="password"
        label={translations.password}
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={fieldErrors.password}
        required
      />

      {/* Business Name Field */}
      <InputField
        type="text"
        label={translations.businessName}
        placeholder={locale === 'fr' ? 'Entreprise ABC Inc.' : 'ABC Enterprises Inc.'}
        value={formData.businessName}
        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
        error={fieldErrors.businessName}
        required
      />

      {/* Language Preference */}
      <SelectField
        label={translations.languagePreference}
        value={formData.locale}
        onChange={(e) => setFormData({ ...formData, locale: e.target.value as 'en' | 'fr' })}
        options={[
          { value: 'en', label: translations.english },
          { value: 'fr', label: translations.french }
        ]}
      />

      {/* Warning Banner */}
      <div className="warning-banner rounded-lg px-4 py-3 text-center">
        <p className="text-danger font-bold text-sm">
          ⚠️ {translations.warningText}
        </p>
      </div>

      {/* Terms Checkbox */}
      <CheckboxField
        label={translations.termsText}
        checked={formData.termsAccepted}
        onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
        error={fieldErrors.termsAccepted}
      />

      {/* Login Link */}
      <div className="text-center text-sm text-gray-400">
        {translations.hasAccount}{' '}
        <Link href={`/${locale}/auth/login`} className="text-primary-start hover:text-primary-end transition-colors">
          {translations.signIn}
        </Link>
      </div>
    </AuthForm>
  );
}