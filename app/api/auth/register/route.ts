import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { hashPassword, loginUser } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password too short' }, { status: 400 });
        }

        // Validate Role (only allow 'host' or 'guest' for self-registration)
        const safeRole = role === 'host' ? 'host' : 'guest';

        await dbConnect();

        // Check existing
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        // Hash Password
        const hashedPassword = await hashPassword(password);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: safeRole,
        });

        // Auto Login
        await loginUser(user);

        return NextResponse.json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Server Error' }, { status: 500 });
    }
}
