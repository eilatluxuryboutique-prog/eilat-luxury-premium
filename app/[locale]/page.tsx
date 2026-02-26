import Hero from '@/components/features/hero';
import LiveCam from '@/components/features/live-cam';
import LastMinuteDeals from '@/components/features/last-minute-deals';
import ApartmentsList from '@/components/features/apartments-list';
import CategoriesList from '@/components/features/categories-list';
import BlogSection from '@/components/features/blog-section';
import NewsletterSignup from '@/components/features/newsletter-signup';
import { properties, Property } from '@/lib/mock-data';
import AdvertisementsSection from '@/components/features/advertisements-section';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export const dynamic = 'force-dynamic';

const Section = ({ title, items, link, viewAll }: { title: string, items: Property[], link: string, viewAll: string }) => (
    <section className="py-12 md:py-16 border-b border-border/40">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-foreground border-r-4 border-primary pr-4">
                    {title}
                </h2>
                <Link href={link} className="text-primary hover:text-foreground transition-colors flex items-center gap-2 font-medium group">
                    {viewAll}
                    <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                </Link>
            </div>
            <ApartmentsList items={items} limit={4} />
        </div>
    </section>
);

export default function Home() {
    const t = useTranslations('Home');

    const hotels = properties.filter(p => p.type === 'hotel');
    const villas = properties.filter(p => p.type === 'villa');
    const apartments = properties.filter(p => p.type === 'apartment');

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
        <main className="min-h-screen bg-background transition-colors duration-300">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <div className="bg-white">
                <Hero />
            </div>

            {/* LiveCam Section */}
            <div className="bg-zinc-50 py-20 border-y border-zinc-100">
                <LiveCam />
            </div>

            <LastMinuteDeals />
            <AdvertisementsSection />
            <CategoriesList />

            <div className="flex flex-col gap-0 pb-0">
                <Section
                    title={t('hotels_title')}
                    items={hotels}
                    link="/search?type=hotel"
                    viewAll={t('view_all')}
                />
                <Section
                    title={t('villas_title')}
                    items={villas}
                    link="/search?type=villa"
                    viewAll={t('view_all')}
                />
                <Section
                    title={t('apartments_title')}
                    items={apartments}
                    link="/search?type=apartment"
                    viewAll={t('view_all')}
                />
            </div>

            <BlogSection />
            <NewsletterSignup />
        </main>
    );
}
