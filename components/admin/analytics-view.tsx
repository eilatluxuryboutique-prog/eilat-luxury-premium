"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { TrendingUp, Users, CreditCard, Eye } from "lucide-react";

export default function AnalyticsDashboard() {
    const t = useTranslations('Admin'); // Assuming an Admin namespace exists, or we default

    // Mock Data
    const stats = [
        { label: "Total Revenue", value: "₪124,500", icon: CreditCard, change: "+12%" },
        { label: "Total Bookings", value: "85", icon: TrendingUp, change: "+5%" },
        { label: "Site Visits", value: "12,450", icon: Users, change: "+24%" },
        { label: "Active Listings", value: "14", icon: Eye, change: "+2%" },
    ];

    const chartData = [65, 45, 75, 55, 85, 95, 70]; // Mock weekly data

    return (
        <div className="space-y-8 p-6">
            <h2 className="text-3xl font-bold text-white mb-6">Host Analytics</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-gold/30 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gold/10 rounded-xl text-gold">
                                <stat.icon size={24} />
                            </div>
                            <span className="text-sm font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-white/60 text-sm font-medium">{stat.label}</h3>
                        <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* CSS Chart Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-premium p-8 rounded-3xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white">Revenue Overview</h3>
                    <select className="bg-black/40 text-white border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-gold/50">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                    </select>
                </div>

                {/* Simple Bar Chart */}
                <div className="h-64 flex items-end justify-between gap-4">
                    {chartData.map((value, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-white/5 rounded-t-lg relative h-full overflow-hidden">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${value}%` }}
                                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gold-dark to-gold opacity-80 group-hover:opacity-100 transition-opacity rounded-t-lg"
                                />
                            </div>
                            <span className="text-xs text-white/40 font-mono">Day {i + 1}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
