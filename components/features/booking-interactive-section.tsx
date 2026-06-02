'use client';

import { useState } from 'react';
import { Link } from '@/navigation';
import AvailabilityCalendar from './availability-calendar';
import AddToCartButton from './add-to-cart';
import LocationMap from './location-map';

export default function BookingInteractiveSection({ property, tLabels }: { property: any, tLabels: any }) {
    const [selectedRange, setSelectedRange] = useState<{ from: Date; to: Date } | undefined>();

    // Calculate days and total price
    let days = 1;
    if (selectedRange?.from && selectedRange?.to) {
        const diffTime = Math.abs(selectedRange.to.getTime() - selectedRange.from.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (days === 0) days = 1; // At least 1 night
    }
    const totalPrice = property.price * days;

    const buildCheckoutUrl = () => {
        let url = `/checkout?propertyId=${property.id}&guests=${property.guests}`;
        if (selectedRange?.from) url += `&start=${selectedRange.from.toISOString().split('T')[0]}`;
        if (selectedRange?.to) url += `&end=${selectedRange.to.toISOString().split('T')[0]}`;
        return url;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 border-t border-border pt-8">
            {/* Left: Calendar & Map */}
            <div className="lg:col-span-2">
                <h3 className="text-xl font-bold mb-6">{tLabels.availability || 'זמינות'}</h3>
                <AvailabilityCalendar 
                    propertyId={property.id} 
                    className="w-full max-w-md mx-auto md:mx-0" 
                    onDateSelect={setSelectedRange}
                />

                <div className="mt-12 border-t border-border pt-8">
                    <LocationMap address={property.location || 'Eilat'} />
                </div>

                {property.virtualTourUrl && (
                    <div className="mt-12 border-t border-border pt-8">
                        <h3 className="text-xl font-bold mb-6">סיור וירטואלי 360°</h3>
                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border shadow-lg bg-black/5">
                            <iframe
                                src={property.virtualTourUrl}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Booking Card */}
            <div>
                <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 shadow-lg">
                    <div className="text-center mb-6">
                        <span className="text-muted-foreground">{tLabels.total_price || 'מחיר כולל'}</span>
                        <div className="text-4xl font-bold text-primary my-2">₪{totalPrice}</div>
                        <span className="text-muted-foreground block">{tLabels.taxes || 'כולל מיסים'}</span>
                        {days > 1 && (
                            <span className="text-sm text-primary block mt-1">עבור {days} לילות</span>
                        )}
                    </div>

                    <Link
                        href={buildCheckoutUrl()}
                        className="w-full bg-primary hover:brightness-110 text-black font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-[1.02] shadow-lg mb-4 flex items-center justify-center"
                    >
                        {tLabels.book_now || 'הזמן עכשיו'}
                    </Link>

                    <AddToCartButton property={property} />

                    <p className="text-center text-xs text-muted-foreground mt-4">
                        {tLabels.not_charged || 'לא תחויב בשלב זה'}
                    </p>
                </div>
            </div>
        </div>
    );
}
