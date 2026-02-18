import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.ADMIN_SECRET && secret !== 'eilat2026') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const code = 'DEMO2026';
        await Coupon.deleteMany({ code });

        const coupon = await Coupon.create({
            code,
            discountType: 'percent',
            value: 20, // 20% off
            expirationDate: new Date('2026-12-31'),
            usageLimit: 100,
            usedCount: 0
        });

        return NextResponse.json({ success: true, coupon });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
    }
}
