'use client';

import { useState, useEffect } from 'react';
import { Link, useRouter } from '@/navigation'; // Ensure using correct navigation imports
import { User, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function UserMenu() {
    const t = useTranslations('Navigation');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        setIsOpen(false);
        router.push('/');
        router.refresh();
    };

    if (loading) return null;

    if (!user) {
        return (
            <Link
                href="/login"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-medium transition-colors text-sm"
            >
                {t('Auth.login_link')}
            </Link>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold px-4 py-2 rounded-full font-medium transition-colors border border-gold/30"
            >
                <User size={18} />
                <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl overflow-hidden py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                        <p className="text-white font-medium truncate">{user.name}</p>
                        <p className="text-white/50 text-xs truncate capitalize">
                            {user.role === 'admin' ? t('Auth.admin_panel') :
                                user.role === 'host' ? t('Auth.role_host_desc') : t('Auth.role_guest_desc')}
                        </p>
                    </div>

                    {(user.role === 'host' || user.role === 'admin') && (
                        <Link
                            href="/host"
                            className="flex items-center gap-3 px-4 py-2 text-white/80 hover:bg-white/5 hover:text-gold transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <LayoutDashboard size={16} />
                            {t('Auth.business_dashboard')}
                        </Link>
                    )}

                    {user.role === 'guest' && (
                        <Link
                            href="/account"
                            className="flex items-center gap-3 px-4 py-2 text-white/80 hover:bg-white/5 hover:text-gold transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <ShoppingBag size={16} />
                            {t('Auth.my_account')}
                        </Link>
                    )}

                    {user.role === 'admin' && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2 text-white/80 hover:bg-white/5 hover:text-gold transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <LayoutDashboard size={16} />
                            {t('Auth.admin_panel')}
                        </Link>
                    )}

                    <div className="border-t border-white/5 mt-2 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                            <LogOut size={16} />
                            {t('Auth.logout')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
