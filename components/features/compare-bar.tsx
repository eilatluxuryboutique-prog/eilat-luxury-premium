"use client";

import { useCompare } from './compare-context';
import { properties } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowLeftRight } from 'lucide-react';
import { Link } from '@/navigation';

export default function CompareBar() {
    const { selectedIds, toggleProperty, isOpen, setIsOpen } = useCompare();

    const selectedProperties = properties.filter(p => selectedIds.includes(p.id));

    if (selectedIds.length === 0) return null;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-zinc-100 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
                    >
                        <div className="container mx-auto max-w-5xl flex items-center justify-between">
                            <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                                {selectedProperties.map(prop => (
                                    <div key={prop.id} className="relative group flex-shrink-0">
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-zinc-100 relative">
                                            <Image src={prop.image} alt={prop.title} fill className="object-cover" />
                                        </div>
                                        <button
                                            onClick={() => toggleProperty(prop.id)}
                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {selectedProperties.length < 3 && (
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-dashed border-zinc-100 flex items-center justify-center text-zinc-400 text-xs text-center p-2">
                                        הוסף עוד נכס
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 pl-4 border-l border-zinc-100">
                                <Link
                                    href="/compare"
                                    className={`flex items-center gap-2 bg-gold hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl transition-colors ${selectedProperties.length < 2 ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <ArrowLeftRight size={20} />
                                    <span className="hidden md:inline">השוואה ({selectedProperties.length})</span>
                                    <span className="md:hidden">השווה</span>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-zinc-400 hover:text-zinc-900"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Minimized Toggle Button */}
            {!isOpen && selectedIds.length > 0 && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-4 z-40 bg-gold text-black p-4 rounded-full shadow-xl animate-bounce-slow"
                >
                    <ArrowLeftRight size={24} />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {selectedIds.length}
                    </span>
                </button>
            )}
        </>
    );
}
