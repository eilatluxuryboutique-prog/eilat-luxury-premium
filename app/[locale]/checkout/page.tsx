'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { properties } from '@/lib/mock-data';
import PaymentForm from '@/components/checkout/payment-form';
import { ArrowLeft, Calendar, Users, Star, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const t = useTranslations('Checkout');

    const propertyId = searchParams.get('propertyId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');

    const property = properties.find(p => p.id === propertyId);

    if (!property) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
                    <button onClick={() => router.back()} className="text-gold hover:underline">{t('back')}</button>
                </div>
            </div>
        );
    }

    // Calculate Nights
    const start = checkIn ? new Date(checkIn) : new Date();
    const end = checkOut ? new Date(checkOut) : new Date(new Date().setDate(new Date().getDate() + 1));
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    // Dynamic Pricing Calculation
    const propertyPrice = property.price;
    const weekendPrice = (property as any).weekendPrice || propertyPrice;

    let totalPrice = 0;
    const currentDate = new Date(start);

    for (let i = 0; i < nights; i++) {
        const day = currentDate.getDay(); // 5=Fri, 6=Sat
        const isWeekend = day === 5 || day === 6;
        totalPrice += isWeekend ? weekendPrice : propertyPrice;
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const serviceFee = Math.round(totalPrice * 0.10); // 10% fee
    const grandTotal = totalPrice + serviceFee;

    return (
        <div className="min-h-screen bg-[#121212] text-white pb-20">
            {/* Header */}
            <header className="border-b border-white/10 bg-[#121212] sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span>{t('back')}</span>
                    </button>
                    <h1 className="font-bold text-lg hidden md:block">{t('title')}</h1>
                    <div className="text-gold">
                        <ShieldCheck size={24} />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto">

                    {/* Left Column: Form */}
                    <div className="flex-1 order-2 lg:order-1">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2">{t('confirm')}</h2>
                            <p className="text-neutral-400">{t('booking_for')} {property.title}</p>
                        </div>

                        <PaymentForm
                            amount={grandTotal}
                            propertyId={property.id}
                            checkIn={start.toISOString()}
                            checkOut={end.toISOString()}
                            guests={Number(guests || 2)}
                        />
                    </div>

                    {/* Right Column: Summary */}
                    <div className="w-full lg:w-[400px] order-1 lg:order-2">
                        <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-6 sticky top-24">
                            <div className="flex gap-4 mb-6">
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                    <Image src={property.image} alt={property.title} fill className="object-cover" />
                                </div>
                                <div>
                                    <div className="text-xs text-neutral-400 mb-1">{property.type === 'hotel' ? 'Hotel' : 'Entire place'}</div>
                                    <h3 className="font-bold text-lg leading-tight mb-2">{property.title}</h3>
                                    <div className="flex items-center gap-1 text-xs text-gold">
                                        <Star size={12} fill="currentColor" />
                                        <span>{property.rating} (Superhost)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="py-6 border-t border-b border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-neutral-400 text-sm">{t('dates')}</p>
                                    <div className="text-right">
                                        <div className="font-medium">{new Date(start).toLocaleDateString()} - {new Date(end).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-neutral-400 text-sm">{t('guests')}</p>
                                    <div className="font-medium">{guests || 2} {t('guests')}</div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between text-neutral-400">
                                    <span>
                                        ₪{Math.round(totalPrice / nights).toLocaleString()} avg/night x {nights} nights
                                    </span>
                                    <span>₪{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-neutral-400">
                                    <span>{t('service_fee')}</span>
                                    <span>₪{serviceFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10 mt-4">
                                    <span>{t('total')}</span>
                                    <span>₪{grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
