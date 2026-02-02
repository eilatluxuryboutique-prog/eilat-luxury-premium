import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { comparePassword, loginUser } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        await dbConnect();

        // Find User
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify Password
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Auto-upgrade specific owner email to admin if not already
        if (user.email === 'eilat.luxury.boutique@gmail.com' && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

        // Login (Set Cookie)
        await loginUser(user);

        return NextResponse.json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
