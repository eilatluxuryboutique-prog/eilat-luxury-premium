'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Chrome, Facebook } from 'lucide-react';

export default function SocialLoginButtons() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleLogin = (provider: string) => {
        setLoading(provider);
        // In a real app with keys, this would redirect to Google/Facebook
        // signIn(provider, { callbackUrl: '/dashboard' });

        // Simulation
        setTimeout(() => {
            alert(`התחברות עם ${provider} דורשת מפתח API אמיתי.\n(Login with ${provider} requires real API Keys)`);
            setLoading(null);
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <button
                onClick={() => handleLogin('google')}
                disabled={!!loading}
                className="flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
                {loading === 'google' ? 'מתחבר...' : (
                    <>
                        <Chrome size={20} className="text-red-500" />
                        המשך עם Google
                    </>
                )}
            </button>
            <button
                onClick={() => handleLogin('facebook')}
                disabled={!!loading}
                className="flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 rounded-xl font-bold hover:bg-[#1864cc] transition-colors disabled:opacity-50"
            >
                {loading === 'facebook' ? 'מתחבר...' : (
                    <>
                        <Facebook size={20} />
                        המשך עם Facebook
                    </>
                )}
            </button>
        </div>
    );
}
