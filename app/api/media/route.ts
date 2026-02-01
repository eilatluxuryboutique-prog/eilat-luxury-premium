import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Media from '@/models/Media';

export async function GET() {
    try {
        await dbConnect();
        const media = await Media.find({}).sort({ createdAt: -1 });
        return NextResponse.json(media);
    } catch (error) {
        console.error('Failed to fetch media:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { publicId, url, format, resourceType } = body;

        const newMedia = await Media.create({
            publicId,
            url,
            format,
            resourceType
        });

        return NextResponse.json({ success: true, media: newMedia });
    } catch (error) {
        console.error('Failed to save media:', error);
        return NextResponse.json({ error: 'Failed to save media' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await Media.findByIdAndDelete(id);

        // Note: Ideally we should also delete from Cloudinary here using Admin API
        // But for "Keyless" setup on client, we often just delete the reference DB
        // or call a separate endpoint that uses secret key.

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete media:', error);
        return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
    }
}
