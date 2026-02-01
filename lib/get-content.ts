import { headers } from 'next/headers';
import dbConnect from './db';
import Content from '@/models/Content';

export async function getSiteContent() {
    try {
        await dbConnect();

        // Find by key 'site_content'
        const doc = await Content.findOne({ key: 'site_content' }).lean();

        if (doc && doc.data) {
            const data: any = doc.data;

            // Fix: If videoUrl is empty string, force fallback
            if (!data.hero?.videoUrl || data.hero.videoUrl.trim() === '') {
                // Fallback to Beach (User requested beach over Dog)
                data.hero = data.hero || {};
                data.hero.videoUrl = 'https://res.cloudinary.com/drr2qzpzk/video/upload/v1769920628/eilat_premium/hero_final_1769920616899.mp4';
            }
            return data;
        }

        // Check if DB is empty
        const count = await Content.countDocuments();
        if (count === 0) {
            console.warn('DB Connected but empty. Returning fallback.');
            return {
                theme: { logoColor: 'text-yellow-400' },
                hero: { videoUrl: 'https://res.cloudinary.com/drr2qzpzk/video/upload/v1769920628/eilat_premium/hero_final_1769920616899.mp4' }
            };
        }

        return {}; // Should not happen usually if seed worked
    } catch (error) {
        console.error('Failed to fetch site content (DB Error):', error);
        return {
            theme: { logoColor: 'text-yellow-400' },
            hero: { videoUrl: 'https://res.cloudinary.com/drr2qzpzk/video/upload/v1769920628/eilat_premium/hero_final_1769920616899.mp4' }
        };
    }
}
