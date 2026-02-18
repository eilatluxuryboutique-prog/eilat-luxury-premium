"use client";

import { useState, useEffect } from 'react';
import { Star, User, Send, Quote } from 'lucide-react';
// We'll use a simple mock session check or just let anyone post for now (with name input)
// Actually we have valid auth in `lib/auth.ts`, let's try to use it if available, or just simple form.

interface Review {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    images?: string[];
}

export default function ReviewsSection({ propertyId }: { propertyId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [userName, setUserName] = useState(""); // If not logged in
    const [submitting, setSubmitting] = useState(false);

    // Fetch Reviews
    useEffect(() => {
        fetch(`/api/reviews?propertyId=${propertyId}`)
            .then(res => res.json())
            .then(data => {
                if (data.reviews) setReviews(data.reviews);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load reviews", err);
                setLoading(false);
            });
    }, [propertyId]);

    const [reviewImages, setReviewImages] = useState<File[]>([]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setReviewImages(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeImage = (index: number) => {
        setReviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // 1. Upload Images
            const imageUrls: string[] = [];
            for (const file of reviewImages) {
                const formData = new FormData();
                formData.append('file', file);
                try {
                    const upRes = await fetch('/api/upload', { method: 'POST', body: formData });
                    if (upRes.ok) {
                        const upData = await upRes.json();
                        // Adjust based on api/upload response structure. 
                        // The file view shows: { success: true, resource: { secure_url: ... } }
                        if (upData.success && upData.resource?.secure_url) {
                            imageUrls.push(upData.resource.secure_url);
                        }
                    }
                } catch (uploadErr) {
                    console.error('Failed to upload image', uploadErr);
                }
            }

            // 2. Submit Review
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyId,
                    rating,
                    comment,
                    userName,
                    images: imageUrls
                })
            });

            if (res.ok) {
                const data = await res.json();
                setReviews([data.review, ...reviews]);
                setComment("");
                setUserName("");
                setRating(5);
                setReviewImages([]); // Clear images
            } else {
                alert("Please log in to leave a review (Host/Admin only in this demo config, or need Guest login)");
            }
        } catch (e) {
            console.error("Submit error", e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-8 mt-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Star className="text-gold fill-gold" />
                חוות דעת אורחים
                <span className="text-sm font-normal text-white/50">({reviews.length})</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Reviews List */}
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gold/20">
                    {loading ? (
                        <div className="text-center text-white/50">טוען ביקורות...</div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                            <p className="text-white/60">אין עדיין ביקורות לנכס זה.</p>
                            <p className="text-gold mt-2">היה הראשונים לדרג! ⭐</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="bg-black/30 p-4 rounded-xl border border-white/5 relative">
                                <Quote className="absolute top-4 left-4 text-white/5 rotate-180" size={40} />
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-gold font-bold">
                                        {review.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{review.userName}</div>
                                        <div className="flex text-gold text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-white/20"} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mr-auto text-xs text-white/30">
                                        {new Date(review.createdAt).toLocaleDateString('he-IL')}
                                    </div>
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed relative z-10">
                                    {review.comment}
                                </p>
                                {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                        {review.images.map((img, idx) => (
                                            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                                                <img src={img} alt="Review" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Add Review Form */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 h-fit sticky top-24">
                    <h3 className="text-lg font-bold mb-4">הוסף חוות דעת</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-white/50 mb-2">שם מלא</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-gold outline-none"
                                placeholder="השם שלך..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-white/50 mb-2">דירוג כללי</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        className="transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Star
                                            size={24}
                                            className={s <= rating ? "text-gold fill-gold" : "text-white/20"}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-white/50 mb-2">החוויה שלך</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-gold outline-none resize-none h-32"
                                placeholder="ספר לנו איך הייתה החופשה..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-white/50 mb-2">הוסף תמונות</label>
                            <div className="flex items-center gap-2">
                                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg border border-white/10 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageSelect}
                                    />
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="bg-white/20 p-1 rounded">📸</div>
                                        <span>בחר תמונות</span>
                                    </div>
                                </label>
                                <span className="text-xs text-white/30">{reviewImages.length} תמונות נבחרו</span>
                            </div>

                            {/* Previews */}
                            {reviewImages.length > 0 && (
                                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                    {reviewImages.map((file, i) => (
                                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 group">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gold hover:bg-gold-light text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'שולח...' : (
                                <>
                                    <Send size={16} /> פרסם ביקורת
                                </>
                            )}
                        </button>
                        <p className="text-xs text-center text-white/30 mt-2">
                            * רק משתמשים רשומים יכולים לפרסם ביקורת
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
