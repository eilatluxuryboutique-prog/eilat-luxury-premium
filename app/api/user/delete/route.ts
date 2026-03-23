import { NextResponse } from 'next/server';
import { getSession, logoutUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Property from '@/models/Property';
import Booking from '@/models/Booking';
import Review from '@/models/Review';

export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.userId;

        await dbConnect();

        // 1. Delete all properties owned by the user
        await Property.deleteMany({ ownerId: userId });

        // 2. Delete all bookings made by the user
        await Booking.deleteMany({ userId: userId });

        // 3. Delete all reviews made by the user
        await Review.deleteMany({ userId: userId });

        // 4. Delete the user themselves
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 5. Logout the user (clear cookies)
        await logoutUser();

        return NextResponse.json({ success: true, message: 'Account and all associated data deleted successfully' });

    } catch (error) {
        console.error('Delete Account Error:', error);
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }
}
