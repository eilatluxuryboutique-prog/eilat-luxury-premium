import { getTranslations } from 'next-intl/server';
import { properties } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Users, Bed, Wifi, Star, Check } from 'lucide-react';
import { Link } from '@/navigation';
import AddToCartButton from '@/components/features/add-to-cart';

export default async function PropertyPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const t = await getTranslations('Property');
    const property = properties.find(p => p.id === params.id);

    if (!property) {
        notFound();
    }

    // ... (rest of filtering)

    return (
    return (
        <main className="min-h-screen bg-background text-foreground pt-24 pb-20 transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary text-black text-xs font-bold px-2 py-1 rounded uppercase">
                                {property.type}
                            </span>
                            <div className="flex items-center gap-1 text-primary">
                                <Star size={14} fill="currentColor" />
                                <span className="font-bold text-sm">{property.rating}</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{property.title}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={18} />
                            <span>{property.location}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-primary">₪{property.price}</div>
                        <div className="text-muted-foreground text-sm">{t('per_night')}</div>
                    </div>
                </div>

                {/* Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px] mb-12 rounded-2xl overflow-hidden">
                    <div className="md:col-span-2 relative h-full">
                        <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="hidden md:flex flex-col gap-4 h-full">
                        {property.images && property.images.length > 0 ? (
                            property.images.slice(0, 2).map((img, i) => (
                                <div key={i} className="relative flex-1 rounded-xl overflow-hidden">
                                    <Image src={img} alt="Gallery" fill className="object-cover" />
                                </div>
                            ))
                        ) : (
                            // Fallback if no gallery images
                            <>
                                <div className="relative flex-1 rounded-xl overflow-hidden bg-muted" />
                                <div className="relative flex-1 rounded-xl overflow-hidden bg-muted" />
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Description & Amenities */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">{t('about')}</h2>
                        <p className="text-muted-foreground leading-relaxed mb-8 text-lg text-right" dir="rtl">
                            {property.description}
                        </p>

                        <h3 className="text-xl font-bold mb-4">{t('amenities')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                            {property.amenities.map(am => (
                                <div key={am} className="flex items-center gap-3 bg-card border border-border p-4 rounded-xl shadow-sm">
                                    <Check size={18} className="text-primary" />
                                    <span>{am}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-8 border-t border-border pt-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-muted p-3 rounded-full">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{t('guests')}</div>
                                    <div className="font-bold">{property.guests} {t('guests_max')}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-muted p-3 rounded-full">
                                    <Bed size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{t('rooms')}</div>
                                    <div className="font-bold">{property.rooms} {t('bedrooms')}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Card */}
                    <div>
                        <div className="bg-card border border-border rounded-2xl p-6 sticky top-24 shadow-lg">
                            <div className="text-center mb-6">
                                <span className="text-muted-foreground">{t('total_price')}</span>
                                <div className="text-4xl font-bold text-primary my-2">₪{property.price}</div>
                                <span className="text-muted-foreground block">{t('taxes')}</span>
                            </div>

                            <Link
                                href={`/checkout?propertyId=${property.id}&guests=${property.guests}`}
                                className="w-full bg-primary hover:brightness-110 text-black font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-[1.02] shadow-lg mb-4 flex items-center justify-center"
                            >
                                {t('book_now')}
                            </Link>

                            <AddToCartButton property={property} />

                            <p className="text-center text-xs text-muted-foreground mt-4">
                                {t('not_charged')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
