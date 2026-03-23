const fs = require('fs');
const path = require('path');
const files = ['en.json', 'he.json', 'fr.json', 'ru.json', 'ar.json'];

const additions = {
  en: {
    Footer: {
      brand_desc: "Experience the peak of luxury in Eilat. Our curated collection of villas, apartments, and hotels ensures an unforgettable vacation.",
      my_orders: "My Orders",
      login_register: "Login / Register",
      admin_login: "Admin Login",
      terms: "Terms of Use",
      privacy: "Privacy Policy",
      address: "HaTmarim Blvd, Eilat",
      secure_clearing: "PCI Secure Clearing",
      tlh: "E&OE"
    },
    Blog: {
      subtitle: "Tips, recommendations, and everything hot in Eilat",
      view_all: "All Articles"
    }
  },
  he: {
    Footer: {
      brand_desc: "חוו את שיא היוקרה באילת. האוסף הנבחר שלנו של וילות, דירות ומלונות מבטיח חופשה בלתי נשכחת.",
      my_orders: "ההזמנות שלי",
      login_register: "כניסה / הרשמה",
      admin_login: "כניסה למנהלים",
      terms: "תנאי שימוש",
      privacy: "מדיניות פרטיות",
      address: "שדרות התמרים, אילת",
      secure_clearing: "סליקה מאובטחת בתקן PCI",
      tlh: "ט.ל.ח"
    },
    Blog: {
      subtitle: "טיפים, המלצות וכל מה שחם באילת",
      view_all: "לכל הכתבות"
    }
  },
  fr: {
    Footer: {
      brand_desc: "Vivez le summum du luxe à Eilat. Notre collection garantit des vacances inoubliables.",
      my_orders: "Mes Réservations",
      login_register: "Connexion / Inscription",
      admin_login: "Connexion Admin",
      terms: "Conditions Générales",
      privacy: "Politique de Confidentialité",
      address: "Blvd HaTmarim, Eilat",
      secure_clearing: "Paiement Sécurisé PCI",
      tlh: "Sauf Erreur"
    },
    Blog: {
      subtitle: "Conseils, recommandations et tendances à Eilat",
      view_all: "Tous les Articles"
    }
  },
  ru: {
    Footer: {
      brand_desc: "Испытайте вершину роскоши в Эйлате. Наша коллекция гарантирует незабываемый отдых.",
      my_orders: "Мои заказы",
      login_register: "Вход / Регистрация",
      admin_login: "Вход для админа",
      terms: "Условия использования",
      privacy: "Политика конфиденциальности",
      address: "Б-р ХаТмарим, Эйлат",
      secure_clearing: "Безопасная оплата PCI",
      tlh: "Возможны ошибки"
    },
    Blog: {
      subtitle: "Советы, рекомендации и всё самое интересное в Эйлате",
      view_all: "Все статьи"
    }
  },
  ar: {
    Footer: {
      brand_desc: "جرب قمة الفخامة في إيلات. تضمن مجموعتنا عطلة لا تُنسى.",
      my_orders: "طلباتي",
      login_register: "عضوية",
      admin_login: "دخول الإدارة",
      terms: "شروط الاستخدام",
      privacy: "سياسة الخصوصية",
      address: "شارع هتماريم، إيلات",
      secure_clearing: "دفع آمن PCI",
      tlh: "السهو والخطأ مردود"
    },
    Blog: {
      subtitle: "نصائح وتوصيات وكل ما هو جديد في إيلات",
      view_all: "جميع المقالات"
    }
  }
};

files.forEach(f => {
  const lang = f.split('.')[0];
  const p = path.join(__dirname, 'locales', f);
  let data = JSON.parse(fs.readFileSync(p, 'utf8'));
  
  if (!data.Blog) data.Blog = {};
  
  // Merge keys
  Object.assign(data.Footer, additions[lang].Footer);
  Object.assign(data.Blog, additions[lang].Blog);
  
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
});
console.log('Update Complete.');
