'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, X, Type, Sun, Eye } from 'lucide-react';

export default function AccessibilityButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [contrast, setContrast] = useState(false);
    const [grayscale, setGrayscale] = useState(false);

    useEffect(() => {
        document.body.style.zoom = `${fontSize}%`;
    }, [fontSize]);

    useEffect(() => {
        if (contrast) {
            document.documentElement.classList.add('contrast-more');
            document.body.style.backgroundColor = '#000000';
            document.body.style.color = '#ffff00';
        } else {
            document.documentElement.classList.remove('contrast-more');
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        }
    }, [contrast]);

    useEffect(() => {
        document.body.style.filter = grayscale ? 'grayscale(100%)' : 'none';
    }, [grayscale]);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-20 left-6 bg-white text-black p-4 rounded-xl shadow-2xl z-50 w-64 border border-gray-200"
                    >
                        <h3 className="font-bold mb-4 text-lg">Accessibility</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2"><Type size={18} /> Font Size</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setFontSize(Math.max(100, fontSize - 10))} className="p-2 bg-gray-100 rounded hover:bg-gray-200">-</button>
                                    <span className="w-12 text-center my-auto">{fontSize}%</span>
                                    <button onClick={() => setFontSize(Math.min(200, fontSize + 10))} className="p-2 bg-gray-100 rounded hover:bg-gray-200">+</button>
                                </div>
                            </div>

                            <button
                                onClick={() => setContrast(!contrast)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${contrast ? 'bg-black text-yellow-400 border border-yellow-400' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                <span className="flex items-center gap-2"><Sun size={18} /> High Contrast</span>
                                <div className={`w-4 h-4 rounded-full ${contrast ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                            </button>

                            <button
                                onClick={() => setGrayscale(!grayscale)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${grayscale ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                <span className="flex items-center gap-2"><Eye size={18} /> Grayscale</span>
                                <div className={`w-4 h-4 rounded-full ${grayscale ? 'bg-green-500' : 'bg-gray-300'}`} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 left-6 bg-[#FFD700] text-black p-3.5 rounded-full shadow-xl z-50 flex items-center justify-center border-2 border-transparent hover:border-black/10 transition-colors"
                aria-label="Accessibility Options"
            >
                {isOpen ? <X size={28} /> : <Accessibility size={28} />}
            </motion.button>
        </>
    );
}
