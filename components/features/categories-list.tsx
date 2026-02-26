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
        <section className="py-12 bg-background transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        {t('title')}
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
                                className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-zinc-100 hover:border-gold hover:bg-zinc-50 transition-all min-w-[160px] cursor-pointer shadow-sm group"
                            >
                                <div className={`p-4 rounded-full bg-zinc-50 group-hover:bg-white transition-colors ${cat.color}`}>
                                    <cat.icon size={32} />
                                </div>
                                <span className="text-zinc-900 font-bold">{cat.label}</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
