'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import UserMenu from '../auth/user-menu';
import ThemeToggle from '../features/theme-toggle';
import CartIcon from '../features/cart-icon';

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Navigation');
    const tCats = useTranslations('Categories');

    const menuVariants: Variants = {
        closed: {
            opacity: 0,
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        }
    };

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-zinc-800 hover:text-gold transition-all bg-white/80 rounded-lg border border-zinc-200 active:scale-95 shadow-sm"
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-white/20 backdrop-blur-md z-40"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed top-0 right-0 h-[100dvh] w-[85%] max-w-sm border-l border-zinc-100 z-[9999] p-6 shadow-2xl flex flex-col overflow-y-auto bg-white/95 backdrop-blur-xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <Link href="/" className="text-xl font-bold text-zinc-900">
                                    Eilat<span className="text-gold">Luxury</span>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X size={28} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4 mb-8 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 text-sm">פרופיל</span>
                                    <UserMenu />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 text-sm">מצב לילה</span>
                                    <ThemeToggle />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 text-sm">עגלת קניות</span>
                                    <CartIcon />
                                </div>
                            </div>

                            <nav className="flex flex-col gap-4 text-lg">
                                <Link
                                    href="/"
                                    onClick={() => setIsOpen(false)}
                                    className="text-zinc-800 hover:text-gold transition-colors border-b border-zinc-50 pb-2"
                                >
                                    {t('home')}
                                </Link>

                                {/* Categories Section */}
                                <div className="mt-2 mb-2">
                                    <span className="text-gold text-xs font-bold uppercase tracking-widest">{tCats('title')}</span>
                                    <div className="flex flex-col gap-3 mt-4 pr-2">
                                        <Link href="/search?type=hotel" onClick={() => setIsOpen(false)} className="text-zinc-700 hover:text-gold transition-colors text-base flex justify-between items-center">
                                            <span>{tCats('hotels')}</span>
                                            <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full border border-gold/20">PREMIUM</span>
                                        </Link>
                                        <Link href="/search?type=apartment" onClick={() => setIsOpen(false)} className="text-zinc-700 hover:text-gold transition-colors text-base">
                                            {tCats('apartments')}
                                        </Link>
                                        <Link href="/search?type=villa" onClick={() => setIsOpen(false)} className="text-zinc-700 hover:text-gold transition-colors text-base">
                                            {tCats('villas')}
                                        </Link>
                                    </div>
                                </div>

                                <Link
                                    href="/apartments"
                                    onClick={() => setIsOpen(false)}
                                    className="text-zinc-800 hover:text-gold transition-colors border-b border-zinc-50 pb-2 mt-2"
                                >
                                    {t('apartments')}
                                </Link>
                                <Link
                                    href="/about"
                                    onClick={() => setIsOpen(false)}
                                    className="text-zinc-800 hover:text-gold transition-colors border-b border-zinc-50 pb-2"
                                >
                                    {t('about')}
                                </Link>
                                <Link
                                    href="/contact"
                                    onClick={() => setIsOpen(false)}
                                    className="text-zinc-800 hover:text-gold transition-colors border-b border-zinc-50 pb-2"
                                >
                                    {t('contact')}
                                </Link>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
