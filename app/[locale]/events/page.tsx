'use client';

import { Calendar, MapPin, Music, Sun } from 'lucide-react';
import Image from 'next/image';

const EVENTS = [
    { id: 1, title: 'Red Sea Jazz Festival', date: '2024-02-25', location: 'Port of Eilat', image: 'https://images.unsplash.com/photo-1514525253440-b393452e8220?q=80&w=800', type: 'Music' },
    { id: 2, title: 'Eilat Triathlon', date: '2024-03-15', location: 'Royal Beach', image: 'https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?q=80&w=800', type: 'Sport' },
    { id: 3, title: 'Desert Marathon', date: '2024-04-02', location: 'Desert Mountains', image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800', type: 'Sport' },
];

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-2">Eilat Events</h1>
                <p className="text-muted-foreground mb-8">What's happening in the city</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {EVENTS.map(event => (
                        <div key={event.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                            <div className="relative h-48 overflow-hidden">
                                <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {event.type}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-gold font-bold mb-2">
                                    <Calendar size={16} />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <MapPin size={16} />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
