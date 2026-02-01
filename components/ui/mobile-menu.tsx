'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Navigation');

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
                className="p-2 text-white hover:text-blue-400 transition-colors"
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-black/90 border-l border-white/10 z-50 p-6 shadow-2xl"
                        >
                            <div className="flex justify-end mb-8">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-white hover:text-red-400 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-6 text-lg">
                                <Link
                                    href="/"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/90 hover:text-blue-400 transition-colors border-b border-white/5 pb-4"
                                >
                                    {t('home')}
                                </Link>
                                <Link
                                    href="/apartments"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/90 hover:text-blue-400 transition-colors border-b border-white/5 pb-4"
                                >
                                    {t('apartments')}
                                </Link>
                                <Link
                                    href="/about"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/90 hover:text-blue-400 transition-colors border-b border-white/5 pb-4"
                                >
                                    {t('about')}
                                </Link>
                                <Link
                                    href="/contact"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/90 hover:text-blue-400 transition-colors border-b border-white/5 pb-4"
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
