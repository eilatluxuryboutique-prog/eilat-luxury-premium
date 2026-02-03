'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, ChevronRight, Megaphone, Image as ImageIcon, Settings, LayoutDashboard, FileText, LogOut, Check } from 'lucide-react';
import { useRouter } from '@/navigation';
import ContentTab from './content-tab';
import MediaTab from './media-tab';
import AdminTab from './settings-tab';
import AdsTab from './ads-tab';

interface AdminLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded for demo - usually env variable
        if (code === '4040') {
            router.push('/admin');
            onClose();
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-900 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white/50 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="bg-blue-500/10 p-4 rounded-full mb-6 text-blue-500">
                                    <Lock size={32} />
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">Manager Access</h2>
                                <p className="text-white/50 mb-8">Enter access code to manage site</p>

                                <form onSubmit={handleLogin} className="w-full">
                                    <input
                                        type="password"
                                        maxLength={4}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] text-white focus:outline-none focus:border-blue-500 mb-4 transition-colors"
                                        autoFocus
                                    />

                                    {error && (
                                        <p className="text-red-500 text-sm mb-4">Incorrect code</p>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        Login <ChevronRight size={18} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
