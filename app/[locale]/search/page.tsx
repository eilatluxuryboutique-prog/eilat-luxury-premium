'use client';

import { useTranslations } from 'next-intl';
import ApartmentsList from '@/components/features/apartments-list';

export default function SearchPage({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const t = useTranslations('Apartments');
    const type = typeof searchParams.type === 'string' ? searchParams.type : '';
    const guests = typeof searchParams.guests === 'string' ? searchParams.guests : '';

    return (
        <main className="min-h-screen pt-24 pb-12 bg-neutral-900">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-white mb-8">
                    {type ? `${type}` : 'All Properties'}
                </h1>

                {/* We pass default filters just for display, usually real filtering happens in DB or in Component */}
                <ApartmentsList limit={100} />
            </div>
        </main>
    );
}
