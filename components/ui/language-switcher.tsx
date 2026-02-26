'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { ChangeEvent, useTransition } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ isScrolled = false }: { isScrolled?: boolean }) {
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
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors text-zinc-500 group-hover:text-zinc-700">
                <Globe size={16} />
            </div>
            <select
                value={locale}
                onChange={handleChange}
                disabled={isPending}
                className="bg-black/5 backdrop-blur-md border border-zinc-300 rounded-full pl-9 pr-4 py-1.5 focus:outline-none cursor-pointer transition-colors text-zinc-900 focus:border-zinc-500 hover:bg-black/10 text-sm font-medium"
            >
                <option value="he" className="text-black text-right">שפות: עברית</option>
                <option value="en" className="text-black text-right">English</option>
                <option value="ru" className="text-black text-right">Русский</option>
                <option value="fr" className="text-black text-right">Français</option>
                <option value="ar" className="text-black text-right">العربية</option>
            </select>
        </div>
    );
}
