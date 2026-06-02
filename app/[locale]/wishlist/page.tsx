"use client";

import { useEffect, useState } from "react";
import { useLocalizedProperties } from "@/hooks/use-localized-data";
import ApartmentsList from "@/components/features/apartments-list";
import { Heart } from "lucide-react";
import { Link } from "@/navigation";

export default function WishlistPage() {
    const properties = useLocalizedProperties();
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

            try {
                const res = await fetch('/api/properties');
                const data = await res.json();
                let allProps = data.properties || [];

                const savedDemo = localStorage.getItem('demo_properties');
                if (savedDemo) {
                    allProps = [...JSON.parse(savedDemo), ...allProps];
                }

                let wishlistItems = allProps.filter((p: any) => favorites.includes(p.id) || favorites.includes(p._id));

                if (wishlistItems.length === 0 && allProps.length === 0) {
                    const mockFavs = properties.filter(p => favorites.includes(p.id));
                    setItems(mockFavs);
                } else {
                    setItems(wishlistItems);
                }
            } catch (e) {
                console.error("Wishlist load error", e);
                const mockFavs = properties.filter(p => favorites.includes(p.id));
                setItems(mockFavs);
            } finally {
                setLoading(false);
            }
        };

        loadWishlist();

        window.addEventListener("favoritesUpdated", loadWishlist);
        return () => window.removeEventListener("favoritesUpdated", loadWishlist);
    }, [properties]);

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
                    <ApartmentsList items={items} limit={100} isCarousel={false} />
                ) : (
                    <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        <Heart size={48} className="text-zinc-200 mx-auto mb-4" />
                        <h2 className="text-xl text-zinc-800 font-bold mb-2">הרשימה ריקה</h2>
                        <p className="text-zinc-500 mb-6">עדיין לא שמרו נכסים. זה הזמן להתחיל לחפש!</p>
                        <Link href="/" className="bg-[#FF385C] text-white font-bold py-3 px-8 rounded-xl hover:brightness-110 shadow-lg transition-all">
                            התחל לחפש
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
