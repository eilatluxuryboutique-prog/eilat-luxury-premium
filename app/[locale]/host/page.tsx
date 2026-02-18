import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus, Home, Settings, Trash2, Edit, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import HostPropertyList from '@/components/host/property-list';

export default async function HostDashboard(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const session: any = await getSession();
    if (!session || (session.role !== 'host' && session.role !== 'admin')) {
        redirect(`/${params.locale}/login`);
    }

    // await dbConnect(); // Not needed for Postgres
    // Fetch user's properties from DB (Postgres)
    let properties: any[] = [];
    try {
        const { rows } = await import('@vercel/postgres').then(m => m.sql`
            SELECT * FROM properties WHERE owner_id = ${session.userId} ORDER BY created_at DESC
        `);
        // Map to match frontend expectations
        properties = rows.map(p => ({
            ...p,
            _id: p.id,
            pricePerNight: p.price,
            images: p.images || []
        }));
    } catch (e) {
        console.error("PG Fetch Error:", e);
        // Fallback to empty if table doesn't exist yet
        properties = [];
    }

    // Mock Booking Data (Replace with real Booking model later)
    const bookingsCount = 12; // Placeholder
    const totalRevenue = 45000; // Placeholder Revenue (₪)
    const commissionRate = 0.10; // 10%
    const netProfit = totalRevenue * (1 - commissionRate);

    return (
        <main className="min-h-screen pt-24 pb-12 bg-[#121212] px-4" dir="rtl">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">לוח בקרה עסקי</h1>
                        <p className="text-white/50">ברוך הבא, {session.name}</p>
                    </div>
                    <Link
                        href="/host/add-property"
                        className="bg-gold hover:bg-gold-light text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} />
                        הוסף נכס חדש
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                                <DollarSign size={24} />
                            </div>
                            <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded">הכנסות</span>
                        </div>
                        <h3 className="text-white/50 text-sm mb-1">סה"כ הכנסות (ברוטו)</h3>
                        <p className="text-2xl font-bold text-white">₪{totalRevenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gold/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gold"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gold/10 rounded-lg text-gold">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-xs font-bold bg-gold/20 text-gold px-2 py-1 rounded">רווח נקי</span>
                        </div>
                        <h3 className="text-white/50 text-sm mb-1">רווח נקי (אחרי עמלה 10%)</h3>
                        <p className="text-3xl font-bold text-white">₪{netProfit.toLocaleString()}</p>
                    </div>

                    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                                <Home size={24} />
                            </div>
                        </div>
                        <h3 className="text-white/50 text-sm mb-1">נכסים פעילים</h3>
                        <p className="text-2xl font-bold text-white">{properties.length}</p>
                    </div>

                    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
                                <Settings size={24} />
                            </div>
                        </div>
                        <h3 className="text-white/50 text-sm mb-1">הזמנות החודש</h3>
                        <p className="text-2xl font-bold text-white">{bookingsCount}</p>
                    </div>
                </div>

                {/* Properties List */}
                <h2 className="text-xl font-bold text-white mb-6">הנכסים שלך</h2>
                <HostPropertyList serverProperties={properties} />
            </div>
        </main>
    );
}
