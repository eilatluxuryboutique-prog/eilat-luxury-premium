import { useLocale } from 'next-intl';
import { properties, attractions } from '@/lib/mock-data';
import { translateProperties, translateAttractions } from '@/lib/translate-mock';

export function useLocalizedProperties() {
    const locale = useLocale();
    return translateProperties(properties, locale);
}

export function useLocalizedAttractions() {
    const locale = useLocale();
    return translateAttractions(attractions, locale);
}
