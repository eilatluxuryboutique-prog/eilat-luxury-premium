'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, X, Type, Sun, Eye, MousePointer2, Settings2, RotateCcw, Activity } from 'lucide-react';
import { useUI } from '@/context/ui-context';

export default function AccessibilityButton() {
    const { isAccessibilityOpen: isOpen, setAccessibilityOpen: setIsOpen } = useUI();
    const [fontSize, setFontSize] = useState(100);
    const [contrast, setContrast] = useState(false);
    const [grayscale, setGrayscale] = useState(false);
    const [readableFont, setReadableFont] = useState(false);
    const [underlineLinks, setUnderlineLinks] = useState(false);
    const [stopAnimations, setStopAnimations] = useState(false);

    const reset = () => {
        setFontSize(100);
        setContrast(false);
        setGrayscale(false);
        setReadableFont(false);
        setUnderlineLinks(false);
        setStopAnimations(false);
    };

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}%`;
    }, [fontSize]);

    useEffect(() => {
        if (contrast) {
            document.documentElement.classList.add('accessibility-contrast');
        } else {
            document.documentElement.classList.remove('accessibility-contrast');
        }
    }, [contrast]);

    useEffect(() => {
        document.body.style.filter = grayscale ? 'grayscale(100%)' : 'none';
    }, [grayscale]);

    useEffect(() => {
        if (readableFont) {
            document.body.classList.add('accessibility-readable-font');
        } else {
            document.body.classList.remove('accessibility-readable-font');
        }
    }, [readableFont]);

    useEffect(() => {
        if (underlineLinks) {
            document.body.classList.add('accessibility-underline');
        } else {
            document.body.classList.remove('accessibility-underline');
        }
    }, [underlineLinks]);

    useEffect(() => {
        if (stopAnimations) {
            document.body.classList.add('accessibility-no-animations');
        } else {
            document.body.classList.remove('accessibility-no-animations');
        }
    }, [stopAnimations]);

    return (
        <div className="fixed bottom-6 left-6 z-[100]" dir="rtl">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        className="fixed bottom-0 md:bottom-24 left-0 md:left-4 right-0 md:right-auto w-full md:w-96 bg-neutral-950 border-t md:border border-white/10 shadow-2xl z-[101] overflow-hidden md:rounded-3xl max-h-[90vh] md:max-h-auto"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gold/5">
                            <span className="font-bold text-black flex items-center gap-2">
                                <Accessibility size={20} />
                                הצהרת נגישות
                            </span>
                            <button onClick={() => setIsOpen(false)} className="text-black/70 hover:text-black">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <AccessibilityOption
                                active={fontSize > 100}
                                icon={<Type size={18} />}
                                label="הגדלת טקסט"
                                onClick={() => setFontSize(prev => Math.min(prev + 10, 150))}
                            />
                            <AccessibilityOption
                                active={fontSize < 100}
                                icon={<Type size={16} />}
                                label="הקטנת טקסט"
                                onClick={() => setFontSize(prev => Math.max(prev - 10, 80))}
                            />
                            <AccessibilityOption
                                active={contrast}
                                icon={<Sun size={18} />}
                                label="ניגודיות גבוהה"
                                onClick={() => setContrast(!contrast)}
                            />
                            <AccessibilityOption
                                active={grayscale}
                                icon={<Eye size={18} />}
                                label="מונוכרום (אפור)"
                                onClick={() => setGrayscale(!grayscale)}
                            />
                            <AccessibilityOption
                                active={readableFont}
                                icon={<Settings2 size={18} />}
                                label="גופן קריא"
                                onClick={() => setReadableFont(!readableFont)}
                            />
                            <AccessibilityOption
                                active={underlineLinks}
                                icon={<MousePointer2 size={18} />}
                                label="הדגשת קישורים"
                                onClick={() => setUnderlineLinks(!underlineLinks)}
                            />
                            <AccessibilityOption
                                active={stopAnimations}
                                icon={<Activity size={18} />}
                                label="עצירת אנימציות"
                                onClick={() => setStopAnimations(!stopAnimations)}
                            />

                            <button
                                onClick={reset}
                                className="w-full flex items-center justify-center gap-2 p-3 mt-4 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl transition-colors text-sm"
                            >
                                <RotateCcw size={16} />
                                איפוס הגדרות
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex p-3 rounded-full shadow-xl transition-all duration-300 items-center justify-center border-2 border-white/20 ${isOpen ? 'bg-white text-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'}`}
                aria-label="נגישות"
            >
                {isOpen ? <X size={24} /> : <Accessibility size={28} />}
            </button>

            <style jsx global>{`
                .accessibility-contrast {
                    filter: contrast(1.2);
                }
                .accessibility-contrast body {
                    background-color: #000 !important;
                    color: #fff !important;
                }
                .accessibility-readable-font * {
                    font-family: Arial, sans-serif !important;
                }
                .accessibility-underline a {
                    text-decoration: underline !important;
                    text-decoration-color: var(--gold) !important;
                }
                .accessibility-no-animations * {
                    animation: none !important;
                    transition: none !important;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}

function AccessibilityOption({ active, icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-gold text-black font-bold' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
        >
            <span className={active ? 'text-black' : 'text-gold'}>{icon}</span>
            <span className="text-sm">{label}</span>
        </button>
    );
}
