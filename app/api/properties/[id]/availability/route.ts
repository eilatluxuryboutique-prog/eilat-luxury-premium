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
        let allUnavailable = [...unavailableDates, ...bookingDates];

        // Fetch iCal Bookings (Real-time)
        if (property && property.icalLinks && property.icalLinks.length > 0) {
            const { fetchExternalBookings } = await import('@/lib/ical');

            for (const link of property.icalLinks) {
                if (link.url) {
                    try {
                        const externalEvents = await fetchExternalBookings(link.url);
                        const mappedEvents = externalEvents.map((e: any) => ({
                            start: e.start,
                            end: e.end,
                            reason: 'external',
                            source: link.name || 'External Platform'
                        }));
                        allUnavailable = [...allUnavailable, ...mappedEvents];
                    } catch (err) {
                        console.error(`Failed to sync iCal from ${link.name}`, err);
                    }
                }
            }
        }

        return NextResponse.json({
            unavailableDates: allUnavailable,
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
