import { useTranslations } from 'next-intl';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20" dir="rtl">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-yellow-200 bg-clip-text text-transparent mb-8">
                    תנאי שימוש
                </h1>

                <div className="prose prose-invert prose-gold max-w-none space-y-6 text-white/80">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. כללי</h2>
                        <p>
                            ברוכים הבאים לאתר Eilat Luxury. השימוש באתר זה כפוף לתנאים המפורטים להלן. עצם הגלישה באתר מהווה הסכמה לתנאים אלו.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. הזמנות וביטולים</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>ביטול עד 14 יום ממועד ההזמנה או עד 7 ימים לפני מועד האירוח (המוקדם מביניהם) יחויב ב-5% או 100 ₪ (הנמוך מביניהם).</li>
                            <li>ביטול בטווח של 7 ימים ממועד האירוח יחויב במלוא סכום ההזמנה.</li>
                            <li>הגעה מאוחרת או עזיבה מוקדמת לא תזכה בהחזר כספי.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. נזקים ופקדון</h2>
                        <p>
                            בעת הצ'ק-אין יידרש האורח להפקיד כרטיס אשראי לביטחון. כל נזק שייגרם לנכס או לתכולתו יחויב מכרטיס זה.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. אחריות</h2>
                        <p>
                            הנהלת האתר אינה אחראית לנזקי גוף או רכוש שייגרמו במהלך השהות, למעט מקרים של רשלנות ישירה מצד המארח.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. יצירת קשר</h2>
                        <p>
                            לכל שאלה ניתן לפנות אלינו במייל: support@eilat-luxury.com או בטלפון: 050-1234567.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
