'use client';

import { useTranslations } from 'next-intl';
import ApartmentsList from '@/components/features/apartments-list';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Map, List } from 'lucide-react';

// Dynamic Import for Map (No SSR)
const MapView = dynamic(() => import('@/components/features/map-view'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-neutral-900 animate-pulse rounded-xl" />
});

function SearchContent() {
    const t = useTranslations('Search');
    const tCats = useTranslations('Categories');
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || '';

    // State
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);

    // Fetch Data (Same logic as CategoryView)
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            let fetchedItems: any[] = [];

            // 1. Fetch from API
            try {
                const query = type ? `?type=${type}` : '';
                const res = await fetch(`/api/properties${query}`);
                const data = await res.json();
                if (data.properties) fetchedItems = data.properties;
            } catch (e) {
                console.error("API Fetch Error", e);
            }

            // 2. Merge Local Storage (Demo Mode)
            try {
                const saved = localStorage.getItem('demo_properties');
                if (saved) {
                    const localProps = JSON.parse(saved);
                    const validLocal = localProps.filter((p: any) =>
                        p && p.title && (!type || p.type === type || (type === 'apartment' && !p.type))
                    );
                    const uniqueLocal = validLocal.filter((lp: any) =>
                        !fetchedItems.some((sp: any) => sp.id === lp.id || sp._id === lp.id)
                    );
                    fetchedItems = [...uniqueLocal, ...fetchedItems];
                }
            } catch (e) { }

            // 3. Fallback to Mock if empty
            if (fetchedItems.length === 0) {
                try {
                    const mod = await import('@/lib/mock-data');
                    let fallback = mod.properties;
                    if (type) fallback = fallback.filter(p => p.type === type);
                    fetchedItems = fallback;
                } catch (e) { }
            }

            setItems(fetchedItems);
            setLoading(false);
        };

        fetchData();
    }, [type]);


    const getTitle = () => {
        if (!type) return t('title');
        if (type === 'hotel') return tCats('hotels');
        if (type === 'apartment') return tCats('apartments');
        if (type === 'villa') return tCats('villas');
        return type;
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-bold text-white">
                    {getTitle()} <span className="text-white/50 text-2xl">({items.length})</span>
                </h1>

                {/* View Toggle */}
                <div className="flex bg-white/10 p-1 rounded-lg backdrop-blur-sm border border-white/5">
                    <button
                        onClick={() => setShowMap(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${!showMap ? 'bg-gold text-black font-bold shadow-lg' : 'text-white hover:bg-white/5'}`}
                    >
                        <List size={18} /> רשימה
                    </button>
                    <button
                        onClick={() => setShowMap(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${showMap ? 'bg-gold text-black font-bold shadow-lg' : 'text-white hover:bg-white/5'}`}
                    >
                        <Map size={18} /> מפה
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                </div>
            ) : (
                <>
                    {showMap ? (
                        <div className="h-[600px] mb-12">
                            <MapView properties={items} />
                        </div>
                    ) : (
                        <ApartmentsList items={items} limit={100} />
                    )}
                </>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 bg-neutral-900">
            <Suspense fallback={<div className="container mx-auto px-4 text-white">Loading...</div>}>
                <SearchContent />
            </Suspense>
        </main>
    );
}
