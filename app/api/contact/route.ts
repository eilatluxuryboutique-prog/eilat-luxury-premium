import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/models/Enquiry';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, name, email, message } = body;

        if (!email || !type) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        await dbConnect();

        await Enquiry.create({
            type,
            name,
            email,
            message
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
    }
}
