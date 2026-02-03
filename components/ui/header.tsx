'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Lock } from 'lucide-react';
import LanguageSwitcher from './language-switcher';
import MobileMenu from './mobile-menu';
import UserMenu from '../auth/user-menu';
import CartIcon from '../features/cart-icon';

export default function Header({ initialData }: { initialData?: any }) {
    const t = useTranslations('Navigation');

    // Use logo color from content or default to Gold (requested by user)
    const logoColorClass = initialData?.theme?.logoColor || 'text-gold-gradient';

    return (
        <header className="fixed top-0 w-full z-50 bg-black/10 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-white">
                    Eilat<span className={logoColorClass}>Luxury</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-8 items-center text-white/90">
                    <Link href="/" className="hover:text-blue-400 transition-colors">
                        {t('home')}
                    </Link>
                    <Link href="/apartments" className="hover:text-blue-400 transition-colors">
                        {t('apartments')}
                    </Link>
                    <Link href="/about" className="hover:text-blue-400 transition-colors">
                        {t('about')}
                    </Link>
                    <Link href="/contact" className="hover:text-blue-400 transition-colors">
                        {t('contact')}
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <UserMenu />
                    <CartIcon />
                    <LanguageSwitcher />
                    <MobileMenu />
                </div>
            </div>
        </header>
    );
}
