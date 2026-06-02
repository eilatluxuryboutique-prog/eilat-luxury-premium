'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function NavigationLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mounted, setMounted] = useState(false);

    const t = useTranslations('Navigation');
    
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        
        setIsTransitioning(true);
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 1800); 

        return () => clearTimeout(timer);
    }, [pathname, searchParams, mounted]);

    if (!isTransitioning) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center transition-opacity duration-300">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <span className="text-[#FF385C]">
                    <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1.5l10 10v11h-20v-11l10-10zm0 3.328l-8 8v8.672h16v-8.672l-8-8z"/>
                    </svg>
                </span>
                <div className="flex flex-col items-center gap-2 text-center px-4">
                    <span className="text-[32px] font-bold text-[#FF385C] tracking-tight">
                        Eilat Luxury
                    </span>
                    <span className="text-[18px] md:text-[22px] font-semibold text-[#FF385C]">
                        {t('loader_text') || 'המקום למצוא בו את החופשה הבאה שלכם באילת'}
                    </span>
                </div>
            </div>
        </div>
    );
}
