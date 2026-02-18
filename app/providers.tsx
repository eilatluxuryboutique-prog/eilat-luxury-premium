'use client';

import { AdminProvider } from "@/components/admin/admin-context";
import { CartProvider } from "@/context/cart-context";
import { UIProvider } from "@/context/ui-context";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <UIProvider>
            <AdminProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </AdminProvider>
        </UIProvider>
    );
}
