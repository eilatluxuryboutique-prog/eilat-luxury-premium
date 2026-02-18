"use client";

import { Share2 } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton({ title, url }: { title: string, url: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `חופשה באילת: ${title}`,
                    text: `תראו את המקום המדהים הזה שמצאתי באילת!`,
                    url: window.location.origin + url,
                });
            } catch (err) { console.error(err); }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.origin + url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md shadow-lg transition-all relative group"
            title="שתף חופשה"
        >
            <Share2 size={20} />
            {copied && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    הקישור הועתק!
                </div>
            )}
        </button>
    );
}
