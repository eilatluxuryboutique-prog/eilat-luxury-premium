'use client';

import { AdminProvider } from "@/components/admin/admin-context";
import { CartProvider } from "@/context/cart-context";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AdminProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </AdminProvider>
    );
}
