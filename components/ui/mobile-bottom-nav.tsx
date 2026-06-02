'use client';

import { Link } from '@/navigation';
import { usePathname } from 'next/navigation';
import { Search, Heart, Map, MessageCircle, UserCircle2 } from 'lucide-react';

export default function MobileBottomNav() {
    const pathname = usePathname();
    
    // Using hardcoded Hebrew as requested "שכל האתר יהיה בעברית"
    const tabs = [
        {
            id: 'search',
            label: 'חיפוש',
            icon: Search,
            href: '/',
            isActive: pathname === '/' || pathname === '/he' || pathname === '/en' || pathname.startsWith('/he/search')
        },
        {
            id: 'wishlists',
            label: 'רשימות משאלות',
            icon: Heart,
            href: '/wishlists',
            isActive: pathname.includes('/wishlists')
        },
        {
            id: 'trips',
            label: 'נסיעות',
            icon: Map,
            href: '/trips',
            isActive: pathname.includes('/trips')
        },
        {
            id: 'messages',
            label: 'הודעות',
            icon: MessageCircle,
            href: '/messages',
            isActive: pathname.includes('/messages')
        },
        {
            id: 'profile',
            label: 'פרופיל',
            icon: UserCircle2,
            href: '/profile',
            isActive: pathname.includes('/profile') || pathname.includes('/login') || pathname.includes('/dashboard')
        }
    ];

    return (
        <div 
            className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EBEBEB] z-[100]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            dir="rtl"
        >
            <div className="flex justify-around items-center h-[65px] px-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <Link 
                            key={tab.id}
                            href={tab.href}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${tab.isActive ? 'text-[#FF385C]' : 'text-[#717171] hover:text-[#222222]'}`}
                        >
                            <Icon size={24} strokeWidth={tab.isActive ? 2.5 : 2} className={tab.isActive ? 'text-[#FF385C]' : 'text-[#B0B0B0]'} />
                            <span className="text-[10px] font-medium tracking-tight mt-[2px]">{tab.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
