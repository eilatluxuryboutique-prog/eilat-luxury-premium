'use client';

import { Link } from '@/navigation';
import { Search, Globe, Menu, UserCircle } from 'lucide-react';
import LanguageSwitcher from './language-switcher';
import UserMenu from '../auth/user-menu';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import SearchModal from '../features/search-modal';

export default function Header({ initialData }: { initialData?: any }) {
    const logoColorClass = 'text-[#FF385C]';
    const tSearch = useTranslations('SearchForm');
    const tAuth = useTranslations('Auth');
    const locale = useLocale();
    const [scrolled, setScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        const handleOpenSearch = () => setIsSearchOpen(true);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('openSearchModal', handleOpenSearch);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('openSearchModal', handleOpenSearch);
        };
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#ebebeb]">
                <div className="mx-auto px-4 md:px-6 xl:px-10 py-3 md:py-0 md:h-[80px] flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
                    
                    <div className="w-full flex items-center justify-between md:w-auto md:flex-1">
                        {/* Logo Section */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-[#FF385C]">
                                <svg width="24" height="24" className="md:w-8 md:h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 1.5l10 10v11h-20v-11l10-10zm0 3.328l-8 8v8.672h16v-8.672l-8-8z"/>
                                </svg>
                            </span>
                            <span className="text-[18px] md:text-[22px] font-bold text-[#FF385C] block tracking-tight leading-none whitespace-nowrap">
                                Eilat Luxury
                            </span>
                        </Link>

                        {/* User Actions (Mobile only shows menu if needed, but we have bottom nav, so hide all on mobile) */}
                        <div className="flex md:hidden items-center">
                            <div className="flex p-2.5 rounded-full cursor-pointer transition-colors items-center justify-center relative" aria-label="החלף שפה" role="button" tabIndex={0}>
                                <Globe size={20} className="text-[#222222]" aria-hidden="true" />
                                <div className="absolute inset-0 opacity-0 overflow-hidden"><LanguageSwitcher isScrolled={scrolled} /></div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar - Airbnb Style Pill */}
                    <div className="w-full md:flex-auto md:max-w-[400px]">
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="w-full flex items-center justify-between md:justify-start bg-white border border-[#dddddd] rounded-full py-2.5 md:py-2 px-3 md:px-2 shadow-[0_3px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-200"
                            aria-label="חיפוש חופשה"
                        >
                            {/* Mobile View Search Pill Text */}
                            <div className="flex items-center gap-3 md:hidden pl-2">
                                <Search size={20} className="text-[#222222]" />
                                <div className="flex flex-col items-start">
                                    <span className="text-[14px] font-bold text-[#222222] leading-tight">חיפוש</span>
                                </div>
                            </div>

                            {/* Desktop View Search Pill Text */}
                            <div className="hidden md:flex items-center w-full justify-between">
                                <span className="px-3 md:px-4 text-[13px] md:text-[14px] font-semibold text-[#222222] truncate">{tSearch('anywhere')}</span>
                                <span className="w-[1px] h-6 bg-[#dddddd]"></span>
                                <span className="px-3 md:px-4 text-[13px] md:text-[14px] font-semibold text-[#222222] truncate">{tSearch('any_week')}</span>
                                <span className="w-[1px] h-6 bg-[#dddddd]"></span>
                                
                                <div className="flex items-center pl-2 md:pl-4 pr-1 gap-1 md:gap-2 justify-between w-auto">
                                    <span className="text-[13px] md:text-[14px] font-normal text-[#717171] truncate block">חיפוש...</span>
                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#FF385C] flex items-center justify-center text-white flex-shrink-0" aria-hidden="true">
                                        <Search size={14} strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* User Actions Desktop */}
                    <div className="hidden md:flex flex-1 items-center justify-end gap-1 min-w-[200px]">
                        <Link href="/host/join" className="text-[14px] font-semibold text-[#222222] hover:bg-[#f7f7f7] px-4 py-3 rounded-full transition-colors" aria-label="פרסם נכס">
                            {tAuth('list_asset')}
                        </Link>
                        
                        <div className="flex hover:bg-[#f7f7f7] p-2.5 rounded-full cursor-pointer transition-colors items-center justify-center relative" aria-label="החלף שפה" role="button" tabIndex={0}>
                            <Globe size={18} className="text-[#222222]" aria-hidden="true" />
                            <div className="absolute inset-0 opacity-0"><LanguageSwitcher isScrolled={scrolled} /></div>
                        </div>

                        <div className="ml-2 z-50">
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </header>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
