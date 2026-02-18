import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';

const BASE_URL = 'https://eilat-booking-premium.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    await dbConnect();
    const articles = await Article.find({ published: true }).select('slug createdAt');

    const articleEntries = articles.map((article: any) => ({
        url: `${BASE_URL}/blog/${article.slug}`,
        lastModified: article.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const staticPages = [
        '',
        '/about',
        '/apartments',
        '/contact',
        '/blog',
        '/concierge',
        '/experiences',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    return [...staticPages, ...articleEntries];
}
