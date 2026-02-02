'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, MapPin, Home } from 'lucide-react';
import EditableText from '../admin/editable-text';
import { useEffect, useState } from 'react';

export default function Hero({ initialVideoUrl }: { initialVideoUrl?: string }) {
    const t = useTranslations('Hero');
    const [videoUrl, setVideoUrl] = useState(initialVideoUrl || '/videos/hero-placeholder.mp4');

    // Search State
    const [searchParams, setSearchParams] = useState({
        type: '',
        location: 'Eilat',
        guests: 2,
        checkIn: '',
        checkOut: ''
    });

    useEffect(() => {
        // If we already have initialVideoUrl, we technically don't need to fetch again,
        // unless we want real-time updates without refresh.
        // For simplicity, we can keep the fetch OR remove it if we rely on SSR.
        // Let's keep it but skip if we have initial. Actually, let's just sync.
        if (initialVideoUrl) return;

        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                if (data.hero?.videoUrl) {
                    setVideoUrl(data.hero.videoUrl);
                }
            })
            .catch(err => console.error('Failed to load hero video:', err));
    }, [initialVideoUrl]);

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Background Video */}
            <video
                key={videoUrl} // Force reload when URL changes
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 min-w-full min-h-full object-cover z-0"
            >
                <source src={videoUrl} type="video/mp4" />
                {/* Fallback for when video is missing or loading */}
                <div className="bg-neutral-900 w-full h-full" />
            </video>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                        <EditableText initialText={t('title')} contentKey="hero.title" />
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
                        <EditableText initialText={t('subtitle')} multiline />
                    </p>
                </motion.div>

                {/* Replica Search Bar (Functional) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-full max-w-5xl bg-black/60 backdrop-blur-md border border-gold/50 rounded-full p-1 hidden md:flex items-center shadow-2xl relative z-30"
                >
                    {/* 1. Property Type (Dropdown) */}
                    <div className="flex-1 px-4 border-l border-white/10 relative group">
                        <button className="w-full h-full flex items-center justify-end gap-3 text-right focus:outline-none">
                            <div className="flex flex-col items-end">
                                <label className="text-xs text-white/50">סוג נכס</label>
                                <span className="font-bold text-white text-lg">{searchParams.type || 'הכל'}</span>
                            </div>
                            <div className="p-2 rounded-full text-gold">
                                <Home size={24} />
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full right-0 mt-4 w-48 bg-gray-900 border border-gold/30 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-40">
                            {['הכל', 'מלונות', 'דירות', 'וילות'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSearchParams({ ...searchParams, type: type === 'הכל' ? '' : type })}
                                    className="w-full text-right px-4 py-3 text-white hover:bg-gold/20 transition-colors border-b border-white/5 last:border-0"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Location */}
                    <div className="flex-1 px-4 border-l border-white/10 flex items-center justify-end gap-3 text-right">
                        <div className="flex flex-col items-end">
                            <label className="text-xs text-white/50">מיקום</label>
                            <span className="font-bold text-white text-lg">אילת, ישראל</span>
                        </div>
                        <div className="p-2 rounded-full text-gold">
                            <MapPin size={24} />
                        </div>
                    </div>

                    {/* 3. Dates */}
                    <div className="flex-1 px-4 border-l border-white/10 flex items-center justify-end gap-3 text-right cursor-pointer hover:bg-white/5 transition-colors rounded-lg">
                        <div className="flex flex-col items-end">
                            <label className="text-xs text-white/50">תאריכים</label>
                            <input
                                type="date"
                                className="bg-transparent text-white font-bold text-lg text-right focus:outline-none w-full [color-scheme:dark]"
                                onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                            />
                        </div>
                        <div className="p-2 rounded-full text-gold">
                            <Calendar size={24} />
                        </div>
                    </div>

                    {/* 4. Guests */}
                    <div className="flex-1 px-4 flex items-center justify-end gap-3 text-right cursor-pointer hover:bg-white/5 transition-colors rounded-lg group relative">
                        <div className="flex flex-col items-end">
                            <label className="text-xs text-white/50">אורחים</label>
                            <span className="font-bold text-white text-lg">{searchParams.guests} אורחים</span>
                        </div>
                        <div className="p-2 rounded-full text-gold">
                            <Users size={24} />
                        </div>

                        {/* Guests Dropdown */}
                        <div className="absolute top-full left-0 mt-4 w-48 bg-gray-900 border border-gold/30 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-40">
                            <div className="flex items-center justify-between p-4">
                                <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.max(1, p.guests - 1) }))} className="w-8 h-8 bg-gray-800 rounded-full text-white">-</button>
                                <span className="text-white font-bold">{searchParams.guests}</span>
                                <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.min(20, p.guests + 1) }))} className="w-8 h-8 bg-gold text-black rounded-full">+</button>
                            </div>
                        </div>
                    </div>

                    {/* 5. Search Button */}
                    <div className="pl-1">
                        <button
                            onClick={() => console.log('Search:', searchParams)}
                            className="bg-gold hover:bg-gold-light text-black rounded-full p-4 shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
                        >
                            <Search size={24} strokeWidth={3} />
                        </button>
                    </div>
                </motion.div>

                {/* Mobile CTA (Search bar is complex for mobile, simplified button usually better initially) */}
                <motion.button
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="md:hidden bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg"
                >
                    {t('cta')}
                </motion.button>
            </div>
        </div>
    );
}
