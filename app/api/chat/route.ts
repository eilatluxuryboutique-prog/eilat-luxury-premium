import { NextResponse } from 'next/server';
import { properties } from '@/lib/mock-data';

// Local NLP Logic (No External API)
// This ensures 100% reliability even if Google/OpenAI are blocked.

interface KeywordMap {
    [key: string]: string[];
}

const KEYWORDS: KeywordMap = {
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
                ? "שלום! איך אני יכול לעזור לך למצוא את החופשה המושלמת באילת? אני מכיר את כל הנכסים שלנו."
                : "Hello! How can I help you find the perfect vacation in Eilat? I know all our properties.";
        }

        // 2. Check for "Pool"
        else if (KEYWORDS.pool.some(k => lowerMsg.includes(k))) {
            const poolProps = properties.filter(p =>
                JSON.stringify(p).toLowerCase().includes('pool') ||
                JSON.stringify(p).toLowerCase().includes('בריכה')
            );
            // Take top 3
            const names = poolProps.slice(0, 3).map(p => p.title).join(', ');
            const count = poolProps.length;

            reply = locale === 'he'
                ? `יש לנו ${count} נכסים עם בריכה, למשל: ${names}... תרצה שאשלח לך קישור?`
                : `We have ${count} properties with a pool, for example: ${names}... Would you like a link?`;
        }

        // 3. Check for "Price"
        else if (KEYWORDS.price.some(k => lowerMsg.includes(k))) {
            reply = locale === 'he'
                ? "המחירים שלנו נעים בין 400₪ ל-5000₪ ללילה, תלוי בעונה ובנכס (דירה, פנטהאוז או וילה). לפרטים מדויקים, מומלץ לבחור תאריכים באתר."
                : "Our prices range from 400₪ to 5000₪ per night, depending on the season and property type. For exact rates, please select dates on the site.";
        }

        // 4. Check for "Contact"
        else if (KEYWORDS.contact.some(k => lowerMsg.includes(k))) {
            reply = locale === 'he'
                ? "אנחנו זמינים לכל שאלה! טלפון/וואטסאפ: 050-522-2536."
                : "We are available for any question! Phone/WhatsApp: 050-522-2536.";
        }

        // 5. Check for "Villa"
        else if (lowerMsg.includes('villa') || lowerMsg.includes('וילה')) {
            const villaProps = properties.filter(p => p.type === 'villa');
            const names = villaProps.slice(0, 3).map(p => p.title).join(', ');
            reply = locale === 'he'
                ? `יש לנו ${villaProps.length} וילות יוקרתיות: ${names}.`
                : `We have ${villaProps.length} luxury villas: ${names}.`;
        }

        // 6. Fallback
        else {
            reply = locale === 'he'
                ? "אני יכול לעזור לך למצוא דירות, וילות, לבדוק מחירים או לענות על שאלות. נסה לשאול על 'בריכה', 'וילות' או 'מחיר'."
                : "I can help see apartments, villas, check prices, or answer questions. Try asking about 'pool', 'villas', or 'price'.";
        }

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Local NLP Error:", error);
        return NextResponse.json({ reply: "System Error." }, { status: 500 });
    }
}
