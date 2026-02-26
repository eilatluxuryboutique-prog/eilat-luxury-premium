'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Hotel, Image as ImageIcon, FileText, Megaphone, Settings, LogOut, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminProvider } from '@/components/admin/admin-context';
import SettingsTab from '@/components/admin/settings-tab';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

const AnalyticsTab = dynamic(() => import('@/components/admin/analytics-tab'), { loading: () => <p>Loading...</p>, ssr: false });
const PropertiesTab = dynamic(() => import('@/components/admin/properties-tab'), { loading: () => <p>Loading...</p>, ssr: false });
const MediaTab = dynamic(() => import('@/components/admin/media-tab'), { loading: () => <p>Loading...</p>, ssr: false });
const ContentTab = dynamic(() => import('@/components/admin/content-tab'), { loading: () => <p>Loading...</p>, ssr: false });
const ChatTab = dynamic(() => import('@/components/admin/chat-tab'), { loading: () => <p>Loading...</p>, ssr: false });
const AdsTab = dynamic(() => import('@/components/admin/ads-tab'), { loading: () => <p>Loading...</p>, ssr: false });
const GoogleAdsTab = dynamic(() => import('@/components/admin/google-ads-tab'), { loading: () => <p>Loading...</p>, ssr: false });

export default function AdminDashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState('analytics');

    // Protect route client-side based on session
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            const role = (session.user as any)?.role;
            const email = session.user?.email || '';
            const isAdminEmail = ['eilat.luxury.boutique@gmail.com', 'joni.business1@gmail.com'].includes(email.toLowerCase());
            if (role !== 'admin' && !isAdminEmail) {
                router.push('/dashboard');
            }
        }
    }, [status, session, router]);

    if (status === 'loading' || status === 'unauthenticated') {
        return <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center">טוען...</div>;
    }

    const un = session?.user?.name || 'Admin';
    const email = session?.user?.email || '';

    const tabs = [
        { id: 'analytics', label: 'דשבורד', icon: LayoutDashboard },
        { id: 'chat', label: 'צ׳אט חי', icon: MessageSquare },
        { id: 'properties', label: 'נכסים', icon: Hotel },
        { id: 'media', label: 'מדיה', icon: ImageIcon },
        { id: 'content', label: 'תוכן ועיצוב', icon: FileText },
        { id: 'site_ads', label: 'פרסומות באתר', icon: Megaphone },
        { id: 'google_ads', label: 'Google Ads', icon: LayoutDashboard },
        { id: 'settings', label: 'הגדרות', icon: Settings },
    ];

    return (
        <AdminProvider>
            <div className="min-h-screen bg-white text-zinc-900 flex flex-col md:flex-row" dir="rtl">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-zinc-50 border-b md:border-l border-zinc-100 flex flex-col">
                    <div className="p-6 border-b border-zinc-100">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gold to-yellow-600 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                        <p className="text-xs text-zinc-400 mt-1">ניהול מערכת פרימיום</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                    ? 'bg-gold/10 border-r-2 border-gold text-zinc-900 font-bold'
                                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                                    }`}
                            >
                                <tab.icon size={20} className={activeTab === tab.id ? 'text-gold' : ''} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-zinc-100">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-100 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                                {un[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold truncate text-zinc-900">{un}</p>
                                <p className="text-xs text-zinc-500 truncate">{email}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto h-screen bg-white">
                    <header className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <h2 className="text-xl font-bold text-zinc-900">{tabs.find(t => t.id === activeTab)?.label}</h2>
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
                                {activeTab === 'properties' && <PropertiesTab />}
                                {activeTab === 'site_ads' && <AdsTab />}
                                {activeTab === 'google_ads' && <GoogleAdsTab />}
                                {activeTab === 'settings' && <SettingsTab />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </AdminProvider>
    );
}
