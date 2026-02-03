'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, MapPin, Home } from 'lucide-react';
import EditableText from '../admin/editable-text';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/navigation';

export default function Hero({ initialVideoUrl }: { initialVideoUrl?: string }) {
    const t = useTranslations('Hero');
    const tSearch = useTranslations('SearchForm');
    const router = useRouter();
    const [videoUrl, setVideoUrl] = useState(initialVideoUrl || '/videos/hero.mp4');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
                key={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 min-w-full min-h-full object-cover z-0"
            >
                <source src={videoUrl} type="video/mp4" />
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

                {/* Search Bar */}
                <motion.div
                    id="hero-search-bar"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-full max-w-5xl bg-black/80 md:bg-black/60 backdrop-blur-md border border-gold/50 rounded-3xl md:rounded-full p-4 md:p-1 flex flex-col md:flex-row items-center shadow-2xl relative z-30 gap-4 md:gap-0"
                >
                    {/* 1. Property Type */}
                    <div className="w-full md:flex-1 px-4 border-b md:border-b-0 md:border-l border-white/10 relative pb-4 md:pb-0">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                            className="w-full h-full flex items-center justify-between md:justify-end gap-3 text-right focus:outline-none"
                        >
                            <span className="md:hidden text-gold font-bold">{tSearch('property_type')}</span>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <label className="text-xs text-white/50 hidden md:block">{tSearch('property_type')}</label>
                                    <span className="font-bold text-white text-lg">
                                        {searchParams.type === 'hotel' ? tSearch('types.hotel') :
                                            searchParams.type === 'apartment' ? tSearch('types.apartment') :
                                                searchParams.type === 'villa' ? tSearch('types.villa') : tSearch('types.all')}
                                    </span>
                                </div>
                                <div className={`p-2 rounded-full text-gold transition-transform duration-300 ${openDropdown === 'type' ? 'rotate-180' : ''}`}>
                                    <Home size={24} />
                                </div>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === 'type' && (
                            <div className="absolute top-full right-0 mt-2 md:mt-4 w-full md:w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-40">
                                {[
                                    { label: tSearch('types.all'), value: '' },
                                    { label: tSearch('types.hotel'), value: 'hotel' },
                                    { label: tSearch('types.apartment'), value: 'apartment' },
                                    { label: tSearch('types.villa'), value: 'villa' }
                                ].map((item) => (
                                    <button
                                        key={item.value}
                                        onClick={() => {
                                            setSearchParams({ ...searchParams, type: item.value });
                                            setOpenDropdown(null);
                                        }}
                                        className="w-full text-right px-4 py-3 text-foreground hover:bg-muted transition-colors border-b border-border last:border-0"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 2. Location */}
                    <div className="w-full md:flex-1 px-4 border-b md:border-b-0 md:border-l border-white/10 flex items-center justify-between md:justify-end gap-3 text-right pb-4 md:pb-0">
                        <span className="md:hidden text-gold font-bold">{tSearch('location')}</span>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <label className="text-xs text-white/50 hidden md:block">{tSearch('location')}</label>
                                <span className="font-bold text-white text-lg">אילת, ישראל</span>
                            </div>
                            <div className="p-2 rounded-full text-gold">
                                <MapPin size={24} />
                            </div>
                        </div>
                    </div>

                    {/* 3. Dates (Range) */}
                    <div className="w-full md:flex-1 px-4 border-b md:border-b-0 md:border-l border-white/10 relative pb-4 md:pb-0">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'dates' ? null : 'dates')}
                            className="w-full h-full flex items-center justify-between md:justify-end gap-3 text-right focus:outline-none"
                        >
                            <span className="md:hidden text-gold font-bold">{tSearch('dates')}</span>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <label className="text-xs text-white/50 hidden md:block">{tSearch('dates')}</label>
                                    <span className="font-bold text-white text-lg whitespace-nowrap">
                                        {searchParams.checkIn ? `${searchParams.checkIn} - ${searchParams.checkOut || '?'}` : tSearch('select_dates')}
                                    </span>
                                </div>
                                <div className="p-2 rounded-full text-gold">
                                    <Calendar size={24} />
                                </div>
                            </div>
                        </button>

                        {/* Date Range Popover */}
                        {openDropdown === 'dates' && (
                            <div className="absolute top-full right-0 mt-2 md:mt-4 w-full md:w-64 bg-card border border-border rounded-xl shadow-xl p-4 z-40 flex flex-col gap-3">
                                <div>
                                    <label className="text-xs text-muted-foreground block mb-1">{tSearch('check_in')}</label>
                                    <input
                                        type="date"
                                        className="w-full bg-muted text-foreground rounded p-2 focus:ring-1 focus:ring-primary outline-none"
                                        value={searchParams.checkIn}
                                        onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground block mb-1">{tSearch('check_out')}</label>
                                    <input
                                        type="date"
                                        className="w-full bg-muted text-foreground rounded p-2 focus:ring-1 focus:ring-primary outline-none"
                                        value={searchParams.checkOut}
                                        onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                                        min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <button
                                    onClick={() => setOpenDropdown(null)}
                                    className="bg-primary text-black font-bold py-2 rounded mt-2 hover:brightness-110"
                                >
                                    {tSearch('confirm')}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 4. Guests */}
                    <div className="w-full md:flex-1 px-4 flex items-center justify-between md:justify-end gap-3 text-right relative pb-4 md:pb-0">
                        <span className="md:hidden text-gold font-bold">{tSearch('guests')}</span>
                        <div className="w-full flex justify-end">
                            <button
                                onClick={() => setOpenDropdown(openDropdown === 'guests' ? null : 'guests')}
                                className="w-full md:w-auto h-full flex items-center justify-end gap-3 text-right focus:outline-none"
                            >
                                <div className="flex flex-col items-end">
                                    <label className="text-xs text-white/50 hidden md:block">{tSearch('guests')}</label>
                                    <span className="font-bold text-white text-lg">{searchParams.guests} {tSearch('guests')}</span>
                                </div>
                                <div className="p-2 rounded-full text-gold">
                                    <Users size={24} />
                                </div>
                            </button>
                        </div>

                        {/* Guests Dropdown */}
                        {openDropdown === 'guests' && (
                            <div className="absolute top-full left-0 mt-2 md:mt-4 w-full md:w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-40">
                                <div className="flex items-center justify-between p-4">
                                    <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.max(1, p.guests - 1) }))} className="w-8 h-8 bg-muted rounded-full text-foreground hover:bg-gray-200">-</button>
                                    <span className="text-foreground font-bold text-xl">{searchParams.guests}</span>
                                    <button onClick={() => setSearchParams(p => ({ ...p, guests: Math.min(20, p.guests + 1) }))} className="w-8 h-8 bg-primary text-black rounded-full hover:brightness-110">+</button>
                                </div>
                                <button
                                    onClick={() => setOpenDropdown(null)}
                                    className="w-full bg-muted text-primary py-2 text-sm hover:brightness-95"
                                >
                                    {tSearch('close')}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 5. Search Button */}
                    <div className="w-full md:w-auto pl-1 pb-2 md:pb-0">
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
                            className="w-full md:w-auto bg-gold hover:bg-gold-light text-black rounded-full p-4 shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <span className="md:hidden font-bold">{tSearch('search_btn')}</span>
                            <Search size={24} strokeWidth={3} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
