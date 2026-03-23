import { signToken, verifyToken } from './token';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export { signToken, verifyToken };

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function getServerSideSession() {
    try {
        // 1. Check NextAuth (Google SSO)
        const { getServerSession } = await import('next-auth');
        const { authOptions } = await import('./nextauth');
        const nextAuthSession = await getServerSession(authOptions);

        if (nextAuthSession?.user) {
            return nextAuthSession.user;
        }

        // 2. Check Custom JWT (Email & Password)
        return await getSession();
    } catch (e) {
        console.error("getServerSideSession error", e);
        return null;
    }
}

export async function loginUser(user: any) {
    const token = await signToken({ userId: user._id, role: user.role, name: user.name, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
}

export async function logoutUser() {
    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === 'production';

    // Cookie options for clearing
    const options = {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax' as const // Using 'lax' for broader compatibility during clearing
    };

    // 1. Clear Custom Auth Token
    cookieStore.set('auth-token', '', options);
    cookieStore.set('auth-token', '', { ...options, sameSite: 'strict' });

    // 2. Clear ALL NextAuth cookie variations (Session, CSRF, Callback, PKCE, State)
    const nextAuthCookies = [
        'next-auth.session-token',
        '__Secure-next-auth.session-token',
        'next-auth.csrf-token',
        '__Host-next-auth.csrf-token',
        'next-auth.callback-url',
        '__Secure-next-auth.callback-url',
        'next-auth.state',
        'next-auth.pkce.code_verifier'
    ];

    nextAuthCookies.forEach(name => {
        cookieStore.set(name, '', options);
        // Also try with secure true explicitly for __Secure and __Host cookies
        if (name.startsWith('__')) {
            cookieStore.set(name, '', { ...options, secure: true });
        }
    });
}
