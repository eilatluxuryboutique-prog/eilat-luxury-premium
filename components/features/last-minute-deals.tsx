"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, ChevronLeft, ChevronRight, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { properties } from '@/lib/mock-data';
import { useTranslations } from 'next-intl';

export default function LastMinuteDeals() {
    const t = useTranslations('Deals');
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });
    const [deals, setDeals] = useState<any[]>([]);

    useEffect(() => {
        // Mock countdown logic
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 24, minutes: 0, seconds: 0 }; // Reset
            });
        }, 1000);

        // Select random properties for deals
        // In real app, fetch from API where deal=true
        const randomDeals = [...properties]
            .sort(() => 0.5 - Math.random())
            .slice(0, 8)
            .map(p => ({
                ...p,
                originalPrice: Math.round(p.price * 1.25), // Mock original price
                price: p.price
            }));
        setDeals(randomDeals);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (num: number) => num.toString().padStart(2, '0');

    return (
        <section className="py-8 md:py-16 bg-gradient-to-br from-red-600/5 to-orange-600/5 border-y border-white/5 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-12 gap-4 md:gap-6">
                    <div className="text-center md:text-right">
                        <div className="flex items-center justify-center md:justify-start gap-1 md:gap-2 text-red-500 font-bold mb-1 md:mb-2 animate-pulse">
                            <Clock size={16} className="md:w-5 md:h-5" />
                            <span className="uppercase tracking-widest text-[10px] md:text-sm">{t('sales_end')}</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-1 md:mb-2">
                            {t('title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">{t('title_highlight')}</span> ⏳
                        </h2>
                        <p className="text-white/60 text-xs md:text-lg">{t('last_minute')}</p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex gap-2 md:gap-4 text-center">
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-2 md:p-4 w-16 md:w-24">
                            <div className="text-xl md:text-4xl font-bold text-white font-mono">{formatTime(timeLeft.hours)}</div>
                            <div className="text-[10px] md:text-xs text-white/50 uppercase mt-0.5 md:mt-1">{t('hours')}</div>
                        </div>
                        <div className="text-xl md:text-4xl font-bold text-white/20 self-center">:</div>
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-2 md:p-4 w-16 md:w-24">
                            <div className="text-xl md:text-4xl font-bold text-white font-mono">{formatTime(timeLeft.minutes)}</div>
                            <div className="text-[10px] md:text-xs text-white/50 uppercase mt-0.5 md:mt-1">{t('minutes')}</div>
                        </div>
                        <div className="text-xl md:text-4xl font-bold text-white/20 self-center">:</div>
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-2 md:p-4 w-16 md:w-24">
                            <div className="text-xl md:text-4xl font-bold text-red-500 font-mono">{formatTime(timeLeft.seconds)}</div>
                            <div className="text-[10px] md:text-xs text-red-500/50 uppercase mt-0.5 md:mt-1">{t('seconds')}</div>
                        </div>
                    </div>
                </div>

                {/* Deals Grid / Mobile Carousel */}
                <div className="relative">
                    {deals.length > 2 && (
                        <div className="absolute top-[40%] left-0 -translate-y-1/2 z-20 w-8 h-8 rounded-r-2xl bg-white/90 shadow-lg border border-l-0 border-white/20 flex items-center justify-center md:hidden pointer-events-none opacity-80 animate-pulse">
                            <ChevronLeft size={18} className="text-black pr-0.5" />
                        </div>
                    )}
                    <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3 md:gap-8 pb-4 md:pb-6 snap-x scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {deals.map((deal, index) => (
                            <motion.div
                                key={deal.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative bg-[#121212] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all duration-300 shadow-2xl hover:shadow-red-900/10 min-w-[190px] w-[190px] snap-center shrink-0 md:min-w-0 md:w-auto flex flex-col"
                            >
                                {/* Discount Badge */}
                                <div className="absolute top-4 left-4 z-20 bg-red-600 text-white font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-bounce-slow">
                                    <Tag size={14} />
                                    <span>-25%</span>
                                </div>

                                {/* Image */}
                                <div className="relative h-36 md:h-64 overflow-hidden">
                                    <Image
                                        src={deal.image}
                                        alt={deal.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />

                                    <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 text-white">
                                        <h3 className="text-base md:text-xl font-bold truncate max-w-[160px] md:max-w-[250px]">{deal.title}</h3>
                                        <div className="flex items-center gap-1 text-white/70 text-[10px] md:text-sm">
                                            <MapPin size={10} className="md:w-3.5 md:h-3.5" />
                                            <span className="truncate">{deal.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-3 md:p-6 md:pt-2 flex-grow flex flex-col justify-between">
                                    <div className="flex justify-between items-end mb-3 md:mb-6">
                                        <div>
                                            <div className="text-white/40 text-[10px] md:text-sm line-through decoration-red-500/50">₪{deal.originalPrice}</div>
                                            <div className="text-lg md:text-3xl font-bold text-white">₪{deal.price}<span className="text-[10px] md:text-sm font-normal text-white/50"> /לילה</span></div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg">
                                            <Star size={12} className="text-gold fill-gold md:w-4 md:h-4" />
                                            <span className="font-bold text-white text-xs md:text-base">{deal.rating}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/property/${deal.id}`}
                                        className="block w-full bg-white text-black font-bold py-2 md:py-3.5 rounded-lg md:rounded-xl text-center hover:bg-red-500 hover:text-white transition-all transform active:scale-95 shadow-lg text-xs md:text-base"
                                    >
                                        {t('grab_deal')}
                                    </Link>
                                    <div className="text-center text-[9px] md:text-xs text-red-500 mt-2 md:mt-3 font-medium animate-pulse">
                                        {t('spots_left')}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
