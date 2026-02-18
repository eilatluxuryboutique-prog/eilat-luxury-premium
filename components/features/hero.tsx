'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Calendar, Users, MapPin, Home, ChevronDown, X } from 'lucide-react';
import EditableText from '../admin/editable-text';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from '@/navigation';
import { Link } from '@/navigation';

export default function Hero({ initialVideoUrl }: { initialVideoUrl?: string }) {
    const t = useTranslations('Hero');
    const tSearch = useTranslations('SearchForm');
    const router = useRouter();
    const [videoUrl, setVideoUrl] = useState(initialVideoUrl || 'https://res.cloudinary.com/drr2qzpzk/video/upload/v1770610178/eilat_premium/hero_video_new_1770610129027.mp4');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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

            // Redirect with filters
            const params = new URLSearchParams();
            if (filters.type) params.set('type', filters.type);
            if (filters.guests) params.set('guests', filters.guests.toString());
            // if (filters.amenities) ... 

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
                if (data.hero?.videoUrl) {
                    setVideoUrl(data.hero.videoUrl);
                }
            })
            .catch(err => console.error('Failed to load hero video:', err));
    }, [initialVideoUrl]);

    return (
        <div ref={containerRef} className="relative h-[80vh] md:h-screen w-full overflow-hidden">
            {/* Background Video with Parallax */}
            <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                <video
                    key={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 min-w-full min-h-full object-cover brightness-[1.1] contrast-[1.05]"
                >
                    <source src={videoUrl} type="video/mp4" />
                    <div className="bg-neutral-900 w-full h-full" />
                </video>
                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />
            </motion.div>


            {/* Content */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 mt-8 md:mt-0">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-[90px] xl:text-[105px] font-black mb-8 leading-[1.1] text-3d-white-black px-2 tracking-tighter drop-shadow-2xl">
                        <EditableText initialText={t('title')} contentKey="hero.title" />
                    </h1>
                    <p className="text-2xl md:text-3xl lg:text-3xl text-white font-bold mb-12 max-w-4xl mx-auto text-3d-white-black-sm leading-relaxed px-4 drop-shadow-xl">
                        <EditableText initialText={t('subtitle')} multiline />
                    </p>


                    {/* Search Bar - Glassmorphism Update */}
                    <motion.div
                        id="hero-search-bar"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-full max-w-5xl relative"
                    >
                        {/* AI Toggle */}
                        <div className="absolute -top-12 right-0 md:right-auto md:left-4 z-40">
                            <button
                                onClick={() => setIsAiMode(!isAiMode)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-lg backdrop-blur-md transition-all ${isAiMode ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                <span className="text-lg">✨</span>
                                {isAiMode ? tSearch('standard_mode') : tSearch('ai_mode')}
                            </button>
                        </div>

                        {isAiMode ? (
                            /* AI Mode Input */
                            <div className="glass-premium rounded-2xl p-2 shadow-2xl relative z-30 animate-in fade-in zoom-in-95 duration-300">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleAiSearch();
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={aiQuery}
                                            onChange={(e) => setAiQuery(e.target.value)}
                                            placeholder={tSearch('ai_placeholder') || "Describe your dream vacation... (e.g. 'Luxury villa for 10 people with a pool')"}
                                            className="w-full bg-transparent text-white text-lg md:text-xl font-medium px-6 py-4 outline-none placeholder:text-white/40"
                                            autoFocus
                                        />
                                        {isAiLoading && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isAiLoading || !aiQuery.trim()}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white rounded-xl px-8 py-4 font-bold text-lg shadow-lg shadow-purple-500/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <span>{isAiLoading ? tSearch('thinking') : tSearch('magic_search')}</span>
                                        {!isAiLoading && <span className="text-xl">✨</span>}
                                    </button>
                                </form>
                                {/* AI Suggestions / Examples */}
                                <div className="hidden md:flex gap-3 px-6 pb-2 mt-2 overflow-x-auto no-scrollbar">
                                    {['Luxury villa with pool', 'Cheap apartment for couple', 'Penthouse near the beach'].map(s => (
                                        <button key={s} onClick={() => setAiQuery(s)} className="text-xs text-white/50 hover:text-white bg-white/5 px-3 py-1 rounded-full whitespace-nowrap transition-colors">
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (<>
                        /* Standard Mode (Existing) */
                            <div className="hidden md:flex glass-premium rounded-full p-2 items-center shadow-2xl relative z-30 transition-all hover:bg-black/40">
                                {/* 1. Property Type */}
                                <div className="flex-1 px-4 border-l border-white/10 relative group">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                                        className="w-full h-full flex items-center justify-end gap-3 text-right focus:outline-none py-2"
                                    >
                                        <div className="flex flex-col items-end">
                                            <label className="text-xs text-gold/80 font-bold uppercase tracking-wider mb-0.5">{tSearch('property_type')}</label>
                                            <span className="font-bold text-white text-lg">
                                                {searchParams.type === 'hotel' ? tSearch('types.hotel') :
                                                    searchParams.type === 'apartment' ? tSearch('types.apartment') :
                                                        searchParams.type === 'villa' ? tSearch('types.villa') : tSearch('types.all')}
                                            </span>
                                        </div>
                                        <div className={`p-2 rounded-full bg-white/5 group-hover:bg-gold group-hover:text-black transition-all duration-300 ${openDropdown === 'type' ? 'rotate-180 bg-gold text-black' : 'text-gold'}`}>
                                            <Home size={20} />
                                        </div>
                                    </button>
                                    {openDropdown === 'type' && (
                                        <div className="absolute top-full right-0 mt-4 w-56 glass-premium rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                            {[
                                                { label: tSearch('types.all'), value: '' },
                                                { label: tSearch('types.hotel'), value: 'hotel' },
                                                { label: tSearch('types.apartment'), value: 'apartment' },
                                                { label: tSearch('types.villa'), value: 'villa' }
                                            ].map((item) => (
                                                <button key={item.value} onClick={() => { setSearchParams({ ...searchParams, type: item.value }); setOpenDropdown(null); }} className="w-full text-right px-6 py-3.5 text-white hover:bg-gold/10 hover:text-gold transition-colors border-b border-white/5 last:border-0 font-medium">{item.label}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 2. Location */}
                                <div className="flex-1 px-4 border-l border-white/10 flex items-center justify-end gap-3 text-right group">
                                    <div className="flex flex-col items-end">
                                        <label className="text-xs text-gold/80 font-bold uppercase tracking-wider mb-0.5">{tSearch('location')}</label>
                                        <span className="font-bold text-white text-lg">אילת, ישראל</span>
                                    </div>
                                    <div className="p-2 rounded-full bg-white/5 text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300"><MapPin size={20} /></div>
                                </div>

                                {/* 3. Dates */}
                                <div className="flex-1 px-4 border-l border-white/10 relative group">
                                    <button onClick={() => setOpenDropdown(openDropdown === 'dates' ? null : 'dates')} className="w-full h-full flex items-center justify-end gap-3 text-right focus:outline-none py-2">
                                        <div className="flex flex-col items-end">
                                            <label className="text-xs text-gold/80 font-bold uppercase tracking-wider mb-0.5">{tSearch('dates')}</label>
                                            <span className="font-bold text-white text-lg whitespace-nowrap">{searchParams.checkIn ? `${searchParams.checkIn} - ${searchParams.checkOut || '?'}` : tSearch('select_dates')}</span>
                                        </div>
                                        <div className="p-2 rounded-full bg-white/5 text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300"><Calendar size={20} /></div>
                                    </button>
                                    {openDropdown === 'dates' && (
                                        <div className="absolute top-full right-0 mt-4 w-[28rem] glass-premium rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] p-6 z-[999] flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-gold/30 transition-colors">
                                                    <label className="text-xs text-gold/80 font-bold uppercase tracking-wider block mb-2">{tSearch('check_in')}</label>
                                                    <input type="date" className="w-full bg-transparent text-white text-lg font-bold outline-none cursor-pointer [color-scheme:dark]" value={searchParams.checkIn} onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-gold/30 transition-colors">
                                                    <label className="text-xs text-gold/80 font-bold uppercase tracking-wider block mb-2">{tSearch('check_out')}</label>
                                                    <input type="date" className="w-full bg-transparent text-white text-lg font-bold outline-none cursor-pointer [color-scheme:dark]" value={searchParams.checkOut} onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })} min={searchParams.checkIn || new Date().toISOString().split('T')[0]} />
                                                </div>
                                            </div>
                                            <button onClick={() => setOpenDropdown(null)} className="w-full bg-gold hover:bg-yellow-400 text-black font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98]">{tSearch('confirm')}</button>
                                        </div>
                                    )}
                                </div>

                                {/* 4. Guests */}
                                <div className="flex-1 px-4 flex items-center justify-end gap-3 text-right relative group">
                                    <button onClick={() => setOpenDropdown(openDropdown === 'guests' ? null : 'guests')} className="w-full h-full flex items-center justify-end gap-3 text-right focus:outline-none py-2">
                                        <div className="flex flex-col items-end">
                                            <label className="text-xs text-gold/80 font-bold uppercase tracking-wider mb-0.5">{tSearch('guests')}</label>
                                            <span className="font-bold text-white text-lg">{searchParams.guests} {tSearch('guests')}</span>
                                        </div>
                                        <div className="p-2 rounded-full bg-white/5 text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300"><Users size={20} /></div>
                                    </button>
                                    {openDropdown === 'guests' && (
                                        <div className="absolute top-full left-0 mt-4 w-56 glass-premium rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                                <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.max(1, p.guests - 1) }))} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full text-white text-xl flex items-center justify-center transition-colors">-</button>
                                                <span className="text-white font-bold text-2xl">{searchParams.guests}</span>
                                                <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.min(20, p.guests + 1) }))} className="w-10 h-10 bg-gold hover:bg-yellow-400 text-black rounded-full text-xl flex items-center justify-center transition-colors">+</button>
                                            </div>
                                            <button onClick={() => setOpenDropdown(null)} className="w-full bg-white/5 text-gold py-3 text-sm font-bold hover:bg-white/10 transition-colors uppercase tracking-wider">{tSearch('close')}</button>
                                        </div>
                                    )}
                                </div>

                                {/* 5. Search Button */}
                                <div className="pl-1 pr-1">
                                    <Link href={{ pathname: '/search', query: { ...(searchParams.type && { type: searchParams.type }), ...(searchParams.guests && { guests: searchParams.guests }), ...(searchParams.checkIn && { checkIn: searchParams.checkIn }), ...(searchParams.checkOut && { checkOut: searchParams.checkOut }), } }} className="bg-gold hover:bg-yellow-400 text-black rounded-full w-14 h-14 shadow-lg shadow-gold/20 transition-all hover:scale-105 flex items-center justify-center">
                                        <Search size={24} strokeWidth={3} />
                                    </Link>
                                </div>
                            </div>
                        </>)}
                    </motion.div>
                    {/* Mobile View: Compact Horizontal 4-Segment Bar */}
                    <div className="md:hidden flex flex-col gap-4 px-2">
                        <div className="glass-premium rounded-2xl p-2 flex items-center shadow-[0_12px_50px_rgba(0,0,0,0.5)] w-full">
                            {/* 1. Type Segment */}
                            <button
                                onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                                className="flex-1 flex flex-col items-center justify-center border-l border-white/10 py-1.5 relative active:opacity-70"
                            >
                                <Home size={20} className="text-gold mb-1" />
                                <span className="text-[10px] text-white/90 font-bold truncate w-full px-1">
                                    {searchParams.type === 'hotel' ? tSearch('types.hotel') :
                                        searchParams.type === 'apartment' ? tSearch('types.apartment') :
                                            searchParams.type === 'villa' ? tSearch('types.villa') : tSearch('types.all')}
                                </span>

                                {openDropdown === 'type' && (
                                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] glass-premium rounded-2xl shadow-2xl overflow-hidden z-[1002] animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gold/5">
                                            <span className="font-bold text-white">{tSearch('property_type')}</span>
                                            <button onClick={() => setOpenDropdown(null)} className="text-white/50"><ChevronDown className="rotate-180" /></button>
                                        </div>
                                        {[
                                            { label: tSearch('types.all'), value: '' },
                                            { label: tSearch('types.hotel'), value: 'hotel' },
                                            { label: tSearch('types.apartment'), value: 'apartment' },
                                            { label: tSearch('types.villa'), value: 'villa' }
                                        ].map((item) => (
                                            <button
                                                key={item.value}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSearchParams({ ...searchParams, type: item.value });
                                                    setOpenDropdown(null);
                                                }}
                                                className={`w-full text-right px-6 py-4 text-white hover:bg-white/5 border-b border-white/5 last:border-0 font-medium ${searchParams.type === item.value ? 'text-gold bg-gold/5' : ''}`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </button>

                            {/* 2. Dates Segment */}
                            <button
                                onClick={() => setOpenDropdown(openDropdown === 'dates' ? null : 'dates')}
                                className="flex-[1.8] flex flex-col items-center justify-center border-l border-white/10 py-1.5 active:opacity-70"
                            >
                                <Calendar size={20} className="text-gold mb-1" />
                                <span className="text-[10px] text-white/90 font-bold whitespace-nowrap px-1">
                                    {searchParams.checkIn ? `${searchParams.checkIn.split('-').slice(1).reverse().join('/')}` : tSearch('dates')}
                                </span>

                                {openDropdown === 'dates' && (
                                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1001] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setOpenDropdown(null)}>
                                        <div className="w-full max-w-sm glass-premium rounded-2xl shadow-2xl p-6 flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl font-bold text-white">{tSearch('dates')}</h3>
                                                <button onClick={() => setOpenDropdown(null)} className="p-2 text-white/60"><X size={24} /></button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/10 focus-within:border-gold/50 transition-colors">
                                                    <label className="text-[10px] text-gold font-bold uppercase block mb-1">{tSearch('check_in')}</label>
                                                    <input type="date" className="w-full bg-transparent text-white text-sm font-bold outline-none [color-scheme:dark]" value={searchParams.checkIn} onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/10 focus-within:border-gold/50 transition-colors">
                                                    <label className="text-[10px] text-gold font-bold uppercase block mb-1">{tSearch('check_out')}</label>
                                                    <input type="date" className="w-full bg-transparent text-white text-sm font-bold outline-none [color-scheme:dark]" value={searchParams.checkOut} onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })} min={searchParams.checkIn || new Date().toISOString().split('T')[0]} />
                                                </div>
                                            </div>
                                            <button onClick={() => setOpenDropdown(null)} className="w-full bg-gold text-black font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform">{tSearch('confirm')}</button>
                                        </div>
                                    </div>
                                )}
                            </button>

                            {/* 3. Guests Segment */}
                            <button
                                onClick={() => setOpenDropdown(openDropdown === 'guests' ? null : 'guests')}
                                className="flex-1.2 flex flex-col items-center justify-center py-1.5 border-l border-white/10 active:opacity-70"
                            >
                                <Users size={20} className="text-gold mb-1" />
                                <span className="text-[10px] text-white/90 font-bold truncate w-full px-1">
                                    {searchParams.guests} {tSearch('guests')}
                                </span>

                                {openDropdown === 'guests' && (
                                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] glass-premium rounded-2xl shadow-2xl overflow-hidden z-[1002] animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gold/5">
                                            <span className="font-bold text-white">{tSearch('guests')}</span>
                                            <button onClick={() => setOpenDropdown(null)} className="text-white/50"><ChevronDown className="rotate-180" /></button>
                                        </div>
                                        <div className="flex items-center justify-between p-8">
                                            <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.max(1, p.guests - 1) }))} className="w-12 h-12 bg-white/5 border border-white/10 rounded-full text-white text-2xl flex items-center justify-center active:scale-95 transition-transform">-</button>
                                            <span className="text-white font-bold text-3xl">{searchParams.guests}</span>
                                            <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.min(20, p.guests + 1) }))} className="w-12 h-12 bg-gold border border-gold rounded-full text-black text-2xl flex items-center justify-center active:scale-95 transition-transform">+</button>
                                        </div>
                                        <button onClick={() => setOpenDropdown(null)} className="w-full bg-white/5 border-t border-white/10 text-gold py-4 font-bold active:bg-white/10 transition-colors">{tSearch('confirm')}</button>
                                    </div>
                                )}
                            </button>

                            {/* 4. Search Trigger */}
                            <div className="pl-2 pr-1">
                                <Link
                                    href={{
                                        pathname: '/search',
                                        query: {
                                            ...(searchParams.type && { type: searchParams.type }),
                                            ...(searchParams.guests && { guests: searchParams.guests }),
                                            ...(searchParams.checkIn && { checkIn: searchParams.checkIn }),
                                            ...(searchParams.checkOut && { checkOut: searchParams.checkOut }),
                                        }
                                    }}
                                    className="bg-gold text-black rounded-xl p-3 shadow-lg flex items-center justify-center active:scale-90 transition-transform shadow-gold/20"
                                >
                                    <Search size={22} strokeWidth={3} />
                                </Link>
                            </div>
                        </div>
                    </div>

                </motion.div>

                {/* Scroll Down Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{
                        opacity: { delay: 1, duration: 1 },
                        y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                    }}
                    className="absolute bottom-20 md:bottom-24 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
                    onClick={() => {
                        window.scrollTo({
                            top: window.innerHeight,
                            behavior: 'smooth'
                        });
                    }}
                >
                    <div className="flex flex-col items-center">
                        <ChevronDown
                            className="text-white w-10 h-10 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]"
                            strokeWidth={3}
                        />
                    </div>
                </motion.div>
            </div>
        </div >
    );
}
