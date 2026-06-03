'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import { Property } from '@/lib/mock-data';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import FavoriteButton from '@/components/ui/favorite-button';

export default function MobilePropertyScroller({ title, properties, subtitle }: { title: string, properties: Property[], subtitle?: string }) {
    const tSearch = useTranslations('SearchForm');
    
    if (!properties || properties.length === 0) return null;

    return (
        <section className="md:hidden py-4 bg-white border-b border-gray-100 last:border-b-0">
            <div className="px-5 mb-3">
                <h2 className="text-[17px] md:text-[22px] font-bold text-[#222222] tracking-tight">{title}</h2>
                {subtitle && <p className="text-[12px] text-[#717171] leading-tight mt-1">{subtitle}</p>}
            </div>
            
            <div className="flex gap-3 overflow-x-auto px-5 pb-4 snap-x snap-mandatory scrollbar-hide">
                {properties.map((apt) => (
                    <div key={apt.id} className="snap-start snap-always shrink-0 w-[42vw] sm:w-[160px] group flex flex-col cursor-pointer">
                        {/* Image Container */}
                        <Link href={`/property/${apt.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-[12px] bg-zinc-200 mb-2">
                            <Image
                                src={apt.image || (apt.images && apt.images[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'}
                                alt={apt.title}
                                fill
                                className="object-cover"
                            />
                            {/* Heart Button overlay */}
                            <div className="absolute top-2 right-2 z-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                <FavoriteButton propertyId={apt.id} />
                            </div>
                            {apt.rating > 4.8 && (
                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[#222222] px-1.5 py-0.5 rounded-sm text-[9px] font-bold shadow-sm">
                                    {tSearch('guest_favorite') || 'מועדף'}
                                </div>
                            )}
                        </Link>

                        {/* Text Details */}
                        <Link href={`/property/${apt.id}`} className="flex flex-col px-0.5">
                            <h3 className="font-semibold text-[12px] text-[#222222] truncate leading-tight mb-0.5">{apt.title} | {apt.location.split(',')[0]}</h3>
                            <div className="flex items-center text-[#717171] text-[12px] leading-tight mt-0.5 gap-1 truncate">
                                <span className="font-semibold text-[#222222] truncate">₪{apt.price}</span> סה"כ • <Star size={9} fill="currentColor" className="ml-[-2px] inline-block mb-[1px]" /> <span className="truncate">{apt.rating}</span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
