import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { addSecurityHeaders } from './middleware/security';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  // First run the intl middleware
  const response = intlMiddleware(request);
  
  // Then add security headers
  return addSecurityHeaders(request, response);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};