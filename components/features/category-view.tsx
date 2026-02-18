
"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Property } from '@/lib/mock-data'; // Use fetched data later
import ApartmentsList from '@/components/features/apartments-list'; // Reusing existing list component

export default function CategoryView({ type }: { type: string }) {
    const t = useTranslations('Categories');
    const [items, setItems] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/properties?type=${type}`)
            .then(res => res.json())
            .then(data => {
                let fetchedItems = [];
                // Check if API returned data
                if (data.properties && data.properties.length > 0) {
                    fetchedItems = data.properties;
                } else {
                    console.warn("API empty, using client-side fallback");
                    // Client-side fallback to mock data
                    // We need to fetch it or filter it. Since we can't import easily inside useEffect without dynamic import:
                    // Using sync import from above logic if possible or just assume empty for now to let local take over
                }

                // MERGE LOCAL STORAGE DEMO PROPERTIES
                try {
                    const saved = localStorage.getItem('demo_properties');
                    if (saved) {
                        const localProps = JSON.parse(saved);
                        // Filter by type and validity
                        const validLocal = localProps.filter((p: any) =>
                            p && p.title && (p.type === type || (type === 'apartment' && !p.type))
                        );

                        // Deduplicate against server items
                        const uniqueLocal = validLocal.filter((lp: any) =>
                            !fetchedItems.some((sp: any) => sp.id === lp.id || sp._id === lp.id)
                        );

                        fetchedItems = [...uniqueLocal, ...fetchedItems];
                    }
                } catch (e) {
                    console.error("Failed to load demo properties in category view", e);
                }

                // If still empty after checking local, load mock data fallback
                if (fetchedItems.length === 0) {
                    import('@/lib/mock-data').then(mod => {
                        const fallback = mod.properties.filter(p => p.type === type);
                        setItems(fallback);
                    });
                } else {
                    setItems(fetchedItems);
                }
            })
            .catch(err => {
                console.error("API Error:", err);
                // On error, try local storage + mock
                import('@/lib/mock-data').then(mod => {
                    let fallback = mod.properties.filter(p => p.type === type);
                    // Try local storage again also here?
                    try {
                        const saved = localStorage.getItem('demo_properties');
                        if (saved) {
                            const localProps = JSON.parse(saved).filter((p: any) => p.type === type);
                            fallback = [...localProps, ...fallback];
                        }
                    } catch (e) { }
                    setItems(fallback);
                });
            })
            .finally(() => setLoading(false));
    }, [type]);

    const titleKey = type === 'villa' ? 'villas' : type === 'hotel' ? 'hotels' : 'apartments';

    return (
        <div className="min-h-screen bg-[#121212] pt-24 pb-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {t(titleKey) || type.charAt(0).toUpperCase() + type.slice(1)}
                    </h1>
                    <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                    </div>
                ) : (
                    <>
                        <ApartmentsList items={items} />
                        {/* Debug Info */}
                        <div className="mt-8 p-4 bg-black/50 text-white/30 text-xs font-mono border border-white/5 rounded">
                            Page Type: {type} <br />
                            Total Items: {items.length} <br />
                            Local Storage: {typeof window !== 'undefined' ? (localStorage.getItem('demo_properties') ? 'Found' : 'Empty') : 'Server'}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
