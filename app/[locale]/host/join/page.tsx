"use client";

import Hero from "@/components/features/hero";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, Star, Shield, DollarSign } from "lucide-react";
import EditableText from "@/components/admin/editable-text";

export default function HostJoinPage() {
    const t = useTranslations('Host');

    const benefits = [
        { icon: DollarSign, title: t('benefits.earn_title'), desc: t('benefits.earn_desc') },
        { icon: Shield, title: t('benefits.protection_title'), desc: t('benefits.protection_desc') },
        { icon: Star, title: t('benefits.guests_title'), desc: t('benefits.guests_desc') },
        { icon: Check, title: t('benefits.manage_title'), desc: t('benefits.manage_desc') },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 pb-20" dir="rtl">
            {/* Hero Section */}
            <div className="relative h-[60vh] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512918760383-edce13a0333d?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950"></div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-black text-3d-white-black mb-6"
                    >
                        {t('hero_title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl text-white/90 font-bold max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
                    >
                        {t('hero_subtitle')}
                    </motion.p>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 -mt-20 relative z-20">
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-premium p-8 md:p-10 rounded-3xl"
                    >
                        <h2 className="text-3xl font-bold text-white mb-2">{t('form_title')}</h2>
                        <p className="text-white/60 mb-8">{t('form_subtitle')}</p>

                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gold uppercase tracking-wider">{t('first_name')}</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-gold transition-colors" placeholder="יוסי" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gold uppercase tracking-wider">{t('last_name')}</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-gold transition-colors" placeholder="כהן" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gold uppercase tracking-wider">{t('property_type')}</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-gold transition-colors">
                                    <option className="bg-neutral-900" value="villa">{t('types.villa')}</option>
                                    <option className="bg-neutral-900" value="penthouse">{t('types.penthouse')}</option>
                                    <option className="bg-neutral-900" value="hotel">{t('types.hotel')}</option>
                                    <option className="bg-neutral-900" value="other">{t('types.other')}</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gold uppercase tracking-wider">{t('phone')}</label>
                                <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-gold transition-colors" placeholder="050-0000000" />
                            </div>

                            <button type="button" className="w-full bg-gold hover:bg-gold-light text-black font-black text-lg py-5 rounded-xl shadow-lg shadow-gold/20 hover:scale-[1.02] transition-all">
                                {t('submit')}
                            </button>
                        </form>
                    </motion.div>

                    {/* Benefits Section */}
                    <div className="space-y-8 pt-10">
                        {benefits.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-6 items-start p-6 rounded-2xl hover:bg-white/5 transition-colors group"
                            >
                                <div className="p-4 bg-gold/10 rounded-full text-gold group-hover:scale-110 transition-transform">
                                    <item.icon size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-white/60 text-lg leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
