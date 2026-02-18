import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import Booking from '@/models/Booking'; // Import Booking model
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const { id } = params;
        await dbConnect();

        // Fetch manual blocks from Property (if it exists in DB)
        let unavailableDates: any[] = [];
        let blockedDates: any[] = [];

        // Check if ID is likely a MongoDB ID
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const property = await Property.findById(id);
            if (property) {
                unavailableDates = property.unavailableDates || [];
                blockedDates = property.blockedDates || [];
            }
        }

        // Fetch actual bookings from Booking collection (works for both DB and Mock IDs)
        const bookings = await Booking.find({
            propertyId: id,
            status: { $in: ['confirmed', 'completed'] }
        });

        const bookingDates = bookings.map(b => ({
            start: b.checkIn,
            end: b.checkOut,
            reason: 'booking'
        }));

        // Merge manual blocks and bookings
        return NextResponse.json({
            unavailableDates: [...unavailableDates, ...bookingDates],
            blockedDates: blockedDates
        });

    } catch (error) {
        console.error('Availability Error:', error);
        return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
    }
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getSession();
        if (!session || session.role !== 'host') {
            // For real app check if user owns the property
            // const property = await Property.findById(params.id);
            // if (property.ownerId !== session.userId) ...
            // For now assume admin/host access
        }

        const { id } = params;
        const body = await req.json();
        const { start, end, reason } = body;

        await dbConnect();

        const property = await Property.findByIdAndUpdate(
            id,
            {
                $push: {
                    unavailableDates: {
                        start: new Date(start),
                        end: new Date(end),
                        reason: reason || 'manual_block'
                    }
                }
            },
            { new: true }
        );

        return NextResponse.json({ success: true, unavailableDates: property.unavailableDates });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
    }
}
