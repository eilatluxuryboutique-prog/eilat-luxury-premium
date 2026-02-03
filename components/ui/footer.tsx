"use client";

import { Link } from '@/navigation';
import { Facebook, Instagram, Phone, Mail, MapPin, Globe, CreditCard } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral-950 text-white border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="text-gold" size={32} />
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold to-yellow-200">
                                אילת לקז'רי
                            </h2>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            חוו את שיא היוקרה באילת. האוסף הנבחר שלנו של וילות, דירות ומלונות מבטיח חופשה בלתי נשכחת ברמה הגבוהה ביותר.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-black transition-all">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">קישורים מהירים</h3>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-neutral-400 hover:text-gold transition-colors">דף הבית</Link></li>
                            <li><Link href="/search?type=villa" className="text-neutral-400 hover:text-gold transition-colors">וילות יוקרה</Link></li>
                            <li><Link href="/search?type=apartment" className="text-neutral-400 hover:text-gold transition-colors">דירות נופש</Link></li>
                            <li><Link href="/search?type=hotel" className="text-neutral-400 hover:text-gold transition-colors">מלונות בוטיק</Link></li>
                            <li><Link href="/cart" className="text-neutral-400 hover:text-gold transition-colors">ההזמנות שלי</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">איזור אישי ותמיכה</h3>
                        <ul className="space-y-3">
                            <li><Link href="/login" className="text-neutral-400 hover:text-gold transition-colors">כניסה / הרשמה</Link></li>
                            <li><Link href="/login/admin" className="text-neutral-400 hover:text-gold transition-colors">כניסה למנהלים</Link></li>
                            <li><Link href="/contact" className="text-neutral-400 hover:text-gold transition-colors">צור קשר</Link></li>
                            <li><Link href="/terms" className="text-neutral-400 hover:text-gold transition-colors">תנאי שימוש</Link></li>
                            <li><Link href="/privacy" className="text-neutral-400 hover:text-gold transition-colors">מדיניות פרטיות</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">יצירת קשר</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-neutral-400">
                                <MapPin className="text-gold shrink-0 mt-1" size={18} />
                                <span>שדרות התמרים, אילת</span>
                            </li>
                            <li className="flex items-center gap-3 text-neutral-400">
                                <Phone className="text-gold shrink-0" size={18} />
                                <a href="tel:050-522-2536" className="hover:text-white transition-colors">050-522-2536</a>
                            </li>
                            <li className="flex items-center gap-3 text-neutral-400">
                                <Mail className="text-gold shrink-0" size={18} />
                                <a href="mailto:info@eilat-luxury.com" className="hover:text-white transition-colors">info@eilat-luxury.com</a>
                            </li>
                        </ul>
                        <div className="mt-6 flex items-center gap-2 text-neutral-500 text-sm">
                            <CreditCard size={16} />
                            <span>סליקה מאובטחת בתקן PCI</span>
                        </div>
                    </div>
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
