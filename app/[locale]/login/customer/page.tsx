'use client';

import { useTranslations } from 'next-intl';
import LoginForm from '@/components/auth/login-form';

export default function CustomerLoginPage() {
    const t = useTranslations('Auth');
    return (
        <main className="min-h-screen pt-24 pb-12 bg-[#121212] flex items-center justify-center px-4" dir="rtl">
            <LoginForm
                title={t('login_customer_title')}
                subtitle={t('login_customer_subtitle')}
                role="guest"
                redirectPath="/account"
                registerRole="guest"
                showRegisterLink={true}
            />
        </main>
    );
}
