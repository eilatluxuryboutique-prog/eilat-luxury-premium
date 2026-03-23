import { NextResponse } from 'next/server';
import { getServerSideSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session: any = await getServerSideSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const users = await User.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ users });
    } catch (e) {
        console.error("Fetch users error", e);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session: any = await getServerSideSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, role, status } = await req.json();
        await dbConnect();

        const updateData: any = {};
        if (role) updateData.role = role;
        if (status) updateData.status = status;

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        return NextResponse.json({ user: updatedUser });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session: any = await getServerSideSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
        }

        await dbConnect();
        await User.findByIdAndDelete(userId);

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
