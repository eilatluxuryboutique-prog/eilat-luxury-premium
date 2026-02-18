'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Search, Home, MoreVertical, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/navigation';

export default function PropertiesTab() {
    const [properties, setProperties] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProperty, setSelectedProperty] = useState<any>(null); // For Calendar Modal
    const [blockedDates, setBlockedDates] = useState<string[]>([]); // Temp state for modal
    const [blockedDatesInput, setBlockedDatesInput] = useState('');

    // Fetch properties
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                // Fetch from API
                const res = await fetch('/api/properties');
                const data = await res.json();
                let serverProps = data.properties || [];

                // Merge with LocalStorage Demo Properties (Same logic as Host Dashboard)
                // This allows Admin to see what Host (Self) uploaded in Demo Mode
                try {
                    const localSaved = localStorage.getItem('demo_properties');
                    if (localSaved) {
                        const localProps = JSON.parse(localSaved).filter((p: any) => p && p.title);
                        // Deduplicate
                        const uniqueLocal = localProps.filter((lp: any) =>
                            !serverProps.some((sp: any) => sp.id === lp.id || sp._id === lp.id)
                        );
                        serverProps = [...uniqueLocal, ...serverProps];
                    }
                } catch (e) {
                    console.error("Local storage read error", e);
                }

                setProperties(serverProps);
            } catch (error) {
                console.error("Failed to fetch properties", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        // Optimistic update
        setProperties(prev => prev.filter(p => p.id !== id && p._id !== id));

        // Also remove from localStorage if it exists there
        try {
            const current = JSON.parse(localStorage.getItem('demo_properties') || '[]');
            const updated = current.filter((p: any) => p.id !== id);
            localStorage.setItem('demo_properties', JSON.stringify(updated));
        } catch (e) { }

        // Call API (will likely fail or mock success)
        try {
            await fetch(`/api/properties?id=${id}`, { method: 'DELETE' });
        } catch (e) { }
    };

    const openCalendar = (property: any) => {
        setSelectedProperty(property);
        // Load blocked dates for this property from local storage (mock persistence)
        const savedDates = localStorage.getItem(`blocked_dates_${property.id || property._id}`);
        setBlockedDates(savedDates ? JSON.parse(savedDates) : []);
    };

    const handleBlockDate = () => {
        if (!blockedDatesInput) return;
        // Simple date string add
        const newDates = [...blockedDates, blockedDatesInput];
        setBlockedDates(newDates);

        // Save
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

    const filteredProperties = properties.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header / Actions */}
            <div className="flex justify-between items-center bg-[#1E1E1E] p-4 rounded-xl border border-white/10">
                <div className="relative w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                        type="text"
                        placeholder="חיפוש נכסים..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pr-10 pl-4 text-white text-sm focus:border-gold outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Link href="/host/add-property" className="bg-gold hover:bg-gold-light text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-sm">
                    <Plus size={18} /> הוסף נכס
                </Link>
            </div>

            {/* List */}
            <div className="bg-[#1E1E1E] rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-white/5 text-white/60 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">נכס</th>
                            <th className="px-6 py-4">מיקום</th>
                            <th className="px-6 py-4">מחיר</th>
                            <th className="px-6 py-4">סטטוס</th>
                            <th className="px-6 py-4">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-white/50">טוען נכסים...</td></tr>
                        ) : filteredProperties.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-white/50">לא נמצאו נכסים.</td></tr>
                        ) : (
                            filteredProperties.map((property: any) => (
                                <tr key={property.id || property._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-gray-700 overflow-hidden shrink-0">
                                                {property.images?.[0] ? <img src={property.images[0]} className="w-full h-full object-cover" /> : <Home className="m-2 text-white/20" />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{property.title || 'Untitled'}</div>
                                                <div className="text-xs text-white/40">{property.type}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white/80 text-sm">{property.location || 'אילת'}</td>
                                    <td className="px-6 py-4 text-white/80 text-sm">₪{property.price || property.pricePerNight}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${property.isDemo ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                                            {property.isDemo ? 'Demo' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openCalendar(property)}
                                                className="p-2 hover:bg-white/10 rounded text-blue-400"
                                                title="ניהול יומן"
                                            >
                                                <Calendar size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(property.id || property._id)}
                                                className="p-2 hover:bg-white/10 rounded text-red-400"
                                                title="מחק נכס"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Calendar Modal */}
            {selectedProperty && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
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
                                className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg font-medium transition-colors"
                            >
                                חסום תאריך
                            </button>
                        </div>

                        {/* List Blocked Dates */}
                        <div>
                            <h3 className="text-sm font-medium text-white/80 mb-3">תאריכים חסומים:</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {blockedDates.length === 0 ? (
                                    <p className="text-white/30 text-sm italic">אין תאריכים חסומים.</p>
                                ) : (
                                    blockedDates.map((date, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                            <span className="text-white text-sm">{date}</span>
                                            <button onClick={() => removeDate(date)} className="text-red-400 hover:text-red-300 text-xs">הסר</button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 text-right">
                            <button
                                onClick={() => setSelectedProperty(null)}
                                className="bg-gold text-black font-bold py-2 px-6 rounded-lg"
                            >
                                שמור וסגור
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
