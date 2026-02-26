import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/token';

// Simple in-memory rate limiter (Note: in serverless environments, this resets per instance)
// For true distributed rate limiting, consider Upstash Redis or Vercel KV.
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

const intlMiddleware = createMiddleware({
    locales: ['he', 'en', 'ru', 'fr', 'ar'],
    defaultLocale: 'he',
    localeDetection: false
});

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // Rate Limiting Logic for API and Login routes
    if (pathname.includes('/api') || pathname.includes('/login')) {
        const now = Date.now();
        const limitRecord = rateLimitMap.get(ip) || { count: 0, lastReset: now };

        if (now - limitRecord.lastReset > RATE_LIMIT_WINDOW_MS) {
            limitRecord.count = 0;
            limitRecord.lastReset = now;
        }

        limitRecord.count++;
        rateLimitMap.set(ip, limitRecord);

        if (limitRecord.count > MAX_REQUESTS_PER_WINDOW) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
    }

    const isLoginPage = pathname.includes('/login');
    const isProtected = !isLoginPage && /\/(he|en|ru|fr|ar)?\/?(admin|host|account)/.test(pathname);

    if (isProtected) {
        const token = req.cookies.get('auth-token')?.value;
        const nextAuthToken = req.cookies.get('next-auth.session-token')?.value || req.cookies.get('__Secure-next-auth.session-token')?.value;

        // If they have a NextAuth token, we let them pass the edge middleware. 
        // The individual page components (via useSession or getServerSession) will handle the actual role-based auth.
        if (nextAuthToken) {
            return intlMiddleware(req);
        }

        const payload = token ? await verifyToken(token) : null;

        if (!payload) {
            const locale = req.nextUrl.pathname.split('/')[1] || 'he';
            const validLocale = ['he', 'en', 'ru', 'fr', 'ar'].includes(locale) ? locale : 'he';
            return NextResponse.redirect(new URL(`/${validLocale}/login`, req.url));
        }

        const role = (payload as any).role;
        const isHostRoute = pathname.includes('/host');
        const isAdminRoute = pathname.includes('/admin');

        if (isAdminRoute && role !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url));
        }

        if (isHostRoute && role !== 'host' && role !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
