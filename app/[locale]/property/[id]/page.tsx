'use client';

import { properties } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Users, Bed, Wifi, Star, Check } from 'lucide-react';
import Link from 'next/link';

export default function PropertyPage({ params }: { params: { id: string } }) {
    const property = properties.find(p => p.id === params.id);

    if (!property) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#121212] text-white pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#FFD700] text-black text-xs font-bold px-2 py-1 rounded uppercase">
                                {property.type}
                            </span>
                            <div className="flex items-center gap-1 text-[#FFD700]">
                                <Star size={14} fill="currentColor" />
                                <span className="font-bold text-sm">{property.rating}</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{property.title}</h1>
                        <div className="flex items-center gap-2 text-neutral-400">
                            <MapPin size={18} />
                            <span>{property.location}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-[#FFD700]">₪{property.price}</div>
                        <div className="text-neutral-500 text-sm">per night</div>
                    </div>
                </div>

                {/* Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px] mb-12 rounded-2xl overflow-hidden">
                    <div className="md:col-span-2 relative h-full">
                        <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="hidden md:flex flex-col gap-4 h-full">
                        {property.images && property.images.length > 0 ? (
                            property.images.slice(0, 2).map((img, i) => (
                                <div key={i} className="relative flex-1 rounded-xl overflow-hidden">
                                    <Image src={img} alt="Gallery" fill className="object-cover" />
                                </div>
                            ))
                        ) : (
                            // Fallback if no gallery images
                            <>
                                <div className="relative flex-1 rounded-xl overflow-hidden bg-neutral-800" />
                                <div className="relative flex-1 rounded-xl overflow-hidden bg-neutral-800" />
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Description & Amenities */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">About this property</h2>
                        <p className="text-neutral-300 leading-relaxed mb-8 text-lg">
                            {property.description}
                        </p>

                        <h3 className="text-xl font-bold mb-4">Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                            {property.amenities.map(am => (
                                <div key={am} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl">
                                    <Check size={18} className="text-[#FFD700]" />
                                    <span>{am}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-8 border-t border-white/10 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-3 rounded-full">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-neutral-400">Guests</div>
                                    <div className="font-bold">{property.guests} Max</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-3 rounded-full">
                                    <Bed size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-neutral-400">Rooms</div>
                                    <div className="font-bold">{property.rooms} Bedrooms</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Card */}
                    <div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <span className="text-neutral-400">Total Price</span>
                                <div className="text-4xl font-bold text-[#FFD700] my-2">₪{property.price}</div>
                                <span className="text-neutral-400 block">+ taxes may apply</span>
                            </div>

                            <button className="w-full bg-[#FFD700] hover:bg-[#E6C200] text-black font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-[1.02] shadow-lg mb-4">
                                Book Now
                            </button>

                            <p className="text-center text-xs text-neutral-500">
                                You won't be charged yet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
