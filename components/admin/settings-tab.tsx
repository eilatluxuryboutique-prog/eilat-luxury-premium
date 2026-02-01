'use client';

import { useState } from 'react';
import { Save, Palette, Type, Layout } from 'lucide-react';

export default function SettingsTab() {
    const [primaryColor, setPrimaryColor] = useState('#3B82F6');
    const [font, setFont] = useState('Inter');

    const handleSave = () => {
        // In real app: save to DB or Context
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        alert('Settings saved! Colors updated.');
    };

    return (
        <div className="space-y-8">
            <div className="bg-neutral-800 border border-white/5 p-8 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Palette className="text-purple-400" />
                    Visual Appearance
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-sm text-white/60 font-medium">Brand Color</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-16 h-16 rounded-xl cursor-pointer bg-transparent border border-white/10 p-1"
                            />
                            <div>
                                <p className="text-white font-mono">{primaryColor}</p>
                                <p className="text-white/40 text-xs mt-1">Used for buttons & highlights</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm text-white/60 font-medium">Typography</label>
                        <div className="flex gap-2">
                            {['Inter', 'Roboto', 'Outfit'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFont(f)}
                                    className={`flex-1 py-3 rounded-xl border transition-all ${font === f
                                            ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                            : 'bg-black/20 border-white/10 text-white/60 hover:text-white'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-neutral-800 border border-white/5 p-8 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Layout className="text-green-400" />
                    Layout Options
                </h2>
                <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
                        <span className="text-white">Enable Full-Width Hero Video</span>
                        <input type="checkbox" defaultChecked className="accent-blue-500 w-5 h-5" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-black/20 rounded-xl cursor-pointer hover:bg-black/30 transition-colors">
                        <span className="text-white">Show "Featured" Badge on Apartments</span>
                        <input type="checkbox" defaultChecked className="accent-blue-500 w-5 h-5" />
                    </label>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-500/20"
                >
                    <Save size={20} />
                    Save Global Settings
                </button>
            </div>
        </div>
    );
}
