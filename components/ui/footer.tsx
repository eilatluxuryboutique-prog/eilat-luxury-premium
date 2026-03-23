"use client";

import { Link } from '@/navigation';
import { Facebook, Instagram, Phone, Mail, MapPin, Globe, CreditCard, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

function FooterSection({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/5 md:border-none pb-4 md:pb-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between md:hidden py-4"
            >
                <h3 className="text-lg font-bold text-zinc-800">{title}</h3>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={20} className="text-gold" />
                </motion.div>
            </button>

            <h3 className="hidden md:block text-lg font-bold text-zinc-800 mb-6">{title}</h3>

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
    const tF = useTranslations('Footer');
    const tN = useTranslations('Navigation');
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
        <footer className="bg-white text-zinc-800 border-t border-zinc-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">

                    {/* Column 1: Brand & Newsletter */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                            <Globe className="text-gold" size={32} />
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold to-yellow-600">
                                אילת לקז'רי
                            </h2>
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed text-center md:text-right">
                            {tF('brand_desc')}
                        </p>

                        {/* Newsletter Form */}
                        <form onSubmit={handleSubscribe} className="pt-4">
                            <p className="text-zinc-800 text-sm font-bold mb-2 text-center md:text-right">{tF('newsletter_btn')}</p>
                            <div className="flex bg-zinc-50 rounded-lg border border-zinc-200 overflow-hidden focus-within:border-gold/50 transition-colors">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={tF('newsletter_placeholder')}
                                    className="bg-transparent flex-1 px-4 py-2 text-zinc-900 text-sm outline-none w-full placeholder:text-zinc-400"
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
                            {status === 'success' && <p className="text-green-600 text-xs mt-2 text-center md:text-right">Success 🎉</p>}
                            {status === 'error' && <p className="text-red-500 text-xs mt-2 text-center md:text-right">Error.</p>}
                        </form>

                        <div className="flex gap-4 pt-4 justify-center md:justify-start">
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links - Accordion on Mobile */}
                    <FooterSection title={tF('quick_links')}>
                        <ul className="space-y-3 text-center md:text-right">
                            <li><Link href="/" className="text-zinc-500 hover:text-gold transition-colors">{tN('home')}</Link></li>
                            <li><Link href="/search?type=villa" className="text-zinc-500 hover:text-gold transition-colors">{tN('villas')}</Link></li>
                            <li><Link href="/search?type=apartment" className="text-zinc-500 hover:text-gold transition-colors">{tN('apartments')}</Link></li>
                            <li><Link href="/search?type=hotel" className="text-zinc-500 hover:text-gold transition-colors">{tN('hotels')}</Link></li>
                            <li><Link href="/cart" className="text-zinc-500 hover:text-gold transition-colors">{tF('my_orders')}</Link></li>
                        </ul>
                    </FooterSection>

                    {/* Column 3: Support - Accordion on Mobile */}
                    <FooterSection title={tF('support')}>
                        <ul className="space-y-3 text-center md:text-right">
                            <li><Link href="/login" className="text-zinc-500 hover:text-gold transition-colors">{tF('login_register')}</Link></li>
                            <li><Link href="/login/admin" className="text-zinc-500 hover:text-gold transition-colors">{tF('admin_login')}</Link></li>
                            <li><Link href="/contact" className="text-zinc-500 hover:text-gold transition-colors">{tN('contact')}</Link></li>
                            <li><Link href="/terms" className="text-zinc-500 hover:text-gold transition-colors">{tF('terms')}</Link></li>
                            <li><Link href="/privacy" className="text-zinc-500 hover:text-gold transition-colors">{tF('privacy')}</Link></li>
                        </ul>
                    </FooterSection>

                    {/* Column 4: Contact - Accordion on Mobile */}
                    <FooterSection title={tF('contact_us')}>
                        <ul className="space-y-4 text-center md:text-right">
                            <li className="flex items-start gap-3 text-zinc-500 justify-center md:justify-start">
                                <MapPin className="text-gold shrink-0 mt-1" size={18} />
                                <span>{tF('address')}</span>
                            </li>
                            <li className="flex items-center gap-3 text-zinc-500 justify-center md:justify-start">
                                <Phone className="text-gold shrink-0" size={18} />
                                <a href="tel:050-222-5536" className="hover:text-zinc-800 transition-colors">050-222-5536</a>
                            </li>
                            <li className="flex items-center gap-3 text-zinc-500 justify-center md:justify-start">
                                <Mail className="text-gold shrink-0" size={18} />
                                <a href="mailto:eilat.luxury.boutique@gmail.com" className="hover:text-zinc-800 transition-colors">eilat.luxury.boutique@gmail.com</a>
                            </li>
                        </ul>
                        <div className="mt-6 flex items-center gap-2 text-zinc-400 text-sm justify-center md:justify-start">
                            <CreditCard size={16} />
                            <span>{tF('secure_clearing')}</span>
                        </div>
                    </FooterSection>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right">
                    <p className="text-zinc-400 text-sm py-2">
                        © {currentYear} Eilat Booking Premium. {tF('rights')} <span className="mx-2">|</span> <span className="font-bold text-zinc-300">{tF('tlh')}</span>
                    </p>
                    <div className="flex gap-6 text-sm text-zinc-400 justify-center">
                        <Link href="/terms" className="hover:text-gold transition-colors">{tF('terms')}</Link>
                        <Link href="/privacy" className="hover:text-gold transition-colors">{tF('privacy')}</Link>
                        <Link href="/cookies" className="hover:text-gold transition-colors">{tN('accessibility')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
