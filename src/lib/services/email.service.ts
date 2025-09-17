import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private from = process.env.EMAIL_FROM || 'noreply@indigenious.ca';

  async sendVerificationCode(email: string, code: string, locale: 'en' | 'fr' = 'en'): Promise<boolean> {
    const template = this.getVerificationTemplate(code, locale);
    
    try {
      const { data, error } = await resend.emails.send({
        from: this.from,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        console.error('Email send error:', error);
        return false;
      }

      console.log('Verification email sent:', data);
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  private getVerificationTemplate(code: string, locale: 'en' | 'fr') {
    if (locale === 'fr') {
      return {
        subject: 'Code de vérification Indigenious',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #667EEA; text-align: center;">Indigenious</h1>
            <h2>Votre code de vérification</h2>
            <p>Voici votre code de vérification:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${code}
            </div>
            <p>Ce code expirera dans 10 minutes.</p>
            <p>Si vous n'avez pas demandé ce code, veuillez ignorer ce courriel.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; text-align: center;">
              © 2024 Indigenious. Bâtir des ponts, honorer l'héritage.
            </p>
          </div>
        `,
        text: `Votre code de vérification Indigenious est: ${code}. Ce code expirera dans 10 minutes.`
      };
    }

    return {
      subject: 'Indigenious Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #667EEA; text-align: center;">Indigenious</h1>
          <h2>Your Verification Code</h2>
          <p>Here is your verification code:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            © 2024 Indigenious. Building bridges, honoring heritage.
          </p>
        </div>
      `,
      text: `Your Indigenious verification code is: ${code}. This code will expire in 10 minutes.`
    };
  }

  async sendWelcomeEmail(email: string, businessName: string, locale: 'en' | 'fr' = 'en'): Promise<boolean> {
    const template = this.getWelcomeTemplate(businessName, locale);
    
    try {
      const { data, error } = await resend.emails.send({
        from: this.from,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        console.error('Welcome email error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  private getWelcomeTemplate(businessName: string, locale: 'en' | 'fr') {
    if (locale === 'fr') {
      return {
        subject: 'Bienvenue sur Indigenious!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #667EEA; text-align: center;">Bienvenue sur Indigenious!</h1>
            <p>Bonjour ${businessName},</p>
            <p>Merci de rejoindre Indigenious - la plateforme de vérification des entreprises autochtones du Canada.</p>
            <h3>Prochaines étapes:</h3>
            <ul>
              <li>Complétez votre profil d'entreprise</li>
              <li>Explorez les opportunités de partenariat</li>
              <li>Consultez les appels d'offres gouvernementaux</li>
            </ul>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/fr/dashboard" style="background: #667EEA; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
                Accéder au tableau de bord
              </a>
            </p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; text-align: center;">
              © 2024 Indigenious. Bâtir des ponts, honorer l'héritage.
            </p>
          </div>
        `,
        text: `Bienvenue sur Indigenious! Merci de rejoindre notre plateforme.`
      };
    }

    return {
      subject: 'Welcome to Indigenious!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #667EEA; text-align: center;">Welcome to Indigenious!</h1>
          <p>Hello ${businessName},</p>
          <p>Thank you for joining Indigenious - Canada's Indigenous business verification platform.</p>
          <h3>Next Steps:</h3>
          <ul>
            <li>Complete your business profile</li>
            <li>Explore partnership opportunities</li>
            <li>Browse government RFQs</li>
          </ul>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/en/dashboard" style="background: #667EEA; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
              Go to Dashboard
            </a>
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            © 2024 Indigenious. Building bridges, honoring heritage.
          </p>
        </div>
      `,
      text: `Welcome to Indigenious! Thank you for joining our platform.`
    };
  }
}