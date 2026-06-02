'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

const icon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }: { position: { lat: number, lng: number }, setPosition: (pos: { lat: number, lng: number }) => void }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position ? (
        <Marker position={position} icon={icon}></Marker>
    ) : null;
}

export default function LocationPicker({ value, onChange }: { value?: { lat: number, lng: number }, onChange: (pos: { lat: number, lng: number }) => void }) {
    // Default to Eilat center if no value provided
    const defaultCenter = { lat: 29.5577, lng: 34.9519 };
    const [position, setPosition] = useState(value || defaultCenter);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handlePositionChange = (newPos: { lat: number, lng: number }) => {
        setPosition(newPos);
        onChange(newPos);
    };

    if (!mounted) return <div className="h-[300px] w-full bg-black/40 animate-pulse rounded-xl border border-white/10" />;

    return (
        <div className="w-full h-[300px] rounded-xl overflow-hidden border border-white/10 z-0 relative">
            <div className="absolute top-2 right-2 z-[1000] bg-black/70 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none">
                לחץ על המפה כדי לסמן את המיקום
            </div>
            <MapContainer
                center={position}
                zoom={14}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                    url="https://mt1.google.com/vt/lyrs=m&hl=he&x={x}&y={y}&z={z}"
                />
                <LocationMarker position={position} setPosition={handlePositionChange} />
            </MapContainer>
        </div>
    );
}
