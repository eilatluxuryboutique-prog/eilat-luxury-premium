'use client';

import { useTranslations } from 'next-intl';
import { Crown, Star } from 'lucide-react';

export default function LoyaltyCard({ points = 0, tier = 'classic' }: { points: number, tier: string }) {
    const t = useTranslations('Loyalty');

    const getTierColor = () => {
        switch (tier) {
            case 'silver': return 'bg-gray-300 text-black';
            case 'gold': return 'bg-gold text-black';
            case 'platinum': return 'bg-black border border-gold text-gold';
            default: return 'bg-white/10 text-white';
        }
    };

    return (
        <div className={`rounded-2xl p-6 ${getTierColor()} shadow-lg relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Crown size={100} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold uppercase tracking-widest">{tier} MEMBER</h3>
                        <p className="text-xs opacity-70">Eilat Luxury Club</p>
                    </div>
                    <Crown size={32} />
                </div>

                <div className="flex items-end gap-2 mt-8">
                    <span className="text-4xl font-black">{points}</span>
                    <span className="text-sm font-medium mb-1.5">{t('points') || 'Points'}</span>
                </div>

                <div className="mt-4 w-full bg-black/10 rounded-full h-1.5">
                    <div className="bg-current h-full rounded-full w-[70%]"></div>
                </div>
                <p className="text-xs mt-2 opacity-80">{1000 - points} points to next tier</p>
            </div>
        </div>
    );
}
