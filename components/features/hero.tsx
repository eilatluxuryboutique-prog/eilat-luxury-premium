'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Calendar, Users, Home, ChevronDown, X, Bot } from 'lucide-react';
import EditableText from '../admin/editable-text';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from '@/navigation';
import { Link } from '@/navigation';

export default function Hero({ initialVideoUrl }: { initialVideoUrl?: string }) {
    const t = useTranslations('Hero');
    const tSearch = useTranslations('SearchForm');
    const router = useRouter();
    const [videoUrl, setVideoUrl] = useState(initialVideoUrl || 'https://res.cloudinary.com/drr2qzpzk/video/upload/v1770610178/eilat_premium/hero_video_new_1770610129027.mp4');
    const containerRef = useRef(null);

    // Search State
    const [searchParams, setSearchParams] = useState({
        type: '',
        location: 'Eilat',
        guests: 2,
        checkIn: '',
        checkOut: ''
    });

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchParams.type) params.set('type', searchParams.type);
        if (searchParams.guests) params.set('guests', searchParams.guests.toString());
        if (searchParams.checkIn) params.set('checkIn', searchParams.checkIn);
        router.push(`/search?${params.toString()}`);
    };

    useEffect(() => {
        if (initialVideoUrl) return;
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                if (data.hero?.videoUrl) setVideoUrl(data.hero.videoUrl);
            })
            .catch(err => console.error('Failed to load hero video:', err));
    }, [initialVideoUrl]);

    return (
        <div ref={containerRef} className="relative w-full bg-white overflow-visible flex flex-col pt-28 pb-6 lg:pb-8 mb-10">
            <div className="container mx-auto px-6 flex-1 flex flex-col z-20 gap-4 lg:gap-6 relative">

                {/* Top Section: Title & Subtitle */}
                <div className="w-full flex justify-end" dir="rtl">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-right w-full lg:w-3/4"
                    >
                        <motion.h1
                            initial={{ perspective: 1000 }}
                            animate={{
                                y: [0, -10, 0],
                                rotateX: [0, 6, 0, -6, 0],
                                rotateY: [0, -6, 0, 6, 0],
                                scale: [1, 1.03, 1],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                times: [0, 0.25, 0.5, 0.75, 1]
                            }}
                            className="text-3xl md:text-5xl lg:text-5xl font-sans font-black text-white tracking-tight leading-tight mb-2"
                            style={{
                                transformStyle: "preserve-3d",
                                textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, 0 10px 20px rgba(0,0,0,0.9)"
                            }}
                        >
                            <EditableText initialText={t('title')} contentKey="hero.title" />
                        </motion.h1>
                        <p className="text-sm md:text-base text-zinc-500 font-medium max-w-2xl leading-relaxed">
                            <EditableText initialText={t('subtitle')} multiline />
                        </p>
                    </motion.div>
                </div>

                {/* Bottom Section: Search Box and Video exactly same size side-by-side */}
                <div className="flex flex-row items-stretch gap-2 md:gap-4 lg:gap-6 w-full mb-4 lg:px-12">

                    {/* Right Side on RTL / Search Box */}
                    <div className="flex-1 order-2 lg:order-1 flex w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full bg-white border border-zinc-100 rounded-2xl md:rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] p-3 lg:p-6 relative ring-1 ring-zinc-50 flex flex-col justify-center"
                            dir="rtl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mt-auto mb-auto w-full">
                                <div className="space-y-0.5 md:space-y-1 text-right">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1 md:px-2">{tSearch('property_type')}</label>
                                    <select
                                        value={searchParams.type}
                                        onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl md:rounded-2xl px-2 py-1.5 md:px-4 md:py-2.5 text-zinc-900 font-bold outline-none appearance-none cursor-pointer hover:bg-zinc-100 transition-colors text-xs md:text-sm"
                                    >
                                        <option value="">{tSearch('types.all')}</option>
                                        <option value="hotel">{tSearch('types.hotel')}</option>
                                        <option value="apartment">{tSearch('types.apartment')}</option>
                                        <option value="villa">{tSearch('types.villa')}</option>
                                    </select>
                                </div>

                                <div className="space-y-0.5 md:space-y-1 text-right">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1 md:px-2">{tSearch('guests')}</label>
                                    <div className="flex items-center gap-1 md:gap-3 bg-zinc-50 border border-zinc-100 rounded-xl md:rounded-2xl px-2 md:px-3 py-1 md:py-2">
                                        <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.max(1, p.guests - 1) }))} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-sm md:text-lg">-</button>
                                        <span className="flex-1 text-center font-bold text-zinc-900 text-sm md:text-base">{searchParams.guests}</span>
                                        <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.min(20, p.guests + 1) }))} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm md:text-lg">+</button>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-0.5 md:space-y-1 mt-1 text-right">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1 md:px-2">{tSearch('dates')}</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-2">
                                        <input
                                            type="date"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-xl md:rounded-2xl px-2 py-1.5 md:px-4 md:py-2.5 text-zinc-900 font-bold outline-none hover:bg-zinc-100 transition-colors text-[10px] md:text-sm [color-scheme:light]"
                                            value={searchParams.checkIn}
                                            onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                                        />
                                        <input
                                            type="date"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-xl md:rounded-2xl px-2 py-1.5 md:px-4 md:py-2.5 text-zinc-900 font-bold outline-none hover:bg-zinc-100 transition-colors text-[10px] md:text-sm [color-scheme:light]"
                                            value={searchParams.checkOut}
                                            onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button onClick={handleSearch} className="md:col-span-2 mt-2 w-full bg-gold text-black rounded-xl md:rounded-2xl py-2.5 md:py-3.5 font-black text-xs md:text-base hover:shadow-xl transition-all active:scale-[0.98]">
                                    {tSearch('search_btn')}
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Left Side on RTL / Video Showcase */}
                    <div className="flex-1 order-1 lg:order-2 w-1/2 flex relative min-h-[180px] md:min-h-[220px] lg:min-h-[280px]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: -50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-none border-none ring-0"
                            style={{ boxShadow: 'none', border: 'none', outline: 'none' }}
                        >
                            <video
                                key={videoUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover scale-[1.05]"
                            >
                                <source src={videoUrl} type="video/mp4" />
                            </video>
                        </motion.div>
                    </div>
                </div>

            </div>

            {/* Background Texture/Gradient */}
            <div className="absolute top-0 right-0 w-1/2 h-screen bg-zinc-50/50 -z-10 skew-x-[-12deg] translate-x-40" />

            {/* Scroll Indicator Arrow */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-30 cursor-pointer flex flex-col items-center gap-1 group"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-white/80 backdrop-blur-md border border-black/10 p-3 rounded-full shadow-lg group-hover:bg-gold group-hover:text-black transition-all duration-300 group-hover:scale-110"
                >
                    <ChevronDown className="w-6 h-6 text-zinc-600 group-hover:text-black transition-colors" />
                </motion.div>
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                    {t('scroll_down') || 'גלול למטה'}
                </span>
            </motion.div>
        </div>
    );
}
