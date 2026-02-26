'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Bot, Accessibility, User, X, MessageCircle, Car } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/navigation';
import { useUI } from '@/context/ui-context';

export default function BottomNav() {
    const t = useTranslations('Navigation');
    const { setAiChatOpen, setAccessibilityOpen, isAiChatOpen, isAccessibilityOpen } = useUI();
    const router = useRouter();
    const pathname = usePathname();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Fetch session to determine profile link destination
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => setUser(data.user))
            .catch(() => setUser(null));
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    const openWhatsApp = () => {
        window.open('https://wa.me/972505222536?text=היי, אשמח לפרטים על דירות פנויות!', '_blank');
    };

    const openTaxi = () => {
        window.open('https://gett.com/il/', '_blank');
    };

    // Hide on admin/host pages where specific sidebars exist
    if (pathname?.includes('/admin') || pathname?.includes('/host')) return null;

    return (
        <>
            <AnimatePresence>
                {isSearchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="fixed inset-0 bg-white/20 backdrop-blur-sm z-[90]"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 rounded-t-3xl z-[100] px-6 pt-8 pb-32 safe-area-bottom shadow-[0_-20px_50px_rgba(0,0,0,0.05)]"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-zinc-900">{t('search')}</h3>
                                <button onClick={() => setIsSearchOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-900">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSearchSubmit} className="relative mb-6">
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('search') + "..."}
                                    className="w-full bg-zinc-100 border border-zinc-100 rounded-2xl py-4 pr-12 pl-4 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-zinc-400"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold w-5 h-5 pointer-events-none" />
                            </form>

                            <div className="grid grid-cols-2 gap-3">
                                {['מלונות', 'דירות', 'וילות', 'נופש'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSearchQuery(cat)}
                                        className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 rounded-xl py-3 text-zinc-700 transition-colors text-sm"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Premium Floating Bottom Navigation Capsule */}
            <div className="fixed bottom-6 left-0 right-0 z-[100] px-4 pointer-events-none flex justify-center">
                <nav className="pointer-events-auto flex items-center justify-between gap-1 md:gap-4 px-3 md:px-6 py-1.5 md:py-2 bg-white/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-3xl ring-1 ring-black/5">

                    {/* Home */}
                    <BottomNavItem
                        href="/"
                        icon={<Home size={20} />}
                        label={t('home')}
                        active={pathname === '/' && !isSearchOpen}
                    />

                    {/* Search */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setIsSearchOpen(!isSearchOpen);
                            if (isAiChatOpen) setAiChatOpen(false);
                            if (isAccessibilityOpen) setAccessibilityOpen(false);
                        }}
                        className={`flex flex-col items-center gap-1 transition-colors relative ${isSearchOpen || pathname.includes('/search') ? 'text-gold-dark' : 'text-zinc-500'} hover:text-gold flex-1 min-w-0`}
                    >
                        <Search size={20} />
                        <span className="text-[10px] md:text-xs font-medium truncate">{t('search')}</span>
                    </motion.button>

                    {/* Taxi (הנהג) */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={openTaxi}
                        className="flex flex-col items-center gap-1 transition-colors text-zinc-500 hover:text-yellow-600 flex-1 min-w-0"
                    >
                        <Car size={20} />
                        <span className="text-[10px] md:text-xs font-medium truncate">Gett</span>
                    </motion.button>

                    {/* Centerpiece: AI Concierge */}
                    <div className="relative px-2">
                        <motion.button
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                setAiChatOpen(!isAiChatOpen);
                                if (isAccessibilityOpen) setAccessibilityOpen(false);
                                if (isSearchOpen) setIsSearchOpen(false);
                            }}
                            className={`relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isAiChatOpen ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-100 text-gold-dark hover:border-gold'}`}
                        >
                            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/20 shadow-lg bg-black">
                                <video
                                    src="/videos/ai-mascot.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover scale-150"
                                />
                            </div>
                            <div className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
                            </div>
                        </motion.button>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${isAiChatOpen ? 'text-zinc-900' : 'text-zinc-400'}`}>
                                {isAiChatOpen ? 'Chatting' : 'AI Assistant'}
                            </span>
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={openWhatsApp}
                        className="flex flex-col items-center gap-1 transition-colors text-zinc-500 hover:text-[#128C7E] flex-1 min-w-0"
                    >
                        <MessageCircle size={20} />
                        <span className="text-[10px] md:text-xs font-medium truncate">WhatsApp</span>
                    </motion.button>

                    {/* Accessibility */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setAccessibilityOpen(!isAccessibilityOpen);
                            if (isAiChatOpen) setAiChatOpen(false);
                            if (isSearchOpen) setIsSearchOpen(false);
                        }}
                        className="flex flex-col items-center gap-1 transition-colors relative text-[#00BFFF] hover:text-blue-400 flex-1 min-w-0"
                    >
                        <Accessibility size={20} />
                        <span className="text-[10px] md:text-xs font-medium truncate">{t('accessibility')}</span>
                    </motion.button>

                    {/* Profile */}
                    <BottomNavItem
                        href={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'}
                        icon={<User size={20} />}
                        label={t('profile')}
                        active={(pathname.includes('/login') || pathname.includes('/dashboard') || pathname.includes('/admin')) && !isSearchOpen}
                    />
                </nav>
            </div>
        </>
    );
}

function BottomNavItem({ href, icon, label, active = false }: { href: string; icon: any; label: string; active?: boolean }) {
    return (
        <motion.div whileTap={{ scale: 0.9 }} className="relative flex-1 min-w-0">
            <Link href={href} className={`flex flex-col items-center gap-1 transition-colors relative ${active ? 'text-gold' : 'text-zinc-500'} hover:text-gold`}>
                <div className="p-1 z-10 transition-transform">
                    {React.cloneElement(icon, { size: active ? 20 : 18 })}
                </div>
                <span className={`text-[10px] md:text-xs font-medium z-10 truncate ${active ? 'font-bold' : ''}`}>{label}</span>
                {active && (
                    <motion.div
                        layoutId="active-indicator"
                        className="absolute -bottom-2 w-1 h-1 bg-gold rounded-full"
                    />
                )}
            </Link>
        </motion.div>
    );
}

