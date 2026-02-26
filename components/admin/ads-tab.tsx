"use client";

import { useEffect, useState } from "react";
import { Plus, Trash, Save, ImageIcon, Link as LinkIcon, Type, Video, Image as ImgIcon } from "lucide-react";

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

export default function AdsTab() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch('/api/ads')
            .then(res => res.json())
            .then(data => setBanners(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(banners)
            });
            alert("Ads saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save ads.");
        } finally {
            setSaving(false);
        }
    };

    const addAd = (bannerId: string) => {
        setBanners(prev => prev.map(b => {
            if (b.id === bannerId) {
                return {
                    ...b,
                    ads: [...b.ads, { id: Date.now().toString(), type: 'video', media: '', link: '', title: '' }]
                };
            }
            return b;
        }));
    };

    const removeAd = (bannerId: string, adId: string) => {
        setBanners(prev => prev.map(b => {
            if (b.id === bannerId) {
                return {
                    ...b,
                    ads: b.ads.filter(a => a.id !== adId)
                };
            }
            return b;
        }));
    };

    const updateAd = (bannerId: string, adId: string, field: keyof Ad, value: any) => {
        setBanners(prev => prev.map(b => {
            if (b.id === bannerId) {
                return {
                    ...b,
                    ads: b.ads.map(a => {
                        if (a.id === adId) {
                            return { ...a, [field]: value };
                        }
                        return a;
                    })
                };
            }
            return b;
        }));
    };

    if (loading) return <div className="text-zinc-900">Loading ads...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900">Manage Advertisements</h2>
                    <p className="text-zinc-500">Configure the 4 banners (Videos/Images).</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gold hover:bg-gold-light text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner, index) => (
                    <div key={banner.id} className="bg-zinc-50 border border-zinc-100 rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-gold mb-4 flex justify-between">
                            {banner.name}
                            <span className="text-xs bg-zinc-200 text-zinc-500 px-2 py-1 rounded">Column {index + 1}</span>
                        </h3>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {banner.ads.map((ad, i) => (
                                <div key={ad.id} className="bg-white p-4 rounded-lg border border-zinc-100 relative group shadow-sm">
                                    <button
                                        onClick={() => removeAd(banner.id, ad.id)}
                                        className="absolute top-2 right-2 text-neutral-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        title="Remove Ad"
                                    >
                                        <Trash size={16} />
                                    </button>

                                    <div className="space-y-3">
                                        {/* Type Selector */}
                                        <div className="flex gap-2 mb-2">
                                            <button
                                                onClick={() => updateAd(banner.id, ad.id, 'type', 'video')}
                                                className={`flex-1 flex items-center justify-center gap-2 py-1 rounded text-xs transition-all ${ad.type === 'video' ? 'bg-gold text-black font-bold shadow-sm' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                                            >
                                                <Video size={14} /> Video
                                            </button>
                                            <button
                                                onClick={() => updateAd(banner.id, ad.id, 'type', 'image')}
                                                className={`flex-1 flex items-center justify-center gap-2 py-1 rounded text-xs transition-all ${ad.type === 'image' ? 'bg-gold text-black font-bold shadow-sm' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                                            >
                                                <ImgIcon size={14} /> Image
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {ad.type === 'video' ? <Video size={16} className="text-neutral-500" /> : <ImageIcon size={16} className="text-neutral-500" />}
                                            <input
                                                type="text"
                                                placeholder={ad.type === 'video' ? "Video URL (mp4/webm)" : "Image URL"}
                                                value={ad.media || ''}
                                                onChange={(e) => updateAd(banner.id, ad.id, 'media', e.target.value)}
                                                className="bg-transparent border-b border-white/20 w-full text-sm text-white focus:border-gold outline-none py-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <LinkIcon size={16} className="text-neutral-500" />
                                            <input
                                                type="text"
                                                placeholder="Link URL"
                                                value={ad.link}
                                                onChange={(e) => updateAd(banner.id, ad.id, 'link', e.target.value)}
                                                className="bg-transparent border-b border-white/20 w-full text-sm text-white focus:border-gold outline-none py-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Type size={16} className="text-neutral-500" />
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                value={ad.title || ''}
                                                onChange={(e) => updateAd(banner.id, ad.id, 'title', e.target.value)}
                                                className="bg-transparent border-b border-white/20 w-full text-sm text-white focus:border-gold outline-none py-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs text-neutral-600">
                                        Ad #{i + 1} ({ad.type})
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => addAd(banner.id)}
                            className="w-full mt-4 border border-dashed border-white/20 hover:border-gold text-neutral-400 hover:text-gold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors key-sm"
                        >
                            <Plus size={16} />
                            Add Video/Image
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
