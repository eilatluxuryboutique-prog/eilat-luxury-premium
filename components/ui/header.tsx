'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Lock, Heart } from 'lucide-react';
import LanguageSwitcher from './language-switcher';
import MobileMenu from './mobile-menu';
import UserMenu from '../auth/user-menu';
import CartIcon from '../features/cart-icon';
import ThemeToggle from '../features/theme-toggle';
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

            <header className={`fixed top-[24px] left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/50 py-3' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="text-xl md:text-2xl font-bold text-foreground transition-colors">
                        Eilat<span className={logoColorClass}>Luxury</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-8 items-center text-foreground/90 font-medium">
                        <Link href="/" className="hover:text-primary transition-colors" aria-label="Go to Home Page">
                            {t('home')}
                        </Link>
                        <Link href="/apartments" className="hover:text-primary transition-colors" aria-label="View Apartments">
                            {t('apartments')}
                        </Link>
                        <Link href="/about" className="hover:text-primary transition-colors">
                            {t('about')}
                        </Link>
                        <Link href="/experiences" className="hover:text-primary transition-colors">
                            חוויות
                        </Link>
                        <Link href="/concierge" className="hover:text-primary transition-colors flex items-center gap-1">
                            <span className="text-gold">★</span> VIP
                        </Link>
                        <Link href="/blog" className="hover:text-primary transition-colors">
                            מגזין
                        </Link>
                        <Link href="/contact" className="hover:text-primary transition-colors">
                            {t('contact')}
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/wishlist" className="text-foreground/80 hover:text-red-500 transition-colors" aria-label="View Wishlist">
                                <Heart size={20} />
                            </Link>
                            <UserMenu aria-label="User Menu" />
                            <ThemeToggle aria-label="Toggle Theme" />
                            <CartIcon aria-label="View Cart" />
                        </div>
                        <div className="hidden md:block">
                            <WeatherWidget />
                        </div>
                        <LanguageSwitcher />
                        <MobileMenu />
                    </div>
                </div>
            </header>
        </>
    );
}
