'use client';

import { motion } from 'framer-motion';
import { Accessibility } from 'lucide-react';

export default function AccessibilityButton() {
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="fixed bottom-6 left-6 bg-[#FFD700] text-black p-3.5 rounded-full shadow-xl z-50 flex items-center justify-center border-2 border-transparent hover:border-black/10 transition-colors"
            aria-label="Accessibility Options"
        >
            <Accessibility size={28} />
        </motion.button>
    );
}
