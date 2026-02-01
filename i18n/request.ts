import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['he', 'en', 'ru', 'fr', 'ar'];

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Validate that the incoming `locale` parameter is valid
    if (!locale || !locales.includes(locale as any)) {
        locale = 'he'; // Default fallack
    }

    return {
        locale,
        messages: (await import(`../locales/${locale}.json`)).default
    };
});
