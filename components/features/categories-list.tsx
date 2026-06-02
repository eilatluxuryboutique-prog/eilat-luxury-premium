'use client';

import { Link } from '@/navigation';
import { Hotel, Home, Building2, Ticket, BriefcaseBusiness, Tag, Gem, SlidersHorizontal, Building } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export default function CategoriesList() {
    const t = useTranslations('Categories');
    const searchParams = useSearchParams();
    const currentType = searchParams.get('type') || 'apartment';

    const categories = [
        { id: 'vacation-apartments', label: t('vacation_apartments'), type: 'apartment', icon: Building },
        { id: 'villas', label: t('villas'), type: 'villa', icon: Home },
        { id: 'penthouses', label: t('penthouses'), type: 'penthouse', icon: Building2 },
        { id: 'luxury-apartments', label: t('luxury_apartments'), type: 'luxury-apartment', icon: Gem },
        { id: 'hotels', label: t('hotels'), type: 'hotel', icon: Hotel },
        { id: 'attractions', label: t('attractions'), type: 'attraction', icon: Ticket },
        { id: 'businesses', label: t('businesses'), type: 'business', icon: BriefcaseBusiness },
        { id: 'coupons', label: t('coupons'), type: 'coupon', icon: Tag },
    ];

    return (
        <section className="bg-white">
            <div className="max-w-none w-full px-6 md:px-10">
                <div className="flex items-center gap-4">
                    <div className="flex gap-8 overflow-x-auto pt-4 pb-0 scrollbar-hide items-center justify-start flex-1 border-none">
                        {categories.map((cat) => {
                            const isActive = currentType === cat.type;
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/?type=${cat.type}`}
                                    className={`flex flex-col items-center gap-2 min-w-max transition-colors group cursor-pointer pb-3 border-b-2 ${isActive ? 'text-[#000000] border-[#000000]' : 'text-[#717171] border-transparent hover:border-[#dddddd] hover:text-[#000000]'}`}
                                >
                                    <cat.icon size={24} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
                                    <span className="text-[12px] font-medium whitespace-nowrap">{cat.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                    {/* Filters button */}
                    <div className="hidden md:flex items-center gap-2 border border-[#dddddd] rounded-xl px-4 py-2 hover:border-[#222222] cursor-pointer bg-white transition-colors mb-3">
                        <SlidersHorizontal size={14} className="text-[#222222]" />
                        <span className="text-[12px] font-medium text-[#222222]">{t('filters') || 'סינונים'}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
