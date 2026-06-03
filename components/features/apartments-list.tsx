'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { Property, properties as allProperties } from '@/lib/mock-data';
import { Link } from '@/navigation';
import FavoriteButton from '@/components/ui/favorite-button';

export default function ApartmentsList({ limit, items, isCarousel = false }: { limit?: number; items?: Property[]; isCarousel?: boolean }) {
    const t = useTranslations('Featured');
    const tSearch = useTranslations('SearchForm');
    const sourceData = items || allProperties;
    const displayedApartments = limit && limit > 0 ? sourceData.slice(0, limit) : sourceData;

    return (
        <section className="py-4 bg-white">
            <div className="max-w-none w-full px-6 md:px-10">
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {displayedApartments.length > 0 ? (
                        displayedApartments.map((apt) => (
                            <div key={apt.id} className="group flex flex-col cursor-pointer">
                                {/* Image Container */}
                                <Link href={`/property/${apt.id}`} className="block relative aspect-[20/19] overflow-hidden rounded-xl bg-zinc-200 mb-3">
                                    <Image
                                        src={apt.image || (apt.images && apt.images[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'}
                                        alt={apt.title}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Heart Button overlay */}
                                    <div className="absolute top-3 right-3 z-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                        <FavoriteButton propertyId={apt.id} />
                                    </div>
                                    {apt.rating > 4.8 && (
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#222222] px-2 py-1 rounded-full text-[11px] font-bold shadow-sm">
                                            {tSearch('guest_favorite') || 'מועדף על אורחים'}
                                        </div>
                                    )}
                                </Link>

                                {/* Text Details */}
                                <Link href={`/property/${apt.id}`} className="flex flex-col">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h3 className="font-semibold text-[15px] text-[#222222] truncate pr-2 leading-tight">{apt.location}</h3>
                                        <div className="flex items-center gap-1 shrink-0 text-[15px] text-[#222222]">
                                            <Star size={12} fill="currentColor" className="mb-[1px]" />
                                            <span>{apt.rating}</span>
                                        </div>
                                    </div>
                                    <span className="text-[#717171] text-[15px] truncate leading-tight">{apt.title}</span>
                                    <span className="text-[#717171] text-[15px] leading-tight">15-20 אוקטובר</span>
                                    <div className="mt-1.5 flex items-baseline gap-1">
                                        <span className="font-semibold text-[15px] text-[#222222]">₪{apt.price}</span>
                                        <span className="text-[#222222] text-[15px]">{t('night') || 'לילה'}</span>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-[#717171]">
                            לא נמצאו נכסים באזור זה.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
