import { NextResponse } from 'next/server';
import { properties } from '@/lib/mock-data';

// --- HELPER LOIC ---
function findCheapest(isHe: boolean) {
    const sorted = [...properties].sort((a, b) => a.price - b.price);
    const cheap = sorted[0];
    const link = `/property/${cheap.id}`;
    return isHe
        ? `הנכס הכי זול שלנו כרגע הוא **${cheap.title}** במחיר **${cheap.price}₪** ללילה. [לחץ כאן לצפייה](${link})`
        : `Our cheapest option is **${cheap.title}** at **${cheap.price}NIS**/night. [Click to View](${link})`;
}

function findMostExpensive(isHe: boolean) {
    const sorted = [...properties].sort((a, b) => b.price - a.price);
    const exp = sorted[0];
    const link = `/property/${exp.id}`;
    return isHe
        ? `הנכס היוקרתי ביותר שלנו הוא **${exp.title}** (${exp.price}₪). [לחץ לצפייה](${link})`
        : `Our most luxurious property is **${exp.title}** (${exp.price}NIS). [View](${link})`;
}

export async function POST(req: Request) {
    try {
        const { message, locale, lastPropertyId } = await req.json(); // EXPECT Context
        const lowerMsg = message.toLowerCase();
        const isHe = locale === 'he';

        // 1. CHEAPEST / MOST EXPENSIVE
        if (lowerMsg.includes('cheapest') || lowerMsg.includes('כי זול') || lowerMsg.includes('הכי זול')) {
            return NextResponse.json({ reply: findCheapest(isHe) });
        }
        if (lowerMsg.includes('expensive') || lowerMsg.includes('כי יקר') || lowerMsg.includes('הכי יקר')) {
            return NextResponse.json({ reply: findMostExpensive(isHe) });
        }

        // 2. CONTEXT (Follow-up)
        // If user asks "Does it have parking?" and we have lastPropertyId
        if (lastPropertyId && (lowerMsg.includes('parking') || lowerMsg.includes('חניה'))) {
            const prop = properties.find(p => p.id === lastPropertyId);
            if (prop) {
                const hasParking = prop.amenities.some(a => a.includes('חניה') || a.includes('Parking'));
                const reply = isHe
                    ? `לגבי **${prop.title}**: ${hasParking ? 'כן! יש חניה.' : 'אין חניה רשומה, אבל יש חניונים קרובים.'}`
                    : `Regarding **${prop.title}**: ${hasParking ? 'Yes! It has parking.' : 'No private parking listed.'}`;
                return NextResponse.json({ reply });
            }
        }

        // ... (Existing Logic for Pool, Price, etc) ...
        // BUT ENHANCED with Links

        // 3. Search Properties (With Links)
        // Same logic as before but add markdown links [Name](/property/id)

        // ... (For Implementation, I will merge this with previous logic) ...

        return NextResponse.json({ reply: "..." }); // Placeholder
    } catch (e) {
        return NextResponse.json({ reply: "Error" }, { status: 500 });
    }
}
