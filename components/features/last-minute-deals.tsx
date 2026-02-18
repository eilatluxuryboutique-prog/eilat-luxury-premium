"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, ChevronLeft, ChevronRight, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { properties } from '@/lib/mock-data';

export default function LastMinuteDeals() {
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
            .slice(0, 3)
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
        <section className="py-16 bg-gradient-to-br from-red-600/5 to-orange-600/5 border-y border-white/5 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-right">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-red-500 font-bold mb-2 animate-pulse">
                            <Clock size={20} />
                            <span className="uppercase tracking-widest text-sm">המבצע מסתיים בעוד</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                            דילים של <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">הרגע האחרון</span> ⏳
                        </h2>
                        <p className="text-white/60 text-lg">עד 25% הנחה להזמנות לסופ"ש הקרוב!</p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex gap-4 text-center">
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-24">
                            <div className="text-4xl font-bold text-white font-mono">{formatTime(timeLeft.hours)}</div>
                            <div className="text-xs text-white/50 uppercase mt-1">שעות</div>
                        </div>
                        <div className="text-4xl font-bold text-white/20 self-center">:</div>
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-24">
                            <div className="text-4xl font-bold text-white font-mono">{formatTime(timeLeft.minutes)}</div>
                            <div className="text-xs text-white/50 uppercase mt-1">דקות</div>
                        </div>
                        <div className="text-4xl font-bold text-white/20 self-center">:</div>
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-24">
                            <div className="text-4xl font-bold text-red-500 font-mono">{formatTime(timeLeft.seconds)}</div>
                            <div className="text-xs text-red-500/50 uppercase mt-1">שניות</div>
                        </div>
                    </div>
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {deals.map((deal, index) => (
                        <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative bg-[#121212] rounded-3xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all duration-300 shadow-2xl hover:shadow-red-900/10"
                        >
                            {/* Discount Badge */}
                            <div className="absolute top-4 left-4 z-20 bg-red-600 text-white font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-bounce-slow">
                                <Tag size={14} />
                                <span>-25%</span>
                            </div>

                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={deal.image}
                                    alt={deal.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />

                                <div className="absolute bottom-4 right-4 text-white">
                                    <h3 className="text-xl font-bold truncate max-w-[250px]">{deal.title}</h3>
                                    <div className="flex items-center gap-1 text-white/70 text-sm">
                                        <MapPin size={14} />
                                        <span>{deal.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 pt-2">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <div className="text-white/40 text-sm line-through decoration-red-500/50">₪{deal.originalPrice}</div>
                                        <div className="text-3xl font-bold text-white">₪{deal.price}<span className="text-sm font-normal text-white/50"> /לילה</span></div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                        <Star size={16} className="text-gold fill-gold" />
                                        <span className="font-bold text-white">{deal.rating}</span>
                                    </div>
                                </div>

                                <Link
                                    href={`/property/${deal.id}`}
                                    className="block w-full bg-white text-black font-bold py-3.5 rounded-xl text-center hover:bg-red-500 hover:text-white transition-all transform active:scale-95 shadow-lg"
                                >
                                    תפוס את הדיל 🔥
                                </Link>
                                <div className="text-center text-xs text-red-500 mt-3 font-medium animate-pulse">
                                    נשארו רק 2 מקומות במחיר הזה!
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
