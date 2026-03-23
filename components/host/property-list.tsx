'use client';

import { useState, useEffect } from 'react';
import { Home, Edit, Trash2, Calendar, X } from 'lucide-react';
import { Link } from '@/navigation';

interface PropertyListProps {
    serverProperties: any[];
}

export default function HostPropertyList({ serverProperties }: PropertyListProps) {
    // 1. Initialize State
    const [properties, setProperties] = useState<any[]>(serverProperties || []);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [blockedDates, setBlockedDates] = useState<string[]>([]);
    const [blockedDatesInput, setBlockedDatesInput] = useState('');

    // 2. Load Local Data on Mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('demo_properties');
            if (saved) {
                const localProps = JSON.parse(saved);
                // Filter invalid
                const validLocal = localProps.filter((p: any) => p && p.title && p.id);

                // Deduplicate
                const uniqueLocal = validLocal.filter((lp: any) =>
                    !serverProperties.some(sp => sp._id === lp.id || sp.id === lp.id)
                );

                // Merge: Local first, then server
                setProperties([...uniqueLocal, ...serverProperties]);
            }
        } catch (e) {
            console.error("Error loading demo properties:", e);
        }
    }, [serverProperties]);

    const openCalendar = (property: any) => {
        setSelectedProperty(property);
        const id = property.id || property._id;
        const savedDates = localStorage.getItem(`blocked_dates_${id}`);
        setBlockedDates(savedDates ? JSON.parse(savedDates) : []);
    };

    const handleBlockDate = () => {
        if (!blockedDatesInput) return;
        const newDates = [...blockedDates, blockedDatesInput];
        setBlockedDates(newDates);
        const id = selectedProperty.id || selectedProperty._id;
        localStorage.setItem(`blocked_dates_${id}`, JSON.stringify(newDates));
        setBlockedDatesInput('');
    };

    const removeDate = (dateToRemove: string) => {
        const newDates = blockedDates.filter(d => d !== dateToRemove);
        setBlockedDates(newDates);
        const id = selectedProperty.id || selectedProperty._id;
        localStorage.setItem(`blocked_dates_${id}`, JSON.stringify(newDates));
    };

    // 3. Fallback UI if empty
    if (!properties || properties.length === 0) {
        return (
            <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-12 text-center text-white/50">
                <Home size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-4">עדיין לא הוספת נכסים.</p>
                <Link href="/host/add-property" className="text-gold hover:underline">
                    צור את הנכס הראשון שלך
                </Link>

                {/* Debug Info */}
                <div className="mt-8 text-xs text-white/20 font-mono">
                    System Status: Active <br />
                    Server returned: {serverProperties?.length || 0} items
                </div>
            </div>
        );
    }

    // 4. Render Grid
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property: any, index: number) => {
                    if (!property) return null;
                    const images = property.images || [];
                    const price = property.price || property.pricePerNight || 0;
                    const id = property.id || property._id || `prop-${index}`;

                    return (
                        <div key={id} className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-white/10 group hover:border-gold/50 transition-colors relative">
                            {/* Image Section */}
                            <div className="h-48 bg-gray-800 relative">
                                {images[0] ? (
                                    <img src={images[0]} alt={property.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20">NO IMAGE</div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-bold">
                                    ₪{price} / ללילה
                                </div>
                                {property.isDemo && (
                                    <div className="absolute top-2 left-2 bg-yellow-500/80 text-black px-2 py-1 rounded text-xs font-bold">
                                        DEMO
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-4">
                                <h3 className="text-white font-bold text-lg mb-1 truncate">{property.title || 'Untitled Property'}</h3>
                                <p className="text-white/50 text-sm mb-4 line-clamp-2">{property.description || 'No description available'}</p>

                                {/* Amenities Badges */}
                                {property.amenities && property.amenities.length > 0 && (
                                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {property.amenities.slice(0, 3).map((am: string) => (
                                            <span key={am} className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/60 whitespace-nowrap">
                                                {am === 'wifi' ? 'WiFi' : am}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link href={`/host/edit-property/${id}`} className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm py-2 rounded-lg transition-colors text-center inline-block">
                                        ערוך
                                    </Link>
                                    <button
                                        onClick={() => openCalendar(property)}
                                        className="flex-1 bg-gold/10 hover:bg-gold/20 text-gold text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Calendar size={14} /> יומן
                                    </button>
                                    <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Diagnostics Footer */}
                <div className="col-span-full mt-8 p-4 bg-black/50 rounded border border-white/5 text-xs text-white/30 font-mono">
                    Running Diagnostics: <br />
                    Server Properties: {serverProperties?.length || 0} <br />
                    Local Properties: {properties.length - (serverProperties?.length || 0)} <br />
                    Total Displayed: {properties.length}
                </div>
            </div>

            {/* Calendar Modal */}
            {selectedProperty && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <div className="bg-[#1E1E1E] w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl relative">
                        <button
                            onClick={() => setSelectedProperty(null)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-1">ניהול זמינות</h2>
                        <p className="text-white/50 text-sm mb-6">עבור: {selectedProperty.title}</p>

                        {/* Add Date */}
                        <div className="flex gap-2 mb-6">
                            <input
                                type="date"
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                                value={blockedDatesInput}
                                onChange={e => setBlockedDatesInput(e.target.value)}
                            />
                            <button
                                onClick={handleBlockDate}
                                className="bg-gold text-black px-4 rounded-lg font-bold transition-colors text-sm"
                            >
                                חסום
                            </button>
                        </div>

                        {/* List Blocked Dates */}
                        <div>
                            <h3 className="text-sm font-bold text-white/80 mb-3">תאריכים חסומים:</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {blockedDates.length === 0 ? (
                                    <p className="text-white/30 text-sm italic">אין תאריכים חסומים.</p>
                                ) : (
                                    blockedDates.map((date, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                            <span className="text-white text-sm font-mono">{date}</span>
                                            <button onClick={() => removeDate(date)} className="text-red-400 hover:text-red-300 text-xs font-bold">הסר</button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSelectedProperty(null)}
                                className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                ביטול
                            </button>
                            <button
                                onClick={() => setSelectedProperty(null)}
                                className="bg-gold hover:bg-gold-light text-black font-bold py-3 rounded-xl transition-colors shadow-lg shadow-gold/20"
                            >
                                שמור שינויים
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
