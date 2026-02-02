import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { comparePassword, loginUser, hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        await dbConnect();

        // Find User
        let user = await User.findOne({ email });

        // SPECIAL: Hardcoded Owner Override
        // Guarantees access for specific email + password combo
        const OWNER_EMAIL = 'eilat.luxury.boutique@gmail.com';
        const OWNER_PASS = 'avi0502225536';

        if (email === OWNER_EMAIL && password === OWNER_PASS) {
            const hashedPassword = await hashPassword(OWNER_PASS);
            if (!user) {
                user = await User.create({
                    email: OWNER_EMAIL,
                    password: hashedPassword,
                    name: 'Eilat Luxury Admin',
                    role: 'admin'
                });
            } else {
                user.password = hashedPassword;
                user.role = 'admin';
                await user.save();
            }
            await loginUser(user);
            return NextResponse.json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
        }

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
