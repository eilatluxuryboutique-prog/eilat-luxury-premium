import Hero from '@/components/features/hero';
import ApartmentsList from '@/components/features/apartments-list';
import CategoriesList from '@/components/features/categories-list';
import AccessibilityButton from '@/components/ui/accessibility-button';
import { properties, Property } from '@/lib/mock-data';
import { Link } from '@/navigation';

export const dynamic = 'force-dynamic';

const Section = ({ title, items, link }: { title: string, items: Property[], link: string }) => (
    <section className="py-12 border-b border-white/5">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white border-l-4 border-[#FFD700] pl-4">
                    {title}
                </h2>
                <Link href={link} className="text-[#FFD700] hover:text-white transition-colors flex items-center gap-2 font-medium">
                    View All
                    <span className="text-xl">→</span>
                </Link>
            </div>
            <ApartmentsList items={items} />
        </div>
    </section>
);

export default async function Home() {
    const { getSiteContent } = await import('@/lib/get-content');
    const content = await getSiteContent();

    const hotels = properties.filter(p => p.type === 'hotel').slice(0, 4);
    const villas = properties.filter(p => p.type === 'villa').slice(0, 4);
    const apartments = properties.filter(p => p.type === 'apartment').slice(0, 4);

    return (
        <main className="min-h-screen bg-[#121212]">
            <Hero initialVideoUrl={content?.hero?.videoUrl} />
            <CategoriesList />



            <div className="flex flex-col gap-8 pb-20">
                <Section title={`Luxury Hotels (${hotels.length})`} items={hotels} link="/search?type=hotel" />
                <Section title={`Exclusive Villas (${villas.length})`} items={villas} link="/search?type=villa" />
                <Section title={`Premium Apartments (${apartments.length})`} items={apartments} link="/search?type=apartment" />
            </div>

            <AccessibilityButton />
        </main>
    );
}
