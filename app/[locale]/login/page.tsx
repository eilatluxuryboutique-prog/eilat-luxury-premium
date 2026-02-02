'use client';

import { useTranslations } from 'next-intl';
import { Shield, Building, User } from 'lucide-react';
import Link from 'next/link';

export default function LoginGatewayPage() {
    const t = useTranslations('Auth');

    return (
        <main className="min-h-screen pt-24 pb-12 bg-[#121212] flex items-center justify-center px-4" dir="rtl">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">{t('login_gateway_title')}</h1>
                    <p className="text-white/50 text-lg">{t('login_gateway_subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Admin */}
                    <Link
                        href="/login/admin"
                        className="group bg-[#1E1E1E] border border-white/10 hover:border-gold p-8 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/10 text-center flex flex-col items-center gap-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                            <Shield size={40} className="text-white/50 group-hover:text-gold transition-colors" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{t('login_admin_title')}</h2>
                            <p className="text-white/50">{t('login_admin_subtitle')}</p>
                        </div>
                    </Link>

                    {/* Business Owner */}
                    <Link
                        href="/login/host"
                        className="group bg-[#1E1E1E] border border-white/10 hover:border-gold p-8 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/10 text-center flex flex-col items-center gap-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                            <Building size={40} className="text-white/50 group-hover:text-gold transition-colors" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{t('login_host_title')}</h2>
                            <p className="text-white/50">{t('login_host_subtitle')}</p>
                        </div>
                    </Link>

                    {/* Customer */}
                    <Link
                        href="/login/customer"
                        className="group bg-[#1E1E1E] border border-white/10 hover:border-gold p-8 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/10 text-center flex flex-col items-center gap-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                            <User size={40} className="text-white/50 group-hover:text-gold transition-colors" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{t('login_customer_title')}</h2>
                            <p className="text-white/50">{t('login_customer_subtitle')}</p>
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    );
}
