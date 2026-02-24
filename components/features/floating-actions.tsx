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
        <div className="fixed bottom-24 left-6 z-50 flex flex-col gap-3 items-center" dir="rtl">
            {/* Taxi Button */}
            <button
                onClick={openTaxi}
                className="w-12 h-12 bg-yellow-400 text-black rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                title="Order Taxi"
            >
                <Car size={20} />
            </button>

            {/* WhatsApp Button */}
            <button
                onClick={openWhatsApp}
                className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform animate-bounce-subtle"
                title="Chat with us"
            >
                <MessageCircle size={28} />
            </button>

            {/* Scroll Top */}
            <button
                onClick={scrollToTop}
                className={`w-10 h-10 bg-black/80 backdrop-blur text-white rounded-full shadow-lg flex items-center justify-center transition-all ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
            >
                <ArrowUp size={18} />
            </button>
        </div>
    );
}
