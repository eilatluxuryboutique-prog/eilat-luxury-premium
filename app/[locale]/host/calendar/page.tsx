import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UnifiedCalendar from '@/components/host/unified-calendar';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

export default async function CalendarManagerPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const session: any = await getSession();

    if (!session || (session.role !== 'host' && session.role !== 'admin')) {
        redirect(`/${params.locale}/login`);
    }

    // Fetch properties
    let properties: any[] = [];
    try {
        await dbConnect();
        // Since we are using Mongoose heavily now, fetch via Mongoose
        const docs = await Property.find({ ownerId: session.userId }).lean();
        properties = JSON.parse(JSON.stringify(docs));

        // If DB is empty, use mock data wrapper or just empty
        // In real execution we expect DB data or fallback
    } catch (e) {
        console.log("DB Fetch failed, falling back to mock unavailable");
    }

    return (
        <main className="min-h-screen pt-24 pb-12 bg-[#121212] px-4" dir="rtl">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">ניהול יומנים (Channel Manager)</h1>
                <p className="text-white/50 mb-8">
                    סנכרון מלא בזמן אמת בין Airbnb, Booking.com והאתר שלך.
                    <br />
                    כל ההזמנות מרוכזות במקום אחד למניעת כפילויות.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/10 flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-[#ff5a5f]"></div>
                        <span className="text-white">Airbnb</span>
                    </div>
                    <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/10 flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-[#003580]"></div>
                        <span className="text-white">Booking.com</span>
                    </div>
                    <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/10 flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-[#22c55e]"></div>
                        <span className="text-white">אתר הבית</span>
                    </div>
                    <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/10 flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-[#555]"></div>
                        <span className="text-white">חסום ידנית</span>
                    </div>
                </div>

                <div className="bg-[#1E1E1E] border border-gold/20 p-6 rounded-xl mb-8">
                    <h3 className="text-lg font-bold text-gold mb-4">כיצד להשתמש בניהול יומנים?</h3>
                    <ul className="text-neutral-300 space-y-2 text-sm list-disc list-inside">
                        <li>
                            **סנכרון iCal:** כדי לחבר את Airbnb/Booking, עליך להעתיק את קישור ה-Experience (iCal) מהאתר המקביל ולהדביק אותו בעמוד
                            **"עריכת נכס"** &rarr; **"מתקדם"**.
                        </li>
                        <li>
                            **מניעת כפילויות:** המערכת שלנו בודקת את הקישורים האלו בכל פעם שנכנסת הזמנה חדשה או שהדף נטען, ומונעת הזמנות כפולות.
                        </li>
                        <li>
                            **צבעים:** כל מקור הזמנה מקבל צבע שונה (כפי שמופיע למעלה) כדי שתוכל להבחין בקלות מאיפה הגיעה כל הזמנה.
                        </li>
                        <li>
                            **חסימה ידנית:** ניתן לחסום תאריכים ידנית דרך עמוד "עריכת נכס" בלחיצה על "חסימת תאריכים".
                        </li>
                    </ul>
                </div>

                <div className="border border-white/10 rounded-xl overflow-hidden bg-white">
                    <UnifiedCalendar properties={properties} />
                </div>
            </div>
        </main>
    );
}
