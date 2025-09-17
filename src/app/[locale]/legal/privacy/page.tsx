import { Navigation } from '@/components/layout/Navigation';
import { useLocale } from 'next-intl';

export default function PrivacyPage() {
  const locale = useLocale();

  if (locale === 'fr') {
    return (
      <main className="min-h-screen">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Navigation />
          
          <div className="max-w-4xl mx-auto mt-12">
            <h1 className="text-4xl font-bold text-white mb-8">Politique de confidentialité</h1>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">Date d'entrée en vigueur: 1er janvier 2024</p>
              
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Collecte de données</h2>
              <p className="text-gray-300 mb-4">Nous collectons:</p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Informations d'entreprise (nom, numéro d'entreprise, coordonnées)</li>
                <li>Informations de contact (email, téléphone)</li>
                <li>Données de vérification (pourcentage de propriété autochtone)</li>
                <li>Informations de paiement (via Stripe - nous ne stockons pas les données de carte)</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Utilisation des données</h2>
              <p className="text-gray-300 mb-4">Vos données sont utilisées pour:</p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Vérifier l'authenticité des entreprises autochtones</li>
                <li>Faciliter les connexions entre entreprises</li>
                <li>Traiter les paiements et gérer les abonnements</li>
                <li>Envoyer des communications importantes sur la plateforme</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Protection des données</h2>
              <p className="text-gray-300 mb-4">
                Nous utilisons le chiffrement SSL et suivons les meilleures pratiques de l'industrie pour protéger 
                vos données. Vos informations sont stockées sur des serveurs sécurisés au Canada.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Vos droits (LPRPDE)</h2>
              <p className="text-gray-300 mb-4">Conformément à la LPRPDE, vous avez le droit de:</p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Accéder à vos données personnelles</li>
                <li>Corriger les inexactitudes</li>
                <li>Retirer votre consentement</li>
                <li>Demander la suppression de vos données</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Contact</h2>
              <p className="text-gray-300 mb-4">
                Pour toute question: privacy@indigenious.ca
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Navigation />
        
        <div className="max-w-4xl mx-auto mt-12">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">Effective Date: January 1, 2024</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Data Collection</h2>
            <p className="text-gray-300 mb-4">We collect:</p>
            <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
              <li>Business information (name, business number, contact details)</li>
              <li>Contact information (email, phone)</li>
              <li>Verification data (Indigenous ownership percentage)</li>
              <li>Payment information (via Stripe - we don't store card data)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Data Usage</h2>
            <p className="text-gray-300 mb-4">Your data is used to:</p>
            <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
              <li>Verify Indigenous business authenticity</li>
              <li>Facilitate business connections</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important platform communications</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Data Protection</h2>
            <p className="text-gray-300 mb-4">
              We use SSL encryption and follow industry best practices to protect your data. 
              Your information is stored on secure servers in Canada.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Your Rights (PIPEDA)</h2>
            <p className="text-gray-300 mb-4">Under PIPEDA, you have the right to:</p>
            <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccuracies</li>
              <li>Withdraw consent</li>
              <li>Request deletion of your data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Cookies</h2>
            <p className="text-gray-300 mb-4">
              We use essential cookies for authentication and session management. 
              Analytics cookies are used only with your consent.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Third-Party Services</h2>
            <p className="text-gray-300 mb-4">
              We use trusted third-party services:
            </p>
            <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
              <li>Stripe for payment processing</li>
              <li>Supabase for data storage</li>
              <li>Vercel for hosting</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Contact</h2>
            <p className="text-gray-300 mb-4">
              For privacy inquiries: privacy@indigenious.ca
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}