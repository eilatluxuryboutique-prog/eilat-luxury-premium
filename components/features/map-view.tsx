"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix Leaflet Icon
const icon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface Property {
    id: string;
    title: string;
    price: number;
    coordinates?: { lat: number; lng: number };
    images: string[];
}

export default function MapView({ properties }: { properties: Property[] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[400px] w-full bg-zinc-100 animate-pulse rounded-xl" />;

    // Default center (Eilat)
    const center = [29.5577, 34.9519];

    return (
        <MapContainer
            center={center as [number, number]}
            zoom={13}
            scrollWheelZoom={false}
            className="h-[400px] w-full rounded-xl z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {properties.map(property => (
                property.coordinates && (
                    <Marker
                        key={property.id}
                        position={[property.coordinates.lat || 29.55, property.coordinates.lng || 34.95]}
                        icon={icon}
                    >
                        <Popup>
                            <div className="text-black text-sm">
                                <strong>{property.title}</strong><br />
                                ₪{property.price} / night
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
}
