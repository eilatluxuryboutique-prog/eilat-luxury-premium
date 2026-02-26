import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function PUT(req: Request) {
    try {
        let session = await getSession() as any;
        const nextAuthSession = await getServerSession(authOptions);
        if (nextAuthSession?.user && (!session || !session.userId)) {
            session = { ...nextAuthSession.user, userId: (nextAuthSession.user as any).id };
        }

        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone, wishlist } = body;

        await dbConnect();

        const updateData: any = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (wishlist) updateData.wishlist = wishlist;

        const updatedUser = await User.findByIdAndUpdate(
            session.userId,
            updateData,
            { new: true }
        ).select('-password');

        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error('Update Profile Error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
