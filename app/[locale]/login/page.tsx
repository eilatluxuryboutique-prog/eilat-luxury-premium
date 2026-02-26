'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SocialLoginButtons from '@/components/auth/social-login';
import { User, Briefcase, ShieldCheck, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';

type LoginType = 'customer' | 'host' | 'admin';

export default function LoginPage() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loginType, setLoginType] = useState<LoginType>('customer');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (loginType === 'admin') {
            await signIn('google', { callbackUrl: '/admin' });
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'פרטי התחברות שגויים');
                setLoading(false);
            } else {
                // Determine redirect based on role
                const role = data.user?.role;
                if (role === 'admin') router.push('/admin');
                else if (role === 'host') router.push('/host');
                else router.push('/dashboard');
            }
        } catch (err) {
            setError('שגיאת תקשורת. נסה שוב מאוחר יותר.');
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (loginType === 'admin') return 'התחברות מנהל מערכת';
        if (loginType === 'host') return 'התחברות בעלי עסקים';
        return 'התחברות לאזור האישי';
    };

    const getSubtitle = () => {
        if (loginType === 'admin') return 'פאנל ניהול Eilat Luxury';
        if (loginType === 'host') return 'ניהול נכסים והזמנות';
        return 'החופשה החלומית הבאה שלך';
    };

    return (
        <div className="min-h-screen bg-white flex md:flex-row-reverse" dir="rtl">
            {/* Image Side */}
            <div className="hidden md:block w-1/2 relative bg-zinc-50">
                <Image
                    src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2000&auto=format&fit=crop"
                    alt="Luxury Hotel"
                    fill
                    className="object-cover opacity-90 shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent"></div>
                <div className="absolute bottom-20 right-20 text-zinc-900 max-w-md drop-shadow-sm">
                    <h2 className="text-4xl font-bold mb-4">ברוכים הבאים לאילת לקז'רי</h2>
                    <p className="text-xl text-zinc-700">החופשה החלומית שלכם מתחילה כאן.</p>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-right mb-10">
                        <Link href="/" className="inline-block mb-8 transition-transform hover:scale-105">
                            <span className="text-3xl font-black text-zinc-900 tracking-tighter">Eilat<span className="text-gold-gradient">Luxury</span></span>
                        </Link>

                        <h1 className="text-4xl font-black text-white mb-2 [text-shadow:0_0_10px_rgba(255,255,255,0.3)] [-webkit-text-stroke:0.5px_#D4AF37] drop-shadow-[0_2px_5px_rgba(212,175,55,0.3)]">{getTitle()}</h1>
                        <p className="text-zinc-500 font-medium">{getSubtitle()}</p>
                    </div>

                    {/* Role Selector Tabs - Premium White Refresh */}
                    <div className="bg-zinc-50 p-1.5 rounded-2xl flex gap-1 mb-8 border border-zinc-100 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setLoginType('customer')}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${loginType === 'customer' ? 'bg-white text-zinc-900 shadow-md ring-1 ring-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}
                        >
                            <User size={14} />
                            לקוח
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginType('host')}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${loginType === 'host' ? 'bg-white text-zinc-900 shadow-md ring-1 ring-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}
                        >
                            <Briefcase size={14} />
                            בעל עסק
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginType('admin')}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${loginType === 'admin' ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-600'}`}
                        >
                            <ShieldCheck size={14} />
                            מנהל
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {loginType !== 'admin' && (
                            <>
                                <div>
                                    <label className="block text-zinc-700 text-sm font-medium mb-1">אימייל</label>
                                    <input
                                        type="email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-gold outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-700 text-sm font-medium mb-1">סיסמה</label>
                                    <input
                                        type="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-gold outline-none transition-colors"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {error && <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {loading ? 'מתחבר...' : loginType === 'admin' ? 'התחבר עם Google' : 'התחבר'}
                        </button>
                    </form>

                    {
                        loginType === 'customer' && (
                            <>
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-zinc-100"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-white px-4 text-zinc-400">או המשך באמצעות</span>
                                    </div>
                                </div>

                                <SocialLoginButtons />
                            </>
                        )
                    }

                    <div className="text-center text-sm text-zinc-500">
                        אין לך חשבון? <Link href="/register" className="text-gold hover:underline font-bold">הרשמה</Link>
                    </div>
                </div >
            </div >
        </div >
    );
}
