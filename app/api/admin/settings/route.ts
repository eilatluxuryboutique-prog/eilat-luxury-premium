import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import { getSession } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        let content = await Content.findOne({ key: 'site_settings' });
        if (!content) {
            content = await Content.create({
                key: 'site_settings',
                data: {
                    primaryColor: '#D4AF37', // gold
                    font: 'Inter',
                    enableHeroVideo: true,
                    showFeaturedBadge: true,
                    contactEmail: 'eilat.luxury.boutique@gmail.com',
                    contactPhone: '+972 50 000 0000',
                    maintenanceMode: false
                }
            });
        }
        return NextResponse.json(content.data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        let session = await getSession() as any;
        const nextAuthSession = await getServerSession(authOptions);
        if (nextAuthSession?.user && (!session || !session.userId)) {
            session = { ...nextAuthSession.user, userId: (nextAuthSession.user as any).id };
        }

        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        await dbConnect();

        const content = await Content.findOneAndUpdate(
            { key: 'site_settings' },
            { $set: { data: body } },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, settings: content.data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
