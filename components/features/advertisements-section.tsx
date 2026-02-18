"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

type Ad = {
    id: string;
    type: 'image' | 'video';
    media: string;
    link: string;
    title?: string;
};

type Banner = {
    id: string;
    name: string;
    ads: Ad[];
};

export default function AdvertisementsSection() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [indexes, setIndexes] = useState<Record<string, number>>({});

    useEffect(() => {
        fetch('/api/ads')
            .then(res => res.json())
            .then((data: Banner[]) => {
                setBanners(data);
                const initial: Record<string, number> = {};
                data.forEach(b => initial[b.id] = 0);
                setIndexes(initial);
            })
            .catch(err => console.error("Failed to load ads:", err));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndexes(prev => {
                const next = { ...prev };
                banners.forEach(b => {
                    if (b.ads.length > 1) {
                        next[b.id] = (prev[b.id] + 1) % b.ads.length;
                    }
                });
                return next;
            });
        }, 8000); // 8 Seconds for video to play a bit

        return () => clearInterval(interval);
    }, [banners]);

    const t = useTranslations('Home');

    if (!banners || banners.length === 0) return null;

    return (
        <>
            {/* Gap between Hero and Ads */}
            <div className="h-6 md:h-10 bg-black w-full" />

            <section className="bg-background py-8 md:py-12 border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gold mb-2">{t('recommended_title')}</h2>
                        <div className="w-20 h-1 bg-gold rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        {banners.map(banner => {
                            const currentIndex = indexes[banner.id] || 0;
                            const currentAd = banner.ads[currentIndex];

                            if (!currentAd) return null;

                            return (
                                <div key={banner.id} className="relative h-40 md:h-80 w-full overflow-hidden rounded-xl shadow-lg group bg-black">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentAd.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.8 }}
                                            className="relative w-full h-full"
                                        >
                                            <Link href={currentAd.link} className="block w-full h-full">
                                                <div className="relative w-full h-full">
                                                    {currentAd.type === 'video' ? (
                                                        <video
                                                            src={currentAd.media}
                                                            autoPlay
                                                            muted
                                                            loop
                                                            playsInline
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            onError={(e) => {
                                                                console.error("Video failed to load:", currentAd.media);
                                                            }}
                                                        />
                                                    ) : (
                                                        <Image
                                                            src={currentAd.media}
                                                            alt={currentAd.title || "Advertisement"}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    )}

                                                    {/* Fallback pattern if media fails or is transparent */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent -z-10" />

                                                    {currentAd.title && (
                                                        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
                                                            <h3 className="text-white font-bold text-center text-xs md:text-lg shadow-black drop-shadow-md">{currentAd.title}</h3>
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        </motion.div>
                                    </AnimatePresence>
                                    {/* Dots visualizer */}
                                    {banner.ads.length > 1 && (
                                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-20">
                                            {banner.ads.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-gold scale-125" : "bg-white/50"}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
