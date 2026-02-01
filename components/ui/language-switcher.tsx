'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <div className="relative">
            <select
                defaultValue={locale}
                onChange={handleChange}
                disabled={isPending}
                className="appearance-none bg-transparent border border-white/20 text-white rounded px-3 py-1 focus:outline-none focus:border-white/50 cursor-pointer"
            >
                <option value="he" className="text-black">עברית</option>
                <option value="en" className="text-black">English</option>
                <option value="ru" className="text-black">Русский</option>
                <option value="fr" className="text-black">Français</option>
                <option value="ar" className="text-black">العربية</option>
            </select>
        </div>
    );
}
