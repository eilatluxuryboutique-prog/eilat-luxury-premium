'use client';

import { useTranslations } from 'next-intl';
import LoginForm from '@/components/auth/login-form';

export default function HostLoginPage() {
    const t = useTranslations('Auth');
    return (
        <main className="min-h-screen pt-24 pb-12 bg-[#121212] flex items-center justify-center px-4" dir="rtl">
            <LoginForm
                title={t('login_host_title')}
                subtitle={t('login_host_subtitle')}
                role="host"
                redirectPath="/host"
                registerRole="host"
                showRegisterLink={true}
            />
        </main>
    );
}
