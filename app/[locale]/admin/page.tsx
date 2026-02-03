'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Edit, Image as ImageIcon, Settings, LogOut, Megaphone } from 'lucide-react';
import { useRouter } from '@/navigation';
import AnalyticsTab from '@/components/admin/analytics-tab';
import ContentTab from '@/components/admin/content-tab';
import MediaTab from '@/components/admin/media-tab';
import AdsTab from '@/components/admin/ads-tab';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('analytics');
    const router = useRouter();

    const handleLogout = () => {
        // In a real app, clear tokens here
        router.push('/');
    };

    const tabs = [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'content', label: 'Content CMS', icon: Edit },
        { id: 'media', label: 'Media Library', icon: ImageIcon },
        { id: 'ads', label: 'Ads Manager', icon: Megaphone },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-white pt-24 px-4 pb-20">
            <div className="container mx-auto max-w-7xl">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                            Manager Dashboard
                        </h1>
                        <p className="text-white/50 mt-1">Welcome back, Jonathan</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-colors text-sm"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/10 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'analytics' && <AnalyticsTab />}
                    {activeTab === 'content' && <ContentTab />}
                    {activeTab === 'media' && <MediaTab />}
                    {activeTab === 'ads' && <AdsTab />}

                </motion.div>
            </div>
        </div>
    );
}
