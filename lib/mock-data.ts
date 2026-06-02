export type PropertyType = 'hotel' | 'apartment' | 'luxury-apartment' | 'penthouse' | 'villa' | 'attraction' | 'business' | 'coupon';

export interface Property {
    id: string;
    type: PropertyType;
    title: string;
    location: string;
    price: number;
    rating: number;
    guests: number;
    rooms: number;
    image: string;
    images: string[];
    description: string;
    amenities: string[];
    virtualTourUrl?: string;
}

export const properties: Property[] = [
    // --- HOTELS ---
    {
        id: 'h1',
        type: 'hotel',
        title: 'רויאל ביץ\' אילת',
        location: 'החוף הצפוני, אילת',
        price: 1500,
        rating: 4.9,
        guests: 2,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945', 'https://images.unsplash.com/photo-1582719508461-905c673771fd'],
        description: 'מלון יוקרה על החוף עם בריכה פרטית וספא. חוויה בלתי נשכחת.',
        amenities: ['בריכה', 'ספא', 'חדר כושר', 'WIFI', 'ארוחת בוקר']
    },
    {
        id: 'h2',
        type: 'hotel',
        title: 'דן אילת',
        location: 'החוף הצפוני, אילת',
        price: 1800,
        rating: 4.8,
        guests: 3,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2649&auto=format&fit=crop',
        images: [],
        description: 'מלון היוקרה המפורסם עם פארק מים ומועדון ילדים.',
        amenities: ['בריכה', 'מועדון ילדים', 'WIFI', 'גישה לחוף']
    },
    {
        id: 'h3',
        type: 'hotel',
        title: 'ארמון הרודס',
        location: 'מרינה, אילת',
        price: 1400,
        rating: 4.7,
        guests: 2,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'מלון בסגנון ארמון היסטורי המעניק חוויה מלכותית.',
        amenities: ['בריכה', 'מסעדות', 'WIFI']
    },
    {
        id: 'h4',
        type: 'hotel',
        title: 'אריה אילת',
        location: 'החוף הדרומי, אילת',
        price: 1200,
        rating: 4.6,
        guests: 2,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'מלון מודרני עם גישה ישירה לחוף ושירות מעולה.',
        amenities: ['חוף צמוד', 'בריכה', 'בר']
    },
    {
        id: 'h5',
        type: 'hotel',
        title: 'מלכת שבא',
        location: 'החוף הצפוני, אילת',
        price: 1350,
        rating: 4.7,
        guests: 4,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'חווית מלכות במלון המפואר הזה בלב העניינים.',
        amenities: ['בריכה', 'ספא', 'קניון']
    },
    {
        id: 'h6',
        type: 'hotel',
        title: 'ישרוטל אגמים',
        location: 'מרכז העיר, אילת',
        price: 1100,
        rating: 4.8,
        guests: 2,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'אווירה רגועה וצעירה עם חדרים על המים.',
        amenities: ['גישה לבריכה', 'בר', 'מבוגרים בלבד']
    },
    {
        id: 'h7',
        type: 'hotel',
        title: 'ורט אילת',
        location: 'החוף הצפוני, אילת',
        price: 1000,
        rating: 4.5,
        guests: 3,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1590073242678-cfe2f792f3c8?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'נוף פנורמי עוצר נשימה לים האדום.',
        amenities: ['נוף לים', 'בריכה', 'WIFI']
    },
    {
        id: 'h8',
        type: 'hotel',
        title: 'יו קורל ביץ\' (U Coral Beach)',
        location: 'החוף הדרומי, אילת',
        price: 1600,
        rating: 4.6,
        guests: 4,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'נופש הכל כלול מושלם למשפחות.',
        amenities: ['הכל כלול', 'חוף', 'בידור']
    },
    {
        id: 'h9',
        type: 'hotel',
        title: 'הרברט סמואל',
        location: 'חוף אלמוג, אילת',
        price: 2000,
        rating: 4.9,
        guests: 2,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1571896349842-6e5a48d88a03?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'מלון בוטיק אקסקלוסיבי ושקט.',
        amenities: ['בריכה פרטית', 'שף', 'WIFI']
    },
    {
        id: 'h10',
        type: 'hotel',
        title: 'נפטון אילת',
        location: 'החוף הצפוני',
        price: 900,
        rating: 4.4,
        guests: 3,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2674&auto=format&fit=crop',
        images: [],
        description: 'מלון קלאסי במיקום מרכזי ליד הקניון.',
        amenities: ['מרכזי', 'בריכה', 'WIFI']
    },

    // --- APARTMENTS ---
    {
        id: 'a1',
        type: 'apartment',
        title: 'פנטהאוז יוקרתי במרינה',
        location: 'מרינה, אילת',
        price: 1200,
        rating: 4.9,
        guests: 6,
        rooms: 3,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2560&auto=format&fit=crop',
        images: [],
        description: 'פנטהאוז מדהים המשקיף למרינה ולים.',
        amenities: ['ג\'קוזי', 'מרפסת', 'WIFI']
    },
    {
        id: 'a2',
        type: 'apartment',
        title: 'לופט מול הים',
        location: 'שחמון, אילת',
        price: 800,
        rating: 4.8,
        guests: 4,
        rooms: 2,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'לופט מודרני עם נוף פנורמי לים.',
        amenities: ['נוף', 'טלוויזיה חכמה', 'מטבח']
    },
    {
        id: 'a3',
        type: 'apartment',
        title: 'דירה על החוף',
        location: 'החוף הצפוני',
        price: 1000,
        rating: 4.7,
        guests: 5,
        rooms: 2,
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'דירה מפנקת במרחק צעדים מהחוף.',
        amenities: ['בריכה', 'חדר כושר', 'חניה']
    },
    {
        id: 'a4',
        type: 'apartment',
        title: 'דירת גן נעימה',
        location: 'שכונת רודד, אילת',
        price: 500,
        rating: 4.5,
        guests: 2,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1502005229766-939cb9342722?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'דירת גן שקטה ומאובזרת.',
        amenities: ['גינה', 'מנגל', 'WIFI']
    },
    {
        id: 'a5',
        type: 'apartment',
        title: 'סוויטת רויאל פארק',
        location: 'החוף הצפוני',
        price: 700,
        rating: 4.6,
        guests: 4,
        rooms: 2,
        image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'סוויטה משפחתית במתחם רויאל פארק המבוקש.',
        amenities: ['בריכה', 'גן שעשועים', 'מטבח']
    },
    {
        id: 'a6',
        type: 'apartment',
        title: 'דירת גולף רזידנס',
        location: 'שכונת רודד, אילת',
        price: 600,
        rating: 4.7,
        guests: 3,
        rooms: 2,
        image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'דירה מודרנית במתחם יוקרתי.',
        amenities: ['בריכה', 'סאונה', 'חדר כושר']
    },
    {
        id: 'a7',
        type: 'apartment',
        title: 'דופלקס לגונה',
        location: 'מרינה, אילת',
        price: 1300,
        rating: 4.9,
        guests: 7,
        rooms: 3,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'דופלקס ענק על המים בלגונה.',
        amenities: ['קו ראשון למים', 'מרפסת', 'בית חכם']
    },
    {
        id: 'a8',
        type: 'apartment',
        title: 'סטודיו שקיעה',
        location: 'שחמון',
        price: 400,
        rating: 4.5,
        guests: 2,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=2564&auto=format&fit=crop',
        images: [],
        description: 'מושלם לזוגות, עם נוף לשקיעה.',
        amenities: ['נוף', 'WIFI', 'מטבחון']
    },
    {
        id: 'a9',
        type: 'apartment',
        title: 'דירה במרכז העיר',
        location: 'מרכז העיר',
        price: 550,
        rating: 4.6,
        guests: 3,
        rooms: 2,
        image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=2671&auto=format&fit=crop',
        images: [],
        description: 'קרוב לכל מקום, נוח ומרווח.',
        amenities: ['מרכזי', 'מרפסת', 'WIFI']
    },
    {
        id: 'a10',
        type: 'apartment',
        title: 'אמבר רזידנס',
        location: 'שכונת אמבר, אילת',
        price: 900,
        rating: 4.8,
        guests: 5,
        rooms: 3,
        image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'דירה בקומה גבוהה עם בריכה בבניין.',
        amenities: ['בריכה', 'חניה', 'נוף']
    },

    // --- VILLAS ---
    {
        id: 'v1',
        type: 'villa',
        title: 'וילה רויאל גרנד',
        location: 'שכונת הוילות',
        price: 3000,
        rating: 5.0,
        guests: 12,
        rooms: 6,
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'הוילה היוקרתית ביותר באילת.',
        amenities: ['בריכה מחוממת', 'קולנוע', 'מטבח שף']
    },
    {
        id: 'v2',
        type: 'villa',
        title: 'וילה נאות מדבר',
        location: 'שכונת רודד',
        price: 2500,
        rating: 4.9,
        guests: 10,
        rooms: 5,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'וילה מבודדת עם נוף מדברי קסום.',
        amenities: ['בריכת אינסוף', 'פרטיות', 'מנגל']
    },
    {
        id: 'v3',
        type: 'villa',
        title: 'הבית הלבן',
        location: 'גנים ב\'',
        price: 2800,
        rating: 4.8,
        guests: 10,
        rooms: 5,
        image: 'https://images.unsplash.com/photo-1600596542815-6ad4c728fdbe?q=80&w=2675&auto=format&fit=crop',
        images: [],
        description: 'וילה בארכיטקטורה מודרנית ונקייה.',
        amenities: ['בריכה', 'חדר משחקים', 'ג\'קוזי']
    },
    {
        id: 'v4',
        type: 'villa',
        title: 'וילת הדקלים',
        location: 'שחמון',
        price: 2200,
        rating: 4.7,
        guests: 8,
        rooms: 4,
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=2574&auto=format&fit=crop',
        images: [],
        description: 'וילה עם גינה טרופית עשירה.',
        amenities: ['גינה', 'בריכה', 'טאבון פיצה']
    },
    {
        id: 'v5',
        type: 'villa',
        title: 'וילת האופק הכחול',
        location: 'שחמון',
        price: 2600,
        rating: 4.9,
        guests: 12,
        rooms: 6,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'וילה משקיפה למפרץ ולים.',
        amenities: ['נוף', 'בריכה', 'אירועים מותרים']
    },
    {
        id: 'v6',
        type: 'villa',
        title: 'וילה 777',
        location: 'שכונת הוילות',
        price: 3500,
        rating: 5.0,
        guests: 14,
        rooms: 7,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
        images: [],
        description: 'וילה ענקית לקבוצות גדולות.',
        amenities: ['קריוקי', 'בריכה', 'ג\'קוזי']
    },
    {
        id: 'v7',
        type: 'villa',
        title: 'וילת זן יוקרתית',
        location: 'רודד',
        price: 2400,
        rating: 4.8,
        guests: 8,
        rooms: 4,
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'וילה בעיצוב יפני רגוע.',
        amenities: ['גן זן', 'בריכה', 'סאונה']
    },
    {
        id: 'v8',
        type: 'villa',
        title: 'וילת המסיבות',
        location: 'אזור התעשייה',
        price: 2000,
        rating: 4.5,
        guests: 15,
        rooms: 5,
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2632&auto=format&fit=crop',
        images: [],
        description: 'מושלמת למסיבות רווקים/ות.',
        amenities: ['מערכת שמע', 'בריכה', 'ללא הגבלת רעש']
    },
    {
        id: 'v9',
        type: 'villa',
        title: 'וילה למשפחות',
        location: 'גנים א\'',
        price: 2300,
        rating: 4.7,
        guests: 10,
        rooms: 5,
        image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=2525&auto=format&fit=crop',
        images: [],
        description: 'מאובזרת לילדים ולמנוחה.',
        amenities: ['גדר לבריכה', 'צעצועים', 'מרחב']
    },
    {
        id: 'v10',
        type: 'villa',
        title: 'האחוזה',
        location: 'שכונת הוילות',
        price: 5000,
        rating: 5.0,
        guests: 20,
        rooms: 10,
        image: 'https://images.unsplash.com/photo-1510627489930-0c1b0dc58e85?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'הוילה הכי גדולה בעיר.',
        amenities: ['הכל כלול', 'באטלר', 'קולנוע']
    },
    // --- NEW CATEGORIES ---
    {
        id: 'c1',
        type: 'luxury-apartment',
        title: 'וילה על הים',
        location: 'חוף אלמוג',
        price: 3500,
        rating: 4.9,
        guests: 8,
        rooms: 4,
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'גישה ישירה אל חוף הים מאחורי הוילה.',
        amenities: ['חוף פרטי', 'נוף לים', 'WIFI']
    },
    {
        id: 'c2',
        type: 'luxury-apartment',
        title: 'אחוזת הבריכות',
        location: 'שחמון',
        price: 2800,
        rating: 4.8,
        guests: 10,
        rooms: 5,
        image: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'וילה עם בריכת אינפיניטי ענקית.',
        amenities: ['בריכת אינפיניטי', 'ג\'קוזי', 'מנגל']
    },
    {
        id: 'c3',
        type: 'penthouse',
        title: 'בקתת עץ הרים',
        location: 'הרי אילת',
        price: 900,
        rating: 4.7,
        guests: 4,
        rooms: 2,
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'בקתת עץ רומנטית מבודדת.',
        amenities: ['אח עצים', 'נוף להרים', 'WIFI']
    },
    {
        id: 'c4',
        type: 'penthouse',
        title: 'טירת המלכים',
        location: 'מצפה רמון (קרוב לאילת)',
        price: 4500,
        rating: 5.0,
        guests: 15,
        rooms: 8,
        image: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'חוויה של פעם בחיים בטירה אמיתית.',
        amenities: ['מרתף יינות', 'שירותי ניקיון', 'בריכה']
    },
    {
        id: 'c5',
        type: 'business',
        title: 'מסעדת שף יוקרתית',
        location: 'פארק תמנע',
        price: 600,
        rating: 4.6,
        guests: 6,
        rooms: 2,
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'לינה בלב הפארק הלאומי.',
        amenities: ['טיולי שטח', 'מנגל', 'חניה']
    },
    {
        id: 'c6',
        type: 'attraction',
        title: 'מתחם צלילה VIP',
        location: 'ריף הדולפינים',
        price: 1500,
        rating: 4.9,
        guests: 2,
        rooms: 1,
        image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'לינה ממש מעל המים עם אטרקציות צלילה.',
        amenities: ['צלילה', 'ארוחת בוקר', 'WIFI']
    },
    {
        id: 'c7',
        type: 'coupon',
        title: 'קופון 50% לספא',
        location: 'החוף הדרומי',
        price: 250,
        rating: 4.8,
        guests: 2,
        rooms: 0,
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop',
        images: [],
        description: 'קופון זוגי ליום ספא מפנק כולל עיסוי וארוחת בוקר.',
        amenities: ['ספא', 'בריכה']
    }
];

export interface Attraction {
    id: string;
    title: string;
    type: 'restaurant' | 'activity' | 'shopping' | 'nature';
    description: string;
    coordinates: { lat: number; lng: number };
}

export const attractions: Attraction[] = [
    {
        id: 'att1',
        title: 'ריף הדולפינים',
        type: 'nature',
        description: 'חוף אקולוגי ייחודי מסוגו בעולם בו תוכלו לשחות ולצלול עם דולפינים חופשיים בסביבתם הטבעית. חוויה בלתי נשכחת לכל המשפחה!',
        coordinates: { lat: 29.5244, lng: 34.9351 }
    },
    {
        id: 'att2',
        title: 'המצפה התת ימי',
        type: 'nature',
        description: 'הפארק הימי הגדול והוותיק בישראל. צפייה מרהיבה באלמוגים, כרישים, צבי ים ושפע דגים נדירים מבלי להירטב.',
        coordinates: { lat: 29.5042, lng: 34.9174 }
    },
    {
        id: 'att3',
        title: 'מסעדת המחבוא של אדי',
        type: 'restaurant',
        description: 'מוסד קולינרי אילתי משנת 1979! בשרים איכותיים, פירות ים ואווירה חמימה. המלצה שלנו: סטייק פילה ברוטב חרדל.',
        coordinates: { lat: 29.5583, lng: 34.9482 }
    },
    {
        id: 'att4',
        title: 'טיילת אילת והמרינה',
        type: 'shopping',
        description: 'מרכז החיים והבילויים של אילת. חנויות ללא מע"מ, דוכנים צבעוניים, בתי קפה ואווירת חופש שלא נגמרת לאורך החוף.',
        coordinates: { lat: 29.5513, lng: 34.9577 }
    },
    {
        id: 'att5',
        title: 'פארק יטבתה אילת',
        type: 'restaurant',
        description: 'מושלם למשפחות - מגוון עצום של גלידות מפורסמות, שוקו מהחבית, ארוחות קלות ומרחב ישיבה ענק במרכז העיר.',
        coordinates: { lat: 29.5532, lng: 34.9585 }
    },
    {
        id: 'att6',
        title: 'מועדון צלילה מנטה',
        type: 'activity',
        description: 'מועדון הצלילה המוביל בעיר, מציע קורסי צלילה לכל הרמות, צלילות היכרות ללא ניסיון קודם וציוד מקצועי.',
        coordinates: { lat: 29.5188, lng: 34.9298 }
    },
    {
        id: 'att7',
        title: 'קניון האייס מול',
        type: 'shopping',
        description: 'מעבר לקניות ללא מע"מ, הקניון מציע משטח החלקה אולימפי על הקרח, פארק טרמפולינות ומתחמי גיימינג מטורפים.',
        coordinates: { lat: 29.5540, lng: 34.9654 }
    },
    {
        id: 'att8',
        title: 'שמורת חוף אלמוג',
        type: 'nature',
        description: 'גן עדן לשנורקלינג. ריף אלמוגים רדוד ועשיר במרחק שחייה קצרה מהחוף. מומלץ להצטייד במשקפת מראש!',
        coordinates: { lat: 29.5113, lng: 34.9238 }
    },
    {
        id: 'att9',
        title: 'מסעדת לוויתן',
        type: 'restaurant',
        description: 'מסעדת שף מהמדוברות בישראל השוכנת באילת. מציעה המבורגרים מיוחדים מנתחי פרימיום, קוקטיילים ואווירה צעירה.',
        coordinates: { lat: 29.5492, lng: 34.9548 }
    },
    {
        id: 'att10',
        title: 'ברביס (Baris)',
        type: 'restaurant',
        description: 'הדיינר האמריקאי המפורסם של אילת! המבורגרים מושחתים, מנות ענקיות וקינוחים שישאירו אתכם פעורי פה.',
        coordinates: { lat: 29.5498, lng: 34.9541 }
    },
    {
        id: 'att11',
        title: 'הגן הבוטני של אילת',
        type: 'nature',
        description: 'פנינת טבע אורגנית ונדירה שנבנתה על גבי מחצבת אבן לשעבר. שבילי הליכה מוצלים, מפלי מים ויער גשם אקולוגי קטן.',
        coordinates: { lat: 29.5824, lng: 34.9667 }
    },
    {
        id: 'att12',
        title: 'כפר הצוללים',
        type: 'activity',
        description: 'מקום אותנטי וקסום לחוות את הים האדום. מציע צלילות לשברים של ספינות (כמו הסטיל) והדרכות אישיות.',
        coordinates: { lat: 29.5075, lng: 34.9205 }
    },
    {
        id: 'att13',
        title: 'בנק הפועלים - סניף אילת',
        type: 'bank',
        description: 'סניף מרכזי של בנק הפועלים כולל כספומט זמין 24/7.',
        coordinates: { lat: 29.5565, lng: 34.9512 }
    },
    {
        id: 'att14',
        title: 'בנק לאומי',
        type: 'bank',
        description: 'בנק לאומי באזור התיירות, מציע שירותי מט"ח וכספומט חיצוני.',
        coordinates: { lat: 29.5538, lng: 34.9540 }
    },
    {
        id: 'att15',
        title: 'סופר-פארם קניון מול הים',
        type: 'pharmacy',
        description: 'בית מרקחת מרכזי, כולל מחלקת קוסמטיקה ומוצרי תינוקות.',
        coordinates: { lat: 29.5495, lng: 34.9535 }
    },
    {
        id: 'att16',
        title: 'סופר-פארם אייס מול',
        type: 'pharmacy',
        description: 'בית מרקחת נוח למבקרים באייס מול, פתוח עד מאוחר.',
        coordinates: { lat: 29.5538, lng: 34.9650 }
    }
];
