'use client';

import { useState, useEffect } from 'react';
import { Home, Edit, Trash2 } from 'lucide-react';
import { Link } from '@/navigation';

interface PropertyListProps {
    serverProperties: any[];
}

export default function HostPropertyList({ serverProperties }: PropertyListProps) {
    // 1. Initialize State
    const [properties, setProperties] = useState<any[]>(serverProperties || []);

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
                                <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm py-2 rounded-lg transition-colors">מחק</button>
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
    );
}
