import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from "next/navigation";
import Header from "@/components/ui/header";
import Providers from "@/app/providers";
import ThemeProvider from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Eilat Booking Premium",
    description: "Luxury vacation apartments in Eilat",
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

    // Ensure that the incoming `locale` is valid
    if (!['he', 'en', 'ru', 'fr', 'ar'].includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    const dir = ['he', 'ar'].includes(locale) ? 'rtl' : 'ltr';

    // Fetch site content server-side to avoid FOUC
    const { getSiteContent } = await import('@/lib/get-content');
    const siteContent = await getSiteContent();

    return (
        <html lang={locale} dir={dir}>
            <body className={inter.className}>
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        <ThemeProvider>
                            <Header initialData={siteContent || {}} />
                            {children}
                        </ThemeProvider>
                    </Providers>
                </NextIntlClientProvider>
                <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript" async></script>
            </body>
        </html>
    );
}
