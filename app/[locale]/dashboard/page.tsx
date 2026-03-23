"use client";

// import { useSession } from "next-auth/react"; // If you have next-auth
// Or just mock for now since we are in a hybrid state
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Heart, Settings, LogOut, FileText } from "lucide-react";
import { properties } from "@/lib/mock-data";

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("bookings");
    const [bookings, setBookings] = useState<any[]>([]);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [userProperties, setUserProperties] = useState<any[]>([]);
    const [allProperties, setAllProperties] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Load Real Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Session
                const sessionRes = await fetch('/api/auth/session');
                const sessionData = await sessionRes.json();
                if (sessionData.user) {
                    setUser(sessionData.user);
                } else {
                    // Force redirect if no session
                    window.location.href = '/login';
                    return;
                }

                // 2. Bookings
                const bookingsRes = await fetch('/api/bookings');
                const bookingsData = await bookingsRes.json();
                if (bookingsData.bookings) setBookings(bookingsData.bookings);

                // 3. Wishlist
                const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
                const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
                let apiWishes: string[] = [];
                try {
                    const wishRes = await fetch('/api/wishlist');
                    const wishData = await wishRes.json();
                    if (wishData.wishlist) apiWishes = wishData.wishlist;
                } catch (e) { }
                const merged = Array.from(new Set([...saved, ...favs, ...apiWishes]));
                if (merged.length > 0) {
                    const wishes = properties.filter(p => merged.includes(p.id));
                    setWishlist(wishes);
                }

                // 4. User Properties (for Hosts)
                if (sessionData.user?.role === 'host' || sessionData.user?.role === 'admin') {
                    const propsRes = await fetch(`/api/properties?ownerId=${sessionData.user.id}`);
                    const propsData = await propsRes.json();
                    if (propsData.properties) setUserProperties(propsData.properties);
                }

                // 5. All Properties (for Admin)
                if (sessionData.user?.role === 'admin') {
                    const allPropsRes = await fetch('/api/properties');
                    const allPropsData = await allPropsRes.json();
                    if (allPropsData.properties) setAllProperties(allPropsData.properties);
                }

            } catch (error) {
                console.error("Dashboard data fetch error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const params = useParams();
    const locale = params.locale || 'he';

    const handleLogout = () => {
        localStorage.removeItem('user');
        // Direct server-side logout and redirect with locale
        window.location.href = `/api/auth/logout?lang=${locale}`;
    };

    const getProperty = (id: string) => properties.find(p => p.id === id);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-500 font-medium animate-pulse">טוען נתונים...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black text-zinc-900 mb-2">שלום, {user?.name} 👋</h1>
                <p className="text-zinc-500 mb-8">ברוך הבא לאזור האישי שלך. כאן תוכל לנהל את החופשות שלך.</p>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-zinc-50 rounded-2xl p-4 sticky top-24 border border-zinc-100 shadow-sm">
                            <nav className="flex flex-col gap-2">
                                <button
                                    onClick={() => setActiveTab("bookings")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "bookings" ? "bg-gold text-black font-bold shadow-md" : "text-zinc-600 hover:bg-zinc-100"}`}
                                >
                                    <Calendar size={20} />
                                    <span>ההזמנות שלי</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("wishlist")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "wishlist" ? "bg-gold text-black font-bold shadow-md" : "text-zinc-600 hover:bg-zinc-100"}`}
                                >
                                    <Heart size={20} />
                                    <span>מועדפים</span>
                                </button>

                                {(user?.role === 'host' || user?.role === 'admin') && (
                                    <button
                                        onClick={() => setActiveTab("my-properties")}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "my-properties" ? "bg-gold text-black font-bold shadow-md" : "text-zinc-600 hover:bg-zinc-100"}`}
                                    >
                                        <MapPin size={20} />
                                        <span>הנכסים שלי</span>
                                    </button>
                                )}

                                {user?.role === 'admin' && (
                                    <button
                                        onClick={() => setActiveTab("admin-control")}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "admin-control" ? "bg-gold text-black font-bold shadow-md" : "text-zinc-600 hover:bg-zinc-100"}`}
                                    >
                                        <Settings size={20} />
                                        <span>ניהול מערכת</span>
                                    </button>
                                )}

                                <button
                                    onClick={() => setActiveTab("settings")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "settings" ? "bg-gold text-black font-bold shadow-md" : "text-zinc-600 hover:bg-zinc-100"}`}
                                >
                                    <Settings size={20} />
                                    <span>הגדרות חשבון</span>
                                </button>
                                <div className="h-px bg-zinc-200 my-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium w-full text-right"
                                >
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
                                                        <h3 className="text-xl font-bold text-zinc-900 mb-1">{prop.title}</h3>
                                                        <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                                            <MapPin size={14} />
                                                            <span>{prop.location}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'confirmed' || booking.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                                        {booking.status === 'confirmed' ? 'מאושר' : booking.status}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                                    <div>
                                                        <div className="text-xs text-zinc-400 mb-1">תאריך הגעה</div>
                                                        <div className="text-zinc-900 font-mono font-bold">{checkIn}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-zinc-400 mb-1">תאריך עזיבה</div>
                                                        <div className="text-zinc-900 font-mono font-bold">{checkOut}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-zinc-400 mb-1">סה"כ לתשלום</div>
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

                        {activeTab === "my-properties" && (
                            <PropertyManagement properties={userProperties} title="הנכסים שלי" isHostView />
                        )}

                        {activeTab === "admin-control" && (
                            <PropertyManagement properties={allProperties} title="ניהול נכסים גלובלי" isAdminView />
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
    const [deleting, setDeleting] = useState(false);

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
                window.location.reload();
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

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('⚠️ אזהרה: האם אתה בטוח שברצונך למחוק את החשבון לצמיתות? פעולה זו תמחוק את כל המידע שלך, כולל נכסים והזמנות, ולא ניתן יהיה לבטלה.');

        if (confirmDelete) {
            setDeleting(true);
            try {
                const res = await fetch('/api/user/delete', { method: 'DELETE' });
                if (res.ok) {
                    alert('חשבונך נמחק בהצלחה. להתראות! 👋');
                    window.location.href = '/';
                } else {
                    alert('שגיאה במחיקת החשבון. אנא נסה שוב מאוחר יותר.');
                }
            } catch (e) {
                console.error(e);
                alert('שגיאה בתקשורת.');
            } finally {
                setDeleting(false);
            }
        }
    };

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">הגדרות פרופיל</h2>
            <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-500 mb-2">שם מלא</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-gold outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-500 mb-2">אימייל</label>
                    <input
                        type="email"
                        defaultValue={user?.email}
                        disabled
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 text-zinc-400 cursor-not-allowed italic"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-500 mb-2">טלפון</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="הכנס מספר טלפון"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:border-gold outline-none transition-colors"
                    />
                </div>
                <div className="flex flex-col gap-4 pt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-gold hover:bg-yellow-500 text-black font-black py-4 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                        {saving ? 'שומר שינויים...' : 'שמור שינויים'}
                    </button>

                    <div className="h-px bg-zinc-100 my-2"></div>

                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <h3 className="text-red-800 font-bold mb-1 text-sm">אזור מסוכן</h3>
                        <p className="text-red-600 text-xs mb-4">מחיקת החשבון היא פעולה בלתי הפיכה שתסיר את כל המידע שלך מהמערכת.</p>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={deleting}
                            className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white font-bold py-2 rounded-lg transition-all text-sm disabled:opacity-50"
                        >
                            {deleting ? 'מוחק חשבון...' : 'מחק את החשבון שלי'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PropertyManagement({ properties, title, isHostView, isAdminView }: { properties: any[], title: string, isHostView?: boolean, isAdminView?: boolean }) {
    const [localProps, setLocalProps] = useState(properties);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [blockingDates, setBlockingDates] = useState(false);

    useEffect(() => {
        setLocalProps(properties);
    }, [properties]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק נכס זה?')) return;

        try {
            const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLocalProps(prev => prev.filter(p => p.id !== id));
                alert('הנכס נמחק בהצלחה.');
            } else {
                alert('שגיאה במחיקה.');
            }
        } catch (e) {
            alert('שגיאה בתקשורת.');
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });
            if (res.ok) {
                setLocalProps(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));
            }
        } catch (e) { }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-zinc-900">{title}</h2>
                {isHostView && (
                    <Link href="/add-property" className="bg-gold text-black font-bold px-4 py-2 rounded-lg hover:scale-105 transition-all shadow-sm text-sm">
                        + הוספת נכס חדש
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {localProps.length === 0 ? (
                    <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-3xl py-20 text-center text-zinc-400">
                        לא נמצאו נכסים לניהול
                    </div>
                ) : (
                    localProps.map(prop => (
                        <div key={prop.id} className="bg-white border border-zinc-100 rounded-2xl p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
                            <div className="relative w-full md:w-32 h-32 rounded-xl overflow-hidden shadow-inner">
                                <Image src={prop.image || prop.images?.[0]} alt={prop.title} fill className="object-cover" />
                                {prop.status === 'suspended' && (
                                    <div className="absolute inset-0 bg-red-600/60 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xs uppercase tracking-tighter">
                                        מושעה
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-zinc-900">{prop.title}</h3>
                                <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                                    <MapPin size={12} />
                                    <span>{prop.location}</span>
                                    <span>•</span>
                                    <span>₪{prop.price} ללילה</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <button className="text-zinc-600 hover:text-black text-xs font-bold px-3 py-1.5 bg-zinc-100 rounded-md transition-colors">
                                        עריכת תמונות
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedProperty(prop);
                                            setBlockingDates(true);
                                        }}
                                        className="text-zinc-600 hover:text-black text-xs font-bold px-3 py-1.5 bg-zinc-100 rounded-md transition-colors"
                                    >
                                        חסימת תאריכים
                                    </button>
                                    {isAdminView && (
                                        <button
                                            onClick={() => toggleStatus(prop.id, prop.status)}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${prop.status === 'suspended' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                        >
                                            {prop.status === 'suspended' ? 'החזר לאתר' : 'השעיית נכס'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(prop.id)}
                                        className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1.5 bg-red-50 rounded-md transition-colors"
                                    >
                                        מחיקה
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Date Blocking Modal */}
            {blockingDates && selectedProperty && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                            <div>
                                <h3 className="text-xl font-black text-zinc-900">חסימת תאריכים</h3>
                                <p className="text-zinc-500 text-xs">נכס: {selectedProperty.title}</p>
                            </div>
                            <button onClick={() => setBlockingDates(false)} className="text-zinc-400 hover:text-black p-2 hover:bg-zinc-200 rounded-full transition-all">
                                ✕
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">תאריך התחלה</label>
                                    <input type="date" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">תאריך סיום</label>
                                    <input type="date" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">סיבת החסימה (לא יוצג ללקוח)</label>
                                <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none">
                                    <option value="maintenance">תחזוקה / שיפוצים</option>
                                    <option value="blocked_by_host">חסום על ידי בעל הנכס</option>
                                    <option value="private_use">שימוש פרטי</option>
                                </select>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex gap-3">
                                <div className="text-yellow-600 mt-0.5">⚠️</div>
                                <p className="text-yellow-800 text-xs leading-relaxed font-medium">
                                    שים לב: חסימת תאריכים תמנע מלקוחות לבצע הזמנות חדשות בימים אלו. הזמנות קיימות לא יבוטלו אוטומטית.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    alert('התאריכים נחסמו בהצלחה!');
                                    setBlockingDates(false);
                                }}
                                className="w-full bg-black text-white font-black py-4 rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                            >
                                שמור חסימה לעדכון יומן
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
