import { NextResponse } from 'next/server';
import content from '@/data/content.json';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { message, locale } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY?.trim();

        if (!apiKey) {
            return NextResponse.json({ reply: locale === 'he' ? "נא להגדיר מפתח." : "Please configure API Key." });
        }

        const systemPrompt = `
        You are "Eilat Luxury Assistant". 
        Inventory: ${JSON.stringify(content).substring(0, 3000)} ... (Truncated for safety)
        Instructions: Answer in ${locale === 'he' ? 'Hebrew' : 'English'}.
        User: ${message}
        `;

        // Direct REST API Call
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Try Fallback to Gemini Pro
            const url2 = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
            const response2 = await fetch(url2, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }) });
            const data2 = await response2.json();

            if (!response2.ok) {
                return NextResponse.json({ reply: `API Error: ${JSON.stringify(data)} AND ${JSON.stringify(data2)}` }, { status: 500 });
            }
            return NextResponse.json({ reply: data2.candidates[0].content.parts[0].text });
        }

        return NextResponse.json({ reply: data.candidates[0].content.parts[0].text });

    } catch (error: any) {
        return NextResponse.json({ reply: `System Error: ${error.message}` }, { status: 500 });
    }
}
