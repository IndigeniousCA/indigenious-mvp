import { Navigation } from '@/components/layout/Navigation';
import { useLocale } from 'next-intl';

export default function TermsPage() {
  const locale = useLocale();

  if (locale === 'fr') {
    return (
      <main className="min-h-screen">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Navigation />
          
          <div className="max-w-4xl mx-auto mt-12">
            <h1 className="text-4xl font-bold text-white mb-8">Conditions d'utilisation</h1>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">Date d'entrée en vigueur: 1er janvier 2024</p>
              
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptation des conditions</h2>
              <p className="text-gray-300 mb-4">
                En utilisant la plateforme Indigenious, vous acceptez ces conditions d'utilisation.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Déclarations d'authenticité</h2>
              <p className="text-gray-300 mb-4">
                <strong className="text-warning">AVERTISSEMENT IMPORTANT:</strong> Toute fausse déclaration concernant 
                le statut autochtone de votre entreprise entraînera un bannissement permanent et pourrait faire l'objet 
                de poursuites judiciaires.
              </p>
              
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Utilisation acceptable</h2>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Fournir des informations exactes et à jour</li>
                <li>Respecter la confidentialité des autres utilisateurs</li>
                <li>Ne pas utiliser la plateforme à des fins illégales</li>
                <li>Respecter les droits de propriété intellectuelle</li>
              </ul>

              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Protection des données</h2>
              <p className="text-gray-300 mb-4">
                Vos données sont protégées conformément à notre politique de confidentialité et aux lois canadiennes 
                sur la protection des renseignements personnels.
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
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4">Effective Date: January 1, 2024</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              By using the Indigenious platform, you agree to these Terms of Service.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Authenticity Declarations</h2>
            <p className="text-gray-300 mb-4">
              <strong className="text-warning">IMPORTANT WARNING:</strong> Any false declaration regarding your 
              business's Indigenous status will result in permanent ban and may be subject to legal action.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Acceptable Use</h2>
            <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
              <li>Provide accurate and current information</li>
              <li>Respect the privacy of other users</li>
              <li>Not use the platform for illegal purposes</li>
              <li>Respect intellectual property rights</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Data Protection</h2>
            <p className="text-gray-300 mb-4">
              Your data is protected in accordance with our Privacy Policy and Canadian privacy laws including PIPEDA.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Payment Terms</h2>
            <p className="text-gray-300 mb-4">
              - Indigenous businesses: Free tier available without credit card<br/>
              - Canadian businesses: Credit card required for all tiers<br/>
              - All payments are processed securely through Stripe
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              Indigenious provides the platform "as is" and is not responsible for business relationships formed 
              through the platform.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Contact</h2>
            <p className="text-gray-300 mb-4">
              For questions about these terms, contact us at legal@indigenious.ca
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}