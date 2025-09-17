'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { AuthForm, InputField } from '@/components/auth/AuthForm';
import { AuthService } from '@/lib/services/auth.service';
import { useToast } from '@/components/ui/ToastContainer';

export default function VerifyPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  const authService = new AuthService();

  useEffect(() => {
    // Get user info from session storage
    const storedUserId = sessionStorage.getItem('pendingUserId');
    const storedEmail = sessionStorage.getItem('pendingUserEmail');
    
    if (!storedUserId || !storedEmail) {
      router.push(`/${locale}/auth/login`);
      return;
    }
    
    setUserId(storedUserId);
    setUserEmail(storedEmail);
  }, [locale, router]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || verificationCode.length !== 6) {
      setError(
        locale === 'fr'
          ? 'Veuillez entrer un code à 6 chiffres'
          : 'Please enter a 6-digit code'
      );
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const isValid = await authService.verifyCode(userId, verificationCode);
      
      if (isValid) {
        setSuccess(
          locale === 'fr'
            ? 'Vérification réussie! Redirection...'
            : 'Verification successful! Redirecting...'
        );
        showToast(
          locale === 'fr' 
            ? 'Compte vérifié avec succès!' 
            : 'Account verified successfully!', 
          'success'
        );
        
        // Clear session storage
        sessionStorage.removeItem('pendingUserId');
        sessionStorage.removeItem('pendingUserEmail');
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
        }, 1500);
      } else {
        setError(
          locale === 'fr'
            ? 'Code invalide ou expiré. Veuillez réessayer.'
            : 'Invalid or expired code. Please try again.'
        );
        showToast(
          locale === 'fr'
            ? 'Code de vérification invalide'
            : 'Invalid verification code',
          'error'
        );
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

  const handleResendCode = async () => {
    if (!userId || !userEmail || resendCountdown > 0) return;
    
    setIsLoading(true);
    try {
      await authService.sendVerificationCode(userId, userEmail, 'email');
      showToast(
        locale === 'fr'
          ? 'Nouveau code envoyé! Vérifiez votre courriel.'
          : 'New code sent! Check your email.',
        'success'
      );
      setResendCountdown(60); // 60 second cooldown
    } catch (err) {
      showToast(
        locale === 'fr'
          ? 'Impossible d\'envoyer le code. Veuillez réessayer.'
          : 'Failed to send code. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
  };

  const translations = {
    title: locale === 'fr' ? 'Vérification du compte' : 'Account Verification',
    subtitle: locale === 'fr' 
      ? `Un code de vérification a été envoyé à ${userEmail}` 
      : `A verification code has been sent to ${userEmail}`,
    codeLabel: locale === 'fr' ? 'Code de vérification' : 'Verification Code',
    submitText: locale === 'fr' ? 'Vérifier' : 'Verify',
    resendText: locale === 'fr' ? 'Renvoyer le code' : 'Resend code',
    resendingIn: locale === 'fr' ? 'Renvoyer dans' : 'Resend in',
    seconds: locale === 'fr' ? 'secondes' : 'seconds',
    backToLogin: locale === 'fr' ? 'Retour à la connexion' : 'Back to login',
    didntReceive: locale === 'fr' ? 'Vous n\'avez pas reçu le code?' : "Didn't receive the code?"
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
      {/* Verification Code Field */}
      <InputField
        type="text"
        label={translations.codeLabel}
        placeholder="123456"
        value={verificationCode}
        onChange={handleCodeChange}
        error={error ? '' : undefined}
        required
        maxLength={6}
        className="text-center text-2xl font-mono tracking-widest"
      />

      {/* Resend Code */}
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-2">{translations.didntReceive}</p>
        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendCountdown > 0 || isLoading}
          className="text-primary-start hover:text-primary-end transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {resendCountdown > 0 
            ? `${translations.resendingIn} ${resendCountdown} ${translations.seconds}`
            : translations.resendText
          }
        </button>
      </div>

      {/* Back to Login Link */}
      <div className="text-center text-sm text-gray-400">
        <Link href={`/${locale}/auth/login`} className="text-primary-start hover:text-primary-end transition-colors">
          ← {translations.backToLogin}
        </Link>
      </div>
    </AuthForm>
  );
}