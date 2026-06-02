'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from '@/navigation';
import Image from 'next/image';

export default function Hero() {
    const tSearch = useTranslations('SearchForm');
    const router = useRouter();

    const [searchParams, setSearchParams] = useState({
        location: 'Eilat',
        guests: 2,
        checkIn: '',
        checkOut: ''
    });

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchParams.guests) params.set('guests', searchParams.guests.toString());
        if (searchParams.checkIn) params.set('checkIn', searchParams.checkIn);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="hidden md:flex relative w-full h-[450px] md:h-[600px] items-center justify-start mt-4 mb-8 overflow-hidden rounded-[24px] max-w-none px-4 md:px-10">
            {/* Background Image */}
            <div className="absolute inset-0 mx-4 md:mx-10 rounded-[24px] overflow-hidden z-0">
                <Image 
                    src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                    alt="Eilat" 
                    fill 
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Search Box Card */}
            <div className="relative z-10 w-full max-w-[420px] mx-auto md:mx-0 md:mr-12 lg:mr-24 mt-8 md:mt-0">
                <div className="bg-white/40 md:bg-white backdrop-blur-sm md:backdrop-blur-none border border-white/50 md:border-none rounded-[20px] md:rounded-[24px] p-5 md:p-8 shadow-2xl flex flex-col gap-3 md:gap-5">
                    <h1 className="text-[24px] md:text-[32px] font-bold text-[#222222] md:text-[#222222] text-shadow-sm leading-[1.1] tracking-tight">
                        {tSearch('hero_title') || 'מצא מקומות לינה באילת'}
                    </h1>
                    <p className="text-[14px] md:text-[16px] text-[#717171] leading-tight hidden sm:block">
                        {tSearch('hero_desc') || 'גלה וילות יוקרה ודירות מושלמות לכל חופשה.'}
                    </p>

                    <div className="border border-[#b0b0b0] rounded-[12px] md:rounded-[16px] flex flex-col mt-2 md:mt-3">
                        {/* Location */}
                        <div className="p-3.5 border-b border-[#b0b0b0]">
                            <label className="block text-[10px] font-bold text-[#222222] uppercase tracking-wider mb-1">{tSearch('location') || 'מיקום'}</label>
                            <input 
                                type="text" 
                                value="אילת, ישראל" 
                                readOnly
                                className="w-full outline-none text-[14px] text-[#222222] bg-transparent font-medium"
                            />
                        </div>
                        {/* Dates */}
                        <div className="flex border-b border-[#b0b0b0]">
                            <div className="p-3.5 border-e border-[#b0b0b0] flex-1">
                                <label className="block text-[10px] font-bold text-[#222222] uppercase tracking-wider mb-1">{tSearch('check_in') || 'צ\'ק-אין'}</label>
                                <input 
                                    type="date" 
                                    className="w-full outline-none text-[14px] text-[#717171] bg-transparent"
                                    value={searchParams.checkIn}
                                    onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                                />
                            </div>
                            <div className="p-3.5 flex-1">
                                <label className="block text-[10px] font-bold text-[#222222] uppercase tracking-wider mb-1">{tSearch('check_out') || 'צ\'ק-אאוט'}</label>
                                <input 
                                    type="date" 
                                    className="w-full outline-none text-[14px] text-[#717171] bg-transparent"
                                    value={searchParams.checkOut}
                                    onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                                />
                            </div>
                        </div>
                        {/* Guests */}
                        <div className="p-3.5">
                            <label className="block text-[10px] font-bold text-[#222222] uppercase tracking-wider mb-1">{tSearch('guests') || 'אורחים'}</label>
                            <select 
                                className="w-full outline-none text-[14px] text-[#222222] bg-transparent appearance-none"
                                value={searchParams.guests}
                                onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
                            >
                                <option value={1}>אורח 1</option>
                                <option value={2}>2 אורחים</option>
                                <option value={3}>3 אורחים</option>
                                <option value={4}>4 אורחים</option>
                                <option value={5}>5 אורחים</option>
                                <option value={6}>6 אורחים</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={handleSearch}
                        className="w-full bg-[#FF385C] text-white rounded-[12px] py-[14px] text-[16px] font-semibold hover:bg-[#D90B42] transition-colors mt-2"
                    >
                        חיפוש חופשה
                    </button>
                </div>
            </div>
        </div>
    );
}
