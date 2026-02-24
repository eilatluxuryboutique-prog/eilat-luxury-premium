import { MetadataRoute } from 'next'
import { properties } from '@/lib/mock-data'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://eilat-booking-premium.vercel.app'
    const locales = ['he', 'en', 'ru', 'fr', 'ar']

    const routes = ['', '/villas', '/apartments', '/hotels', '/contact', '/about'].flatMap(route =>
        locales.map(locale => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    )

    const propertyRoutes = properties.flatMap(property =>
        locales.map(locale => ({
            url: `${baseUrl}/${locale}/property/${property.id}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        }))
    )

    return [...routes, ...propertyRoutes]
}
