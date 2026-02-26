'use client';

import { Save, Type, Image as ImageIcon, Palette, Cloud, Loader2 } from 'lucide-react';
import { useAdmin } from './admin-context';
import { useState, useEffect } from 'react';

export default function ContentTab() {
    const { isEditMode, toggleEditMode } = useAdmin();
    const [heroVideoUrl, setHeroVideoUrl] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#3b82f6');
    const [fontFamily, setFontFamily] = useState('Inter');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        // Fetch current content configuration
        fetch('/api/content')
            .then(res => res.json())
            .then(data => {
                if (data.hero?.videoUrl) setHeroVideoUrl(data.hero.videoUrl);
                if (data.theme?.primaryColor) setPrimaryColor(data.theme.primaryColor);
                if (data.theme?.fontFamily) setFontFamily(data.theme.fontFamily);
            })
            .catch(err => console.error('Failed to load content:', err));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hero: {
                        videoUrl: heroVideoUrl
                    },
                    theme: {
                        primaryColor,
                        fontFamily
                    }
                })
            });

            if (res.ok) {
                alert('השינויים נשמרו בהצלחה! רענן את הדף כדי לראות את השינויים בעיצוב.');
                document.documentElement.style.setProperty('--primary', primaryColor);
            } else {
                throw new Error('Failed to save');
            }
        } catch (err) {
            alert('שגיאה בשמירת השינויים');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        setUploading(true);
        setUploadProgress(0);

        try {
            const timestamp = Math.round((new Date()).getTime() / 1000);
            const paramsToSign = {
                timestamp: timestamp,
                folder: 'eilat_premium'
            };

            const signRes = await fetch('/api/sign-cloudinary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paramsToSign })
            });

            const signData = await signRes.json();
            if (!signData.signature) throw new Error('Failed to get signature');

            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '594182461165845');
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signData.signature);
            formData.append('folder', 'eilat_premium');

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drr2qzpzk';

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    setUploadProgress((event.loaded / event.total) * 100);
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    setHeroVideoUrl(result.secure_url);
                    // Also save immediately? User requested Save button instead.
                } else {
                    console.error('Upload failed:', xhr.responseText);
                    alert('Upload failed');
                }
                setUploading(false);
            };

            xhr.onerror = () => {
                alert('Network error');
                setUploading(false);
            };

            xhr.send(formData);

        } catch (err) {
            console.error('Upload error:', err);
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8 text-right" dir="rtl">
            {/* Design Configuration */}
            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <Palette className="text-purple-600" />
                    עיצוב האתר
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-sm text-zinc-500">צבע ראשי (מותג)</label>
                        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-zinc-200 shadow-sm">
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-12 h-12 rounded cursor-pointer bg-transparent border-none p-0"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm text-zinc-900 font-bold">{primaryColor}</span>
                                <span className="text-xs text-zinc-400">לחץ לשינוי צבע</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Configuration */}
            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <ImageIcon className="text-orange-600" />
                    וידאו ראשי (Hero Section)
                </h2>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-500">בחר וידאו מהמחשב (העלאה מהירה)</label>
                        <div className="relative group">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                disabled={uploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`p-6 border-2 border-dashed ${uploading ? 'border-orange-500 bg-orange-50' : 'border-zinc-200 hover:border-orange-500/50 hover:bg-orange-50/30'} rounded-xl text-center transition-all shadow-inner`}>
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="animate-spin text-orange-500" />
                                        <span className="text-orange-400 text-sm">מעלה... {Math.round(uploadProgress)}%</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                                        <Cloud className="text-orange-500" />
                                        <span className="text-sm">לחץ כאן להעלאת וידאו</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-zinc-500">או הדבק קישור ישיר</label>
                        <input
                            type="text"
                            value={heroVideoUrl}
                            onChange={(e) => setHeroVideoUrl(e.target.value)}
                            placeholder="/uploads/..."
                            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:border-gold transition-colors text-left shadow-sm"
                            dir="ltr"
                        />
                    </div>

                    {/* Dedicated Save Button Logic */}
                    <div className="flex justify-end pt-4 border-t border-white/5">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 text-sm transition-colors disabled:opacity-50"
                        >
                            <Save size={16} />
                            {saving ? 'שומר...' : 'שמור וידאו'}
                        </button>
                    </div>
                    {/* Visual Confirmation */}
                    <div className="text-center pt-2">
                        <p className="text-xs text-zinc-300" dir="ltr">
                            Current DB Value: {heroVideoUrl ? heroVideoUrl.substring(0, 40) + '...' : 'Empty'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Text Editing Mode */}
            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <Type className="text-blue-600" />
                    עריכת טקסטים
                </h2>
                <div className="flex items-center gap-4 bg-white border border-zinc-200 p-4 rounded-xl shadow-sm">
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isEditMode}
                            onChange={toggleEditMode}
                        />
                        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold peer-checked:after:-translate-x-full"></div>
                    </div>
                    <span className="text-zinc-900 font-medium mr-4">הפעל מצב עריכה חי</span>
                </div>
            </div>

            {/* Floating Global Save (optional, kept for robustness) */}
        </div>
    );
}
