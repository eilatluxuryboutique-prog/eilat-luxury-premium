'use client';

import { motion } from 'framer-motion';
import { Hotel, Home, Building, Camera, Palmtree } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { id: 'hotels', label: 'Luxury Hotels', type: 'hotel', icon: Hotel, color: 'text-gold' },
    { id: 'apartments', label: 'Apartments', type: 'apartment', icon: Building, color: 'text-blue-400' },
    { id: 'villas', label: 'Exclusive Villas', type: 'villa', icon: Home, color: 'text-green-400' },
    { id: 'attractions', label: 'Attractions', type: '', icon: Camera, color: 'text-purple-400' },
    { id: 'vacation', label: 'Vacation', type: '', icon: Palmtree, color: 'text-orange-400' },
];

export default function CategoriesList() {
    return (
        <section className="py-12 bg-[#121212]">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Browse by Category
                    </h2>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            href={`/search?type=${cat.type}`}
                            className="flex-shrink-0"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center gap-3 p-6 bg-[#1E1E1E] rounded-2xl border border-white/5 hover:border-[#FFD700] hover:bg-[#252525] transition-all min-w-[160px] cursor-pointer"
                            >
                                <div className={`p-4 rounded-full bg-white/5 ${cat.color}`}>
                                    <cat.icon size={32} />
                                </div>
                                <span className="text-white font-bold">{cat.label}</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
