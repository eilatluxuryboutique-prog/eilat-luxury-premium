import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/host/analytics', '/account'],
        },
        sitemap: 'https://eilat-booking-premium.vercel.app/sitemap.xml',
    }
}
