import NextAuth, { NextAuthOptions } from "next-auth";
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
            // Allow anyone to sign in via Google.
            // We will save them to MongoDB here so they have a permanent history.
            try {
                const mongoose = (await import('mongoose')).default;
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
                    // Upgrade to admin if email matches and they aren't admin yet
                    existingUser.role = 'admin';
                    await existingUser.save();
                }
                return true;
            } catch (e) {
                console.error("Error creating user on signIn", e);
                return true; // still allow sign in even if db fails occasionally
            }
        },
        async session({ session }) {
            // Retrieve from DB to attach ID and accurate role
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
                        // Fallback
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
