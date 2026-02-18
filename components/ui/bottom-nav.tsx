'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Bot, Accessibility, User, X } from 'lucide-react';
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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-gold/30 rounded-t-3xl z-[100] px-6 pt-8 pb-32 safe-area-bottom shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">{t('search')}</h3>
                                <button onClick={() => setIsSearchOpen(false)} className="p-2 text-white/60 hover:text-white">
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
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all placeholder:text-white/30"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold w-5 h-5 pointer-events-none" />
                            </form>

                            <div className="grid grid-cols-2 gap-3">
                                {['מלונות', 'דירות', 'וילות', 'נופש'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSearchQuery(cat)}
                                        className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl py-3 text-white/80 transition-colors text-sm"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 z-[100] px-4 py-2 flex justify-between items-center safe-area-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <BottomNavItem
                    href="/"
                    icon={<Home size={22} />}
                    label={t('home')}
                    active={pathname === '/' && !isSearchOpen}
                />
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        setIsSearchOpen(!isSearchOpen);
                        if (isAiChatOpen) setAiChatOpen(false);
                        if (isAccessibilityOpen) setAccessibilityOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 transition-colors relative ${isSearchOpen || pathname.includes('/search') ? 'text-gold' : 'text-white/60'} hover:text-gold`}
                >
                    {(isSearchOpen || pathname.includes('/search')) && (
                        <motion.div
                            layoutId="active-glow"
                            className="absolute -top-2 w-12 h-12 bg-gold/10 blur-xl rounded-full z-0"
                        />
                    )}
                    <div className="p-1 z-10">
                        <Search size={22} />
                    </div>
                    <span className="text-xs font-medium z-10">{t('search')}</span>
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        setAiChatOpen(!isAiChatOpen);
                        if (isAccessibilityOpen) setAccessibilityOpen(false);
                        if (isSearchOpen) setIsSearchOpen(false);
                    }}
                    className={`flex flex-col items-center transition-all transform ${isAiChatOpen ? 'text-gold' : 'text-white/60'}`}
                >
                    <div className={`w-18 h-18 relative -mt-10 rounded-full overflow-hidden border-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all ${isAiChatOpen ? 'border-gold bg-gold/20 scale-110' : 'border-white/80 bg-black'}`}>
                        <video
                            src="/videos/ai-mascot-final.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover scale-150 translate-y-2"
                            style={{ filter: isAiChatOpen ? 'none' : 'grayscale(0.3) brightness(1.1)' }}
                        />
                    </div>
                    <span className="text-sm font-black mt-1 text-white">היי?</span>
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        setAccessibilityOpen(!isAccessibilityOpen);
                        if (isAiChatOpen) setAiChatOpen(false);
                        if (isSearchOpen) setIsSearchOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1 transition-colors relative ${isAccessibilityOpen ? 'text-gold' : 'text-white/60'} hover:text-gold`}
                >
                    {isAccessibilityOpen && (
                        <motion.div
                            layoutId="active-glow"
                            className="absolute -top-2 w-12 h-12 bg-gold/10 blur-xl rounded-full z-0"
                        />
                    )}
                    <div className="p-1 z-10">
                        <Accessibility size={22} />
                    </div>
                    <span className="text-xs font-medium z-10">{t('accessibility')}</span>
                </motion.button>

                <BottomNavItem
                    href="/login"
                    icon={<User size={22} />}
                    label={t('profile')}
                    active={(pathname.includes('/login') || pathname.includes('/account')) && !isSearchOpen}
                />
            </nav>
        </>
    );
}

function BottomNavItem({ href, icon, label, active = false }: { href: string; icon: any; label: string; active?: boolean }) {
    return (
        <motion.div whileTap={{ scale: 0.9 }} className="relative">
            <Link href={href} className={`flex flex-col items-center gap-1 transition-colors relative ${active ? 'text-gold' : 'text-white/60'} hover:text-gold`}>
                {active && (
                    <motion.div
                        layoutId="active-glow"
                        className="absolute -top-2 w-12 h-12 bg-gold/10 blur-xl rounded-full z-0"
                    />
                )}
                <div className="p-1 z-10">
                    {icon}
                </div>
                <span className="text-xs font-medium z-10">{label}</span>
            </Link>
        </motion.div>
    );
}
