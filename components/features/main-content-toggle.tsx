'use client';

import { useState } from 'react';
import ApartmentsList from './apartments-list';
import dynamic from 'next/dynamic';
import { Property, attractions } from '@/lib/mock-data';
import { Map as MapIcon, List as ListIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import MobilePropertyScroller from './mobile-property-scroller';

const MapView = dynamic(() => import('./map-view'), { 
    ssr: false, 
    loading: () => <div className="h-[400px] w-full bg-zinc-100 animate-pulse rounded-xl" />
});

export default function MainContentToggle({ properties, initialShowMap = false }: { properties: Property[], initialShowMap?: boolean }) {
    const [showMap, setShowMap] = useState(initialShowMap);
    const tMap = useTranslations('Map');

    // Split properties for mobile display based on categories
    const popularHomes = properties.slice(0, 5);
    const hotels = properties.filter(p => p.type === 'hotel');
    const apartments = properties.filter(p => p.type === 'apartment');
    const villas = properties.filter(p => p.type === 'villa');

    return (
        <>
            <div className="pb-16 mt-2 relative">
                {showMap ? (
                    <div className="w-full px-6 md:px-10 h-[calc(100vh-250px)] min-h-[500px]">
                        <MapView properties={properties} attractions={attractions} />
                    </div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block">
                            <ApartmentsList items={properties} isCarousel={false} limit={0} />
                        </div>
                        {/* Mobile View */}
                        <div className="md:hidden pb-20 mt-2 space-y-1">
                            <MobilePropertyScroller title="בתים פופולריים | אילת" properties={popularHomes} />
                            {hotels.length > 0 && (
                                <MobilePropertyScroller 
                                    title="דילים מעולים על מלונות" 
                                    subtitle="בנוסף, מתארחים באחד מהמלונות הנבחרים ומקבלים קרדיט של Eilat Luxury."
                                    properties={hotels} 
                                />
                            )}
                            {apartments.length > 0 && (
                                <MobilePropertyScroller title="דירות יוקרה | אילת" properties={apartments} />
                            )}
                            {villas.length > 0 && (
                                <MobilePropertyScroller title="וילות בלעדיות | אילת" properties={villas} />
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Show Map / Show List Floating Button */}
            <div className="fixed bottom-20 md:bottom-12 left-1/2 -translate-x-1/2 z-50">
                <button 
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2 bg-[#222222] text-white px-5 py-3.5 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                >
                    <span className="text-[14px] font-semibold">
                        {showMap ? (tMap('show_list') || 'Show list') : (tMap('show_map') || 'Show map')}
                    </span>
                    {showMap ? <ListIcon size={16} strokeWidth={2.5} /> : <MapIcon size={16} strokeWidth={2.5} />}
                </button>
            </div>
        </>
    );
}
