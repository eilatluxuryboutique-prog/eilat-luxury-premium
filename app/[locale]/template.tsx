'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        
        // Show loader on route change
        setIsTransitioning(true);
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 800); // 800ms of the pulsing logo

        return () => clearTimeout(timer);
    }, [pathname, searchParams, mounted]);

    return (
        <>
            {isTransitioning && (
                <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-300">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <span className="text-[#FF385C]">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1.5l10 10v11h-20v-11l10-10zm0 3.328l-8 8v8.672h16v-8.672l-8-8z"/>
                            </svg>
                        </span>
                        <span className="text-[28px] font-bold text-[#FF385C] tracking-tight">
                            Eilat Luxury
                        </span>
                    </div>
                </div>
            )}
            {children}
        </>
    );
}
