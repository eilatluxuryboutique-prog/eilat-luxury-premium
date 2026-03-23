"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from '@/navigation';
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ExperiencesPage() {
    const t = useTranslations('Experiences');
    
    // Derived from translations to maintain translation mapping
    const experiences = [
        {
            id: "yacht",
            title: t('yacht_title'),
            price: "₪1500",
            duration: `2 ${t('hours')}`,
            image: "https://images.unsplash.com/photo-1569263979104-cdfaef81a5bc?q=80&w=2574&auto=format&fit=crop",
            description: t('yacht_desc')
        },
        {
            id: "jeep",
            title: t('jeep_title'),
            price: "₪800",
            duration: `3 ${t('hours')}`,
            image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=2670&auto=format&fit=crop",
            description: t('jeep_desc')
        },
        {
            id: "diving",
            title: t('diving_title'),
            price: "₪350",
            duration: t('hour_and_half'),
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2670&auto=format&fit=crop",
            description: t('diving_desc')
        },
        {
            id: "massage",
            title: t('massage_title'),
            price: "₪400",
            duration: `60 ${t('minutes')}`,
            image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=2670&auto=format&fit=crop",
            description: t('massage_desc')
        }
    ];

    return (
        <div className="min-h-screen bg-[#121212] pt-24 pb-20">
            {/* Hero Section */}
            <div className="container mx-auto px-4 text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold mb-6"
                >
                    {t('hero_title')}
                </motion.h1>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                    {t('hero_desc')}
                </p>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5 hover:border-gold/30 group shadow-2xl transition-all"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={exp.image}
                                    alt={exp.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80"></div>
                                <div className="absolute bottom-4 right-4">
                                    <h3 className="text-2xl font-bold text-white mb-1">{exp.title}</h3>
                                    <div className="flex gap-3 text-sm font-medium">
                                        <span className="bg-white/10 px-2 py-1 rounded text-white/90">{exp.duration}</span>
                                        <span className="bg-gold/20 text-gold px-2 py-1 rounded">{t('starting_from')}{exp.price}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-white/60 mb-6 leading-relaxed">
                                    {exp.description}
                                </p>
                                <a
                                    href={`https://wa.me/972502225536?text=Hi, I would like more details about: ${exp.title}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gold transition-colors"
                                >
                                    <Send size={18} />
                                    {t('book_whatsapp')}
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-20">
                <p className="text-white/40 text-sm">{t('local_suppliers')}</p>
            </div>
        </div>
    );
}
