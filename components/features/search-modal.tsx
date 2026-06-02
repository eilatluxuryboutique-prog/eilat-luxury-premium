'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Search, X, Users, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { he } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const router = useRouter();
    const t = useTranslations('SearchForm');
    
    const [step, setStep] = useState<'location' | 'dates' | 'guests'>('dates');
    const [selectedRange, setSelectedRange] = useState<{ from: Date; to?: Date } | undefined>();
    const [guests, setGuests] = useState(2);
    const [propertyType, setPropertyType] = useState<string>('');
    const [amenities, setAmenities] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleAmenity = (amenity: string) => {
        setAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selectedRange?.from) params.set('start', selectedRange.from.toISOString().split('T')[0]);
        if (selectedRange?.to) params.set('end', selectedRange.to.toISOString().split('T')[0]);
        params.set('guests', guests.toString());
        if (propertyType) params.set('type', propertyType);
        if (amenities.length > 0) params.set('amenities', amenities.join(','));
        
        router.push(`/?${params.toString()}`);
        onClose();
    };

    const propertyTypes = [
        { id: 'apartment', label: 'דירה' },
        { id: 'villa', label: 'וילה' },
        { id: 'penthouse', label: 'פנטהאוז' },
        { id: 'hotel', label: 'מלון' }
    ];

    const availableAmenities = [
        { id: 'pool', label: 'בריכה' },
        { id: 'accessible', label: 'נגיש לנכים' },
        { id: 'jacuzzi', label: 'ג\'קוזי' },
        { id: 'sea_view', label: 'נוף לים' },
        { id: 'kitchen', label: 'מטבח מאובזר' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-[32px] w-full max-w-[900px] max-h-[90vh] shadow-2xl p-6 relative flex flex-col md:flex-row gap-4 border border-zinc-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 left-4 p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors z-10"
                    aria-label="סגור חיפוש"
                >
                    <X size={20} aria-hidden="true" />
                </button>

                {/* Left Side: Scrollable Filters & Calendar */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4 pb-20 md:pb-0">
                    
                    {/* Calendar */}
                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <CalendarIcon size={20} className="text-[#FF385C]" />
                            בחר תאריכים
                        </h3>
                        <div dir="ltr" className="flex justify-center overflow-x-auto">
                            <style>{`
                                .rdp { --rdp-accent-color: #FF385C; margin: 0; }
                                .rdp-day_selected { font-weight: bold; }
                                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 10px; }
                            `}</style>
                            <DayPicker
                                mode="range"
                                selected={selectedRange}
                                onSelect={setSelectedRange}
                                numberOfMonths={1}
                                locale={he}
                            />
                        </div>
                    </div>

                    {/* Guests (Moved here for mobile visibility) */}
                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Users size={20} className="text-[#FF385C]" />
                            אורחים
                        </h3>
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-zinc-700">מספר מתארחים</span>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                    className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:border-zinc-800 transition-colors"
                                    aria-label="הפחת אורחים"
                                >
                                    <span aria-hidden="true">-</span>
                                </button>
                                <span className="w-4 text-center font-bold" aria-live="polite">{guests}</span>
                                <button 
                                    onClick={() => setGuests(guests + 1)}
                                    className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:border-zinc-800 transition-colors"
                                    aria-label="הוסף אורחים"
                                >
                                    <span aria-hidden="true">+</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Property Types */}
                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                        <h3 className="text-lg font-bold mb-4">סוג נכס</h3>
                        <div className="flex flex-wrap gap-2">
                            {propertyTypes.map(pt => (
                                <button
                                    key={pt.id}
                                    onClick={() => setPropertyType(propertyType === pt.id ? '' : pt.id)}
                                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${propertyType === pt.id ? 'border-[#222222] bg-[#222222] text-white' : 'border-zinc-300 hover:border-[#222222] bg-white text-zinc-700'}`}
                                >
                                    {pt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                        <h3 className="text-lg font-bold mb-4">אפשרויות וסינונים</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {availableAmenities.map(am => (
                                <label key={am.id} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${amenities.includes(am.id) ? 'bg-[#222222] border-[#222222]' : 'border-zinc-300 group-hover:border-[#222222]'}`}>
                                        {amenities.includes(am.id) && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <span className="text-zinc-700 text-sm font-medium select-none">{am.label}</span>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={amenities.includes(am.id)}
                                        onChange={() => toggleAmenity(am.id)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Side: Search */}
                <div className="w-full md:w-[300px] flex flex-col gap-4 mt-auto md:mt-0 pt-4 md:pt-0 bg-white md:bg-transparent absolute md:relative bottom-0 left-0 right-0 p-4 md:p-0 border-t md:border-t-0 border-zinc-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex-1 hidden md:flex flex-col items-center justify-center text-center">
                        <Users size={32} className="text-zinc-300 mb-2" />
                        <span className="text-zinc-500 font-medium">בחר תאריכים, סוג נכס וכמות אורחים כדי למצוא את החופשה המושלמת.</span>
                    </div>

                    <button 
                        onClick={handleSearch}
                        className="w-full py-4 bg-[#FF385C] hover:bg-[#D90B42] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-pink-500/20"
                    >
                        <Search size={20} />
                        חיפוש מורחב
                    </button>
                </div>
            </div>
        </div>
    );
}
