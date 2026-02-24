'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Hotel, Image as ImageIcon, FileText, Megaphone, Settings, LogOut, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminProvider } from '@/components/admin/admin-context';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';

const AnalyticsTab = dynamic(() => import('@/components/admin/analytics-tab'), { loading: () => <p>Loading...</p>, ssr: false });
const PropertiesTab = dynamic(() => import('@/components/admin/properties-tab'), { loading: () => <p>Loading...</p>, ssr: false });
const MediaTab = dynamic(() => import('@/components/admin/media-tab'), { loading: () => <p>Loading...</p>, ssr: false });
const ContentTab = dynamic(() => import('@/components/admin/content-tab'), { loading: () => <p>Loading...</p>, ssr: false });
const ChatTab = dynamic(() => import('@/components/admin/chat-tab'), { loading: () => <p>Loading...</p>, ssr: false });

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('analytics');
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);

    // Simple client-side auth check (optional if middleware exists)
    // For now we assume middleware protects this route.

    // Fetch user info just for display
    useEffect(() => {
        // Mock or Fetch
        setUser({ name: 'Admin', email: 'admin@eilat-luxury.com' });
    }, []);

    const tabs = [
        { id: 'analytics', label: 'דשבורד', icon: LayoutDashboard },
        { id: 'chat', label: 'צ׳אט חי', icon: MessageSquare },
        { id: 'properties', label: 'נכסים', icon: Hotel },
        { id: 'media', label: 'מדיה', icon: ImageIcon },
        { id: 'content', label: 'תוכן ועיצוב', icon: FileText },
        { id: 'ads', label: 'פרסומות', icon: Megaphone },
        { id: 'settings', label: 'הגדרות', icon: Settings },
    ];

    return (
        <AdminProvider>
            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row" dir="rtl">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-[#111] border-b md:border-l border-white/10 flex flex-col">
                    <div className="p-6 border-b border-white/10">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gold to-yellow-200 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">ניהול מערכת פרימיום</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-gold/20 to-transparent border-r-2 border-gold text-white'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <tab.icon size={20} className={activeTab === tab.id ? 'text-gold' : ''} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                                {user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto h-screen">
                    <header className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-10">
                        <h2 className="text-xl font-bold">{tabs.find(t => t.id === activeTab)?.label}</h2>
                        <div className="flex gap-4">
                            {/* Actions if needed */}
                        </div>
                    </header>

                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'analytics' && <AnalyticsTab />}
                                {activeTab === 'chat' && <ChatTab />}
                                {activeTab === 'content' && <ContentTab />}
                                {activeTab === 'media' && <MediaTab />}
                                {activeTab === 'properties' && <div className="p-10 text-center text-gray-500">ניהול נכסים (בקרוב)</div>}
                                {activeTab === 'ads' && <div className="p-10 text-center text-gray-500">ניהול פרסומות (בקרוב)</div>}
                                {activeTab === 'settings' && <div className="p-10 text-center text-gray-500">הגדרות מערכת (בקרוב)</div>}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </AdminProvider>
    );
}
