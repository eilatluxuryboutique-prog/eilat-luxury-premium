"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { Attraction } from '@/lib/mock-data';

// Helper function to create price tag icon
const createPriceIcon = (price: number) => {
    return divIcon({
        className: 'custom-div-icon',
        html: `<div style="
            background-color: #222222; 
            border-radius: 28px; 
            padding: 8px 14px; 
            font-weight: bold; 
            font-size: 15px; 
            color: white; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.3); 
            display: inline-block;
            white-space: nowrap;
            transition: transform 0.2s, background-color 0.2s;
            border: 2px solid white;
        " onmouseover="this.style.transform='scale(1.15)'; this.style.backgroundColor='black'; this.style.zIndex='1000'" onmouseout="this.style.transform='scale(1)'; this.style.backgroundColor='#222222'; this.style.zIndex='1'">
            ₪${price}
        </div>`,
        iconSize: [60, 30],
        iconAnchor: [30, 15]
    });
};

// Helper function to create attraction tag icon
const createAttractionIcon = (title: string, type: string) => {
    let bgColor = '#D90B42'; // Default pinkish
    let emoji = '📍';
    if (type === 'restaurant') { bgColor = '#EAB308'; emoji = '🍔'; }
    if (type === 'shopping') { bgColor = '#8B5CF6'; emoji = '🛍️'; }
    if (type === 'nature') { bgColor = '#10B981'; emoji = '🌴'; }
    if (type === 'bank') { bgColor = '#3B82F6'; emoji = '🏦'; }
    if (type === 'pharmacy') { bgColor = '#059669'; emoji = '💊'; }
    
    return divIcon({
        className: 'custom-div-icon',
        html: `<div style="
            background-color: ${bgColor}; 
            border-radius: 28px; 
            padding: 6px 12px; 
            font-weight: 800; 
            font-size: 14px; 
            color: white; 
            box-shadow: 0 3px 6px rgba(0,0,0,0.4); 
            display: flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
            transition: transform 0.2s;
            border: 2px solid white;
        " onmouseover="this.style.transform='scale(1.15)'; this.style.zIndex='1000'" onmouseout="this.style.transform='scale(1)'; this.style.zIndex='1'">
            <span style="font-size:16px">${emoji}</span> ${title}
        </div>`,
        iconSize: [120, 30],
        iconAnchor: [60, 15]
    });
};

interface Property {
    id: string;
    title: string;
    price: number;
    coordinates?: { lat: number; lng: number };
    images: string[];
}

export default function MapView({ properties, attractions = [] }: { properties: Property[], attractions?: Attraction[] }) {
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
            zoom={15}
            scrollWheelZoom={false}
            className="h-full w-full min-h-[400px] rounded-xl z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                url="https://mt1.google.com/vt/lyrs=m&hl=he&x={x}&y={y}&z={z}"
            />
            
            {/* Render Properties */}
            {properties.map(property => (
                property.coordinates && (
                    <Marker
                        key={`prop-${property.id}`}
                        position={[property.coordinates.lat || 29.55, property.coordinates.lng || 34.95]}
                        icon={createPriceIcon(property.price)}
                    >
                        <Popup>
                            <div className="text-black text-sm w-48">
                                <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                                    {property.images && property.images[0] ? (
                                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">אין תמונה</div>
                                    )}
                                </div>
                                <strong className="block truncate">{property.title}</strong>
                                <span className="font-semibold">₪{property.price}</span> <span className="text-gray-500">ללילה</span>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}

            {/* Render Attractions */}
            {attractions.map(attraction => (
                <Marker
                    key={`att-${attraction.id}`}
                    position={[attraction.coordinates.lat, attraction.coordinates.lng]}
                    icon={createAttractionIcon(attraction.title, attraction.type)}
                >
                    <Popup>
                        <div className="text-black text-sm max-w-[220px]">
                            <strong className="text-lg mb-1 block" style={{ color: attraction.type === 'restaurant' ? '#F59E0B' : attraction.type === 'nature' ? '#10B981' : '#D90B42' }}>
                                {attraction.title}
                            </strong>
                            <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 inline-block mb-2 font-medium">
                                {attraction.type === 'restaurant' ? 'מסעדה מומלצת' : attraction.type === 'shopping' ? 'קניות ובילוי' : attraction.type === 'nature' ? 'טבע ואטרקציות' : 'פעילות'}
                            </div>
                            <p className="text-sm mt-1 leading-relaxed text-gray-700 border-t pt-2">{attraction.description}</p>
                            <div className="mt-3 text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
                                קרא עוד המלצות...
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
