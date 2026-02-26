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

    // AI Search State
    const [isAiMode, setIsAiMode] = useState(false);
    const [aiQuery, setAiQuery] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleAiSearch = async () => {
        setIsAiLoading(true);
        try {
            const res = await fetch('/api/search/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: aiQuery })
            });
            const filters = await res.json();
            const params = new URLSearchParams();
            if (filters.type) params.set('type', filters.type);
            if (filters.guests) params.set('guests', filters.guests.toString());
            router.push(`/search?${params.toString()}`);
        } catch (e) {
            console.error("AI Search Failed", e);
            router.push('/search');
        } finally {
            setIsAiLoading(false);
        }
    };

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
        <div ref={containerRef} className="relative min-h-screen w-full bg-white overflow-hidden flex flex-col pt-24 pb-12">
            {/* Split Content Container */}
            <div className="container mx-auto px-6 flex-1 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 z-20">

                {/* Right Side: Text & Search (RTL) */}
                <div className="flex-1 order-2 lg:order-1 text-right space-y-10 w-full flex flex-col justify-center" dir="rtl">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="text-5xl md:text-6xl lg:text-7xl font-sans font-black text-white tracking-tight leading-tight mb-4 [-webkit-text-stroke:2px_#000] [text-shadow:2px_2px_0_#000,4px_4px_0_#000]"
                        >
                            <EditableText initialText={t('title')} contentKey="hero.title" />
                        </motion.h1>
                        <p className="text-xl md:text-2xl text-zinc-500 font-medium max-w-2xl leading-relaxed">
                            <EditableText initialText={t('subtitle')} multiline />
                        </p>
                    </motion.div>

                    {/* Premium Rectangular Search Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white border border-zinc-100 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] p-4 md:p-8 relative ring-1 ring-zinc-50"
                    >
                        {/* Mode Switcher */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-zinc-100 p-1.5 rounded-full flex gap-1">
                                <button
                                    onClick={() => setIsAiMode(false)}
                                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${!isAiMode ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}
                                >
                                    {tSearch('standard_mode')}
                                </button>
                                <button
                                    onClick={() => setIsAiMode(true)}
                                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isAiMode ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400'}`}
                                >
                                    <span>✨</span>
                                    {tSearch('ai_mode')}
                                </button>
                            </div>
                        </div>

                        {isAiMode ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleAiSearch(); }} className="space-y-6">
                                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 focus-within:ring-2 ring-gold/20 transition-all text-right">
                                    <textarea
                                        value={aiQuery}
                                        onChange={(e) => setAiQuery(e.target.value)}
                                        placeholder={tSearch('ai_placeholder')}
                                        className="w-full bg-transparent text-zinc-900 text-xl font-bold outline-none resize-none h-24 placeholder:text-zinc-300 text-right"
                                        autoFocus
                                    />
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex gap-2">
                                            {['וילה עם בריכה', 'פנטהאוז', 'זוגי'].map(s => (
                                                <button key={s} type="button" onClick={() => setAiQuery(s)} className="text-[10px] bg-white border border-zinc-100 px-3 py-1 rounded-full text-zinc-500 hover:border-gold transition-colors">{s}</button>
                                            ))}
                                        </div>
                                        {isAiLoading && <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />}
                                    </div>
                                </div>
                                <button type="submit" disabled={isAiLoading || !aiQuery.trim()} className="w-full bg-zinc-900 text-white rounded-2xl py-5 font-black text-xl hover:bg-black transition-all shadow-xl active:scale-[0.98]">
                                    {isAiLoading ? tSearch('thinking') : tSearch('magic_search')} ✨
                                </button>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">{tSearch('property_type')}</label>
                                    <select
                                        value={searchParams.type}
                                        onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold outline-none appearance-none cursor-pointer hover:bg-zinc-100 transition-colors"
                                    >
                                        <option value="">{tSearch('types.all')}</option>
                                        <option value="hotel">{tSearch('types.hotel')}</option>
                                        <option value="apartment">{tSearch('types.apartment')}</option>
                                        <option value="villa">{tSearch('types.villa')}</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">{tSearch('guests')}</label>
                                    <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-3">
                                        <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.max(1, p.guests - 1) }))} className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center font-bold text-xl">-</button>
                                        <span className="flex-1 text-center font-bold text-zinc-900 text-lg">{searchParams.guests}</span>
                                        <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.min(20, p.guests + 1) }))} className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xl">+</button>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2">{tSearch('dates')}</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="date"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold outline-none hover:bg-zinc-100 transition-colors text-sm [color-scheme:light]"
                                            value={searchParams.checkIn}
                                            onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                                        />
                                        <input
                                            type="date"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold outline-none hover:bg-zinc-100 transition-colors text-sm [color-scheme:light]"
                                            value={searchParams.checkOut}
                                            onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button onClick={handleSearch} className="md:col-span-2 mt-4 w-full bg-gold text-black rounded-2xl py-5 font-black text-xl hover:shadow-xl transition-all active:scale-[0.98]">
                                    {tSearch('search_btn')}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Left Side: Video Showcase */}
                <div className="flex-1 order-1 lg:order-2 w-full h-[300px] md:h-[450px] lg:h-[650px] relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: -50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] ring-8 ring-zinc-50"
                    >
                        <video
                            key={videoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover scale-[1.05]"
                        >
                            <source src={videoUrl} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                        {/* Floating Badge */}
                        <div className="absolute bottom-10 right-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 text-white text-right">
                            <div className="text-sm font-bold opacity-80 mb-1">Eilat Luxury</div>
                            <div className="text-xl font-black">Private Collection 2026</div>
                        </div>
                    </motion.div>
                </div>

            </div>

            {/* Background Texture/Gradient */}
            <div className="absolute top-0 right-0 w-1/2 h-screen bg-zinc-50/50 -z-10 skew-x-[-12deg] translate-x-40" />
        </div>
    );
}
