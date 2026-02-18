import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function POST(req: Request) {
    try {
        const { code, totalAmount } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });
        }

        await dbConnect();

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!coupon) {
            return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
        }

        // Check expiration
        if (coupon.expirationDate && new Date() > new Date(coupon.expirationDate)) {
            return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percent') {
            discount = (totalAmount * coupon.value) / 100;
        } else {
            discount = coupon.value;
        }

        // Ensure discount doesn't exceed total
        discount = Math.min(discount, totalAmount);

        const newTotal = totalAmount - discount;

        return NextResponse.json({
            success: true,
            discount,
            newTotal,
            type: coupon.discountType,
            value: coupon.value
        });

    } catch (error) {
        console.error('Coupon Verification Error:', error);
        return NextResponse.json({ error: 'Failed to verify coupon' }, { status: 500 });
    }
}
