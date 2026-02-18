'use client';

import { MapPin, Navigation } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LocationMapProps {
    address: string;
    className?: string;
}

export default function LocationMap({ address, className }: LocationMapProps) {
    const t = useTranslations('Property');

    // Encode address for URL
    const encodedAddress = encodeURIComponent(address + ', Eilat, Israel');

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="text-gold" />
                    {t('location') || 'מיקום'}
                </h3>
                <a
                    href={`https://waze.com/ul?q=${encodedAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#33ccff]/10 hover:bg-[#33ccff]/20 text-[#33ccff] px-4 py-2 rounded-full transition-colors font-medium text-sm"
                >
                    <Navigation size={16} />
                    {t('waze') || 'נווט עם Waze'}
                </a>
            </div>

            <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-white/10 relative bg-neutral-900">
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
            </div>
            <p className="text-sm text-white/40 flex items-center gap-1">
                <MapPin size={12} />
                {address}
            </p>
        </div>
    );
}
