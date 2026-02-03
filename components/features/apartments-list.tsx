'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Users, Bed, Wifi, MapPin, Star } from 'lucide-react';
import Image from 'next/image';

import { Property, properties as allProperties } from '@/lib/mock-data';

import { Link } from '@/navigation';

// ... imports

export default function ApartmentsList({ limit, items }: { limit?: number; items?: Property[] }) {
    const t = useTranslations('Featured');
    const sourceData = items || allProperties;
    const displayedApartments = limit ? sourceData.slice(0, limit) : sourceData;

    return (
        <section className="py-16 bg-background transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('title')}</h2>
                        <p className="text-muted-foreground">{t('subtitle')}</p>
                    </div>
                    <Link href="/search" className="text-primary font-medium hover:underline hidden md:block">
                        View All
                    </Link>
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
                            className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 shadow-sm"
                        >
                            <Link href={`/property/${apt.id}`} className="block h-full">
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={apt.image}
                                        alt={apt.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-primary text-black px-2 py-1 rounded-md flex items-center gap-1 shadow-lg z-10">
                                        <Star size={12} fill="currentColor" />
                                        <span className="text-xs font-bold">{apt.rating}</span>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-md text-xs z-10 font-bold">
                                        {t('recommended')}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">{apt.title}</h3>
                                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
                                        <MapPin size={12} />
                                        <span>{apt.location}</span>
                                    </div>

                                    {/* Features Icons */}
                                    <div className="flex gap-3 mb-4 text-muted-foreground">
                                        <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                                            <Users size={12} />
                                            <span>{apt.guests}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                                            <Bed size={12} />
                                            <span>{apt.rooms}</span>
                                        </div>
                                        {apt.amenities.slice(0, 2).map((am, i) => (
                                            <div key={i} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                                                <Wifi size={12} />
                                                <span>{am}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-border mb-4" />

                                    {/* Price & Action */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xl font-bold text-foreground">₪{apt.price}</span>
                                            <span className="text-muted-foreground text-xs"> {t('night')}</span>
                                        </div>
                                        <span className="bg-primary text-black px-4 py-2 rounded-lg text-sm font-bold group-hover:bg-primary/90 transition-colors">
                                            {t('details')}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
