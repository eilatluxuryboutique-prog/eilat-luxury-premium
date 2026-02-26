'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('success');
        setTimeout(() => {
            setEmail('');
            setStatus('idle');
        }, 3000);
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gold-gradient opacity-5 skew-y-3 scale-110"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto bg-white border border-zinc-100 rounded-3xl p-8 md:p-16 text-center shadow-[0_10px_50px_rgba(0,0,0,0.03)]">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gold/20">
                            <Mail className="text-black" size={32} />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4">
                            הצטרפו למועדון <span className="text-gold-gradient">הפרימיום</span>
                        </h2>
                        <p className="text-zinc-600 text-lg mb-8 max-w-lg mx-auto">
                            קבלו גישה ראשונים למבצעים בלעדיים, וילות חדשות והמלצות סודיות ישירות למייל.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto relative">
                            <div className="relative flex-grow">
                                <input
                                    type="email"
                                    placeholder="האימייל שלך..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-4 pr-12 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-gold/50 transition-all"
                                />
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                            </div>
                            <button
                                type="submit"
                                className="bg-gold hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-gold/20"
                            >
                                {status === 'success' ? 'נרשמת בהצלחה!' : 'הרשמו עכשיו'}
                                {status !== 'success' && <ArrowLeft size={20} />}
                            </button>
                        </form>

                        <p className="text-zinc-400 text-xs mt-6">
                            אנו מכבדים את הפרטיות שלך. אפשר להסיר הרשמה בכל עת.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
