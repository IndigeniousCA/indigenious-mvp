'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { AuthForm, InputField, CheckboxField } from '@/components/auth/AuthForm';
import { 
  validateLoginForm, 
  LoginFormData, 
  ValidationError,
  mockLogin 
} from '@/lib/auth';
import { useToast } from '@/components/ui/ToastContainer';

export default function LoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});

    // Validate form
    const errors = validateLoginForm(formData);
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
      // Mock login (would connect to Supabase in real implementation)
      const result = await mockLogin(formData);
      
      if (result.success) {
        setSuccess(result.message);
        showToast(result.message, 'success');
        // Redirect after 1 second
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
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

  // Translation keys for the form
  const translations = {
    title: locale === 'fr' ? 'Connexion' : 'Sign In',
    subtitle: locale === 'fr' ? 'Accédez à votre compte entreprise' : 'Access your business account',
    email: locale === 'fr' ? 'Courriel' : 'Email',
    password: locale === 'fr' ? 'Mot de passe' : 'Password',
    rememberMe: locale === 'fr' ? 'Se souvenir de moi' : 'Remember me',
    forgotPassword: locale === 'fr' ? 'Mot de passe oublié?' : 'Forgot password?',
    submitText: locale === 'fr' ? 'Se connecter' : 'Sign In',
    noAccount: locale === 'fr' ? 'Pas encore de compte?' : "Don't have an account?",
    register: locale === 'fr' ? 'Créer un compte' : 'Create account',
    or: locale === 'fr' ? 'ou' : 'or'
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
        autoComplete="email"
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
        autoComplete="current-password"
      />

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between">
        <CheckboxField
          label={translations.rememberMe}
          checked={formData.rememberMe}
          onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
        />
        
        <Link 
          href="#" 
          className="text-sm text-primary-start hover:text-primary-end transition-colors"
        >
          {translations.forgotPassword}
        </Link>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-dark-middle text-gray-400">{translations.or}</span>
        </div>
      </div>

      {/* Register Link */}
      <div className="text-center text-sm text-gray-400">
        {translations.noAccount}{' '}
        <Link href="/auth/register" className="text-primary-start hover:text-primary-end transition-colors font-medium">
          {translations.register}
        </Link>
      </div>
    </AuthForm>
  );
}