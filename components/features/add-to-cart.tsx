"use client";

import { useCart } from "@/context/cart-context";
import { Property } from "@/lib/mock-data";
import { ShoppingCart, Check } from "lucide-react";
import { useLocale } from "next-intl";

export default function AddToCartButton({ property }: { property: Property }) {
    const { addToCart, items } = useCart();
    const locale = useLocale();
    const isHe = locale === "he";

    const isInCart = items.some(i => i.propertyId === property.id);

    return (
        <button
            onClick={() => addToCart(property)}
            disabled={isInCart}
            className={`
                flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all
                ${isInCart
                    ? "bg-green-500 text-white cursor-default"
                    : "bg-white text-black border border-gray-200 hover:border-gold hover:text-gold"
                }
            `}
        >
            {isInCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
            {isInCart
                ? (isHe ? "נוסף לעגלה" : "Added")
                : (isHe ? "שמור לאחר כך" : "Save for Later")
            }
        </button>
    );
}
