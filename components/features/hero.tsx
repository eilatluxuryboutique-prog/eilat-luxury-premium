'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import EditableText from '../admin/editable-text';
import { useEffect, useState } from 'react';

export default function Hero({ initialVideoUrl }: { initialVideoUrl?: string }) {
    const t = useTranslations('Hero');
    // If server provided URL, use it immediately in initial state!
    const [videoUrl, setVideoUrl] = useState(initialVideoUrl || '/videos/hero-placeholder.mp4');

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

                {/* Glassmorphism Search Bar (Gold Theme) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-full max-w-4xl bg-gold-glass border-gold-glow rounded-full p-2 hidden md:flex items-center shadow-gold-glow"
                >
                    {/* Location Input */}
                    <div className="flex-1 px-6 border-r border-gold/30 flex items-center gap-3">
                        <MapPin className="text-gold-light" size={20} />
                        <div className="flex flex-col text-left">
                            <label className="text-xs text-gold/80 uppercase tracking-wider font-bold">Location</label>
                            <input
                                type="text"
                                placeholder="Eilat, Israel"
                                className="bg-transparent text-white placeholder-white/70 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Dates Input */}
                    <div className="flex-1 px-6 border-r border-gold/30 flex items-center gap-3">
                        <Calendar className="text-gold-light" size={20} />
                        <div className="flex flex-col text-left">
                            <label className="text-xs text-gold/80 uppercase tracking-wider font-bold">Dates</label>
                            <input
                                type="text"
                                placeholder="Add dates"
                                className="bg-transparent text-white placeholder-white/70 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Guests Input */}
                    <div className="flex-1 px-6 flex items-center gap-3">
                        <Users className="text-gold-light" size={20} />
                        <div className="flex flex-col text-left">
                            <label className="text-xs text-gold/80 uppercase tracking-wider font-bold">Guests</label>
                            <input
                                type="text"
                                placeholder="Add guests"
                                className="bg-transparent text-white placeholder-white/70 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <button className="bg-gold-gradient hover:brightness-110 text-black font-bold rounded-full p-4 transition-all shadow-gold-sm">
                        <Search size={24} />
                    </button>
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
