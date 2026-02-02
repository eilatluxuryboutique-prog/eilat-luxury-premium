'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error);

            // Redirect based on role
            if (result.user.role === 'admin') router.push('/admin');
            else if (result.user.role === 'host') router.push('/host');
            else router.push('/account');

            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-12 bg-[#121212] flex items-center justify-center px-4" dir="rtl">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{t('login_title')}</h1>
                    <p className="text-white/50">{t('login_subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#1E1E1E] border border-white/10 p-8 rounded-2xl shadow-xl">
                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">{t('email')}</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">{t('password')}</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-gold"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gold hover:bg-gold-light text-black font-bold py-4 rounded-xl mt-8 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : t('login_btn')}
                    </button>

                    <p className="text-center text-neutral-500 mt-6 text-sm">
                        {t('no_account')} {' '}
                        <Link href="/register" className="text-gold hover:underline">
                            {t('sign_up')}
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
