'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import SearchModal from './search-modal';

export default function MobileSearchPill() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <div className="md:hidden px-4 pt-4 pb-2 bg-white sticky top-[60px] z-[45]">
                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="w-full bg-white rounded-full flex items-center justify-center gap-3 py-3.5 shadow-[0_3px_10px_rgb(0,0,0,0.1)] border border-gray-100"
                >
                    <Search size={20} className="text-[#222222]" />
                    <span className="text-[15px] font-bold text-[#222222] tracking-tight">להתחיל לחפש</span>
                </button>
            </div>
            
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
