export type MenuCategory = "لفائف" | "جانبية" | "مشروبات" | "حلويات"

export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
  imageLabel: string
}

export const menuCategories: MenuCategory[] = [
  "لفائف",
  "جانبية",
  "مشروبات",
  "حلويات",
]

export const menuItems: MenuItem[] = [
  {
    id: "spiced-fries",
    name: "بطاطس تنت المتبّلة",
    description:
      "بطاطس مقرمشة مغطاة بالشاورما المتبّلة والطحينة والمخللات.",
    price: 45,
    category: "جانبية",
    imageLabel: "بطاطس",
  },
  {
    id: "zaatar-wrap",
    name: "لفّة الزعتر",
    description: "خبز دافئ مع لبنة وأعشاب طازجة وزيت زيتون.",
    price: 35,
    category: "لفائف",
    imageLabel: "لفّة",
  },
  {
    id: "kibbeh-bites",
    name: "قطع الكبة",
    description: "قشرة برغل مقلية محشوة باللحم المفروم.",
    price: 50,
    category: "جانبية",
    imageLabel: "كبة",
  },
  {
    id: "varni-wrap",
    name: "لفّة فارني",
    description:
      "خبز مشوي محشو بدجاج مشوي وصلصة ثوم وبصل بالسماق.",
    price: 35,
    category: "لفائف",
    imageLabel: "لفّة",
  },
  {
    id: "chicken-shawarma",
    name: "لفّة شاورما الدجاج",
    description:
      "دجاج مشوي ببطء مع مخللات وطحينة وخلطة بهارات المنزل.",
    price: 42,
    category: "لفائف",
    imageLabel: "شاورما",
  },
  {
    id: "falafel-plate",
    name: "طبق فلافل",
    description: "فلافل أعشاب مقرمشة مع حمص وسلطة وخبز بيتا دافئ.",
    price: 38,
    category: "جانبية",
    imageLabel: "فلافل",
  },
  {
    id: "mint-lemonade",
    name: "ليمونادة بالنعناع",
    description: "ليمون طازج ونعناع مهروس ولمسة من ماء الزهر.",
    price: 18,
    category: "مشروبات",
    imageLabel: "مشروب",
  },
  {
    id: "arabic-coffee",
    name: "قهوة عربية",
    description: "قهوة بالهيل تقدّم على الطريقة التقليدية.",
    price: 15,
    category: "مشروبات",
    imageLabel: "قهوة",
  },
  {
    id: "kunafa",
    name: "كنافة",
    description: "عجينة مقرمشة بطبقات من الجبن وشراب الورد العطر.",
    price: 40,
    category: "حلويات",
    imageLabel: "كنافة",
  },
  {
    id: "baklava",
    name: "قطع البقلاوة",
    description: "عجينة فيلو هشة بالفستق والعسل الذهبي.",
    price: 32,
    category: "حلويات",
    imageLabel: "بقلاوة",
  },
  {
    id: "baklava",
    name: "قطع البقلاوة",
    description: "عجينة فيلو هشة بالفستق والعسل الذهبي.",
    price: 32,
    category: "حلويات",
    imageLabel: "بقلاوة",
  },
  {
    id: "baklava",
    name: "قطع البقلاوة",
    description: "عجينة فيلو هشة بالفستق والعسل الذهبي.",
    price: 32,
    category: "حلويات",
    imageLabel: "بقلاوة",
  },
  {
    id: "baklava",
    name: "قطع البقلاوة",
    description: "عجينة فيلو هشة بالفستق والعسل الذهبي.",
    price: 32,
    category: "حلويات",
    imageLabel: "بقلاوة",
  },
  {
    id: "baklava",
    name: "قطع البقلاوة",
    description: "عجينة فيلو هشة بالفستق والعسل الذهبي.",
    price: 32,
    category: "حلويات",
    imageLabel: "بقلاوة",
  },
  {
    id: "baklava",
    name: "قطع البقلاوة",
    description: "عجينة فيلو هشة بالفستق والعسل الذهبي.",
    price: 32,
    category: "حلويات",
    imageLabel: "بقلاوة",
  },
]

export const featuredItems = menuItems.filter((item) =>
  ["chicken-shawarma", "zaatar-wrap", "kibbeh-bites", "spiced-fries"].includes(
    item.id,
  ),
)

export const locations = [
  {
    id: "riyadh",
    city: "الرياض",
    address: "شارع العليا، حي العليا",
    hours: "يومياً 11:00 – 01:00",
  },
  {
    id: "jeddah",
    city: "جدة",
    address: "شارع التحلية، الأندلس",
    hours: "يومياً 12:00 – 02:00",
  },
  {
    id: "dammam",
    city: "الدمام",
    address: "طريق الكورنيش، الشاطئ",
    hours: "يومياً 11:00 – 00:30",
  },
]

export const testimonials = [
  {
    id: "1",
    name: "ليلى م.",
    quote:
      "كل لقمة تذوق كطعم البيت — الشاورما متبّلة بإتقان والأجواء رائعة.",
    rating: 5,
  },
  {
    id: "2",
    name: "عمر ك.",
    quote:
      "تنت تقدّم أكل الشارع العربي الأصيل بلمسة راقية. لفّة الزعتر لا تُنسى.",
    rating: 5,
  },
  {
    id: "3",
    name: "سارة أ.",
    quote:
      "من التفاصيل الذهبية إلى النكهات، كل شيء مدروس. صار المفضل الجديد لعائلتنا.",
    rating: 5,
  },
]
