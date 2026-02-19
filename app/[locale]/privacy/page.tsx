export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20" dir="rtl">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-yellow-200 bg-clip-text text-transparent mb-8">
                    מדיניות פרטיות
                </h1>

                <div className="prose prose-invert prose-gold max-w-none space-y-6 text-white/80">
                    <section>
                        <p>
                            אנו ב-Eilat Luxury מכבדים את פרטיותך ומתחייבים להגן על המידע האישי שלך. מסמך זה מתאר כיצד אנו אוספים ומשתמשים במידע.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. איסוף מידע</h2>
                        <p>
                            אנו אוספים מידע אישי כגון שם, טלפון, וכתובת מייל בעת ביצוע הזמנה או הרשמה לניוזלטר.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. שימוש במידע</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>עיבוד הזמנות ושליחת אישורים.</li>
                            <li>יצירת קשר בנוגע להזמנה.</li>
                            <li>שיפור חווית המשתמש באתר.</li>
                            <li>שליחת עדכונים שיווקיים (רק אם נתת הסכמה מפורשת).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. אבטחת מידע</h2>
                        <p>
                            אנו משתמשים בטכנולוגיות הצפנה מתקדמות (SSL) כדי להגן על פרטיך הרגישים ופרטי האשראי.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. עוגיות (Cookies)</h2>
                        <p>
                            האתר משתמש בעוגיות לצורך תפעול שוטף, שיפור הביצועים וניתוח סטטיסטי.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
