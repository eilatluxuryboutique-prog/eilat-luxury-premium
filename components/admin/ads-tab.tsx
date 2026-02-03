"use client";

import { useEffect, useState } from "react";
import { Plus, Trash, Save, ImageIcon, Link as LinkIcon, Type } from "lucide-react";

type Ad = {
    id: string;
    image: string;
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
                    ads: [...b.ads, { id: Date.now().toString(), image: '', link: '', title: '' }]
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

    const updateAd = (bannerId: string, adId: string, field: keyof Ad, value: string) => {
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

    if (loading) return <div className="text-white">Loading ads...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Manage Advertisements</h2>
                    <p className="text-neutral-400">Configure the 4 banners on the homepage.</p>
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
                    <div key={banner.id} className="bg-neutral-900 border border-white/10 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gold mb-4 flex justify-between">
                            {banner.name}
                            <span className="text-xs bg-white/10 text-neutral-400 px-2 py-1 rounded">Column {index + 1}</span>
                        </h3>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {banner.ads.map((ad, i) => (
                                <div key={ad.id} className="bg-black/40 p-4 rounded-lg border border-white/5 relative group">
                                    <button
                                        onClick={() => removeAd(banner.id, ad.id)}
                                        className="absolute top-2 right-2 text-neutral-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove Ad"
                                    >
                                        <Trash size={16} />
                                    </button>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <ImageIcon size={16} className="text-neutral-500" />
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                value={ad.image}
                                                onChange={(e) => updateAd(banner.id, ad.id, 'image', e.target.value)}
                                                className="bg-transparent border-b border-white/20 w-full text-sm text-white focus:border-gold outline-none py-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <LinkIcon size={16} className="text-neutral-500" />
                                            <input
                                                type="text"
                                                placeholder="Link URL (e.g., /search?type=hotel)"
                                                value={ad.link}
                                                onChange={(e) => updateAd(banner.id, ad.id, 'link', e.target.value)}
                                                className="bg-transparent border-b border-white/20 w-full text-sm text-white focus:border-gold outline-none py-1"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Type size={16} className="text-neutral-500" />
                                            <input
                                                type="text"
                                                placeholder="Title (Optional)"
                                                value={ad.title || ''}
                                                onChange={(e) => updateAd(banner.id, ad.id, 'title', e.target.value)}
                                                className="bg-transparent border-b border-white/20 w-full text-sm text-white focus:border-gold outline-none py-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs text-neutral-600">
                                        Ad #{i + 1} in Rotation
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => addAd(banner.id)}
                            className="w-full mt-4 border border-dashed border-white/20 hover:border-gold text-neutral-400 hover:text-gold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors test-sm"
                        >
                            <Plus size={16} />
                            Add another Ad to Rotation
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
