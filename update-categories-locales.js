const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'locales');
const locales = {
  he: {
    title: "חופשות לפי קטגוריה",
    vacation_apartments: "דירות נופש",
    villas: "וילות",
    penthouses: "פנטהאוזים",
    luxury_apartments: "דירות יוקרה",
    hotels: "מלונות",
    attractions: "אטרקציות",
    businesses: "בתי עסק",
    coupons: "קופונים",
    filters: "סינונים"
  },
  en: {
    title: "Vacations by Category",
    vacation_apartments: "Vacation Apartments",
    villas: "Villas",
    penthouses: "Penthouses",
    luxury_apartments: "Luxury Apartments",
    hotels: "Hotels",
    attractions: "Attractions",
    businesses: "Businesses",
    coupons: "Coupons",
    filters: "Filters"
  },
  ru: {
    title: "Отпуск по категориям",
    vacation_apartments: "Апартаменты для отдыха",
    villas: "Виллы",
    penthouses: "Пентхаусы",
    luxury_apartments: "Элитные апартаменты",
    hotels: "Отели",
    attractions: "Аттракционы",
    businesses: "Бизнесы",
    coupons: "Купоны",
    filters: "Фильтры"
  },
  fr: {
    title: "Vacances par catégorie",
    vacation_apartments: "Appartements de vacances",
    villas: "Villas",
    penthouses: "Penthouses",
    luxury_apartments: "Appartements de luxe",
    hotels: "Hôtels",
    attractions: "Attractions",
    businesses: "Commerces",
    coupons: "Coupons",
    filters: "Filtres"
  },
  ar: {
    title: "عطلات حسب الفئة",
    vacation_apartments: "شقق العطلات",
    villas: "فيلات",
    penthouses: "بنتهاوس",
    luxury_apartments: "شقق فاخرة",
    hotels: "فنادق",
    attractions: "أماكن جذب",
    businesses: "أعمال تجارية",
    coupons: "كوبونات",
    filters: "تصفيات"
  }
};

for (const lang of Object.keys(locales)) {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.Categories = locales[lang];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}.json`);
  }
}
