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

            <header className={`fixed top-[24px] left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-zinc-100 py-3 shadow-lg' : 'bg-transparent py-5'}`}>
                <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="text-lg md:text-xl font-black text-foreground transition-all hover:scale-105 shrink-0">
                        Eilat<span className="text-[#FFD700]">Luxury</span>
                    </Link>

                    {/* Desktop Navigation - Optimized Spacing */}
                    <nav className="hidden lg:flex gap-6 xl:gap-10 items-center text-zinc-900 font-bold text-sm uppercase tracking-wide">
                        <Link href="/" className="hover:text-gold transition-colors relative group">
                            {t('home')}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/apartments" className="hover:text-gold transition-colors relative group">
                            {t('apartments')}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/experiences" className="hover:text-gold transition-colors relative group">
                            חוויות
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/concierge" className="hover:text-gold transition-colors flex items-center gap-1 relative group">
                            <span className="text-gold">★</span> VIP
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/blog" className="hover:text-gold transition-colors relative group">
                            מגזין
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
                        </Link>
                        <Link href="/contact" className="hover:text-gold transition-colors relative group">
                            {t('contact')}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
                        </Link>
                    </nav>

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
