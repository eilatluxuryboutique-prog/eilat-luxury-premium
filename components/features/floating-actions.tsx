'use client';

import { MessageCircle, Car, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FloatingActions() {
    const [show, setShow] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openWhatsApp = () => {
        window.open('https://wa.me/972501234567?text=Hi, available apartments?', '_blank');
    };

    const openTaxi = () => {
        // Deeplink to Gett or Web fallback
        window.open('https://gett.com/il/', '_blank');
    };

    // Hide on admin/host pages
    if (pathname?.includes('/admin') || pathname?.includes('/host')) return null;

    return (
        <div className="fixed bottom-32 left-6 z-50 flex flex-col gap-3 items-center" dir="rtl">
            {/* Scroll Top */}
            <button
                onClick={scrollToTop}
                className={`w-10 h-10 bg-black/80 backdrop-blur text-white rounded-full shadow-lg border border-white/10 flex items-center justify-center transition-all ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            >
                <ArrowUp size={18} />
            </button>
        </div>
    );
}
