import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Regex Fallback (If no API Key)
function analyzeRegex(text: string) {
    const filters: any = {};
    const lower = text.toLowerCase();

    // Guests
    const guestMatch = lower.match(/(\d+)\s*(people|guests|u|friends|family|אנשים|אורחים|חברים)/i);
    if (guestMatch) filters.guests = parseInt(guestMatch[1]);

    // Type
    if (lower.includes('villa') || lower.includes('וילה')) filters.type = 'villa';
    else if (lower.includes('apartment') || lower.includes('דירה') || lower.includes('flat')) filters.type = 'apartment';
    else if (lower.includes('hotel') || lower.includes('מלון')) filters.type = 'hotel';

    // Dates (Very basic)
    // ... complex date parsing is hard with regex, skipping for now unless specific format

    // Price
    // ...

    return filters;
}

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query) return NextResponse.json({ error: "Empty query" }, { status: 400 });

        // Try Gemini
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                const prompt = `
                    Analyze this travel search query and extract filters in JSON format.
                    Query: "${query}"
                    Possible JSON fields:
                    - type: "apartment", "villa", "hotel" (or null)
                    - guests: number (default 2)
                    - location: string (default "Eilat")
                    - amenities: string[] (e.g. "pool", "wifi", "sea view")
                    - maxPrice: number (or null)
                    
                    Return ONLY raw JSON. No markdown.
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

                const data = JSON.parse(text);
                return NextResponse.json(data);

            } catch (geminiError) {
                console.error("Gemini API Error (falling back to regex):", geminiError);
            }
        }

        // Fallback
        const data = analyzeRegex(query);
        return NextResponse.json(data);

    } catch (error) {
        console.error("Analyze Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
