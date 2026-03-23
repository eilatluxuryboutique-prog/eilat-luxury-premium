'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

const articles = [
    {
        id: 1,
        title: "5 הוילות הכי יוקרתיות באילת לשנת 2026",
        excerpt: "גלו את הפנינים הנסתרות של אילת: בריכות אינסוף, שפים פרטיים ונוף לים.",
        date: "10 פברואר, 2026",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600",
        category: "וילות",
        slug: "top-5-luxury-villas-eilat-2026"
    },
    {
        id: 2,
        title: "המדריך הקולינרי: מסעדות שף שאסור לפספס",
        excerpt: "מאסייתיות יוקרתיות ועד דגים טריים על המים. איפה אוכלים באילת?",
        date: "05 פברואר, 2026",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80&w=1600",
        category: "אוכל",
        slug: "best-restaurants-eilat-guide"
    },
    {
        id: 3,
        title: "חיי הלילה של אילת: מועדונים וברים בסטייל",
        excerpt: "איפה הקהל הכי יפה, הקוקטיילים הכי טובים והמוזיקה שלא מפסיקה.",
        date: "01 פברואר, 2026",
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=1600",
        category: "לילה",
        slug: "eilat-nightlife-vip"
    }
];

export default function BlogSection() {
    const tB = useTranslations('Blog');
    const tN = useTranslations('Navigation');

    return (
        <section className="py-8 md:py-20 bg-white border-t border-zinc-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-6 md:mb-12">
                    <div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 mb-1 md:mb-3">{tN('magazine')}</h2>
                        <p className="text-sm md:text-base text-zinc-500">{tB('subtitle')}</p>
                    </div>
                    <Link href="/blog" className="text-gold hidden md:flex items-center gap-2 hover:gap-3 transition-all">
                        {tB('view_all')} <ArrowLeft size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article, i) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <Link href={`/blog/${article.slug}`} className="block h-full">
                                <div className="relative h-48 md:h-64 rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-6">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md text-zinc-900 text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-zinc-100">
                                        {article.category}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <span className="text-gold-dark text-sm font-medium">{article.date}</span>
                                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-gold transition-colors">{article.title}</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 text-center md:hidden">
                    <Link href="/blog" className="text-gold inline-flex items-center gap-2">
                        {tB('view_all')} <ArrowLeft size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
