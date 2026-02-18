'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import FavoriteButton from "../ui/favorite-button";
import { Users, Bed, Wifi, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Property, properties as allProperties } from '@/lib/mock-data';
import { Link } from '@/navigation';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { useCompare } from './compare-context';
import SocialProof from '@/components/ui/social-proof';
import ShareButton from '@/components/ui/share-button';
import UrgencyTimer from '@/components/ui/urgency-timer';

function CompareCheckbox({ id }: { id: string }) {
    const { selectedIds, toggleProperty } = useCompare();
    const isSelected = selectedIds.includes(id);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleProperty(id);
            }}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md transition-all w-full border ${isSelected ? 'bg-gold text-black border-gold' : 'bg-transparent text-muted-foreground border-border hover:border-gold hover:text-foreground'}`}
        >
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'border-black bg-black text-gold' : 'border-current'}`}>
                {isSelected && <span className="text-[10px]">✓</span>}
            </div>
            {isSelected ? 'נבחר להשוואה' : 'הוסף להשוואה'}
        </button>
    );
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function ApartmentsList({ limit, items }: { limit?: number; items?: Property[] }) {
    const t = useTranslations('Featured');
    // const [isLoading, setIsLoading] = useState(true); // Removing loading for instant render
    const sourceData = items || allProperties;
    const displayedApartments = limit ? sourceData.slice(0, limit) : sourceData;

    // useEffect(() => {
    //     // Simulate data fetching for skeleton demo
    //     const timer = setTimeout(() => setIsLoading(false), 1000);
    //     return () => clearTimeout(timer);
    // }, []);

    return (
        <section className="py-16 bg-background transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('title')}</h2>
                        <p className="text-muted-foreground">{t('subtitle')}</p>
                    </div>
                    <Link href="/search" className="text-primary font-medium hover:underline hidden md:block">
                        View All
                    </Link>
                </div>

                {/* Grid - Simplified for Robustness */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-6">
                    {displayedApartments.length > 0 ? (
                        displayedApartments.map((apt) => (
                            <div
                                key={apt.id}
                                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 shadow-sm"
                            >
                                <Link href={`/property/${apt.id}`} className="block h-full">
                                    {/* Image */}
                                    <div className="relative h-48 md:h-64 overflow-hidden bg-neutral-900">
                                        <Image
                                            src={apt.image || (apt.images && apt.images[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'}
                                            alt={apt.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                        <div className="absolute top-3 left-3 bg-gold/90 text-black px-2 py-1 rounded-md flex items-center gap-1 shadow-lg z-10">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-xs font-bold">{apt.rating}</span>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-md text-xs z-10 font-bold">
                                            {t('recommended')}
                                        </div>
                                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                                            <FavoriteButton propertyId={apt.id} />
                                            <ShareButton title={apt.title} url={`/property/${apt.id}`} />
                                        </div>

                                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
                                            {(apt as any).isBestSeller && (
                                                <div className="bg-gold text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                    BEST SELLER
                                                </div>
                                            )}
                                            <SocialProof id={apt.id} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">{apt.title}</h3>
                                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
                                            <MapPin size={12} />
                                            <span>{apt.location}</span>
                                        </div>

                                        {/* Features Icons */}
                                        <div className="flex gap-3 mb-4 text-muted-foreground">
                                            <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                                                <Users size={12} />
                                                <span>{apt.guests}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                                                <Bed size={12} />
                                                <span>{apt.rooms}</span>
                                            </div>
                                            {(apt.amenities || []).slice(0, 2).map((am, i) => (
                                                <div key={i} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                                                    <Wifi size={12} />
                                                    <span>{am}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Urgency */}
                                        <div className="mb-3">
                                            <UrgencyTimer />
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-border mb-4" />

                                        {/* Price & Action */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xl font-bold text-foreground">₪{apt.price}</span>
                                                <span className="text-muted-foreground text-xs"> {t('night')}</span>
                                            </div>
                                            <span className="bg-primary text-black px-4 py-2 rounded-lg text-sm font-bold group-hover:bg-primary/90 transition-colors">
                                                {t('details')}
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <CompareCheckbox id={apt.id} />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No properties found.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
