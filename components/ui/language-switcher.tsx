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
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${isScrolled ? 'text-zinc-500 group-hover:text-zinc-900' : 'text-white/70 group-hover:text-white'
                }`}>
                <Globe size={14} />
            </div>
            <select
                defaultValue={locale}
                onChange={handleChange}
                disabled={isPending}
                className={`appearance-none bg-black/10 backdrop-blur-md border rounded-full pl-9 pr-4 py-1.5 text-sm font-semibold focus:outline-none cursor-pointer transition-all shadow-sm ${isScrolled
                    ? 'border-zinc-300 text-zinc-900 focus:border-zinc-500 hover:bg-zinc-100/80'
                    : 'border-white/30 text-white focus:border-white/60 hover:bg-white/20'
                    }`}
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
