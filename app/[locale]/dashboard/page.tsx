"use client";

// import { useSession } from "next-auth/react"; // If you have next-auth
// Or just mock for now since we are in a hybrid state
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Heart, Settings, LogOut, FileText } from "lucide-react";
import { properties } from "@/lib/mock-data";

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("bookings");
    const [bookings, setBookings] = useState<any[]>([]);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    // Load Real Data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/session');
                const data = await res.json();
                if (data.user) setUser(data.user);
            } catch (e) { console.error("Session error", e); }
        };
        fetchUser();

        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/bookings');
                const data = await res.json();
                if (data.bookings) {
                    setBookings(data.bookings);
                }
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            }
        };

        fetchBookings();

        // Load Wishlist (Merge API + Local)
        const fetchWishlist = async () => {
            const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
            // Also check 'favorites' key which FavoriteButton uses
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');

            let apiWishes: string[] = [];

            try {
                const res = await fetch('/api/wishlist');
                const data = await res.json();
                if (data.wishlist) apiWishes = data.wishlist;
            } catch (e) { console.error("Wishlist API error", e); }

            const merged = Array.from(new Set([...saved, ...favs, ...apiWishes]));

            if (merged.length > 0) {
                const wishes = properties.filter(p => merged.includes(p.id));
                setWishlist(wishes);
            }
        };
        fetchWishlist();
    }, []);

    const getProperty = (id: string) => properties.find(p => p.id === id);

    return (
        <div className="min-h-screen bg-[#121212] pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black text-white mb-2">שלום, {user?.name || 'אורח'} 👋</h1>
                <p className="text-white/60 mb-8">ברוך הבא לאזור האישי שלך. כאן תוכל לנהל את החופשות שלך.</p>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-[#1a1a1a] rounded-2xl p-4 sticky top-24 border border-white/5">
                            <nav className="flex flex-col gap-2">
                                <button
                                    onClick={() => setActiveTab("bookings")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "bookings" ? "bg-gold text-black font-bold" : "text-white/70 hover:bg-white/5"}`}
                                >
                                    <Calendar size={20} />
                                    <span>ההזמנות שלי</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("wishlist")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "wishlist" ? "bg-gold text-black font-bold" : "text-white/70 hover:bg-white/5"}`}
                                >
                                    <Heart size={20} />
                                    <span>מועדפים</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("settings")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "settings" ? "bg-gold text-black font-bold" : "text-white/70 hover:bg-white/5"}`}
                                >
                                    <Settings size={20} />
                                    <span>הגדרות</span>
                                </button>
                                <div className="h-px bg-white/10 my-2"></div>
                                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium">
                                    <LogOut size={20} />
                                    <span>התנתק</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="flex-1">
                        {activeTab === "bookings" && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-4">ההזמנות שלי</h2>
                                {bookings.map((booking: any) => {
                                    let prop = booking.propertyId;

                                    // Handle Hybrid Data:
                                    // If prop is just an ID string (failed populate or mock ID), try to find in mock data
                                    if (typeof prop === 'string') {
                                        prop = properties.find(p => p.id === prop);
                                    }

                                    // If still invalid, skip
                                    if (!prop || typeof prop === 'string') return null;

                                    // Format dates
                                    const checkIn = new Date(booking.checkIn).toLocaleDateString('he-IL');
                                    const checkOut = new Date(booking.checkOut).toLocaleDateString('he-IL');

                                    return (
                                        <div key={booking._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row">
                                            <div className="relative w-full md:w-48 h-48 md:h-auto">
                                                <Image
                                                    src={prop.image || prop.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'}
                                                    alt={prop.title || 'Property'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white mb-1">{prop.title}</h3>
                                                        <div className="flex items-center gap-2 text-white/50 text-sm">
                                                            <MapPin size={14} />
                                                            <span>{prop.location}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'confirmed' || booking.status === 'upcoming' ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/50'}`}>
                                                        {booking.status === 'confirmed' ? 'מאושר' : booking.status}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                                    <div>
                                                        <div className="text-xs text-white/40 mb-1">תאריך הגעה</div>
                                                        <div className="text-white font-mono">{checkIn}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-white/40 mb-1">תאריך עזיבה</div>
                                                        <div className="text-white font-mono">{checkOut}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-white/40 mb-1">סה"כ לתשלום</div>
                                                        <div className="text-gold font-bold">₪{booking.totalPrice?.toLocaleString()}</div>
                                                    </div>
                                                    <div className="flex items-end justify-end">
                                                        <button className="text-white/60 hover:text-white flex items-center gap-1 text-sm underline decoration-white/30 hover:decoration-white">
                                                            <FileText size={14} />
                                                            קבלות
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {activeTab === "wishlist" && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">המועדפים שלי</h2>
                                {wishlist.length === 0 ? (
                                    <div className="text-white/40 text-center py-20">עוד לא הוספת כלום לרשימה... ❤️</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {wishlist.map(prop => (
                                            <Link key={prop.id} href={`/property/${prop.id}`} className="group bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all">
                                                <div className="relative h-48">
                                                    <Image src={prop.image} alt={prop.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-gold transition-colors">{prop.title}</h3>
                                                    <p className="text-white/60 text-sm mb-3 line-clamp-1">{prop.description}</p>
                                                    <div className="font-bold text-white">₪{prop.price} <span className="text-sm font-normal text-white/40">/לילה</span></div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <ProfileSettings user={user} />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

function ProfileSettings({ user }: { user: any }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || ''
    });
    const [saving, setSaving] = useState(false);

    // Update form when user data loads
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('הפרופיל עודכן בהצלחה! 💾');
                window.location.reload(); // Refresh to show new name in header
            } else {
                alert('שגיאה בשמירת השינויים.');
            }
        } catch (e) {
            console.error(e);
            alert('שגיאה בתקשורת.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-white mb-6">הגדרות פרופיל</h2>
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">שם מלא</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">אימייל</label>
                    <input
                        type="email"
                        defaultValue={user?.email}
                        disabled
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white/50 focus:border-gold/50 outline-none transition-colors cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">טלפון</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="הכנס מספר טלפון"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 outline-none transition-colors"
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gold hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50"
                >
                    {saving ? 'שומר...' : 'שמור שינויים'}
                </button>
            </div>
        </div>
    );
}
