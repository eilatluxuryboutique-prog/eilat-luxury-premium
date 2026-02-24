'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SocialLoginButtons from '@/components/auth/social-login';
import { User, Briefcase, ShieldCheck } from 'lucide-react';

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
        <div className="min-h-screen bg-neutral-950 flex md:flex-row-reverse" dir="rtl">
            {/* Image Side */}
            <div className="hidden md:block w-1/2 relative bg-neutral-900">
                <Image
                    src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2000&auto=format&fit=crop"
                    alt="Luxury Hotel"
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-neutral-950 to-transparent"></div>
                <div className="absolute bottom-20 right-20 text-white max-w-md">
                    <h2 className="text-4xl font-bold mb-4">ברוכים הבאים לאילת לקז'רי</h2>
                    <p className="text-xl text-white/80">החופשה החלומית שלכם מתחילה כאן.</p>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 pt-32 md:p-12 md:pt-32">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-right">
                        <Link href="/" className="hidden text-gold font-bold text-2xl">Eilat Luxury</Link>

                        {/* Role Selector Tabs */}
                        <div className="flex bg-neutral-900 p-1 rounded-xl mt-6 mb-2">
                            <button
                                type="button"
                                onClick={() => setLoginType('customer')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${loginType === 'customer' ? 'bg-gold text-black shadow-md' : 'text-neutral-400 hover:text-white'}`}
                            >
                                <User size={16} />
                                לקוח
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginType('host')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${loginType === 'host' ? 'bg-gold text-black shadow-md' : 'text-neutral-400 hover:text-white'}`}
                            >
                                <Briefcase size={16} />
                                בעל עסק
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginType('admin')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${loginType === 'admin' ? 'bg-gold text-black shadow-md' : 'text-neutral-400 hover:text-white'}`}
                            >
                                <ShieldCheck size={16} />
                                מנהל
                            </button>
                        </div>

                        <h1 className="text-3xl font-bold text-white mt-4">{getTitle()}</h1>
                        <p className="text-neutral-400 mt-2">{getSubtitle()}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1">אימייל</label>
                            <input
                                type="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-1">סיסמה</label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold outline-none transition-colors"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {loading ? 'מתחבר...' : 'התחבר'}
                        </button>
                    </form>

                    {
                        loginType === 'customer' && (
                            <>
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-neutral-950 px-4 text-neutral-500">או המשך באמצעות</span>
                                    </div>
                                </div>

                                <SocialLoginButtons />
                            </>
                        )
                    }

                    <div className="text-center text-sm text-neutral-400">
                        אין לך חשבון? <Link href="/register" className="text-gold hover:underline">הרשמה</Link>
                    </div>
                </div >
            </div >
        </div >
    );
}
