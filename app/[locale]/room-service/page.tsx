'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ShoppingBag, Coffee, Wine, Bath } from 'lucide-react';

const services = [
    { id: 1, name: 'Champagne Bottle', price: 250, icon: Wine, image: 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?q=80&w=800' },
    { id: 2, name: 'Breakfast for Two', price: 180, icon: Coffee, image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=800' },
    { id: 3, name: 'Spa Set (Towels + Oil)', price: 120, icon: Bath, image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800' },
];

export default function RoomServicePage() {
    const [cart, setCart] = useState<any[]>([]);

    const addToOrder = (item: any) => {
        setCart([...cart, item]);
    };

    const handleOrder = () => {
        const message = `Hi, I would like to order: ${cart.map(i => i.name).join(', ')} to my room.`;
        window.open(`https://wa.me/972501234567?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-24">
            <div className="relative h-60">
                <Image
                    src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2000"
                    alt="Room Service"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-4xl font-bold">Room Service</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map(service => (
                        <div key={service.id} className="bg-neutral-900 rounded-2xl overflow-hidden border border-white/10">
                            <div className="relative h-48">
                                <Image src={service.image} alt={service.name} fill className="object-cover" />
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold">{service.name}</h3>
                                    <span className="text-gold font-bold">₪{service.price}</span>
                                </div>
                                <button
                                    onClick={() => addToOrder(service)}
                                    className="w-full bg-white/10 hover:bg-gold hover:text-black py-2 rounded-xl transition-colors font-bold mt-2 flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={16} />
                                    Add to Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {cart.length > 0 && (
                <div className="fixed bottom-20 left-4 right-4 bg-gold text-black p-4 rounded-xl shadow-2xl flex justify-between items-center z-50">
                    <span className="font-bold">{cart.length} Items (₪{cart.reduce((a, b) => a + b.price, 0)})</span>
                    <button onClick={handleOrder} className="bg-black text-white px-6 py-2 rounded-lg font-bold">
                        Order via WhatsApp
                    </button>
                </div>
            )}
        </div>
    );
}
