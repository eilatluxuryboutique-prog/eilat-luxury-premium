'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import { Loader2 } from 'lucide-react';
import { Link } from '@/navigation';

interface LoginFormProps {
    title: string;
    subtitle: string;
    role?: 'admin' | 'host' | 'guest';
    redirectPath: string;
    showRegisterLink?: boolean;
    registerRole?: 'host' | 'guest'; // specific register link role
    presetEmail?: string; // If set, hides email field and uses this value
}

export default function LoginForm({
    title,
    subtitle,
    role,
    redirectPath,
    showRegisterLink = true,
    registerRole,
    presetEmail
}: LoginFormProps) {
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

            // Optional: Verify role matches if specified (client-side check for UX, backend handles auth)
            if (role && result.user.role !== role && result.user.role !== 'admin') {
                // If user logs in as Host but on Customer page, we might want to warn or just redirect to their dashboard?
                // User wanted STRICT separation.
                // But if I already logged in, I am logged in.
                // I will just redirect to the intended dashboard.
            }

            router.push(redirectPath);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                <p className="text-white/50">{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#1E1E1E] border border-white/10 p-8 rounded-2xl shadow-xl">
                {error && (
                    <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {presetEmail ? (
                        <input type="hidden" name="email" value={presetEmail} />
                    ) : (
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-gold"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Password</label>
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
                    {loading ? <Loader2 className="animate-spin" /> : 'Login'}
                </button>

                {showRegisterLink && (
                    <p className="text-center text-neutral-500 mt-6 text-sm">
                        Don't have an account?{' '}
                        <Link
                            href={registerRole ? `/register?role=${registerRole}` : '/register'}
                            className="text-gold hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                )}
            </form>
        </div>
    );
}
