import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";
import Header from "@/components/ui/header";
import Providers from "@/app/providers";
import ThemeProvider from "@/components/theme-provider";
import AiAssistant from "@/components/ai-assistant";
import CartDrawer from "@/components/features/cart-drawer";
import Footer from "@/components/ui/footer";
import BottomNav from "@/components/ui/bottom-nav";
import AccessibilityButton from "@/components/ui/accessibility-button";
import FloatingActions from "@/components/features/floating-actions"; // NEW
import { CompareProvider } from "@/components/features/compare-context";
import CompareBar from "@/components/features/compare-bar";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const rubik = Rubik({ subsets: ["hebrew", "latin"], variable: '--font-rubik' });

export const metadata: Metadata = {
    title: {
        default: "Eilat Booking Premium | Luxury Vacation Rentals",
        template: "%s | Eilat Booking Premium"
    },
    description: "Discover exclusive luxury apartments, villas, and boutique hotels in Eilat. Book your perfect premium vacation today.",
    keywords: ["Eilat", "Vacation", "Luxury", "Apartments", "Villas", "Booking", "Israel", "Travel", "Red Sea"],
    authors: [{ name: "Eilat Luxury Team" }],
    creator: "Eilat Luxury Premium",
    publisher: "Eilat Luxury Premium",
    openGraph: {
        title: "Eilat Booking Premium | The Best Vacation 2026",
        description: "Experience the ultimate luxury in Eilat. Handpicked villas and apartments for an unforgettable stay.",
        url: "https://eilat-booking-premium.vercel.app",
        siteName: "Eilat Booking Premium",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Eilat Luxury Vacation View",
            },
        ],
        locale: "he_IL",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Eilat Booking Premium",
        description: "Your gateway to a luxury vacation in Eilat.",
        images: ["/og-image.jpg"],
    },
    icons: {
        icon: '/globe.svg',
        apple: '/globe.svg',
    },
    manifest: '/manifest.json',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!['he', 'en', 'ru', 'fr', 'ar'].includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();
    const dir = ['he', 'ar'].includes(locale) ? 'rtl' : 'ltr';

    // Fetch site content server-side to avoid FOUC
    const { getSiteContent } = await import('@/lib/get-content');
    const siteContent = await getSiteContent();

    return (
        <html lang={locale} dir={dir}>
            <head>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6683838338383833" crossOrigin="anonymous"></script>
            </head>
            <body className={`${rubik.className} ${inter.variable} ${rubik.variable} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        <ThemeProvider>
                            <CompareProvider>
                                <Header initialData={siteContent || {}} />
                                <main className="pb-20 md:pb-0">
                                    {children}
                                </main>
                                <AiAssistant />
                                <AccessibilityButton />
                                <CartDrawer />
                                <CompareBar />
                                <BottomNav />
                                <FloatingActions />
                                <Footer />
                            </CompareProvider>
                        </ThemeProvider>
                    </Providers>
                </NextIntlClientProvider>
                <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript" async></script>
            </body>
        </html>
    );
}
