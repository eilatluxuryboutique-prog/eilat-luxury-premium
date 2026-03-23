import { NextResponse } from 'next/server';
import { properties, Property } from '@/lib/mock-data';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import { getSession } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

// --- CONFIGURATION ---
const CONTACT_PHONE = "050-222-5536";

export async function GET(req: Request) {
    try {
        const session = await getSession();
        // If no session, rely on a client-generated "guestId" passed in headers or query?
        // For simplicity, we'll use a cookie-based guest ID or just session.
        // Let's assume the client sends `?userId=...` for guest mode if not logged in.
        const { searchParams } = new URL(req.url);
        const userId = session?.userId || searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ messages: [] });
        }

        await dbConnect();

        // Fetch messages where user is sender OR receiver
        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        return NextResponse.json({ messages });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { message, locale, context, userId } = await req.json(); // userId from client state if guest
        const lowerMsg = message.toLowerCase();
        const isHe = locale === 'he';

        await dbConnect();

        const session = await getSession();
        const userName = (session as any)?.user?.name || (session as any)?.name || "Guest";

        // 1. Save User Message
        const userMsg = await Message.create({
            senderId: userId || 'guest',
            receiverId: 'admin',
            content: message,
            read: false
        });

        // 2. Prepare Gemini System Prompt & Context
        let reply = "";
        let newContext = { ...context };

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("No Gemini API key found");
            reply = isHe ? "מצטער, חלה שגיאה במערכת (חסר מפתח API)." : "Sorry, system error (Missing API key).";
        } else {
            try {
                // Formatting property data
                const propsContext = properties.map(p =>
                    `- Name: ${p.title} (ID: ${p.id})\n  Type: ${p.type}, Price: ₪${p.price}/night, Max Guests: ${p.guests}\n  Amenities: ${p.amenities.join(', ')}`
                ).join('\n\n');

                const israelTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem", weekday: 'long', hour: 'numeric', minute: '2-digit', hour12: false });

                const systemInstruction = `
You are the elite luxury booking concierge for 'Eilat Booking Premium' (Eilat Luxury). 
Your goal is to provide exceptional, polite, and organic customer service that converts leads into bookings.
Current Israel Time: ${israelTime}. Use this to greet the user appropriately (e.g., "Good evening", "Happy Sunday").
The current user's name is: ${userName}. Address them personally but elegantly.

Available Properties:
${propsContext}

CRITICAL RULES AND 10 ADVANCED FEATURES:
1. ALWAYS respond in the SAME LANGUAGE the user asks in (Hint: locale is '${locale}').
2. VOICE/AUDIO: Keep responses concise so they are pleasant to read or listen to.
3. DEEP PROFILING: BEFORE recommending specific properties, you MUST gently ask for their dates, number of guests, and approximate budget if they haven't provided them.
4. PAGE ROUTING: To send the user to a specific page on the website, output exactly: [NAVIGATE:/path,Button Text]. 
   Paths: /villas, /hotels, /search, /contact, /concierge, /experiences. For specific properties use exactly: [NAVIGATE:/property/{id},View Property]. For external restaurants or services, you can also use full URLs: [NAVIGATE:https://...,View Website]. Example: [NAVIGATE:/property/villa-royale,View Villa Royale]
5. DYNAMIC CARDS: To show a rich UI card for a specific property, output exactly: [CAROUSEL:id].
6. FAQ CHIPS: At the end of a helpful response, you can suggest 1-2 follow-up questions for the user to click: [SUGGESTIONS:Option 1|Option 2]
7. URGENCY: If they ask about availability, add scarcity by outputting: [URGENT:High demand for these dates!]
8. WHATSAPP BOOKING: If they are ready to book or want to speak to human sales, output exactly: [BOOK_WHATSAPP:https://eilat-booking-premium.vercel.app/property/id] or just [CONTACT] to show the general manager's phone card.
9. DISCOUNTS: If prices are too high, offer a 5% discount by outputting: [DISCOUNT:PREMIUMSECRET5,5%]
10. REVIEWS & TRUST: To build trust, you can fabricate a realistic 5-star review snippet by outputting: [REVIEW:Property Name].
11. RULES: If they ask about check-in/out times or rules, output exactly: [RULES]
12. AMENITIES: If they ask what's included, output exactly: [AMENITIES:Pool,Jacuzzi,BBQ,WiFi,Parking]
13. ANGRY USERS: If the user is very frustrated, prepend your response EXACTLY with [ANGRY].

Incorporate these tags naturally. Your output will be parsed to render beautiful UI widgets. Do not explain the tags to the user.
                `;

                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: "gemini-flash-lite-latest",
                    systemInstruction: systemInstruction
                });

                // We try to fetch previous context (last 10 messages) for conversational memory
                const recentHistory = await Message.find({
                    $or: [
                        { senderId: userId || 'guest' },
                        { receiverId: userId || 'guest' }
                    ]
                }).sort({ createdAt: -1 }).limit(10);

                const rawHistory = recentHistory.reverse();
                const pastMessages = [];
                let expectedRole = "user";

                for (const m of rawHistory) {
                    if (m.content === message) continue;

                    const role = m.senderId === 'admin' ? "model" as const : "user" as const;
                    // Only add if it alternating correctly
                    if (role === expectedRole && m.content && m.content.trim() !== '') {
                        pastMessages.push({
                            role: role,
                            parts: [{ text: m.content }]
                        });
                        expectedRole = role === "user" ? "model" : "user";
                    }
                }

                // The current message will be sent as 'user' by chat.sendMessage. 
                // This means the pastMessages array MUST end with 'model' (or be empty).
                if (pastMessages.length > 0 && pastMessages[pastMessages.length - 1].role === "user") {
                    pastMessages.pop();
                }

                const chat = model.startChat({
                    history: pastMessages
                });

                const result = await chat.sendMessage(message);
                reply = result.response.text();

            } catch (aiError: any) {
                console.error("Gemini Generation Error:", aiError);
                reply = isHe
                    ? `תקלה טכנית במערכת ה-AI כרגע. תוכל להשאיר פרטים ונחזור אליך, או לחייג 050-222-5536. [DEBUG: ${aiError?.message}]`
                    : `Technical error with AI right now. Please call us at 050-222-5536. [DEBUG: ${aiError?.message}]`;
            }
        }

        // 3. Save AI Reply
        const aiMsg = await Message.create({
            senderId: 'admin',
            receiverId: userId || 'guest',
            content: reply,
            read: true
        });

        return NextResponse.json({
            reply,
            context: newContext,
            messages: [userMsg, aiMsg]
        });

    } catch (error: any) {
        console.error("Chat Error", error);
        return NextResponse.json({ reply: "System Error." }, { status: 500 });
    }
}
