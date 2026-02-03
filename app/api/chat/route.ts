import { NextResponse } from 'next/server';
import { properties, Property } from '@/lib/mock-data';

// --- CONFIGURATION ---
const CONTACT_PHONE = "050-522-2536";

export async function POST(req: Request) {
    try {
        const { message, locale, context } = await req.json(); // context = { propertyId: '...' }
        const lowerMsg = message.toLowerCase();
        const isHe = locale === 'he';

        let reply = "";
        let newContext = { ...context };

        // Helper: Format Link
        const link = (p: Property) => `[${p.title}](/property/${p.id})`;

        // 1. CHEAPEST / MOST EXPENSIVE
        if (lowerMsg.includes('cheapest') || lowerMsg.includes('כי זול') || lowerMsg.includes('הכי זול')) {
            const sorted = [...properties].sort((a, b) => a.price - b.price);
            const cheap = sorted[0];
            newContext = { propertyId: cheap.id }; // Store context
            reply = isHe
                ? `הנכס הכי זול שלנו הוא **${link(cheap)}** במחיר **${cheap.price}₪**. הוא מתאים ל-${cheap.guests} אורחים.`
                : `The cheapest option is **${link(cheap)}** at **${cheap.price}NIS**. Fits ${cheap.guests} guests.`;
            return NextResponse.json({ reply, context: newContext });
        }

        if (lowerMsg.includes('expensive') || lowerMsg.includes('luxur') || lowerMsg.includes('כי יקר') || lowerMsg.includes('יוקר')) {
            const sorted = [...properties].sort((a, b) => b.price - a.price);
            const exp = sorted[0];
            newContext = { propertyId: exp.id };
            reply = isHe
                ? `הפסגה של היוקרה שלנו: **${link(exp)}** (וילה). המחיר הוא **${exp.price}₪** ללילה.`
                : `Our top luxury property: **${link(exp)}** (Villa). Price is **${exp.price}NIS**/night.`;
            return NextResponse.json({ reply, context: newContext });
        }

        // 2. CONTEXT AWARENESS (Follow-up)
        // If user asks about specific feature "parking", "pool", "wifi", "view" AND has context
        if (newContext?.propertyId) {
            const lastProp = properties.find(p => p.id === newContext.propertyId);
            if (lastProp) {
                if (lowerMsg.includes('parking') || lowerMsg.includes('חניה')) {
                    const has = lastProp.amenities.some(a => a.includes('חניה') || a.includes('Parking'));
                    reply = isHe
                        ? `בנוגע ל-${lastProp.title}: ${has ? 'כן, יש חניה!' : 'אין חניה פרטית, אך יש חניונים באזור.'}`
                        : `Regarding ${lastProp.title}: ${has ? 'Yes, parking included.' : 'No private parking listed.'}`;
                    return NextResponse.json({ reply, context: newContext });
                }
                if (lowerMsg.includes('pool') || lowerMsg.includes('בריכה')) {
                    const has = lastProp.amenities.some(a => a.includes('בריכה') || a.includes('Pool'));
                    reply = isHe
                        ? `ב-**${lastProp.title}** ${has ? 'יש בריכה מפנקת!' : 'אין בריכה בנכס הזה.'}`
                        : `In **${lastProp.title}**, there is ${has ? 'a pool!' : 'no pool.'}`;
                    return NextResponse.json({ reply, context: newContext });
                }
                if (lowerMsg.includes('price') || lowerMsg.includes('מחיר') || lowerMsg.includes('cost')) {
                    reply = isHe
                        ? `המחיר של **${lastProp.title}** הוא ${lastProp.price}₪ ללילה.`
                        : `The price for **${lastProp.title}** is ${lastProp.price}NIS/night.`;
                    return NextResponse.json({ reply, context: newContext });
                }
            }
        }

        // 3. GENERAL SEARCH (Keyword Matching)
        // Check for specific property names first
        const matchedProp = properties.find(p => lowerMsg.includes(p.title.toLowerCase()) || (isHe && lowerMsg.includes(p.title.replace("'", "").toLowerCase())));
        if (matchedProp) {
            newContext = { propertyId: matchedProp.id };
            reply = isHe
                ? `מצאתי את **${link(matchedProp)}**: ${matchedProp.description}. מחיר: ${matchedProp.price}₪. תרצה להזמין?`
                : `Found **${link(matchedProp)}**: ${matchedProp.description}. Price: ${matchedProp.price}NIS. Want to book?`;
            return NextResponse.json({ reply, context: newContext });
        }

        // Check for Types (Villa, Penthouse)
        if (lowerMsg.includes('villa') || lowerMsg.includes('וילה')) {
            const villas = properties.filter(p => p.type === 'villa');
            const random = villas[Math.floor(Math.random() * villas.length)];
            newContext = { propertyId: random.id }; // Discuss one of them
            reply = isHe
                ? `יש לנו ${villas.length} וילות. למשל **${link(random)}** שהיא מדהימה. תרצה לשמוע עוד עליה?`
                : `We have ${villas.length} villas. For example **${link(random)}** is amazing. Want more details?`;
            return NextResponse.json({ reply, context: newContext });
        }

        // 4. FALLBACK logic (Greetings, Contact, etc.)
        // ... (Keep existing short templates)
        if (lowerMsg.includes('phone') || lowerMsg.includes('טלפון')) {
            return NextResponse.json({ reply: isHe ? `050-522-2536` : `Call us: 050-522-2536`, context: newContext });
        }

        // Default
        reply = isHe
            ? "אני יכול לעזור לך למצוא את הדירה הכי זולה, הכי יוקרתית, או לחפש לפי "
            : "I can help find the cheapest apartment, luxury villas, or search by features.";

        return NextResponse.json({ reply, context: newContext });

    } catch (error: any) {
        return NextResponse.json({ reply: "System Error." }, { status: 500 });
    }
}
