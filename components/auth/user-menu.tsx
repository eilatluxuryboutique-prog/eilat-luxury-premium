'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link, useRouter } from '@/navigation'; // Ensure using correct navigation imports
import { User, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function UserMenu() {
    const t = useTranslations('Auth');
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

    const params = useParams();
    const locale = params.locale || 'he';

    const handleLogout = () => {
        setIsOpen(false);
        localStorage.removeItem('user');
        // Direct server-side logout and redirect with locale
        window.location.href = `/api/auth/logout?lang=${locale}`;
    };

    if (loading) return null;

    if (!user) {
        return (
            <Link
                href="/login"
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-5 py-2.5 rounded-full font-bold transition-all text-sm border border-zinc-200 shadow-sm flex items-center gap-2"
            >
                <User size={16} className="text-gold" />
                {t('login_link')}
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
                <span className="hidden md:inline">{t('account_menu_label')}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-zinc-100 rounded-2xl shadow-2xl overflow-hidden py-2 z-50 ring-1 ring-black/5">
                    <div className="px-4 py-3 border-b border-zinc-50 mb-2 bg-zinc-50/50">
                        <p className="text-zinc-900 font-bold truncate">{user.name}</p>
                        <p className="text-zinc-500 text-xs truncate capitalize">
                            {user.role === 'admin' ? t('admin_panel') :
                                user.role === 'host' ? t('role_host_desc') : t('role_guest_desc')}
                        </p>
                    </div>

                    <Link
                        href="/host/join"
                        className="flex items-center gap-3 px-4 py-2.5 text-gold hover:bg-zinc-50 transition-colors font-bold"
                        onClick={() => setIsOpen(false)}
                    >
                        <LayoutDashboard size={16} />
                        {t('list_asset') || 'פרסם נכס'}
                    </Link>

                    {(user.role === 'host' || user.role === 'admin') && (
                        <Link
                            href="/host"
                            className="flex items-center gap-3 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-gold transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <LayoutDashboard size={16} />
                            {t('business_dashboard')}
                        </Link>
                    )}

                    {user.role === 'guest' && (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-gold transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <ShoppingBag size={16} />
                            {t('my_account')}
                        </Link>
                    )}

                    <div className="px-4 py-3 bg-zinc-50/30 my-1">
                        <div className="text-[10px] text-gold font-black uppercase tracking-widest mb-1">Loyalty Rewards</div>
                        <div className="flex justify-between text-sm text-zinc-900 font-medium">
                            <span>Points</span>
                            <span className="font-bold text-gold">{user.loyaltyPoints || 0}</span>
                        </div>
                    </div>

                    {user.role === 'admin' && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-gold transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <LayoutDashboard size={16} />
                            {t('admin_panel')}
                        </Link>
                    )}

                    <div className="border-t border-zinc-100 mt-1 pt-1">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors font-bold text-sm"
                        >
                            <LogOut size={16} />
                            {t('logout')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
