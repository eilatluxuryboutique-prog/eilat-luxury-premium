"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Utensils, Star, ShoppingBag, Baby, Music, Sparkles, Send } from "lucide-react";

const services = [
    {
        id: "chef",
        icon: <Utensils size={32} className="text-gold" />,
        title: "שף פרטי עד הבית",
        price: "מ-₪1200",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop",
        description: "ארוחת גורמה מוכנה בוילה שלכם על ידי שף מקצועי. תפריט בשרים, חלבי או טבעוני לבחירתכם."
    },
    {
        id: "decor",
        icon: <Sparkles size={32} className="text-gold" />,
        title: "סידור ועיצוב רומנטי",
        price: "מ-₪450",
        image: "https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=2672&auto=format&fit=crop",
        description: "בלונים, בקבוק שמפניה, פרחים ונרות שיחכו בחדר ברגע הגעתכם להצעות נישואין או ימי הולדת."
    },
    {
        id: "fridge",
        icon: <ShoppingBag size={32} className="text-gold" />,
        title: "מקרר מלא",
        price: "₪150 + עלות הקניות",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop",
        description: "שלחו לנו רשימת קניות, ואנחנו נדאג שהמקרר יהיה מלא בכל טוב לפני שאתם נכנסים."
    },
    {
        id: "babysitter",
        icon: <Baby size={32} className="text-gold" />,
        title: "שירותי שמרטפות",
        price: "₪60 לשעה",
        image: "https://images.unsplash.com/photo-1601726543163-d49d95d85255?q=80&w=2671&auto=format&fit=crop",
        description: "רוצים לצאת בערב? בייביסיטר מנוסה ואחראית תגיע לשמור על הילדים כדי שתוכלו ליהנות בשקט."
    },
    {
        id: "dj",
        icon: <Music size={32} className="text-gold" />,
        title: "DJ למסיבות פרטיות",
        price: "מ-₪1500",
        image: "https://images.unsplash.com/photo-1571266028243-371695039d2c?q=80&w=2670&auto=format&fit=crop",
        description: "מתכננים מסיבה בוילה? DJ מקצועי ירים לכם את האווירה עם הציוד הכי מתקדם."
    },
    {
        id: "massage",
        icon: <Star size={32} className="text-gold" />,
        title: "ספא זוגי בחדר",
        price: "₪700 לזוג",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop",
        description: "שני מעסים יגיעו בו זמנית לטיפול מפנק של 60 דקות באווירה רגועה."
    }
];

export default function ConciergePage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
            {/* Header */}
            <div className="container mx-auto px-4 text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-gold font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Eilat Premium Services</span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                        שירותי <span className="text-gold italic">VIP</span> קונסיירז'
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        אנחנו כאן כדי להגשים כל בקשה. מהפרטים הקטנים ועד האירועים הגדולים, הצוות שלנו יעמוד לרשותכם 24/7.
                    </p>
                </motion.div>
            </div>

            {/* Services Grid */}
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-[#121212] border border-white/5 rounded-3xl overflow-hidden hover:border-gold/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.2)]"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-75 group-hover:brightness-100"
                                />
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/10">
                                    {service.icon}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                                <div className="text-gold font-bold text-lg mb-4">{service.price}</div>
                                <p className="text-white/60 text-sm leading-relaxed mb-6 min-h-[60px]">
                                    {service.description}
                                </p>

                                <a
                                    href={`https://wa.me/972505222536?text=היי, אשמח להזמין שירות קונסיירז': ${service.title}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-white/5 hover:bg-gold hover:text-black text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10 group-hover:border-gold/50"
                                >
                                    <Send size={16} />
                                    הזמן שירות
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Custom Request */}
            <div className="container mx-auto px-4 mt-20 max-w-4xl">
                <div className="bg-gradient-to-r from-gold/20 to-yellow-600/20 rounded-3xl p-8 md:p-12 text-center border border-gold/30 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <h2 className="text-3xl font-bold text-white mb-4 relative z-10">יש לכם בקשה מיוחדת?</h2>
                    <p className="text-white/70 mb-8 max-w-xl mx-auto relative z-10">
                        החל מהשכרת מסוק פרטי ועד שריון שולחן במסעדה הכי מבוקשת בעיר. הצוות שלנו יודע להשיג הכל.
                    </p>

                    <a
                        href="https://wa.me/972505222536?text=היי, יש לי בקשה מיוחדת לשירות קונסיירז'..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gold hover:bg-white text-black font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:shadow-gold/50 transition-all transform hover:scale-105 relative z-10"
                    >
                        <Sparkles size={20} />
                        דבר עם מנהל השירות
                    </a>
                </div>
            </div>
        </div>
    );
}
