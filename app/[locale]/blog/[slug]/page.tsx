import Image from 'next/image';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await dbConnect();
    const article = await Article.findOne({ slug });

    if (!article) return { title: 'Article Not Found' };

    return {
        title: article.title,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            images: [article.coverImage],
            type: 'article',
        }
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await dbConnect();

    // Find article (Mock fallback if empty DB for demo)
    let article = await Article.findOne({ slug });

    if (!article) {
        // Mock Data Fallback for Demo (matching the list page)
        const mockArticles = [
            {
                slug: "top-5-luxury-villas-eilat-2026",
                title: "5 הוילות הכי יוקרתיות באילת לשנת 2026",
                content: `
                    <p>אילת, עיר הנופש הדרומית של ישראל, מציעה חווית אירוח ברמה בינלאומית. לקראת שנת 2026, אספנו עבורכם את הוילות שפשוט אסור לפספס.</p>
                    <h2>1. וילת רויאל גארדן</h2>
                    <p>עם בריכת אינסוף המשקיפה למפרץ, ג'קוזי ענק ומטבח שף מאובזר, וילה זו היא הבחירה האולטימטיבית למשפחות שמחפשות פינוק.</p>
                    <h2>2. אחוזת המדבר</h2>
                    <p>עיצוב מודרני המשתלב עם הנוף המדברי, שקט מופתי ופרטיות מלאה.</p>
                    <h3>מה חשוב לבדוק לפני שמזמינים?</h3>
                    <ul>
                        <li>מיקום הוילה והקרבה לים</li>
                        <li>מתקנים (בריכה מחוממת, מנגל, חניה)</li>
                        <li>ביקורות מאורחים קודמים</li>
                    </ul>
                    <p>להזמנת חופשה חלומית, צרו קשר עם הצוות שלנו עוד היום.</p>
                `,
                coverImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600",
                createdAt: new Date(),
                author: "צוות אילת לוקז'רי"
            },
            {
                slug: "best-restaurants-eilat-guide",
                title: "המדריך הקולינרי: מסעדות שף שאסור לפספס",
                content: "<p>הקולינריה באילת עברה מהפכה בשנים האחרונות...</p>",
                coverImage: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80&w=1600",
                createdAt: new Date(),
                author: "מבקר המסעדות"
            }
        ];
        article = mockArticles.find(a => a.slug === slug);
    }

    if (!article) notFound();

    // JSON-LD Schema for Blog Posting
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        image: article.coverImage,
        author: {
            '@type': 'Person',
            name: article.author || 'Eilat Luxury Team',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Eilat Booking Premium',
            logo: {
                '@type': 'ImageObject',
                url: 'https://eilat-booking-premium.vercel.app/globe.svg'
            }
        },
        datePublished: article.createdAt,
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Image */}
            <div className="relative h-[40vh] md:h-[60vh] w-full">
                <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 container mx-auto max-w-4xl">
                    <div className="bg-gold/90 text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                        מגזין יוקרה
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                        <span>{new Date(article.createdAt).toLocaleDateString('he-IL')}</span>
                        <span>•</span>
                        <span>מאת {article.author}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <article className="container mx-auto px-4 max-w-3xl mt-10">
                <div
                    className="prose prose-invert prose-lg md:prose-xl max-w-none 
                    prose-headings:text-gold prose-a:text-blue-400 prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>
        </div>
    );
}
