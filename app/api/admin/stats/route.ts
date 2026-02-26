import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import { getSession } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Authenticate (Admin only)
        let session = await getSession() as any;
        const nextAuthSession = await getServerSession(authOptions);
        if (nextAuthSession?.user && (!session || !session.userId)) {
            session = { ...nextAuthSession.user, userId: (nextAuthSession.user as any).id };
        }

        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // 1. Total Revenue & Bookings
        // Aggregate only confirmed or completed bookings
        const revenueStats = await Booking.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                    totalBookings: { $sum: 1 }
                }
            }
        ]);

        const totalRevenue = revenueStats[0]?.totalRevenue || 0;
        const totalBookings = revenueStats[0]?.totalBookings || 0;

        // Calculate Profit (10% commission)
        const totalProfit = totalRevenue * 0.10;

        // 2. Total Properties
        const totalProperties = await Property.countDocuments({});

        // 3. Active Users (approximate by unique users in bookings + users collection?)
        // For now, let's just count bookings for "Guests" stat or distinct users
        const distinctGuests = await Booking.distinct('userId');
        const totalGuests = distinctGuests.length;

        // 4. Recent Activity
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('propertyId', 'title') // Populate property title if ref works, otherwise handled in frontend
            .lean();

        // Map recent bookings to friendly format
        const activity = recentBookings.map((b: any) => ({
            id: b._id,
            user: b.userId.substring(0, 8) + '...', // Mock user name behavior for now
            action: 'booked', // or status
            details: b.propertyId?.title || b.propertyId || 'Unknown Property',
            amount: b.totalPrice,
            date: b.createdAt
        }));

        return NextResponse.json({
            stats: {
                revenue: totalRevenue,
                profit: totalProfit,
                bookings: totalBookings,
                properties: totalProperties,
                guests: totalGuests
            },
            activity
        });

    } catch (error: any) {
        console.error("Admin Stats API Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
