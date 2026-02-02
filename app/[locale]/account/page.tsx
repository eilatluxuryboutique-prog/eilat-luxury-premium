import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Calendar, User } from 'lucide-react';

export default async function AccountPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const session: any = await getSession();
    if (!session) {
        redirect(`/${params.locale}/login`);
    }

    return (
        <main className="min-h-screen pt-24 pb-12 bg-[#121212] px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center text-gold">
                        <User size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">My Account</h1>
                        <p className="text-white/50">{session.name} ({session.email})</p>
                    </div>
                </div>

                <div className="grid gap-8">
                    {/* My Bookings */}
                    <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar className="text-gold" />
                            <h2 className="text-xl font-bold text-white">My Bookings</h2>
                        </div>

                        <div className="bg-black/20 rounded-xl p-8 text-center text-white/50">
                            You have no active bookings.
                        </div>
                    </div>

                    {/* Settings placeholder */}
                    <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
                        <button className="text-red-500 hover:text-red-400 font-medium">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
