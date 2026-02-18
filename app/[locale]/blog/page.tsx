import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';

// Helper to strip HTML tags for preview if excerpt missing
const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

// Since we don't have a CMS yet, we can seed or just show empty state.
// I'll create a seed script or just 2 mock articles in the code if DB empty for demo.

export const dynamic = 'force-dynamic';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('Blog'); // Ensure 'Blog' namespace exists or use fallback

    await dbConnect();
    let articles = await Article.find({ published: true }).sort({ createdAt: -1 });

    // Seed if empty (Temporary for Demo)
    if (articles.length === 0) {
        articles = [
            {
                slug: "top-5-luxury-villas-eilat-2026",
                title: "5 הוילות הכי יוקרתיות באילת לשנת 2026",
                excerpt: "גלו את הפנינים הנסתרות של אילת: בריכות אינסוף, שפים פרטיים ונוף לים.",
                coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600",
                createdAt: new Date()
            },
            {
                slug: "best-restaurants-eilat-guide",
                title: "המדריך הקולינרי: מסעדות שף שאסור לפספס",
                excerpt: "מאסייתיות יוקרתיות ועד דגים טריים על המים. איפה אוכלים באילת?",
                coverImage: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80&w=1600",
                createdAt: new Date(Date.now() - 86400000)
            },
            {
                slug: "eilat-nightlife-vip",
                title: "חיי הלילה של אילת: מועדונים וברים בסטייל",
                excerpt: "איפה הקהל הכי יפה, הקוקטיילים הכי טובים והמוזיקה שלא מפסיקה.",
                coverImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=1600",
                createdAt: new Date(Date.now() - 172800000)
            }
        ];
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gold to-yellow-200 bg-clip-text text-transparent mb-4">
                        {locale === 'he' ? 'המגזין של אילת' : 'The Eilat Magazine'}
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        {locale === 'he'
                            ? 'המלצות, טיפים וסקירות בלעדיות על חופשות יוקרה, קולינריה וחיי לילה.'
                            : 'Exclusive recommendations and reviews on luxury vacations, culinary, and nightlife.'}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article: any, i: number) => (
                        <Link href={`/blog/${article.slug}`} key={i} className="group block bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 hover:border-gold/50 transition-all hover:transform hover:-translate-y-1">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={article.coverImage}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-4 right-4 text-xs font-bold bg-gold text-black px-2 py-1 rounded-full">
                                    {locale === 'he' ? 'כתבה' : 'Article'}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-sm text-white/40 mb-2">
                                    {new Date(article.createdAt).toLocaleDateString(locale === 'he' ? 'he-IL' : 'en-US')} • 5 {locale === 'he' ? 'דק׳ קריאה' : 'min read'}
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-white/60 text-sm line-clamp-3 leading-relaxed">
                                    {article.excerpt}
                                </p>
                                <div className="mt-4 flex items-center text-gold text-sm font-bold">
                                    {locale === 'he' ? 'קרא עוד' : 'Read More'}
                                    <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
