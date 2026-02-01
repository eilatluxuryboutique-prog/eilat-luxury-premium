'use client';

import { motion } from 'framer-motion';
import { Utensils, Hotel, Camera, ShoppingBag, Car, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';

const categories = [
    { id: 'attractions', label: 'Attractions', icon: Camera, color: 'text-purple-400' },
    { id: 'restaurants', label: 'Restaurants', icon: Utensils, color: 'text-orange-400' },
    { id: 'hotels', label: 'Hotels', icon: Hotel, color: 'text-blue-400' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-pink-400' },
    { id: 'nightlife', label: 'Nightlife', icon: Music, color: 'text-red-400' },
    { id: 'transport', label: 'Transport', icon: Car, color: 'text-green-400' },
];

export default function CategoriesList() {
    // const t = useTranslations('Categories'); // Commented out until updated json

    return (
        <section className="py-12 bg-[#121212]">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        Explore Categories
                    </h2>
                    <button className="text-[#FFD700] text-sm hover:underline">View All</button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map((cat, index) => (
                        <motion.button
                            key={cat.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex-shrink-0 flex flex-col items-center gap-3 p-6 bg-[#1E1E1E] rounded-2xl border border-white/5 hover:border-[#FFD700] hover:bg-[#252525] transition-all min-w-[140px]"
                        >
                            <div className={`p-4 rounded-full bg-white/5 ${cat.color}`}>
                                <cat.icon size={28} />
                            </div>
                            <span className="text-white font-medium">{cat.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
}
