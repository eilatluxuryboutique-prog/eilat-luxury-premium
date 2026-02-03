import { NextResponse } from 'next/server';
import content from '@/data/content.json';

// Local NLP Logic (No External API)
// This ensures 100% reliability even if Google/OpenAI are blocked.

const KEYWORDS = {
    pool: ['pool', 'בריכה', 'שחייה', 'מים'],
    price: ['price', 'cost', 'money', 'מחיר', 'כמה', 'עולה', 'תשלום'],
    contact: ['contact', 'phone', 'call', 'email', 'טלפון', 'צור קשר', 'מספר', 'וואטסאפ'],
    location: ['location', 'where', 'address', 'map', 'מיקום', 'כתובת', 'איפה'],
    booking: ['book', 'reserve', 'order', 'הזמנה', 'להזמין', 'שריין'],
    parking: ['parking', 'park', 'חניה', 'רכב'],
    wifi: ['wifi', 'internet', 'אינטרנט', 'וויפיי'],
    greeting: ['hi', 'hello', 'hey', 'shalom', 'היי', 'שלום', 'אהלן']
};

export async function POST(req: Request) {
    try {
        const { message, locale } = await req.json();
        const lowerMsg = message.toLowerCase();

        let reply = "";

        // 1. Check for Greeting
        if (KEYWORDS.greeting.some(k => lowerMsg.includes(k))) {
            reply = locale === 'he'
                ? "שלום! איך אני יכול לעזור לך למצוא את החופשה המושלמת באילת?"
                : "Hello! How can I help you find the perfect vacation in Eilat?";
        }

        // 2. Check for "Pool"
        else if (KEYWORDS.pool.some(k => lowerMsg.includes(k))) {
            const poolProps = content.filter(p => JSON.stringify(p).toLowerCase().includes('pool') || JSON.stringify(p).toLowerCase().includes('בריכה'));
            const names = poolProps.map(p => locale === 'he' ? p.titleHE : p.title).join(', ');
            reply = locale === 'he'
                ? `יש לנו ${poolProps.length} דירות עם בריכה: ${names}. תרצה לראות אותן?`
                : `We have ${poolProps.length} apartments with a pool: ${names}. Would you like to see them?`;
        }

        // 3. Check for "Price"
        else if (KEYWORDS.price.some(k => lowerMsg.includes(k))) {
            reply = locale === 'he'
                ? "המחירים שלנו נעים בין 800₪ ל-2500₪ ללילה, תלוי בעונה ובנכס. לפרטים מדויקים, מומלץ לבחור תאריכים באתר."
                : "Our prices range from 800₪ to 2500₪ per night, depending on the season and property. For exact rates, please select dates on the site.";
        }

        // 4. Check for "Contact"
        else if (KEYWORDS.contact.some(k => lowerMsg.includes(k))) {
            reply = locale === 'he'
                ? "אנחנו זמינים לכל שאלה! טלפון/וואטסאפ: 050-522-2536."
                : "We are available for any question! Phone/WhatsApp: 050-522-2536.";
        }

        // 5. Fallback
        else {
            reply = locale === 'he'
                ? "אני יכול לעזור לך למצוא דירות, לבדוק מחירים או לענות על שאלות נפוצות. נסה לשאול על 'בריכה', 'חניה' או 'מחיר'."
                : "I can help you find apartments, check prices, or answer common questions. Try asking about 'pool', 'parking', or 'price'.";
        }

        return NextResponse.json({ reply });

    } catch (error: any) {
        return NextResponse.json({ reply: "System Error." }, { status: 500 });
    }
}
