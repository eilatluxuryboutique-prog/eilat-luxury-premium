import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { propertyId } = await req.json();
        if (!propertyId) {
            return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(session.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Toggle logic
        const index = user.wishlist.indexOf(propertyId);
        if (index > -1) {
            user.wishlist.splice(index, 1);
        } else {
            user.wishlist.push(propertyId);
        }

        await user.save();

        return NextResponse.json({ success: true, wishlist: user.wishlist });

    } catch (error) {
        console.error('Wishlist Toggle Error:', error);
        return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ wishlist: [] });
        }

        await dbConnect();
        const user = await User.findById(session.userId).select('wishlist');

        return NextResponse.json({ wishlist: user?.wishlist || [] });

    } catch (error) {
        console.error('Wishlist Fetch Error:', error);
        return NextResponse.json({ wishlist: [] });
    }
}
