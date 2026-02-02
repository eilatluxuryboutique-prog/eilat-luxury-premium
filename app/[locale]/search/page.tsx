'use client';

import { useTranslations } from 'next-intl';
import ApartmentsList from '@/components/features/apartments-list';
import { properties } from '@/lib/mock-data';

export default function SearchPage({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const t = useTranslations('Apartments');
    const type = typeof searchParams.type === 'string' ? searchParams.type : '';

    // Filter Logic
    const filteredItems = properties.filter(item => {
        if (!type) return true;
        return item.type === type;
    });

    const getTitle = () => {
        if (!type) return 'All Properties';
        if (type === 'hotel') return 'Luxury Hotels';
        if (type === 'apartment') return 'Premium Apartments';
        if (type === 'villa') return 'Exclusive Villas';
        return type;
    };

    return (
        <main className="min-h-screen pt-24 pb-12 bg-neutral-900">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-white mb-8">
                    {getTitle()} ({filteredItems.length})
                </h1>

                <ApartmentsList items={filteredItems} limit={100} />
            </div>
        </main>
    );
}
