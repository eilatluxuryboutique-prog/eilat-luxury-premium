'use client';

import { useTranslations } from 'next-intl';
import LoginForm from '@/components/auth/login-form';

export default function AdminLoginPage() {
    const t = useTranslations('Auth');
    return (
        <main className="min-h-screen pt-24 pb-12 bg-[#121212] flex items-center justify-center px-4" dir="rtl">
            <LoginForm
                title={t('login_admin_title')}
                subtitle={t('login_admin_subtitle')}
                role="admin"
                redirectPath="/admin"
                showRegisterLink={false} // User requested simplified login
                presetEmail="eilat.luxury.boutique@gmail.com"
            />
        </main>
    );
}
