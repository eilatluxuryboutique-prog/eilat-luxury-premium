const fs = require('fs');
const path = require('path');
const files = ['en.json', 'he.json', 'fr.json', 'ru.json', 'ar.json'];

const additions = {
  en: {
    Deals: {
      sales_end: 'Sale ends in',
      title: 'Last Minute',
      title_highlight: 'Deals',
      last_minute: 'Up to 25% discount for upcoming weekend!',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      grab_deal: 'Grab the deal 🔥',
      spots_left: 'Only 2 spots left at this price!'
    }
  },
  he: {
    Deals: {
      sales_end: 'המבצע מסתיים בעוד',
      title: 'דילים של',
      title_highlight: 'הרגע האחרון',
      last_minute: 'עד 25% הנחה להזמנות לסופ"ש הקרוב!',
      hours: 'שעות',
      minutes: 'דקות',
      seconds: 'שניות',
      grab_deal: 'תפוס את הדיל 🔥',
      spots_left: 'נשארו רק 2 מקומות במחיר הזה!'
    }
  },
  fr: {
    Deals: {
      sales_end: 'La vente se termine dans',
      title: 'Offres de',
      title_highlight: 'Dernière Minute',
      last_minute: 'Jusqu\'à 25% de réduction ce week-end !',
      hours: 'Heures',
      minutes: 'Minutes',
      seconds: 'Secondes',
      grab_deal: 'Saisir l\'offre 🔥',
      spots_left: 'Plus que 2 places à ce prix !'
    }
  },
  ru: {
    Deals: {
      sales_end: 'Акция заканчивается через',
      title: 'Горящие',
      title_highlight: 'Предложения',
      last_minute: 'Скидка до 25% на выходные!',
      hours: 'Часы',
      minutes: 'Минуты',
      seconds: 'Секунды',
      grab_deal: 'Хватай скидку 🔥',
      spots_left: 'Осталось всего 2 места!'
    }
  },
  ar: {
    Deals: {
      sales_end: 'ينتهي العرض خلال',
      title: 'عروض',
      title_highlight: 'اللحظة الأخيرة',
      last_minute: 'خصم حتى 25٪ على إجازة نهاية الأسبوع القادمة!',
      hours: 'ساعات',
      minutes: 'دقائق',
      seconds: 'ثواني',
      grab_deal: 'اغتنم العرض 🔥',
      spots_left: 'بقي مكانان فقط بهذا السعر!'
    }
  }
};

files.forEach(f => {
  const lang = f.split('.')[0];
  const p = path.join(__dirname, 'locales', f);
  let data = JSON.parse(fs.readFileSync(p, 'utf8'));
  
  if (!data.Deals) data.Deals = {};
  Object.assign(data.Deals, additions[lang].Deals);
  
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
});
console.log('Update Complete.');
