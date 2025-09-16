# Indigenious - Indigenous Business Platform

A modern platform connecting Indigenous businesses across Canada with verification, partnerships, and growth opportunities.

## 🚀 Features

- **Bilingual Support** - Full English and French language support
- **Business Verification** - Secure Indigenous business verification system
- **Partnership Matching** - Connect with verified businesses for partnerships
- **Subscription Tiers** - Partner, Growth, and Corporate plans via Stripe
- **PWA Support** - Install as a mobile app
- **Liquid Glass Design** - Modern, accessible UI with glass morphism effects

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase
- **Payments**: Stripe
- **i18n**: next-intl
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/indigenious-platform.git
cd indigenious-platform
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Add your environment variables (see Environment Setup below)

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔑 Environment Setup

Create a `.env` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables in Vercel

Go to your project settings in Vercel and add all the environment variables from `.env.example`.

## 📝 Database Setup

Run the Supabase schema in your Supabase SQL editor:

```sql
-- See supabase/schema.sql for full schema
```

## 💳 Stripe Setup

1. Create products in Stripe Dashboard for each tier
2. Update price IDs in the code or environment variables
3. Set up webhook endpoint for `/api/stripe/webhook`

## 🌐 Localization

The app supports English and French. Translation files are in:
- `/messages/en.json`
- `/messages/fr.json`

## 📱 PWA

The app is PWA-ready. Users can install it on mobile devices for a native app experience.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

This project is licensed under the MIT License.# Trigger deployment 1758036695
