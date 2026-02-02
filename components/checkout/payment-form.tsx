'use client';

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Apple, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PaymentForm({ amount }: { amount: number }) {
    const t = useTranslations('Payment');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulator
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000);
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

            {/* Apple Pay / Google Pay Mock */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                    <Apple size={20} />
                    Pay
                </button>
                <button className="bg-[#333] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-white/10 hover:bg-[#444] transition-colors">
                    <Smartphone size={20} />
                    Google Pay
                </button>
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

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gold hover:bg-gold-light text-black font-bold py-4 rounded-xl mt-6 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>{t('processing')}</>
                    ) : (
                        <>{t('pay')} ₪{amount.toLocaleString()}</>
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
