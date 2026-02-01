import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const doc = await Content.findOne({ key: 'site_content' });
        return NextResponse.json(doc?.data || {});
    } catch (e) {
        return NextResponse.json({ error: 'DB Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await dbConnect();

        // Upsert
        const doc = await Content.findOneAndUpdate(
            { key: 'site_content' },
            { $set: { data: body } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, data: doc.data });
    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
}
