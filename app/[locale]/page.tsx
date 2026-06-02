import Hero from '@/components/features/hero';
import LiveCam from '@/components/features/live-cam';
import LastMinuteDeals from '@/components/features/last-minute-deals';
import CategoriesList from '@/components/features/categories-list';
import BlogSection from '@/components/features/blog-section';
import NewsletterSignup from '@/components/features/newsletter-signup';
import { properties as rawProperties, attractions as rawAttractions, Property } from '@/lib/mock-data';
import { translateProperties, translateAttractions } from '@/lib/translate-mock';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import AdvertisementsSection from '@/components/features/advertisements-section';
import { Link } from '@/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import MainContentToggle from '@/components/features/main-content-toggle';
import MobileSearchPill from '@/components/features/mobile-search-pill';

export const revalidate = 3600;

export default async function Home({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams?: Promise<any> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Home' });
    const tMap = await getTranslations({ locale, namespace: 'Map' });

    const search = await searchParams || {};
    
    const properties = translateProperties(rawProperties, locale);
    
    // Filter properties based on search params
    let filteredProperties = [...properties];
    
    if (search.type) {
        filteredProperties = filteredProperties.filter(p => p.type === search.type);
    }
    
    if (search.guests) {
        const requiredGuests = parseInt(search.guests as string, 10);
        if (!isNaN(requiredGuests)) {
            filteredProperties = filteredProperties.filter(p => p.guests >= requiredGuests);
        }
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TravelAgency',
        name: 'Eilat Booking Premium',
        description: 'Luxury vacation rentals, villas, and apartments in Eilat.',
        url: 'https://eilat-booking-premium.vercel.app',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Eilat',
            addressCountry: 'IL'
        },
        priceRange: '$$$$',
        image: 'https://eilat-booking-premium.vercel.app/og-image.jpg'
    };

    return (
        <main className="min-h-screen bg-white transition-colors duration-300 relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Airbnb layout: Categories immediately below header */}
            <div className="sticky top-[110px] md:top-[80px] z-40 bg-white shadow-sm md:shadow-none pb-1 md:pb-0">
                <CategoriesList />
            </div>

            {/* Landing Page Hero image + Search Widget (Desktop only) */}
            <Hero />

            {/* Main Content: List or Map */}
            <MainContentToggle properties={filteredProperties} />
        </main>
    );
}
