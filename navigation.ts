import { createNavigation } from 'next-intl/navigation';

export const locales = ['he', 'en', 'ru', 'fr', 'ar'] as const;
export const { Link, redirect, usePathname, useRouter } = createNavigation({ locales });
