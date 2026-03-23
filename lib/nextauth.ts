import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            try {
                const dbConnect = (await import('@/lib/db')).default;
                const User = (await import('@/models/User')).default;
                await dbConnect();

                const existingUser = await User.findOne({ email: user.email });
                const isAdmin = [
                    "eilat.luxury.boutique@gmail.com",
                    "joni.business1@gmail.com"
                ].includes(user.email?.toLowerCase() || "");

                const assignedRole = isAdmin ? 'admin' : 'guest';

                if (!existingUser) {
                    await User.create({
                        email: user.email,
                        name: user.name,
                        role: assignedRole,
                    });
                } else if (existingUser.role !== assignedRole && isAdmin) {
                    existingUser.role = 'admin';
                    await existingUser.save();
                }
                return true;
            } catch (e) {
                console.error("Error creating user on signIn", e);
                return true;
            }
        },
        async session({ session }) {
            try {
                const dbConnect = (await import('@/lib/db')).default;
                const User = (await import('@/models/User')).default;
                await dbConnect();

                if (session.user?.email) {
                    const dbUser = await User.findOne({ email: session.user.email });
                    if (dbUser) {
                        (session.user as any).role = dbUser.role;
                        (session.user as any).id = dbUser._id.toString();
                    } else {
                        const isAdmin = [
                            "eilat.luxury.boutique@gmail.com",
                            "joni.business1@gmail.com"
                        ].includes(session.user.email.toLowerCase());
                        (session.user as any).role = isAdmin ? 'admin' : 'guest';
                    }
                }
            } catch (e) {
                console.error("Session fetch error", e);
            }
            return session;
        }
    }
};
