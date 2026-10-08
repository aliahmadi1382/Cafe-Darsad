export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  note: string;
  image: string;
  tag?: string;
};
export const categories = [
  "همه محصولات",
  "قهوه",
  "شکلات",
  "قهوه‌ساز",
  "ماگ و تجهیزات",
];
export const products: Product[] = [
  {
    id: 1,
    name: "قهوه ترکیبی روزانه درصد",
    category: "قهوه",
    price: 485000,
    note: "۲۵۰ گرم · شکلاتی، متعادل و خوش‌عطر",
    image: "./images/beans.jpg",
    tag: "انتخاب درصد",
  },
  {
    id: 2,
    name: "قهوه تک‌خاستگاه اتیوپی",
    category: "قهوه",
    price: 645000,
    note: "۲۵۰ گرم · گلی، میوه‌ای، رُست روشن",
    image: "./images/coffee.jpg",
    tag: "برای کشف طعم",
  },
  {
    id: 3,
    name: "شکلات تلخ منتخب",
    category: "شکلات",
    price: 295000,
    note: "۱۰۰ گرم · کاکائوی ۷۰ درصد",
    image: "./images/chocolate.jpg",
  },
  {
    id: 4,
    name: "اسپرسوساز خانگی کلاسیک",
    category: "قهوه‌ساز",
    price: 18900000,
    note: "برای شروع صبح‌های حرفه‌ای",
    image: "./images/machine.jpg",
    tag: "یک همراه همیشگی",
  },
  {
    id: 5,
    name: "ماگ سرامیکی دست‌ساز",
    category: "ماگ و تجهیزات",
    price: 390000,
    note: "۳۰۰ میلی‌لیتر · لعاب گرم و طبیعی",
    image: "./images/mug.jpg",
  },
  {
    id: 6,
    name: "پک قهوه و شکلات درصد",
    category: "شکلات",
    price: 890000,
    note: "یک هدیه کوچک، یک حال خوب بزرگ",
    image: "./images/gift.jpg",
    tag: "برای هدیه",
  },
];
export const menu = [
  {
    name: "اسپرسو",
    note: "عصاره خالص قهوه، کوتاه و پرقدرت",
    price: 85000,
    category: "قهوه گرم",
    detail: "دبل شات · بدون شیر",
    signature: false,
  },
  {
    name: "کاپوچینو",
    note: "اسپرسو، شیر و فوم مخملی",
    price: 125000,
    category: "قهوه گرم",
    detail: "دبل شات · با شیر",
    signature: false,
  },
  {
    name: "لاته",
    note: "قهوه‌ای نرم با شیر گرم",
    price: 135000,
    category: "قهوه گرم",
    detail: "دبل شات · با شیر",
    signature: true,
  },
  {
    name: "آمریکانو",
    note: "اسپرسو و آب؛ ساده و خوش‌عطر",
    price: 95000,
    category: "قهوه گرم",
    detail: "دبل شات · بدون شیر",
    signature: false,
  },
  {
    name: "هات چاکلت",
    note: "شکلات غلیظ و شیر گرم",
    price: 145000,
    category: "شکلات و بیشتر",
    detail: "شکلات و شیر · بدون شات قهوه",
    signature: true,
  },
  {
    name: "قهوه دمی روز",
    note: "برای آرام‌تر نوشیدن و کشف طعم",
    price: 155000,
    category: "قهوه گرم",
    detail: "دم‌آوری دستی · بدون شیر",
    signature: false,
  },
  {
    name: "آیس لاته",
    note: "اسپرسو روی یخ، با شیر خنک و بافت نرم",
    price: 145000,
    category: "قهوه سرد",
    detail: "دبل شات · با شیر",
    signature: true,
  },
  {
    name: "آیس آمریکانو",
    note: "خنک، شفاف و پر از عطر قهوه",
    price: 105000,
    category: "قهوه سرد",
    detail: "دبل شات · بدون شیر",
    signature: false,
  },
  {
    name: "موکا",
    note: "جایی که قهوه و شکلات به هم می‌رسند",
    price: 155000,
    category: "شکلات و بیشتر",
    detail: "اسپرسو · شکلات · شیر",
    signature: false,
  },
];
export const money = (n: number) =>
  new Intl.NumberFormat("fa-IR").format(n) + " تومان";
