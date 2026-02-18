import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getSession();

        const body = await req.json();
        const { propertyId, rating, comment, userName } = body;

        if (!propertyId || !rating || !comment) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Allow Guest Reviews (if no session, require userName)
        if (!session && !userName) {
            return NextResponse.json({ error: 'Please provide your name' }, { status: 401 });
        }

        await dbConnect();

        const review = await Review.create({
            propertyId,
            userId: session?.userId || `guest_${Date.now()}`,
            userName: session?.name || userName || 'Anonymous',
            rating,
            comment
        });

        // Recalculate Property Average
        const allReviews = await Review.find({ propertyId });
        const avg = allReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / allReviews.length;

        await Property.findByIdAndUpdate(propertyId, { rating: avg.toFixed(1) });

        return NextResponse.json({ success: true, review });

    } catch (error) {
        console.error('Review Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const propertyId = searchParams.get('propertyId');

        if (!propertyId) {
            return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
        }

        await dbConnect();
        const reviews = await Review.find({ propertyId }).sort({ createdAt: -1 });

        return NextResponse.json({ reviews });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
