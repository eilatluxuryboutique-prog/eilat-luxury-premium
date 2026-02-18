"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Upload, X, ArrowRight, Home, DollarSign } from "lucide-react";
import { useRouter } from "@/navigation";

export default function AddPropertyPage() {
    const t = useTranslations('Host');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Simplified Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        type: "apartment",
        address: ""
    });

    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]); // For display
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]); // Actual Cloudinary URLs
    const [isUploading, setIsUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const uploadToCloudinary = async (file: File) => {
        const timestamp = Math.round(Date.now() / 1000);

        // 1. Get Signature
        const signRes = await fetch('/api/sign-cloudinary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paramsToSign: { timestamp } })
        });
        const { signature } = await signRes.json();

        // 2. Upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        return data.secure_url;
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);

            // Show local preview immediately
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);

            // Start Upload
            setIsUploading(true);
            try {
                const uploadPromises = newFiles.map(file => uploadToCloudinary(file));
                const newUrls = await Promise.all(uploadPromises);
                setUploadedUrls(prev => [...prev, ...newUrls]);
            } catch (err) {
                console.error("Upload error", err);
                setErrorMsg("Failed to upload images. Please try again.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setUploadedUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        if (uploadedUrls.length === 0 && previewUrls.length > 0 && !isUploading) {
            // Retry upload if needed or warn? 
            // Ideally we blocked submit if uploading.
        }

        try {
            // 1. Prepare Data
            // Use uploaded URLs, or fallback if testing (but we want real ones now)
            const imageUrls = uploadedUrls.length > 0 ? uploadedUrls : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'];

            const payload = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                type: formData.type,
                images: imageUrls,
                location: formData.address || 'Eilat',
                amenities: (formData as any).amenities || []
            };

            console.log("Submitting Payload:", payload);

            // 2. Send to API
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.message || 'Failed to create property');
            }

            console.log("Success:", data);

            // SAVE TO LOCAL STORAGE FOR DEMO PERSISTENCE
            // This bridges the gap between serverless mock response and client view
            try {
                const currentDemos = JSON.parse(localStorage.getItem('demo_properties') || '[]');
                currentDemos.unshift(data.property); // Add to start
                localStorage.setItem('demo_properties', JSON.stringify(currentDemos));
            } catch (e) {
                console.error("Local storage save failed", e);
            }

            // 3. Redirect
            router.push('/host');
            router.refresh();

        } catch (error: any) {
            console.error("Submission Error:", error);
            setErrorMsg(error.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] py-24 px-4" dir="rtl">
            <div className="container mx-auto max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-white mb-2">{t('add_property_title') || 'הוספת נכס חדש'}</h1>
                    <p className="text-white/60 mb-8">{t('add_property_subtitle') || 'מלא את הטופס כדי לפרסם.'}</p>

                    {errorMsg && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl mb-6">
                            Error: {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 bg-[#1E1E1E] p-8 rounded-2xl border border-white/10">
                        {/* Title */}
                        <div>
                            <label className="block text-white/80 text-sm mb-2 font-medium">כותרת</label>
                            <input
                                type="text"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-gold outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="דירת נופש..."
                                required
                            />
                        </div>

                        {/* Price & Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm mb-2 font-medium">סוג נכס</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-gold outline-none"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="apartment">דירה</option>
                                    <option value="villa">וילה</option>
                                    <option value="hotel">מלון</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm mb-2 font-medium">מחיר ללילה (₪)</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-gold outline-none"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white/80 text-sm mb-2 font-medium">תיאור</label>
                            <textarea
                                rows={4}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-gold outline-none resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="תיאור קצר..."
                                required
                            />
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className="block text-white/80 text-sm mb-2 font-medium">שדרוגים ומתקנים</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { id: 'wifi', label: 'אינטרנט אלחוטי' },
                                    { id: 'ac', label: 'מיזוג אiויר' },
                                    { id: 'pool', label: 'בריכה' },
                                    { id: 'parking', label: 'חניה' },
                                    { id: 'accessibility', label: 'נגישות לנכים' },
                                    { id: 'sea_view', label: 'נוף לים' },
                                    { id: 'jacuzzi', label: 'ג׳קוזי' },
                                    { id: 'elevator', label: 'מעלית' }
                                ].map(item => (
                                    <label key={item.id} className="flex items-center gap-2 bg-black/40 border border-white/10 p-3 rounded-xl cursor-pointer hover:border-gold/50 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="accent-gold w-4 h-4"
                                            checked={(formData as any).amenities?.includes(item.id)}
                                            onChange={(e) => {
                                                const current = (formData as any).amenities || [];
                                                const updated = e.target.checked
                                                    ? [...current, item.id]
                                                    : current.filter((i: string) => i !== item.id);
                                                setFormData({ ...formData, amenities: updated } as any);
                                            }}
                                        />
                                        <span className="text-sm text-white">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-white/80 text-sm mb-2 font-medium">תמונות</label>
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                {previewUrls.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                                        <img src={url} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 text-xs"><X size={12} /></button>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-lg border border-dashed border-white/20 flex items-center justify-center hover:bg-white/5 cursor-pointer">
                                    <Upload className="text-white/40" />
                                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading || isUploading}
                            className="w-full bg-gold hover:bg-gold-light text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? 'שומר...' : isUploading ? 'מעלה תמונות...' : (
                                <>
                                    פרסם נכס <ArrowRight className="rotate-180" size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
