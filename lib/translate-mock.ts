import { Property, Attraction } from './mock-data';

const dictionary: Record<string, Record<string, string>> = {
  en: {
    // Properties
    "רויאל ביץ' אילת": "Royal Beach Eilat",
    "דן אילת": "Dan Eilat",
    "ארמון הרודס": "Herods Palace",
    "אריה אילת": "Aria Eilat",
    "מלכת שבא": "Queen of Sheba",
    "ישרוטל אגמים": "Isrotel Agamim",
    "ורט אילת": "Vert Eilat",
    "יו קורל ביץ' (U Coral Beach)": "U Coral Beach",
    "הרברט סמואל": "Herbert Samuel",
    "נפטון אילת": "Neptune Eilat",
    "פנטהאוז יוקרתי במרינה": "Luxury Penthouse in Marina",
    "לופט מול הים": "Seafront Loft",
    "דירה על החוף": "Beachfront Apartment",
    "דירת גן נעימה": "Cozy Garden Apartment",
    "סוויטת רויאל פארק": "Royal Park Suite",
    "דירת גולף רזידנס": "Golf Residence Apartment",
    "דופלקס לגונה": "Laguna Duplex",
    "סטודיו שקיעה": "Sunset Studio",
    "דירה במרכז העיר": "City Center Apartment",
    "אמבר רזידנס": "Amber Residence",
    "וילה רויאל גרנד": "Royal Grand Villa",
    "וילה נאות מדבר": "Desert Oasis Villa",
    "הבית הלבן": "The White House",
    "וילת הדקלים": "Palms Villa",
    "וילת האופק הכחול": "Blue Horizon Villa",
    "וילה 777": "Villa 777",
    "וילת זן יוקרתית": "Luxury Zen Villa",
    "וילת המסיבות": "Party Villa",
    "וילה למשפחות": "Family Villa",
    "האחוזה": "The Mansion",
    "וילה על הים": "Seafront Villa",
    "אחוזת הבריכות": "Pools Estate",
    "בקתת עץ הרים": "Mountain Wooden Cabin",
    "טירת המלכים": "Kings Castle",
    "מסעדת שף יוקרתית": "Luxury Chef Restaurant",
    "מתחם צלילה VIP": "VIP Diving Complex",
    "קופון 50% לספא": "50% Spa Coupon",
    
    // Locations
    "החוף הצפוני, אילת": "North Beach, Eilat",
    "מרינה, אילת": "Marina, Eilat",
    "החוף הדרומי, אילת": "South Beach, Eilat",
    "מרכז העיר, אילת": "City Center, Eilat",
    "חוף אלמוג, אילת": "Coral Beach, Eilat",
    "החוף הצפוני": "North Beach",
    "שחמון, אילת": "Shahamon, Eilat",
    "שכונת רודד, אילת": "Roded Neighborhood, Eilat",
    "שחמון": "Shahamon",
    "מרכז העיר": "City Center",
    "שכונת אמבר, אילת": "Amber Neighborhood, Eilat",
    "שכונת הוילות": "Villas Neighborhood",
    "שכונת רודד": "Roded Neighborhood",
    "גנים ב'": "Ganim B",
    "אזור התעשייה": "Industrial Zone",
    "גנים א'": "Ganim A",
    "חוף אלמוג": "Coral Beach",
    "הרי אילת": "Eilat Mountains",
    "מצפה רמון (קרוב לאילת)": "Mitzpe Ramon (Near Eilat)",
    "פארק תמנע": "Timna Park",
    "ריף הדולפינים": "Dolphin Reef",
    "החוף הדרומי": "South Beach",
    
    // Amenities
    "בריכה": "Pool", "ספא": "Spa", "חדר כושר": "Gym", "WIFI": "WIFI", "ארוחת בוקר": "Breakfast",
    "מועדון ילדים": "Kids Club", "גישה לחוף": "Beach Access", "מסעדות": "Restaurants", "חוף צמוד": "Private Beach",
    "בר": "Bar", "קניון": "Mall", "גישה לבריכה": "Pool Access", "מבוגרים בלבד": "Adults Only", "נוף לים": "Sea View",
    "הכל כלול": "All Inclusive", "חוף": "Beach", "בידור": "Entertainment", "בריכה פרטית": "Private Pool", "שף": "Chef",
    "מרכזי": "Central", "ג'קוזי": "Jacuzzi", "מרפסת": "Balcony", "נוף": "View", "טלוויזיה חכמה": "Smart TV",
    "מטבח": "Kitchen", "חניה": "Parking", "גינה": "Garden", "מנגל": "BBQ", "גן שעשועים": "Playground", "סאונה": "Sauna",
    "קו ראשון למים": "First line to water", "בית חכם": "Smart Home", "מטבחון": "Kitchenette", "בריכה מחוממת": "Heated Pool",
    "קולנוע": "Cinema", "מטבח שף": "Chef Kitchen", "בריכת אינסוף": "Infinity Pool", "פרטיות": "Privacy", "חדר משחקים": "Game Room",
    "טאבון פיצה": "Pizza Oven", "אירועים מותרים": "Events Allowed", "קריוקי": "Karaoke", "גן זן": "Zen Garden", "מערכת שמע": "Sound System",
    "ללא הגבלת רעש": "No Noise Limit", "גדר לבריכה": "Pool Fence", "צעצועים": "Toys", "מרחב": "Space", "באטלר": "Butler",
    "חוף פרטי": "Private Beach", "בריכת אינפיניטי": "Infinity Pool", "אח עצים": "Fireplace", "נוף להרים": "Mountain View", "מרתף יינות": "Wine Cellar",
    "שירותי ניקיון": "Cleaning Services", "טיולי שטח": "Off-road Tours", "צלילה": "Diving", "שירות חדרים": "Room Service"
  },
  ru: {
    "בריכה": "Бассейн", "ספא": "Спа", "חדר כושר": "Спортзал", "WIFI": "WIFI", "ארוחת בוקר": "Завтрак",
    "החוף הצפוני": "Северный пляж", "שחמון": "Шахамон", "מרכז העיר": "Центр города", "מרינה, אילת": "Марина, Эйлат"
  },
  fr: {
    "בריכה": "Piscine", "ספא": "Spa", "חדר כושר": "Salle de sport", "WIFI": "WIFI", "ארוחת בוקר": "Petit déjeuner",
    "החוף הצפוני": "Plage Nord", "שחמון": "Shahamon", "מרכז העיר": "Centre-ville", "מרינה, אילת": "Marina, Eilat"
  },
  ar: {
    "בריכה": "مسبح", "ספא": "منتجع صحي", "חדר כושר": "صالة ألعاب", "WIFI": "WIFI", "ארוחת בוקר": "فطور",
    "החוף הצפוני": "الشاطئ الشمالي", "שחמון": "شحامون", "מרכז העיר": "وسط المدينة", "מרינה, אילת": "مارينا، إيلات"
  }
};

export function translateProperties(properties: Property[], locale: string): Property[] {
  if (locale === 'he') return properties;
  
  const d = dictionary[locale] || dictionary['en'];
  
  const translate = (text: string) => {
    if (!text) return text;
    // Check full string
    if (d[text]) return d[text];
    // For missing languages, fallback to english
    if (dictionary['en'][text]) return dictionary['en'][text];
    return text;
  };

  return properties.map(p => ({
    ...p,
    title: translate(p.title),
    location: translate(p.location),
    description: translate(p.description), // For description, we could translate words, but it's full sentences. Let's just leave it or use english.
    amenities: p.amenities.map(a => translate(a))
  }));
}

export function translateAttractions(attractions: Attraction[], locale: string): Attraction[] {
    if (locale === 'he') return attractions;
    
    const d = dictionary[locale] || dictionary['en'];
    const translate = (text: string) => d[text] || dictionary['en'][text] || text;
  
    return attractions.map(a => ({
      ...a,
      title: translate(a.title),
      description: translate(a.description)
    }));
}
