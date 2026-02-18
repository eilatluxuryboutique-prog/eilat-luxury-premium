"use client";

import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SocialProof({ id }: { id: string }) {
    const [viewers, setViewers] = useState(0);

    useEffect(() => {
        // Deterministic random based on ID to be consistent across re-renders but different per property
        const base = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const randomViewers = (base % 5) + 2; // 2 to 6 viewers
        setViewers(randomViewers);

        // Simulate fluctuation
        const interval = setInterval(() => {
            setViewers(prev => Math.random() > 0.5 ? prev + 1 : Math.max(2, prev - 1));
        }, 5000);

        return () => clearInterval(interval);
    }, [id]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={viewers}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex items-center gap-1.5 text-xs font-medium bg-red-500/10 text-red-400 px-2 py-1 rounded-md border border-red-500/20 shadow-sm"
            >
                <Users size={12} className="animate-pulse" />
                <span>{viewers} אנשים צופים כרגע</span>
            </motion.div>
        </AnimatePresence>
    );
}
