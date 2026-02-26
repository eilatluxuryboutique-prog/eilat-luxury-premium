"use client";

import { useEffect, useState } from "react";
import { properties } from "@/lib/mock-data";
// We should ideally fetch from API for real data, 
// but for Wishlist display of mixed sources, we'll try API first then fallback.
import ApartmentsList from "@/components/features/apartments-list";
import { Heart } from "lucide-react";

export default function WishlistPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWishlist = async () => {
            const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

            if (favorites.length === 0) {
                setItems([]);
                setLoading(false);
                return;
            }

            // 1. Try fetching all from API (efficient? no, but okay for MVP)
            // Better: Fetch by IDs. Our API didn't support array of IDs yet, 
            // but we can fetch all and filter client side for now or make n requests.
            // Let's try fetching all properties and filtering.
            try {
                const res = await fetch('/api/properties');
                const data = await res.json();
                let allProps = data.properties || [];

                // Merge Demo
                const savedDemo = localStorage.getItem('demo_properties');
                if (savedDemo) {
                    allProps = [...JSON.parse(savedDemo), ...allProps];
                }

                // Filter
                const wishlistItems = allProps.filter((p: any) => favorites.includes(p.id) || favorites.includes(p._id));

                // Fallback to Mock if API empty
                if (wishlistItems.length === 0 && allProps.length === 0) {
                    const mockFavs = properties.filter(p => favorites.includes(p.id));
                    setItems(mockFavs);
                } else {
                    setItems(wishlistItems);
                }
            } catch (e) {
                console.error("Wishlist load error", e);
                // Fallback to Mock
                const mockFavs = properties.filter(p => favorites.includes(p.id));
                setItems(mockFavs);
            } finally {
                setLoading(false);
            }
        };

        loadWishlist();

        // Listen for updates
        window.addEventListener("favoritesUpdated", loadWishlist);
        return () => window.removeEventListener("favoritesUpdated", loadWishlist);
    }, []);

    return (
        <div className="min-h-screen bg-white pt-32 px-4 pb-20">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                    <Heart className="text-red-500 fill-red-500" />
                    המועדפים שלי
                    <span className="text-2xl text-zinc-300">({items.length})</span>
                </h1>

                {loading ? (
                    <div className="text-zinc-900 text-center">טוען...</div>
                ) : items.length > 0 ? (
                    <ApartmentsList items={items} limit={100} />
                ) : (
                    <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        <Heart size={48} className="text-zinc-200 mx-auto mb-4" />
                        <h2 className="text-xl text-zinc-800 font-bold mb-2">הרשימה ריקה</h2>
                        <p className="text-zinc-500 mb-6">עדיין לא שמרו נכסים. זה הזמן להתחיל לחפש!</p>
                        <a href="/search" className="bg-gold text-black font-bold py-3 px-8 rounded-xl hover:brightness-110 shadow-lg transition-all">
                            התחל לחפש
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
