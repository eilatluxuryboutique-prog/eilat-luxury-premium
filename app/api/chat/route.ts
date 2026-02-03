import { NextResponse } from 'next/server';
import { properties, Property } from '@/lib/mock-data';

// --- CONFIGURATION ---
const CONTACT_PHONE = "050-522-2536";

// --- TEMPLATES (Hebrew & English) ---
const TEMPLATES = {
    he: {
        greetings: [
            "שלום! אני כאן כדי לעזור לך למצוא את החופשה המושלמת.",
            "היי! איזה כיף שהצטרפת. מה מחפשים הפעם?",
            "אהלן! אני העוזר האישי שלך לחופשות באילת. איך אפשר לעזור?",
            "שלום רב. אני מכיר את כל הנכסים שלנו בעל פה. שאל אותי כל דבר!"
        ],
        fallback: [
            "אני מבין, אבל כרגע אני יודע לענות בעיקר על דירות, מחירים וזמינות. נסה לשאול 'איזה וילות יש?' או 'כמה עולה דירה עם בריכה?'.",
            "שאלה מעניינת. אני מתמחה במציאת נכסים. תוכל למקד אותי? (למשל: 'אני מחפש דירה לזוג').",
            "אני עדיין לומד, אבל אני אלוף במציאת חופשות. נסה לשאול על מיקום, מחיר או מס' חדרים.",
        ],
        contact: [
            `בשמחה! אנחנו זמינים בוואטסאפ או בטלפון: ${CONTACT_PHONE}`,
            `כמובן. המספר שלנו הוא ${CONTACT_PHONE}. דבר איתנו!`,
            `מוזמן לחייג אלינו: ${CONTACT_PHONE}. אנחנו עונים מהר.`
        ],
        priceGeneral: [
            "המחירים משתנים לפי העונה והנכס. בגדול? בין 400₪ לדירת יחיד ועד 5000₪ לוילות מפוארות.",
            "זה תלוי בתאריך. דירות מתחילות סביב 500₪, ווילות יוקרה יכולות להגיע ל-4000₪.",
            "טווח המחירים שלנו רחב ומתאים לכולם. ממליץ לבחור נכס ספציפי כדי לקבל מחיר מדויק."
        ]
    },
    en: {
        greetings: [
            "Hello! I'm here to help you find the perfect vacation.",
            "Hi there! What are you looking for today?",
            "Welcome! Ask me anything about our luxury properties."
        ],
        fallback: [
            "I'm mainly trained on property details. Try asking about 'Villas', 'Pools' or 'Prices'.",
            "I didn't quite catch that. Can you ask about a specific apartment or budget?",
        ],
        contact: [
            `Sure! Contact us at: ${CONTACT_PHONE}`,
            `You can reach us anytime at ${CONTACT_PHONE}.`
        ],
        priceGeneral: [
            "Prices range from 400NIS to 5000NIS depending on the property and season.",
            "It depends on the dates. Apartments start at ~500NIS, Villas go up to ~4000NIS."
        ]
    }
};

// --- HELPER FUNCTIONS ---
function getRandom(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function findProperties(query: string) {
    const q = query.toLowerCase();
    return properties.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.type.includes(q) ||
        (q.includes('pool') && JSON.stringify(p).toLowerCase().includes('pool')) ||
        (q.includes('בריכה') && JSON.stringify(p).toLowerCase().includes('בריכה'))
    );
}

export async function POST(req: Request) {
    try {
        const { message, locale } = await req.json();
        const lowerMsg = message.toLowerCase();
        const isHe = locale === 'he';
        const t = isHe ? TEMPLATES.he : TEMPLATES.en;

        let reply = "";

        // 1. Greeting
        if (['hi', 'hello', 'shalom', 'hey', 'start', 'היי', 'שלום', 'אהלן'].some(w => lowerMsg.includes(w))) {
            return NextResponse.json({ reply: getRandom(t.greetings) });
        }

        // 2. Contact
        if (['phone', 'contact', 'call', 'mail', 'number', 'טלפון', 'מספר', 'וואטסאפ', 'צור קשר'].some(w => lowerMsg.includes(w))) {
            return NextResponse.json({ reply: getRandom(t.contact) });
        }

        // 3. Price (General)
        if (['how much', 'price', 'cost', 'כמה עולה', 'מחיר', 'עלות', 'תשלום'].some(w => lowerMsg.includes(w))) {
            // If query specifically mentions a property name, handle in search logic?
            // Let's pass through to search logic if it contains "villa" or similar?
            if (!lowerMsg.includes('villa') && !lowerMsg.includes('apartment') && !lowerMsg.includes('דירה') && !lowerMsg.includes('וילה')) {
                return NextResponse.json({ reply: getRandom(t.priceGeneral) });
            }
        }

        // 4. COMPLEX SEARCH LOGIC
        // Try to identify intent: "Villa", "Apartment", "Pool", "View", "Jacuzzi"
        const relevantProps = findProperties(lowerMsg);

        if (relevantProps.length > 0) {
            const top3 = relevantProps.slice(0, 3);
            const titles = top3.map(p => p.title).join(', ');

            if (isHe) {
                reply = `מצאתי ${relevantProps.length} נכסים שיכולים להתאים! למשל: ${titles}. `;
                if (relevantProps.length > 3) reply += `ועוד ${relevantProps.length - 3} נוספים. `;
                reply += `המחירים נעים סביב ${relevantProps[0].price}₪ ללילה. תרצה שאשלח לך קישור?`;
            } else {
                reply = `I found ${relevantProps.length} matching properties! E.g., ${titles}. `;
                reply += `Prices are around ${relevantProps[0].price}NIS. Want a link?`;
            }
            return NextResponse.json({ reply });
        }

        // 5. Specific text-based matches (Policies etc.)
        if (lowerMsg.includes('check in') || lowerMsg.includes('צאק אין') || lowerMsg.includes('שעה')) {
            return NextResponse.json({ reply: isHe ? "הצ'ק אין אצלנו הוא החל מהשעה 15:00, והצ'ק אאוט עד 11:00. (גמישים בתיאום מראש!)." : "Check-in is at 15:00, Check-out by 11:00." });
        }

        // 6. Fallback
        return NextResponse.json({ reply: getRandom(t.fallback) });

    } catch (error: any) {
        return NextResponse.json({ reply: "System Error" }, { status: 500 });
    }
}
