"use client";

import { Link } from '@/navigation';
import { Facebook, Instagram, Phone, Mail, MapPin, Globe, CreditCard, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FooterSection({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/5 md:border-none pb-4 md:pb-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between md:hidden py-4"
            >
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={20} className="text-gold" />
                </motion.div>
            </button>

            <h3 className="hidden md:block text-lg font-bold text-white mb-6">{title}</h3>

            <AnimatePresence>
                {(isOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
                    <motion.div
                        initial={false}
                        animate={{
                            height: (isOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) ? "auto" : 0,
                            opacity: (isOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) ? 1 : 0
                        }}
                        className="overflow-hidden md:!h-auto md:!opacity-100"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'newsletter', email })
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
                setTimeout(() => setStatus(''), 3000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <footer className="bg-neutral-950 text-white border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">

                    {/* Column 1: Brand & Newsletter */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                            <Globe className="text-gold" size={32} />
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold to-yellow-200">
                                אילת לקז'רי
                            </h2>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed text-center md:text-right">
                            חוו את שיא היוקרה באילת. האוסף הנבחר שלנו של וילות, דירות ומלונות מבטיח חופשה בלתי נשכחת.
                        </p>

                        {/* Newsletter Form */}
                        <form onSubmit={handleSubscribe} className="pt-4">
                            <p className="text-white/80 text-sm font-bold mb-2 text-center md:text-right">הירשמו לניוזלטר שלנו</p>
                            <div className="flex bg-white/5 rounded-lg border border-white/10 overflow-hidden focus-within:border-gold/50 transition-colors">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="האימייל שלך..."
                                    className="bg-transparent flex-1 px-4 py-2 text-white text-sm outline-none w-full"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'sending' || status === 'success'}
                                    className="bg-gold hover:bg-yellow-400 text-black px-4 font-bold disabled:opacity-50 transition-colors"
                                >
                                    <Mail size={18} />
                                </button>
                            </div>
                            {status === 'success' && <p className="text-green-400 text-xs mt-2 text-center md:text-right">נרשמת בהצלחה! 🎉</p>}
                            {status === 'error' && <p className="text-red-400 text-xs mt-2 text-center md:text-right">שגיאה בהרשמה.</p>}
                        </form>

                        <div className="flex gap-4 pt-4 justify-center md:justify-start">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links - Accordion on Mobile */}
                    <FooterSection title="קישורים מהירים">
                        <ul className="space-y-3 text-center md:text-right">
                            <li><Link href="/" className="text-neutral-400 hover:text-gold transition-colors">דף הבית</Link></li>
                            <li><Link href="/search?type=villa" className="text-neutral-400 hover:text-gold transition-colors">וילות יוקרה</Link></li>
                            <li><Link href="/search?type=apartment" className="text-neutral-400 hover:text-gold transition-colors">דירות נופש</Link></li>
                            <li><Link href="/search?type=hotel" className="text-neutral-400 hover:text-gold transition-colors">מלונות בוטיק</Link></li>
                            <li><Link href="/cart" className="text-neutral-400 hover:text-gold transition-colors">ההזמנות שלי</Link></li>
                        </ul>
                    </FooterSection>

                    {/* Column 3: Support - Accordion on Mobile */}
                    <FooterSection title="איזור אישי ותמיכה">
                        <ul className="space-y-3 text-center md:text-right">
                            <li><Link href="/login" className="text-neutral-400 hover:text-gold transition-colors">כניסה / הרשמה</Link></li>
                            <li><Link href="/login/admin" className="text-neutral-400 hover:text-gold transition-colors">כניסה למנהלים</Link></li>
                            <li><Link href="/contact" className="text-neutral-400 hover:text-gold transition-colors">צור קשר</Link></li>
                            <li><Link href="/terms" className="text-neutral-400 hover:text-gold transition-colors">תנאי שימוש</Link></li>
                            <li><Link href="/privacy" className="text-neutral-400 hover:text-gold transition-colors">מדיניות פרטיות</Link></li>
                        </ul>
                    </FooterSection>

                    {/* Column 4: Contact - Accordion on Mobile */}
                    <FooterSection title="יצירת קשר">
                        <ul className="space-y-4 text-center md:text-right">
                            <li className="flex items-start gap-3 text-neutral-400 justify-center md:justify-start">
                                <MapPin className="text-gold shrink-0 mt-1" size={18} />
                                <span>שדרות התמרים, אילת</span>
                            </li>
                            <li className="flex items-center gap-3 text-neutral-400 justify-center md:justify-start">
                                <Phone className="text-gold shrink-0" size={18} />
                                <a href="tel:050-522-2536" className="hover:text-white transition-colors">050-522-2536</a>
                            </li>
                            <li className="flex items-center gap-3 text-neutral-400 justify-center md:justify-start">
                                <Mail className="text-gold shrink-0" size={18} />
                                <a href="mailto:info@eilat-luxury.com" className="hover:text-white transition-colors">info@eilat-luxury.com</a>
                            </li>
                        </ul>
                        <div className="mt-6 flex items-center gap-2 text-neutral-500 text-sm justify-center md:justify-start">
                            <CreditCard size={16} />
                            <span>סליקה מאובטחת בתקן PCI</span>
                        </div>
                    </FooterSection>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right">
                    <p className="text-neutral-500 text-sm py-2">
                        © {currentYear} אילת בוקינג פרימיום. כל הזכויות שמורות. <span className="mx-2">|</span> <span className="font-bold text-neutral-600">ט.ל.ח</span>
                    </p>
                    <div className="flex gap-6 text-sm text-neutral-500 justify-center">
                        <Link href="/terms" className="hover:text-gold transition-colors">תקנון</Link>
                        <Link href="/privacy" className="hover:text-gold transition-colors">פרטיות</Link>
                        <Link href="/cookies" className="hover:text-gold transition-colors">נגישות</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
