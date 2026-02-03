import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { GoogleGenerativeAI } from "@google/generative-ai";
import content from '@/data/content.json';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { message, locale } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY?.trim();

        // If no API key, use fallback mock (user still needs to provide key)
        if (!apiKey) {
            console.log("No GEMINI_API_KEY found. Using Mock.");
            const lowerMsg = message.toLowerCase();
            let reply = "";
            if (lowerMsg.includes('pool') || lowerMsg.includes('בריכה')) {
                reply = locale === 'he'
                    ? "כן! יש לנו דירות מרהיבות עם בריכה. הפנטהאוז שלנו ברויאל ביץ' כולל בריכה פרטית."
                    : "Yes! We have amazing apartments with pools. Our Royal Beach Penthouse features a private pool.";
            } else {
                reply = locale === 'he'
                    ? "כדי שאהיה חכם באמת, המנהל שלי צריך להוסיף מפתח API (Gemini Key). כרגע אני במצב הדגמה."
                    : "To be truly smart, my admin needs to configure the Gemini API Key. I am in demo mode.";
            }
            return NextResponse.json({ reply });
        }

        // Real AI Logic
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelName = "gemini-pro";
        const model = genAI.getGenerativeModel({ model: modelName });

        const systemPrompt = `
        You are "Eilat Luxury Assistant", a helpful, polite, and professional agent for a luxury vacation rental business in Eilat, Israel.
        Your Goal: Help users find the perfect apartment, answer questions about policies, and assist with booking inquiries.
        
        Inventory Data:
        ${JSON.stringify(content)}

        Instructions:
        1. Always answer in the language requested: ${locale === 'he' ? 'Hebrew (עברית)' : 'English'}.
        2. Be concise but warm. Use emojis occasionally (🏖️, ☀️).
        3. Only recommend properties from the provided data. Do not invent properties.
        4. If the user asks for contact info, provide: 050-522-2536.
        5. If asked about prices, say "Prices vary by season, typically 800-2500 NIS per night."
        
        User Query: ${message}
        `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error('Chat Error:', error);
        return NextResponse.json({ reply: `Error (Key: ${process.env.GEMINI_API_KEY ? 'Present' : 'Missing'}): ${error.message || error}` }, { status: 500 });
    }
}
