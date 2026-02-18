import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Property from '@/models/Property';
import mongoose from 'mongoose';
import { sendBookingConfirmation } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        // Allow guest bookings for testing: use session.userId if available, otherwise fallback
        const userId = session?.userId || 'guest_user_123';

        /* 
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        */

        const body = await req.json();
        const { propertyId, checkIn, checkOut, guests, totalPrice, paymentMethod } = body;

        if (!propertyId || !checkIn || !checkOut || !totalPrice) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // 1. Check Availability (Prevent double booking)
        const existingBooking = await Booking.findOne({
            propertyId,
            status: { $ne: 'cancelled' },
            $or: [
                { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
            ]
        });

        if (existingBooking) {
            return NextResponse.json({ error: 'Property is already booked for these dates' }, { status: 409 });
        }

        // 2. Create Booking
        const booking = await Booking.create({
            userId: userId, // Use strict session.userId or fallback
            propertyId,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests,
            totalPrice,
            paymentMethod,
            status: 'confirmed'
        });

        // 3. Mark dates as unavailable in Property (Only if it's a valid DB ID)
        let propertyTitle = 'Unknown Property';
        if (mongoose.isValidObjectId(propertyId)) {
            const prop = await Property.findByIdAndUpdate(propertyId, {
                $push: {
                    unavailableDates: {
                        start: new Date(checkIn),
                        end: new Date(checkOut),
                        reason: 'booking'
                    }
                }
            });
            if (prop) propertyTitle = prop.title;
        }

        // 4. Send Confirmation Email
        const userEmail = (session as any)?.user?.email || 'guest@example.com'; // TODO: Capture email for guests
        await sendBookingConfirmation(userEmail, {
            id: booking._id.toString(),
            propertyName: propertyTitle,
            checkIn: new Date(checkIn).toLocaleDateString('he-IL'),
            checkOut: new Date(checkOut).toLocaleDateString('he-IL'),
            totalPrice,
            guests
        });

        return NextResponse.json({ success: true, booking });

    } catch (error) {
        console.error('Booking Error:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch bookings for the current user
        // Populate property details for display
        const bookings = await Booking.find({ userId: session.userId })
            .populate('propertyId', 'title location image images')
            .sort({ checkIn: -1 }); // Newest first

        return NextResponse.json({ bookings });

    } catch (error) {
        console.error('Fetch Bookings Error:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
