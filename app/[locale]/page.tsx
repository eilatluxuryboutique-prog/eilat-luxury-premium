import Hero from '@/components/features/hero';
import ApartmentsList from '@/components/features/apartments-list';
import CategoriesList from '@/components/features/categories-list';
import AccessibilityButton from '@/components/ui/accessibility-button';
import { properties, Property } from '@/lib/mock-data';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export const dynamic = 'force-dynamic';

const Section = ({ title, items, link, viewAll }: { title: string, items: Property[], link: string, viewAll: string }) => (
    <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-foreground border-l-4 border-primary pl-4">
                    {title}
                </h2>
                <Link href={link} className="text-primary hover:text-foreground transition-colors flex items-center gap-2 font-medium">
                    {viewAll}
                    <span className="text-xl">←</span>
                </Link>
            </div>
            <ApartmentsList items={items} />
        </div>
    </section>
);

export default function Home() {
    const t = useTranslations('Home');

    const hotels = properties.filter(p => p.type === 'hotel').slice(0, 4);
    const villas = properties.filter(p => p.type === 'villa').slice(0, 4);
    const apartments = properties.filter(p => p.type === 'apartment').slice(0, 4);

    return (
        <main className="min-h-screen bg-background transition-colors duration-300">
            <Hero />
            <CategoriesList />

            <div className="flex flex-col gap-8 pb-20">
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

            <AccessibilityButton />
        </main>
    );
}
