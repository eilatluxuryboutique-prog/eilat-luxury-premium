"use client";

import { useCart } from "@/context/cart-context";
import { X, Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function CartDrawer() {
    const { isOpen, setIsOpen, items, removeFromCart, clearCart } = useCart();
    const locale = useLocale();
    const isHe = locale === 'he' || locale === 'ar'; // RTL languages
    const tC = useTranslations("Cart");

    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: isHe ? -100 : 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: isHe ? -100 : 100, opacity: 0 }}
                        className={`fixed top-0 bottom-0 ${isHe ? "left-0" : "right-0"} w-80 md:w-96 bg-white z-50 shadow-2xl flex flex-col`}
                    >
                        {/* Header */}
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-gold" />
                                {tC('title')}
                                <span className="bg-gold/20 text-gold text-xs px-2 py-1 rounded-full">{items.length}</span>
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 rounded-full">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p>{tC('empty')}</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.propertyId} className="relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        {/* Unavailable Overlay */}
                                        {item.isUnavailable && (
                                            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-[1px]">
                                                <div className="text-red-500 font-bold flex flex-col items-center">
                                                    <AlertCircle className="w-6 h-6 mb-1" />
                                                    {tC('sold_out')}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex">
                                            <div className="w-24 h-24 relative flex-shrink-0">
                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                            </div>
                                            <div className="p-3 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-sm line-clamp-1">{item.title}</h3>
                                                        <button
                                                            onClick={() => removeFromCart(item.propertyId)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-gold font-bold text-sm">{item.price}₪ / {tC('per_night')}</p>
                                                </div>
                                                <Link
                                                    href={`/${locale}/property/${item.propertyId}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-xs text-blue-600 hover:underline"
                                                >
                                                    {tC('view_property')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-4 border-t bg-gray-50 space-y-3">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>{tC('total')}</span>
                                    <span>{total}₪</span>
                                </div>
                                <button className="w-full py-3 bg-gold text-black font-bold rounded-xl hover:brightness-110 shadow-lg transition-all">
                                    {tC('proceed')}
                                </button>
                                <button
                                    onClick={clearCart}
                                    className="w-full py-2 text-gray-500 text-sm hover:text-red-500"
                                >
                                    {tC('clear')}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
