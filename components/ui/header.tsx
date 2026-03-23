'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Lock, Heart } from 'lucide-react';
import LanguageSwitcher from './language-switcher';
import MobileMenu from './mobile-menu';
import UserMenu from '../auth/user-menu';
import CartIcon from '../features/cart-icon';
import WeatherWidget from './weather-widget';

export default function Header({ initialData }: { initialData?: any }) {
    const t = useTranslations('Navigation');
    const [isScrolled, setIsScrolled] = useState(false);

    // Use logo color from content or default to Gold (requested by user)
    const logoColorClass = initialData?.theme?.logoColor || 'text-gold-gradient';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Legal Disclaimer / Beta Banner - Protection from liability */}
            <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600/90 text-white text-xs py-1 text-center font-bold px-4 shadow-md" dir="rtl">
                ⚠️ אתר זה נמצא בשלבי פיתוח (BETA). הנכסים המוצגים הם להדגמה בלבד ואינם זמינים להזמנה אמיתית.
            </div>

            <header className={`fixed top-[24px] left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-zinc-100 py-3 shadow-sm' : 'bg-white border-b border-zinc-100 py-3 shadow-md'}`}>
                <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="text-lg md:text-xl font-black text-foreground transition-all hover:scale-105 shrink-0">
                        Eilat<span className="text-[#FFD700]">Luxury</span>
                    </Link>

                    {/* Desktop Navigation removed as per new layout. Navigation moved to hamburger menu. */}

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="hidden sm:flex items-center gap-4">
                            <Link href="/wishlist" className="text-zinc-400 hover:text-red-500 transition-colors p-2 hover:bg-zinc-50 rounded-full" aria-label="View Wishlist">
                                <Heart size={22} />
                            </Link>
                            <UserMenu />
                            <CartIcon />
                        </div>
                        <div className="hidden xl:block">
                            <WeatherWidget />
                        </div>
                        <div className="flex items-center gap-2">
                            <LanguageSwitcher isScrolled={isScrolled} />
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
