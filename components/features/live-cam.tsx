'use client';

import { useTranslations } from 'next-intl';

export default function LiveCam() {
    const t = useTranslations('LiveCam');

    return (
        <div className="w-full h-full relative group">
            {/* Overlay for "LIVE" badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                LIVE
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
                <p className="text-white font-bold">{t('view_label') || 'Eilat Promenade - Live View'}</p>
                <p className="text-white/60 text-xs">{new Date().toLocaleTimeString()} • 28°C</p>
            </div>

            <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/S26J-F7K0yI?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=S26J-F7K0yI"
                title="Eilat Live Cam"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full object-cover pointer-events-none"
            ></iframe>
        </div>
    );
}
