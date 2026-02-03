"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Facebook, Instagram, Phone, Mail, MapPin, Globe, CreditCard } from 'lucide-react';

export default function Footer() {
    const t = useTranslations('Footer'); // I'll assume keys exist or fallback
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
                                Eilat Luxury
                            </h2>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Experience the ultimate luxury in Eilat. Our handpicked collection of villas, apartments, and hotels ensures an unforgettable vacation.
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
                        <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-neutral-400 hover:text-gold transition-colors">Home</Link></li>
                            <li><Link href="/search?type=villa" className="text-neutral-400 hover:text-gold transition-colors">Villas</Link></li>
                            <li><Link href="/search?type=apartment" className="text-neutral-400 hover:text-gold transition-colors">Apartments</Link></li>
                            <li><Link href="/search?type=hotel" className="text-neutral-400 hover:text-gold transition-colors">Hotels</Link></li>
                            <li><Link href="/cart" className="text-neutral-400 hover:text-gold transition-colors">My Cart</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Support</h3>
                        <ul className="space-y-3">
                            <li><Link href="/login" className="text-neutral-400 hover:text-gold transition-colors">Login / Register</Link></li>
                            <li><Link href="/login/admin" className="text-neutral-400 hover:text-gold transition-colors">Admin Access</Link></li>
                            <li><Link href="/contact" className="text-neutral-400 hover:text-gold transition-colors">Contact Us</Link></li>
                            <li><Link href="/terms" className="text-neutral-400 hover:text-gold transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="text-neutral-400 hover:text-gold transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-neutral-400">
                                <MapPin className="text-gold shrink-0 mt-1" size={18} />
                                <span>HaTmarim Blvd, Eilat, Israel</span>
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
                            <span>Secure Payment</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-neutral-500 text-sm py-4">
                        © {currentYear} Eilat Luxury Booking. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-neutral-500">
                        <Link href="/terms" className="hover:text-gold transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
                        <Link href="/cookies" className="hover:text-gold transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
