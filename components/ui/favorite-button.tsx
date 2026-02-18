"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function FavoriteButton({ propertyId }: { propertyId: string }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load from LocalStorage
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.includes(propertyId));
    }, [propertyId]);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        let newFavorites;

        if (isFavorite) {
            newFavorites = favorites.filter((id: string) => id !== propertyId);
        } else {
            newFavorites = [...favorites, propertyId];
        }

        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);

        // Sync with API (fire and forget - if logged in)
        fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId })
        }).catch(err => console.error("Wishlist sync error (likely guest)", err));

        // Dispatch custom event for Header/Wishlist updates
        window.dispatchEvent(new Event("favoritesUpdated"));
    };

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={toggleFavorite}
            className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-all ${isFavorite ? "bg-white text-red-500" : "bg-black/20 text-white hover:bg-black/40"}`}
        >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </motion.button>
    );
}
