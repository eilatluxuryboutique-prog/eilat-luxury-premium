import Hero from '@/components/features/hero';
import ApartmentsList from '@/components/features/apartments-list';
import CategoriesList from '@/components/features/categories-list';
import AccessibilityButton from '@/components/ui/accessibility-button';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const { getSiteContent } = await import('@/lib/get-content');
    const content = await getSiteContent();

    return (
        <main className="min-h-screen bg-[#121212]">
            <Hero initialVideoUrl={content?.hero?.videoUrl} />
            <CategoriesList />
            <ApartmentsList />
            <AccessibilityButton />
        </main>
    );
}
