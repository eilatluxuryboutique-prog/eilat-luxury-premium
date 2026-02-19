'use client';

import { useTranslations } from 'next-intl';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', income: 4000 },
    { name: 'Feb', income: 3000 },
    { name: 'Mar', income: 2000 },
    { name: 'Apr', income: 2780 },
    { name: 'May', income: 1890 },
    { name: 'Jun', income: 2390 },
    { name: 'Jul', income: 3490 },
    { name: 'Aug', income: 5200 },
    { name: 'Sep', income: 4100 },
];

export default function InvestorDashboard() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8" dir="rtl">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gold to-yellow-200 bg-clip-text text-transparent mb-8">
                דשבורד משקיעים
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl">
                    <p className="text-neutral-400 text-sm">תשואה שנתית (ROI)</p>
                    <p className="text-3xl font-bold text-green-400">8.5%</p>
                </div>
                <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl">
                    <p className="text-neutral-400 text-sm">הכנסה חודשית (ממוצע)</p>
                    <p className="text-3xl font-bold text-white">₪12,450</p>
                </div>
                <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl">
                    <p className="text-neutral-400 text-sm">תפוסה החודש</p>
                    <p className="text-3xl font-bold text-gold">82%</p>
                </div>
                <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl">
                    <p className="text-neutral-400 text-sm">שווי נכס מוערך</p>
                    <p className="text-3xl font-bold text-white">₪2.4M</p>
                </div>
            </div>

            <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl h-[400px]">
                <h3 className="text-xl font-bold mb-6">גרף הכנסות</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                        <Area type="monotone" dataKey="income" stroke="#D4AF37" fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
