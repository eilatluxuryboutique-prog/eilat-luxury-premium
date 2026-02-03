"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property } from "@/lib/mock-data";

export interface CartItem {
    propertyId: string;
    title: string;
    price: number;
    image: string;
    dates?: { start: Date; end: Date }; // Optional for now
    addedAt: number; // Timestamp
    isUnavailable?: boolean; // If checked and found booked
}

interface CartContextType {
    items: CartItem[];
    addToCart: (property: Property, dates?: { start: Date; end: Date }) => void;
    removeFromCart: (propertyId: string) => void;
    clearCart: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Mock Validation: Randomly mark 1 item as unavailable if older than 1 minute (for demo)
                const validated = parsed.map((item: CartItem) => {
                    const now = Date.now();
                    // Demo: If item added > 5 mins ago, mark unavailable
                    if (now - item.addedAt > 5 * 60 * 1000) {
                        // return { ...item, isUnavailable: true }; // Uncomment for aggressive demo
                    }
                    return item;
                });
                setItems(validated);
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (property: Property, dates?: { start: Date; end: Date }) => {
        setItems(prev => {
            if (prev.find(i => i.propertyId === property.id)) return prev; // Already in cart
            return [...prev, {
                propertyId: property.id,
                title: property.title,
                price: property.price,
                image: property.image,
                dates,
                addedAt: Date.now()
            }];
        });
        setIsOpen(true); // Open drawer
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(i => i.propertyId !== id));
    };

    const clearCart = () => setItems([]);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isOpen, setIsOpen }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}
