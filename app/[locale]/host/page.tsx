import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus, Home, Settings } from 'lucide-react';
import Link from 'next/link';

export default async function HostDashboard(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const session: any = await getSession();
    if (!session || (session.role !== 'host' && session.role !== 'admin')) {
        redirect(`/${params.locale}/login`);
    }

    // TODO: Fetch existing properties for this host
    const properties: any[] = [];

    return (
        <main className="min-h-screen pt-24 pb-12 bg-[#121212] px-4">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Business Dashboard</h1>
                        <p className="text-white/50">Welcome, {session.name}</p>
                    </div>
                    <Link
                        href="/host/add-property"
                        className="bg-gold hover:bg-gold-light text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} />
                        Add New Property
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10">
                        <h3 className="text-white/50 text-sm mb-2">Active Properties</h3>
                        <p className="text-3xl font-bold text-white">{properties.length}</p>
                    </div>
                    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10">
                        <h3 className="text-white/50 text-sm mb-2">Total Views</h3>
                        <p className="text-3xl font-bold text-white">0</p>
                    </div>
                    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10">
                        <h3 className="text-white/50 text-sm mb-2">Bookings</h3>
                        <p className="text-3xl font-bold text-white">0</p>
                    </div>
                </div>

                {/* Properties List */}
                <h2 className="text-xl font-bold text-white mb-6">Your Properties</h2>
                {properties.length === 0 ? (
                    <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-12 text-center text-white/50">
                        <Home size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-4">You haven't added any properties yet.</p>
                        <Link href="/host/add-property" className="text-gold hover:underline">
                            Create your first listing
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* List properties here */}
                    </div>
                )}
            </div>
        </main>
    );
}
