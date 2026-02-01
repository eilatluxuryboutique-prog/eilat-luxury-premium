'use client';

import { motion } from 'framer-motion';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';

export default function AnalyticsTab() {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: '₪124,500', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
                    { label: 'Active Bookings', value: '18', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { label: 'Total Guests', value: '1,234', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    { label: 'Occupancy Rate', value: '85%', icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-neutral-800 border border-white/5 p-6 rounded-2xl"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-white/30 text-xs uppercase tracking-wider font-medium">Last 30 Days</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-white/50 text-sm">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity Mock chart/table placehoder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-neutral-800 border border-white/5 p-6 rounded-2xl h-80 flex items-center justify-center text-white/30">
                    Revenue Chart Placeholder (Recharts)
                </div>
                <div className="bg-neutral-800 border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4">Recent Bookings</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                                    JD
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">John Doe</p>
                                    <p className="text-white/40 text-xs">Penthouse • 3 Nights</p>
                                </div>
                                <div className="ml-auto text-green-400 text-sm font-medium">
                                    +₪3,200
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
