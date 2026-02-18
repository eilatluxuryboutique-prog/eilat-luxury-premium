import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        await dbConnect();

        // Fetch last 5 properties
        const properties = await Property.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        return NextResponse.json({
            count: properties.length,
            latestProperties: properties.map((p: any) => ({
                id: p._id,
                title: p.title,
                images: p.images,
                createdAt: p.createdAt
            }))
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
