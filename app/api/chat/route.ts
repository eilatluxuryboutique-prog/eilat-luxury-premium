import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { GoogleGenerativeAI } from "@google/generative-ai";
import content from '@/data/content.json';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { message, locale } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY?.trim();

        if (!apiKey) {
            const lowerMsg = message.toLowerCase();
            // Mock Response
            let reply = locale === 'he'
                ? "כדי שאהיה חכם באמת, המנהל שלי צריך להוסיף מפתח API (Gemini Key). כרגע אני במצב הדגמה."
                : "To be truly smart, my admin needs to configure the Gemini API Key. I am in demo mode.";
            return NextResponse.json({ reply });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const systemPrompt = `
        You are "Eilat Luxury Assistant", a helpful, polite, and professional agent for a luxury vacation rental business in Eilat, Israel.
        Your Goal: Help users find the perfect apartment, answer questions about policies, and assist with booking inquiries.
        Inventory Data: ${JSON.stringify(content)}
        Instructions:
        1. Always answer in the language requested: ${locale === 'he' ? 'Hebrew (עברית)' : 'English'}.
        2. Be concise but warm. Use emojis (🏖️, ☀️).
        3. Only recommend properties from the provided data.
        4. Contact: 050-522-2536. 
        5. Prices: 800-2500 NIS.
        User Query: ${message}
        `;

        try {
            // Priority 1: Gemini 1.5 Flash (Fastest)
            console.log("Attempting gemini-1.5-flash...");
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(systemPrompt);
            return NextResponse.json({ reply: result.response.text() });
        } catch (error1: any) {
            console.error("Gemini 1.5 Flash Failed:", error1.message);
            try {
                // Priority 2: Gemini Pro (Stable)
                console.log("Attempting gemini-pro...");
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const result = await model.generateContent(systemPrompt);
                return NextResponse.json({ reply: result.response.text() });
            } catch (error2: any) {
                console.error("Gemini Pro Failed:", error2.message);
                return NextResponse.json({
                    reply: `Error: Both 'gemini-1.5-flash' and 'gemini-pro' failed. Key present? ${!!apiKey}. Err1: ${error1.message}. Err2: ${error2.message}`
                }, { status: 500 });
            }
        }

    } catch (error: any) {
        console.error('Chat Fatal Error:', error);
        return NextResponse.json({ reply: `System Error: ${error.message}` }, { status: 500 });
    }
}
