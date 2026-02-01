import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { message, locale } = await req.json();
        const lowerMsg = message.toLowerCase();

        // Connect DB to fetch real content
        await dbConnect();

        let reply = "";

        // Simple Keyword Matching (Mock AI)
        if (lowerMsg.includes('pool') || lowerMsg.includes('בריכה')) {
            reply = locale === 'he'
                ? "כן! יש לנו דירות מרהיבות עם בריכה. הפנטהאוז שלנו ברויאל ביץ' כולל בריכה פרטית."
                : "Yes! We have amazing apartments with pools. Our Royal Beach Penthouse features a private pool.";
        }
        else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('מחיר') || lowerMsg.includes('כמה')) {
            reply = locale === 'he'
                ? "המחירים משתנים לפי העונה. טווח המחירים הוא בין ₪800 ל-₪2500 ללילה. תרצה שאבדוק זמינות?"
                : "Prices vary by season, ranging from 800₪ to 2500₪ per night. Would you like me to check availability?";
        }
        else if (lowerMsg.includes('contact') || lowerMsg.includes('phone') || lowerMsg.includes('טלפון') || lowerMsg.includes('צור קשר')) {
            reply = locale === 'he'
                ? "תוכל ליצור קשר בטלפון: 050-522-2536 או בוואטסאפ."
                : "You can reach us at 050-522-2536 or via WhatsApp.";
        }
        else if (lowerMsg.includes('location') || lowerMsg.includes('where') || lowerMsg.includes('מיקום') || lowerMsg.includes('איפה')) {
            reply = locale === 'he'
                ? "הדירות שלנו נמצאות במיקומים הכי טובים באילת: רויאל ביץ', מגדלי אילת, ואיזור המלונות."
                : "Our apartments are in prime locations: Royal Beach, Eilat Towers, and the hotel zone.";
        }
        else {
            reply = locale === 'he'
                ? "אני עוזר AI חכם (בשלבי למידה). אני יכול לעזור לך למצוא דירה, לבדוק מחירים או לענות על שאלות. מה תרצה לדעת?"
                : "I am a smart AI assistant (still learning). I can help you find an apartment, check prices, or answer questions. What would you like to know?";
        }

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Chat Error:', error);
        return NextResponse.json({ reply: "Sorry, I am having a bad hair day." }, { status: 500 });
    }
}
