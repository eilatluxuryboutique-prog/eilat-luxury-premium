import { NextResponse } from 'next/server';
import { logoutUser } from '@/lib/auth';

export async function POST() {
    await logoutUser();
    return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
    await logoutUser();

    // Get locale from query param or default to 'he'
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('lang') || 'he';

    // Perform a server-side redirect to the localized login page
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
}
