import { signToken, verifyToken } from './token';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export { signToken, verifyToken };

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function loginUser(user: any) {
    const token = await signToken({ userId: user._id, role: user.role, name: user.name, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.set('auth-token', '', { maxAge: 0 });
}
