"use client";

import { useCart } from "@/context/cart-context";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
    const { setIsOpen, items } = useCart();

    return (
        <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-white hover:text-gold transition-colors"
        >
            <ShoppingCart className="w-6 h-6" />
            {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {items.length}
                </span>
            )}
        </button>
    );
}
