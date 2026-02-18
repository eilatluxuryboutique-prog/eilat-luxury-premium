"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from '@/navigation';
import { Send } from "lucide-react";

const experiences = [
    {
        id: "yacht",
        title: "השכרת יאכטה פרטית",
        price: "₪1500",
        duration: "שעתיים",
        image: "https://images.unsplash.com/photo-1569263979104-cdfaef81a5bc?q=80&w=2574&auto=format&fit=crop",
        description: "שייט יוקרתי במפרץ אילת הכולל סקיפר, שתייה קלה ופירות. מתאים לעד 12 אנשים."
    },
    {
        id: "jeep",
        title: "טיול ג'יפים בשקיעה",
        price: "₪800",
        duration: "3 שעות",
        image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=2670&auto=format&fit=crop",
        description: "חוויה מדברית עוצרת נשימה בהרי אילת. כולל תה צמחים ופיתות על המדורה."
    },
    {
        id: "diving",
        title: "צלילת היכרות VIP",
        price: "₪350",
        duration: "שעה וחצי",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2670&auto=format&fit=crop",
        description: "צלילה אישית עם מדריך צמוד בשמורת האלמוגים. כולל צילום תת-ימי."
    },
    {
        id: "massage",
        title: "עיסוי עד הבית",
        price: "₪400",
        duration: "60 דקות",
        image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=2670&auto=format&fit=crop",
        description: "מעסים מקצועיים שיגיעו אליכם לוילה או לדירה לחווית ספא מושלמת."
    }
];

export default function ExperiencesPage() {
    return (
        <div className="min-h-screen bg-[#121212] pt-24 pb-20">
            {/* Hero Section */}
            <div className="container mx-auto px-4 text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold mb-6"
                >
                    חוויות בלתי נשכחות
                </motion.h1>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                    החופשה שלכם היא הרבה מעבר לשינה. אספנו עבורכם את האטרקציות והחוויות הכי שוות באילת, במחירים בלעדיים לאורחי האתר.
                </p>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5 hover:border-gold/30 group shadow-2xl transition-all"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={exp.image}
                                    alt={exp.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80"></div>
                                <div className="absolute bottom-4 right-4">
                                    <h3 className="text-2xl font-bold text-white mb-1">{exp.title}</h3>
                                    <div className="flex gap-3 text-sm font-medium">
                                        <span className="bg-white/10 px-2 py-1 rounded text-white/90">{exp.duration}</span>
                                        <span className="bg-gold/20 text-gold px-2 py-1 rounded">החל מ-{exp.price}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-white/60 mb-6 leading-relaxed">
                                    {exp.description}
                                </p>
                                <a
                                    href={`https://wa.me/972505222536?text=היי, אשמח לפרטים נוספים והזמנה של: ${exp.title}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gold transition-colors"
                                >
                                    <Send size={18} />
                                    הזמן עכשיו בוואטסאפ
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-20">
                <p className="text-white/40 text-sm">מופעל בשיתוף פעולה עם ספקים מקומיים נבחרים באילת.</p>
            </div>
        </div>
    );
}
