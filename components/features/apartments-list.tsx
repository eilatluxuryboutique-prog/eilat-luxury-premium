'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Users, Bed, Wifi, MapPin, Star } from 'lucide-react';
import Image from 'next/image';

// Mock Data
const apartments = [
    {
        id: 1,
        title: "Royal Beach Penthouse",
        location: "North Beach, Eilat",
        price: 1200,
        rating: 4.9,
        guests: 6,
        rooms: 3,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2560&auto=format&fit=crop",
        features: ["Sea View", "Private Pool", "WiFi"]
    },
    {
        id: 2,
        title: "Desert Luxury Villa",
        location: "Shachamon, Eilat",
        price: 850,
        rating: 4.8,
        guests: 8,
        rooms: 4,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop",
        features: ["Mountain View", "Jacuzzi", "BBQ"]
    },
    {
        id: 3,
        title: "Lagoon Tech Apartment",
        location: "Marina, Eilat",
        price: 600,
        rating: 4.7,
        guests: 4,
        rooms: 2,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop",
        features: ["Smart Home", "Balcony", "Gym"]
    }
];

export default function ApartmentsList({ limit }: { limit?: number }) {
    const t = useTranslations('Featured');
    const displayedApartments = limit ? apartments.slice(0, limit) : apartments;

    return (
        <section className="py-16 bg-[#121212]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('title')}</h2>
                        <p className="text-neutral-400">{t('subtitle')}</p>
                    </div>
                    <button className="text-[#FFD700] font-medium hover:underline hidden md:block">
                        View All
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedApartments.map((apt, index) => (
                        <motion.div
                            key={apt.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-[#1E1E1E] rounded-2xl overflow-hidden border border-white/5 hover:border-[#FFD700]/50 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={apt.image}
                                    alt={apt.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 bg-[#FFD700] text-black px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                                    <Star size={12} fill="currentColor" />
                                    <span className="text-xs font-bold">{apt.rating}</span>
                                </div>
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs">
                                    Recommended
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-1 truncate">{apt.title}</h3>
                                <div className="flex items-center gap-1 text-neutral-400 text-xs mb-3">
                                    <MapPin size={12} />
                                    <span>{apt.location}</span>
                                </div>

                                {/* Features Icons */}
                                <div className="flex gap-3 mb-4 text-neutral-500">
                                    <div className="flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded">
                                        <Users size={12} />
                                        <span>{apt.guests}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded">
                                        <Bed size={12} />
                                        <span>{apt.rooms}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded">
                                        <Wifi size={12} />
                                        <span>Wifi</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-white/10 mb-4" />

                                {/* Price & Action */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xl font-bold text-white">₪{apt.price}</span>
                                        <span className="text-neutral-500 text-xs"> / night</span>
                                    </div>
                                    <button className="bg-[#FFD700] text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#E6C200] transition-colors">
                                        Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
