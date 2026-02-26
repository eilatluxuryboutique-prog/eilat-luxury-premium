import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Check NextAuth (Google SSO)
        const nextAuthSession = await getServerSession(authOptions);
        if (nextAuthSession?.user) {
            return NextResponse.json({ user: nextAuthSession.user });
        }

        // 2. Check Custom JWT (Email & Password)
        const jwtSession = await getSession();
        if (jwtSession) {
            return NextResponse.json({ user: jwtSession });
        }

        // 3. Not logged in
        return NextResponse.json({ user: null });
    } catch (e) {
        return NextResponse.json({ user: null });
    }
}
