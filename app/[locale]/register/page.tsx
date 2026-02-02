'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Building, User, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState<'guest' | 'host'>('guest');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, role }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error);

            // Redirect based on role
            router.push(role === 'host' ? '/host' : '/account');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-12 bg-[#121212] flex items-center justify-center px-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Join EilatLuxury</h1>
                    <p className="text-white/50">Select your account type to get started</p>
                </div>

                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setRole('guest')}
                        className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${role === 'guest'
                                ? 'bg-gold/10 border-gold text-white'
                                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                            }`}
                    >
                        <User size={32} className={role === 'guest' ? 'text-gold' : ''} />
                        <span className="font-bold">I want to book</span>
                    </button>
                    <button
                        onClick={() => setRole('host')}
                        className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${role === 'host'
                                ? 'bg-gold/10 border-gold text-white'
                                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                            }`}
                    >
                        <Building size={32} className={role === 'host' ? 'text-gold' : ''} />
                        <span className="font-bold">I want to host</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-[#1E1E1E] border border-white/10 p-8 rounded-2xl shadow-xl">
                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-gold"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-gold"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-gold"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gold hover:bg-gold-light text-black font-bold py-4 rounded-xl mt-8 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                    </button>

                    <p className="text-center text-neutral-500 mt-6 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-gold hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
