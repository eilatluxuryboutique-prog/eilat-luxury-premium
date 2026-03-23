const fs = require('fs');
const path = require('path');
const files = ['en.json', 'he.json', 'fr.json', 'ru.json', 'ar.json'];

const additions = {
  en: {
    Experiences: {
      hero_title: "Unforgettable Experiences",
      hero_desc: "Your vacation is much more than sleep. We've curated the best attractions in Eilat at exclusive prices.",
      starting_from: "From ",
      book_whatsapp: "Book on WhatsApp",
      local_suppliers: "Operated in collaboration with selected local suppliers in Eilat.",
      yacht_title: "Private Yacht Rental",
      yacht_desc: "Luxury cruise in the Gulf of Eilat including a skipper, soft drinks and fruits. Up to 12 people.",
      jeep_title: "Sunset Jeep Tour",
      jeep_desc: "Breathtaking desert experience in the Eilat Mountains. Includes herbal tea and pita bread on the fire.",
      diving_title: "VIP Introductory Dive",
      diving_desc: "Personal dive with a private instructor at the coral reserve. Includes underwater photography.",
      massage_title: "Massage to the door",
      massage_desc: "Professional masseurs who will come to you for a perfect spa experience.",
      hours: "hours",
      hour_and_half: "1.5 hours",
      minutes: "minutes"
    },
    Blog: {
      magazine_title: "The Eilat Magazine",
      magazine_desc: "Exclusive recommendations, tips, and reviews on luxury vacations, culinary, and nightlife.",
      article: "Article",
      min_read: "min read",
      read_more: "Read More"
    }
  },
  he: {
    Experiences: {
      hero_title: "חוויות בלתי נשכחות",
      hero_desc: "החופשה שלכם היא הרבה מעבר לשינה. אספנו עבורכם את האטרקציות והחוויות הכי שוות באילת, במחירים בלעדיים לאורחי האתר.",
      starting_from: "החל מ-",
      book_whatsapp: "הזמן עכשיו בוואטסאפ",
      local_suppliers: "מופעל בשיתוף פעולה עם ספקים מקומיים נבחרים באילת.",
      yacht_title: "השכרת יאכטה פרטית",
      yacht_desc: "שייט יוקרתי במפרץ אילת הכולל סקיפר, שתייה קלה ופירות. מתאים לעד 12 אנשים.",
      jeep_title: "טיול ג'יפים בשקיעה",
      jeep_desc: "חוויה מדברית עוצרת נשימה בהרי אילת. כולל תה צמחים ופיתות על המדורה.",
      diving_title: "צלילת היכרות VIP",
      diving_desc: "צלילה אישית עם מדריך צמוד בשמורת האלמוגים. כולל צילום תת-ימי.",
      massage_title: "עיסוי עד הבית",
      massage_desc: "מעסים מקצועיים שיגיעו אליכם לוילה או לדירה לחווית ספא מושלמת.",
      hours: "שעות",
      hour_and_half: "שעה וחצי",
      minutes: "דקות"
    },
    Blog: {
      magazine_title: "המגזין של אילת",
      magazine_desc: "המלצות, טיפים וסקירות בלעדיות על חופשות יוקרה, קולינריה וחיי לילה.",
      article: "כתבה",
      min_read: "דק׳ קריאה",
      read_more: "קרא עוד"
    }
  },
  fr: {
    Experiences: {
      hero_title: "Expériences Inoubliables",
      hero_desc: "Vos vacances sont bien plus qu'un simple sommeil. Nous avons sélectionné les meilleures attractions d'Eilat.",
      starting_from: "À partir de ",
      book_whatsapp: "Réserver sur WhatsApp",
      local_suppliers: "Exploité en collaboration avec des fournisseurs locaux sélectionnés à Eilat.",
      yacht_title: "Location Yacht Privé",
      yacht_desc: "Croisière de luxe dans le golfe d'Eilat. Jusqu'à 12 personnes.",
      jeep_title: "Tour en Jeep au Coucher du Soleil",
      jeep_desc: "Expérience époustouflante dans le désert.",
      diving_title: "Plongée d'initiation VIP",
      diving_desc: "Plongée avec instructeur privé à la réserve corallienne.",
      massage_title: "Massage à domicile",
      massage_desc: "Masseurs professionnels qui viennent à vous.",
      hours: "heures",
      hour_and_half: "1,5 heures",
      minutes: "minutes"
    },
    Blog: {
      magazine_title: "Le Magazine Eilat",
      magazine_desc: "Recommandations exclusives et avis pour vos vacances.",
      article: "Article",
      min_read: "min de lecture",
      read_more: "Lire plus"
    }
  },
  ru: {
    Experiences: {
      hero_title: "Незабываемые впечатления",
      hero_desc: "Ваш отпуск - это больше, чем просто сон. Мы собрали лучшие развлечения в Эйлате.",
      starting_from: "От ",
      book_whatsapp: "Забронировать в WhatsApp",
      local_suppliers: "Осуществляется совместно с местными поставщиками.",
      yacht_title: "Аренда частной яхты",
      yacht_desc: "Роскошный круиз по Эйлатскому заливу. До 12 человек.",
      jeep_title: "Джип-тур на закате",
      jeep_desc: "Захватывающее дух приключение в пустыне.",
      diving_title: "VIP-погружение",
      diving_desc: "Индивидуальное погружение с частным инструктором.",
      massage_title: "Массаж на дом",
      massage_desc: "Профессиональные массажисты приедут к вам.",
      hours: "часов",
      hour_and_half: "1,5 часа",
      minutes: "минут"
    },
    Blog: {
      magazine_title: "Журнал Эйлата",
      magazine_desc: "Эксклюзивные рекомендации и советы об отдыхе.",
      article: "Статья",
      min_read: "мин чтения",
      read_more: "Читать далее"
    }
  },
  ar: {
    Experiences: {
      hero_title: "تجارب لا تُنسى",
      hero_desc: "عطلتك هي أكثر بكثير من مجرد نوم. لقد جمعنا أفضل مناطق الجذب في إيلات بأسعار حصرية.",
      starting_from: "بدءاً من ",
      book_whatsapp: "احجز عبر واتساب",
      local_suppliers: "يتم التشغيل بالتعاون مع موردين محليين مختارين في إيلات.",
      yacht_title: "تأجير يخت خاص",
      yacht_desc: "رحلة بحرية فاخرة في خليج إيلات. ما يصل إلى 12 شخصًا.",
      jeep_title: "جولة جيب وقت الغروب",
      jeep_desc: "تجربة صحراوية تخطف الأنفاس في جبال إيلات.",
      diving_title: "غوص تعريفي VIP",
      diving_desc: "غوص شخصي مع مدرب خاص في محمية المرجان.",
      massage_title: "تدليك حتى الباب",
      massage_desc: "مدلكون محترفون يأتون إليك لتجربة سبا مثالية.",
      hours: "ساعات",
      hour_and_half: "ساعة ونصف",
      minutes: "دقائق"
    },
    Blog: {
      magazine_title: "مجلة إيلات",
      magazine_desc: "توصيات ونصائح ومراجعات حصرية حول إجازات الرفاهية.",
      article: "مقال",
      min_read: "دقيقة قراءة",
      read_more: "اقرأ المزيد"
    }
  }
};

files.forEach(f => {
  const lang = f.split('.')[0];
  const p = path.join(__dirname, 'locales', f);
  let data = JSON.parse(fs.readFileSync(p, 'utf8'));
  
  if (!data.Experiences) data.Experiences = {};
  if (!data.Blog) data.Blog = {};
  
  Object.assign(data.Experiences, additions[lang].Experiences);
  Object.assign(data.Blog, additions[lang].Blog);
  
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
});
console.log('Update Complete.');
