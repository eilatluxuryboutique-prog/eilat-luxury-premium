'use client';

import { Link } from '@/navigation';
import { motion } from 'framer-motion';
import { Hotel, Home, Building, Camera, Palmtree } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CategoriesList() {
    const t = useTranslations('Categories');

    const categories = [
        { id: 'hotels', label: t('hotels'), type: 'hotel', icon: Hotel, color: 'text-gold-dark' },
        { id: 'apartments', label: t('apartments'), type: 'apartment', icon: Building, color: 'text-blue-600' },
        { id: 'villas', label: t('villas'), type: 'villa', icon: Home, color: 'text-green-600' },
        { id: 'attractions', label: t('attractions'), type: '', icon: Camera, color: 'text-purple-600' },
        { id: 'vacation', label: t('vacation'), type: '', icon: Palmtree, color: 'text-orange-600' },
    ];

    return (
        <section className="py-6 md:py-12 bg-background transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-4 md:mb-8">
                    <h2 className="text-xl md:text-3xl font-bold text-foreground">
                        {t('title')}
                    </h2>
                </div>

                <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
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
                                className="flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 bg-white rounded-xl md:rounded-2xl border border-zinc-100 hover:border-gold hover:bg-zinc-50 transition-all min-w-[120px] md:min-w-[160px] cursor-pointer shadow-sm group"
                            >
                                <div className={`p-3 md:p-4 rounded-full bg-zinc-50 group-hover:bg-white transition-colors ${cat.color}`}>
                                    <cat.icon size={24} className="md:w-8 md:h-8" />
                                </div>
                                <span className="text-zinc-900 font-bold text-sm md:text-base">{cat.label}</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
