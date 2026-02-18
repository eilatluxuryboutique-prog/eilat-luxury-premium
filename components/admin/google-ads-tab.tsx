"use client";

import { useState } from "react";
import {
    BarChart3,
    TrendingUp,
    MousePointer2,
    DollarSign,
    Play,
    Pause,
    AlertCircle,
    Info,
    ExternalLink
} from "lucide-react";

type Campaign = {
    id: string;
    name: string;
    status: 'ENABLED' | 'PAUSED';
    clicks: number;
    impressions: number;
    cost: number;
    ctr: number;
};

export default function GoogleAdsTab() {
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);

    // Mock data for demonstration
    const [campaigns, setCampaigns] = useState<Campaign[]>([
        { id: '1', name: 'Eilat Luxury Villas - Search', status: 'ENABLED', clicks: 1240, impressions: 25000, cost: 450.5, ctr: 4.96 },
        { id: '2', name: 'Penthouse Rentals - Display', status: 'PAUSED', clicks: 450, impressions: 120000, cost: 230.2, ctr: 0.38 },
        { id: '3', name: 'International Tourists - Video', status: 'ENABLED', clicks: 890, impressions: 45000, cost: 120.8, ctr: 1.98 },
    ]);

    const toggleStatus = (id: string) => {
        setCampaigns(prev => prev.map(c => {
            if (c.id === id) {
                return { ...c, status: c.status === 'ENABLED' ? 'PAUSED' : 'ENABLED' };
            }
            return c;
        }));
    };

    if (!connected) {
        return (
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-10 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Connect Google Ads</h2>
                <p className="text-neutral-400 mb-8">
                    Manage your Google Ads campaigns, monitor performance, and control budgets directly from this dashboard.
                </p>

                <div className="bg-black/40 border border-white/5 rounded-xl p-6 text-right mb-8 flex flex-col gap-3" dir="rtl">
                    <h3 className="font-bold text-gold flex items-center gap-2 justify-end">
                        <Info size={16} />
                        מה נדרש לצורך החיבור?
                    </h3>
                    <ul className="text-sm text-neutral-400 space-y-2">
                        <li>• הקמת Developer Token בחשבון ה-Manager של גוגל.</li>
                        <li>• יצירת OAuth Client ID ב-Google Cloud Console.</li>
                        <li>• הגדרת הרשאות גישה (Customer ID).</li>
                    </ul>
                </div>

                <button
                    onClick={() => setConnected(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 mx-auto"
                >
                    <ExternalLink size={18} />
                    Start Connection Setup
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Total Impressions" value="190K" icon={<TrendingUp size={20} />} color="text-blue-400" />
                <StatCard label="Total Clicks" value="2,580" icon={<MousePointer2 size={20} />} color="text-green-400" />
                <StatCard label="Cost" value="$801.50" icon={<DollarSign size={20} />} color="text-gold" />
                <StatCard label="Avg. CTR" value="2.45%" icon={<AlertCircle size={20} />} color="text-purple-400" />
            </div>

            {/* Campaign Table */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Your Campaigns</h3>
                    <div className="flex gap-2">
                        <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">Active</span>
                        <span className="text-xs bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full border border-white/5">Synced</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead className="bg-black/20 text-neutral-500 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">קמפיין</th>
                                <th className="px-6 py-4 font-medium text-center">סטטוס</th>
                                <th className="px-6 py-4 font-medium text-center">קליקים</th>
                                <th className="px-6 py-4 font-medium text-center">התרשמויות</th>
                                <th className="px-6 py-4 font-medium text-center">עלות</th>
                                <th className="px-6 py-4 font-medium">פעולות</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {campaigns.map(c => (
                                <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-medium">{c.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${c.status === 'ENABLED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                            {c.status === 'ENABLED' ? 'פעיל' : 'מושהה'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono">{c.clicks.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center font-mono">{c.impressions.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center font-mono text-gold">${c.cost.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(c.id)}
                                            className={`p-2 rounded-lg transition-all ${c.status === 'ENABLED' ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}
                                            title={c.status === 'ENABLED' ? 'Pause' : 'Start'}
                                        >
                                            {c.status === 'ENABLED' ? <Pause size={18} /> : <Play size={18} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 flex gap-4 items-start text-right" dir="rtl">
                <AlertCircle className="text-gold shrink-0" />
                <div>
                    <p className="text-gold font-bold text-sm">הערה חשובה</p>
                    <p className="text-xs text-gold/80 mt-1">
                        הנתונים המוצגים כרגע הם נתוני דמו. כדי לראות את הקמפיינים האמיתיים שלך, עליך להזין את מפתחות הגישה שקיבלת מגוגל בקובץ ה-Environment.
                    </p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string, value: string, icon: any, color: string }) {
    return (
        <div className="bg-neutral-900 border border-white/10 p-5 rounded-2xl shadow-lg">
            <div className={`flex justify-between items-start mb-2 ${color}`}>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">{label}</span>
                {icon}
            </div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}
