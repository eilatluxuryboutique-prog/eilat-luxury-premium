import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/token';

const intlMiddleware = createMiddleware({
    locales: ['he', 'en', 'ru', 'fr', 'ar'],
    defaultLocale: 'he'
});

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isLoginPage = pathname.includes('/login');
    const isProtected = !isLoginPage && /\/(he|en|ru|fr|ar)?\/?(admin|host|account)/.test(pathname);

    if (isProtected) {
        const token = req.cookies.get('auth-token')?.value;
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
