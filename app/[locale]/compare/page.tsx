"use client";

import { useCompare } from '@/components/features/compare-context';
import { properties } from '@/lib/mock-data';
import { Link } from '@/navigation';
import Image from 'next/image';
import { Check, X, MapPin, Users, Bed, Wifi, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComparePage() {
    const { selectedIds, toggleProperty, clearComparison } = useCompare();
    const selectedProperties = properties.filter(p => selectedIds.includes(p.id));

    if (selectedProperties.length === 0) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">לא נבחרו נכסים להשוואה</h1>
                    <p className="text-white/60 mb-8">אנא סמנו נכסים מדף החיפוש או דף הבית כדי להשוות ביניהם.</p>
                    <Link href="/" className="bg-gold text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
                        חזרה לדף הבית
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] pt-28 pb-20 px-4 md:px-8">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-5xl font-black text-white">השוואת נכסים</h1>
                    <button onClick={clearComparison} className="text-red-400 hover:text-red-300 text-sm font-medium underline">
                        נקה הכל
                    </button>
                </div>

                <div className="overflow-x-auto pb-8">
                    <div className="min-w-[800px] grid grid-cols-[200px_repeat(3,1fr)] gap-4">
                        {/* Labels Column */}
                        <div className="space-y-4 pt-64">
                            <div className="h-12 flex items-center text-white/50 font-medium px-4 border-b border-white/5">מחיר ללילה</div>
                            <div className="h-12 flex items-center text-white/50 font-medium px-4 border-b border-white/5">דירוג גולשים</div>
                            <div className="h-12 flex items-center text-white/50 font-medium px-4 border-b border-white/5">מיקום</div>
                            <div className="h-12 flex items-center text-white/50 font-medium px-4 border-b border-white/5">אורחים</div>
                            <div className="h-12 flex items-center text-white/50 font-medium px-4 border-b border-white/5">חדרים</div>
                            <div className="h-auto min-h-[100px] flex items-start pt-4 text-white/50 font-medium px-4 border-b border-white/5">אביזרים</div>
                            <div className="h-12 px-4"></div> {/* Action Spacer */}
                        </div>

                        {/* Property Columns */}
                        {selectedProperties.map((prop, index) => (
                            <motion.div
                                key={prop.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5 relative"
                            >
                                <button
                                    onClick={() => toggleProperty(prop.id)}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full z-10 transition-colors"
                                >
                                    <X size={16} />
                                </button>

                                {/* Header Card */}
                                <div className="h-64 relative">
                                    <Image src={prop.image} alt={prop.title} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 right-4 left-4">
                                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{prop.title}</h3>
                                        <p className="text-gold text-xs uppercase tracking-wider">{prop.type}</p>
                                    </div>
                                </div>

                                {/* Data Rows */}
                                <div className="space-y-4">
                                    <div className="h-12 flex items-center px-6 text-2xl font-bold text-white border-b border-white/5">
                                        ₪{prop.price}
                                    </div>
                                    <div className="h-12 flex items-center px-6 text-white border-b border-white/5">
                                        <div className="flex items-center gap-1 bg-gold/10 text-gold px-2 py-1 rounded-lg">
                                            <Star size={14} fill="currentColor" />
                                            <span className="font-bold">{prop.rating}</span>
                                        </div>
                                    </div>
                                    <div className="h-12 flex items-center px-6 text-white/80 border-b border-white/5 text-sm">
                                        <MapPin size={16} className="ml-2 text-white/40" />
                                        {prop.location}
                                    </div>
                                    <div className="h-12 flex items-center px-6 text-white/80 border-b border-white/5">
                                        <Users size={16} className="ml-2 text-white/40" />
                                        {prop.guests}
                                    </div>
                                    <div className="h-12 flex items-center px-6 text-white/80 border-b border-white/5">
                                        <Bed size={16} className="ml-2 text-white/40" />
                                        {prop.rooms}
                                    </div>
                                    <div className="h-auto min-h-[100px] p-6 border-b border-white/5">
                                        <div className="flex flex-wrap gap-2">
                                            {prop.amenities.map(am => (
                                                <span key={am} className="text-xs bg-white/5 px-2 py-1 rounded text-white/70">
                                                    {am}
                                                </span>
                                            ))}
                                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">WIFI</span>
                                            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">מיזוג</span>
                                        </div>
                                    </div>
                                    <div className="h-20 flex items-center px-6 pb-6">
                                        <Link href={`/property/${prop.id}`} className="w-full bg-white text-black font-bold py-3 rounded-xl text-center hover:bg-gold transition-colors block">
                                            הזמן עכשיו
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
