'use client';

import { useState, useEffect } from 'react';
import { Save, Palette, Type, Layout, Settings as SettingsIcon, Mail, Phone, AlertTriangle } from 'lucide-react';

export default function SettingsTab() {
    const [settings, setSettings] = useState({
        primaryColor: '#D4AF37',
        font: 'Inter',
        enableHeroVideo: true,
        showFeaturedBadge: true,
        contactEmail: '',
        contactPhone: '',
        maintenanceMode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setSettings(prev => ({ ...prev, ...data }));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch settings error:", err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert('ההגדרות נשמרו בהצלחה!');
                // document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
            } else {
                alert('שגיאה בשמירת ההגדרות.');
            }
        } catch (error) {
            alert('שגיאה בשמירת ההגדרות.');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return <div className="text-zinc-900 p-6">טוען הגדרות...</div>;

    return (
        <div className="space-y-8" dir="rtl">
            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <SettingsIcon className="text-blue-600" />
                    הגדרות כלליות (General Config)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-sm text-zinc-500 font-medium flex items-center gap-2"><Mail size={16} /> אימייל יצירת קשר</label>
                        <input
                            type="email"
                            value={settings.contactEmail}
                            onChange={(e) => updateSetting('contactEmail', e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-gold outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm text-zinc-500 font-medium flex items-center gap-2"><Phone size={16} /> טלפון / סוכן</label>
                        <input
                            type="text"
                            value={settings.contactPhone}
                            onChange={(e) => updateSetting('contactPhone', e.target.value)}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-gold outline-none transition-colors"
                            dir="ltr"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <Layout className="text-green-600" />
                    אפשרויות פריסה (Layout & Features)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 transition-colors shadow-sm">
                        <span className="text-zinc-900">וידאו מסך מלא בעמוד הבית</span>
                        <input type="checkbox" checked={settings.enableHeroVideo} onChange={(e) => updateSetting('enableHeroVideo', e.target.checked)} className="accent-gold w-5 h-5" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 transition-colors shadow-sm">
                        <span className="text-zinc-900">תגית "מומלץ" בנכסים</span>
                        <input type="checkbox" checked={settings.showFeaturedBadge} onChange={(e) => updateSetting('showFeaturedBadge', e.target.checked)} className="accent-gold w-5 h-5" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl cursor-pointer hover:bg-red-100 transition-colors shadow-sm">
                        <span className="text-red-600 flex items-center gap-2 font-bold"><AlertTriangle size={18} /> מצב תחזוקה (אתר סגור ללקוחות)</span>
                        <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => updateSetting('maintenanceMode', e.target.checked)} className="accent-red-600 w-5 h-5" />
                    </label>
                </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <Palette className="text-purple-600" />
                    סגנון ויזואלי (Branding)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-sm text-zinc-500 font-medium">צבע מותג</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={settings.primaryColor}
                                onChange={(e) => updateSetting('primaryColor', e.target.value)}
                                className="w-16 h-16 rounded-xl cursor-pointer bg-transparent border border-zinc-200 p-1"
                            />
                            <div>
                                <p className="text-zinc-900 font-mono font-bold" dir="ltr">{settings.primaryColor}</p>
                                <p className="text-zinc-500 text-xs mt-1">צבע כפתורים והדגשות</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm text-white/60 font-medium">גופן (Typography)</label>
                        <div className="flex gap-2" dir="ltr">
                            {['Inter', 'Roboto', 'Outfit'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => updateSetting('font', f)}
                                    className={`flex-1 py-3 rounded-xl border transition-all ${settings.font === f
                                        ? 'bg-gold/10 border-gold text-gold font-bold shadow-sm'
                                        : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gold hover:bg-gold-light text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-gold/20 disabled:opacity-50"
                >
                    <Save size={20} />
                    {saving ? 'שומר...' : 'שמור הגדרות מערכת'}
                </button>
            </div>
        </div>
    );
}
