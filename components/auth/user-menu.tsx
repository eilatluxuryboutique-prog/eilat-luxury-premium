'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link, useRouter } from '@/navigation'; // Ensure using correct navigation imports
import { User, LogOut, LayoutDashboard, ShoppingBag, Menu, UserCircle } from 'lucide-react';
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
                className="flex items-center gap-3 border border-[#dddddd] rounded-full p-[5px] pl-3 hover:shadow-md transition-shadow bg-white cursor-pointer"
            >
                <Menu size={18} className="text-[#222222]" />
                <UserCircle size={30} className="text-[#717171]" />
            </Link>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 border border-[#dddddd] rounded-full p-[5px] pl-3 hover:shadow-md transition-shadow bg-white cursor-pointer"
                aria-label="תפריט משתמש"
                aria-expanded={isOpen}
            >
                <Menu size={18} className="text-[#222222]" aria-hidden="true" />
                <div className="relative">
                    <UserCircle size={30} className="text-[#717171]" aria-hidden="true" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                </div>
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
                        <div className="text-[10px] text-gold font-black uppercase tracking-widest mb-1">מועדון יוקרה</div>
                        <div className="flex justify-between text-sm text-zinc-900 font-medium">
                            <span>נקודות</span>
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
