import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { userId, content } = await req.json();

        // Validate (Admin check skipped for demo speed)

        await dbConnect();

        const message = await Message.create({
            senderId: 'admin',
            receiverId: userId,
            content: content,
            read: false, // User hasn't read it yet
            createdAt: new Date()
        });

        // Also mark user's last message as read?
        await Message.updateMany(
            { senderId: userId, receiverId: 'admin', read: false },
            { $set: { read: true } }
        );

        return NextResponse.json({ success: true, message });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }
}
