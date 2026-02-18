'use client';

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Apple, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PaymentForm({ amount, propertyId, checkIn, checkOut, guests }: { amount: number, propertyId: string, checkIn: string, checkOut: string, guests: number }) {
    const t = useTranslations('Payment');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [verifyingCoupon, setVerifyingCoupon] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setVerifyingCoupon(true);
        try {
            const res = await fetch('/api/coupons/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, totalAmount: amount })
            });
            const data = await res.json();
            if (data.success) {
                setAppliedDiscount(data.discount);
                setError(''); // clear errors
            } else {
                setError(data.error);
                setAppliedDiscount(0);
            }
        } catch {
            setError('Error verifying coupon');
        } finally {
            setVerifyingCoupon(false);
        }
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreed) {
            setError('יש לאשר את תנאי השימוש ומדיניות הביטולים.');
            return;
        }

        setIsProcessing(true);
        // ... rest of logic
        setError('');

        try {
            // 1. Simulate Payment Processing (Stripe/PayPal would go here)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 2. Create Booking in DB
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyId,
                    checkIn,
                    checkOut,
                    guests,
                    totalPrice: amount - appliedDiscount,
                    paymentMethod: 'credit_card',
                    coupon: appliedDiscount > 0 ? couponCode : undefined
                })
            });

            // ... rest of handler


            const data = await res.json();

            if (!res.ok) {
                console.error('Booking failed:', data);
                if (res.status === 401) {
                    throw new Error('נא להתחבר למערכת כדי לבצע הזמנה');
                }
                throw new Error(data.error || 'שגיאה ביצירת ההזמנה. נסה שוב.');
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-[#1E1E1E] border border-gold/30 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('success_title')}</h3>
                <p className="text-neutral-400 mb-6">{t('success_msg')}</p>
                <div className="p-4 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-sm text-neutral-500">Transaction ID</p>
                    <p className="font-mono text-gold">TX-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Lock size={20} className="text-gold" />
                {t('secure')}
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-8">
                <button className="bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm">
                    <Apple size={18} />
                    Pay
                </button>
                <button className="bg-[#333] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-white/10 hover:bg-[#444] transition-colors text-sm">
                    <Smartphone size={18} />
                    G-Pay
                </button>
                <button className="bg-[#F7931A]/10 text-[#F7931A] font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-[#F7931A]/30 hover:bg-[#F7931A]/20 transition-colors text-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gold/5 animate-pulse"></div>
                    <span className="font-mono">₿</span>
                    Bitcoin
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            {/* Coupon Section */}
            <div className="mb-6">
                <label className="text-xs text-neutral-400 block mb-1.5">יש לך קופון?</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="הכנס קוד קופון"
                        className="flex-1 bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none text-sm"
                    />
                    <button
                        onClick={handleApplyCoupon}
                        disabled={verifyingCoupon || !couponCode}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                    >
                        {verifyingCoupon ? 'בודק...' : 'החל'}
                    </button>
                </div>
                {appliedDiscount > 0 && (
                    <div className="mt-2 text-green-400 text-sm flex justify-between">
                        <span>הנחה הופעלה!</span>
                        <span>-₪{appliedDiscount.toLocaleString()}</span>
                    </div>
                )}
            </div>

            {/* Price Summary */}
            <div className="bg-black/20 p-4 rounded-lg mb-6 space-y-2">
                <div className="flex justify-between text-neutral-400 text-sm">
                    <span>מחיר מקורי</span>
                    <span className="line-through">₪{amount.toLocaleString()}</span>
                </div>
                {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-400 text-sm">
                        <span>קופון</span>
                        <span>-₪{appliedDiscount.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between text-white font-bold border-t border-white/10 pt-2 mt-2">
                    <span>סה"כ לתשלום</span>
                    <span className="text-gold">₪{(amount - appliedDiscount).toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-neutral-500 text-center mt-2">
                    * פיקדון ביטחון על סך ₪2,000 יישמר במסגרת האשראי בלבד ולא יחויב.
                </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-sm text-neutral-500">{t('or_card')}</span>
                <div className="h-px bg-white/10 flex-1" />
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
                <div>
                    <label className="text-xs text-neutral-400 block mb-1.5">{t('card_name')}</label>
                    <input
                        type="text"
                        required
                        placeholder="ישראל ישראלי"
                        className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none transition-colors text-right"
                        dir="rtl"
                    />
                </div>

                <div>
                    <label className="text-xs text-neutral-400 block mb-1.5">{t('card_number')}</label>
                    <div className="relative">
                        <input
                            type="text"
                            required
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 pl-12 text-white focus:border-gold outline-none transition-colors font-mono"
                            dir="ltr"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                            <CreditCard size={18} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-neutral-400 block mb-1.5">{t('expiry')}</label>
                        <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none transition-colors text-center"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-neutral-400 block mb-1.5">{t('cvc')}</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                placeholder="123"
                                maxLength={3}
                                className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 pr-10 text-white focus:border-gold outline-none transition-colors text-center"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                                <Lock size={14} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4 space-y-4">
                    <div>
                        <label className="text-xs text-neutral-400 block mb-1.5 font-bold">צילום תעודת זהות / דרכון (חובה)</label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                        />
                        <p className="text-[10px] text-neutral-600 mt-1">המסמך נשמר בשרת מאובטח ומוצפן.</p>
                    </div>

                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreed}
                            onChange={e => setAgreed(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-gold"
                            required
                        />
                        <label htmlFor="terms" className="text-xs text-neutral-400 leading-relaxed cursor-pointer select-none">
                            אני מאשר/ת את <a href="/terms" target="_blank" className="text-gold underline">תנאי השימוש</a>, <a href="/privacy" target="_blank" className="text-gold underline">מדיניות הפרטיות</a> ואת <a href="/cancellation" target="_blank" className="text-gold underline">מדיניות הביטולים</a>. אני מבין/ה שביטול פחות מ-14 יום לפני ההגעה יחויב במלואו.
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gold hover:bg-gold-light text-black font-bold py-4 rounded-xl mt-6 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>{t('processing')}</>
                    ) : (
                        <>{t('pay')} ₪{(amount - appliedDiscount).toLocaleString()}</>
                    )}
                </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
                <Lock size={12} />
                <span>{t('secure')}</span>
            </div>
        </div>
    );
}
