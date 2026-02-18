"use client";

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: 'contact' })
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-black text-white mb-4">
                        צור <span className="text-gold">קשר</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        אנחנו כאן לכל שאלה, בקשה או הזמנה מיוחדת. הצוות שלנו זמין עבורך 24/7 כדי להבטיח את החופשה המושלמת.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 hover:border-gold/30 transition-colors group">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-black transition-all">
                                <Phone size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">טלפון</h3>
                            <p className="text-white/60 mb-4">זמינים בימים א'-ה' בין 09:00-20:00</p>
                            <a href="tel:050-522-2536" className="text-2xl font-bold text-gold hover:text-white transition-colors ltr">
                                050-522-2536
                            </a>
                        </div>

                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 hover:border-gold/30 transition-colors group">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-black transition-all">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">אימייל</h3>
                            <p className="text-white/60 mb-4">מענה תוך 24 שעות לכל פנייה</p>
                            <a href="mailto:info@eilat-luxury.com" className="text-xl font-bold text-gold hover:text-white transition-colors">
                                info@eilat-luxury.com
                            </a>
                        </div>

                        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 hover:border-gold/30 transition-colors group">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-black transition-all">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">משרדנו</h3>
                            <p className="text-white/60">שדרות התמרים, אילת</p>
                            <p className="text-white/40 text-sm mt-2">יש לתאם פגישה מראש</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#1E1E1E] p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden"
                    >
                        {/* Background Gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

                        <h2 className="text-2xl font-bold text-white mb-8">שלח לנו הודעה</h2>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">שם מלא</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-gold/50 outline-none transition-all placeholder:text-white/20"
                                    placeholder="דניאל כהן"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">אימייל</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-gold/50 outline-none transition-all placeholder:text-white/20"
                                    placeholder="daniel@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">תוכן ההודעה</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={5}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-gold/50 outline-none transition-all placeholder:text-white/20 resize-none"
                                    placeholder="אשמח לקבל פרטים נוספים לגבי..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending' || status === 'success'}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${status === 'success'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gold hover:bg-yellow-400 text-black hover:shadow-lg hover:shadow-gold/20'
                                    }`}
                            >
                                {status === 'sending' ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> שולח...
                                    </>
                                ) : status === 'success' ? (
                                    'ההודעה נשלחה בהצלחה! ✓'
                                ) : (
                                    <>
                                        שלח הודעה <Send size={18} />
                                    </>
                                )}
                            </button>

                            {status === 'error' && (
                                <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
                                    אירעה שגיאה בשליחת ההודעה. נסה שוב מאוחר יותר.
                                </p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
