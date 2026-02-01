
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import pool from '@/lib/pg-db';

export const dynamic = 'force-dynamic';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const videoUrl = searchParams.get('url');

        if (!videoUrl) return NextResponse.json({ error: 'No URL provided' });

        // 1. Upload to Cloudinary
        console.log('Uploading to Cloudinary:', videoUrl);
        const uploadRes = await cloudinary.uploader.upload(videoUrl, {
            resource_type: 'video',
            folder: 'eilat_premium',
            eager_async: true
        });

        console.log('Upload Success:', uploadRes.secure_url);

        // 2. Save to DB
        // Connect to MongoDB
        const { default: dbConnect } = await import('@/lib/db');
        const { default: Content } = await import('@/models/Content');
        await dbConnect();

        const newData = {
            hero: { videoUrl: uploadRes.secure_url },
            theme: { logoColor: 'text-yellow-400', primaryColor: '#FFD700' }
        };

        // Update DB
        const doc = await Content.findOneAndUpdate(
            { key: 'site_content' },
            { $set: { data: newData } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, url: uploadRes.secure_url });
    } catch (error: any) {
        console.error('Ingest Error:', error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
