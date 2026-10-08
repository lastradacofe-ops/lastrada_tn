export type Locale = 'fr' | 'ar' | 'en';
export type LocalizedText = Partial<Record<Locale, string>>;
export type Category = { id: string; name: string; position: number; translations?: LocalizedText };
export type Product = {
  id: string; categoryId: string; name: string; description?: string; price: number;
  image?: string; available: boolean; translations?: LocalizedText;
  descriptions?: LocalizedText;
};
export const seededCategories: Category[] = [
  { id: 'eau', name: 'Eau', position: 1000, translations: { ar: 'مياه', en: 'Water' } },
  { id: 'cafes', name: 'Cafés', position: 2000, translations: { ar: 'قهوة', en: 'Coffee' } },
  { id: 'cafes-froides', name: 'Cafés froides', position: 3000, translations: { ar: 'قهوة باردة', en: 'Iced coffee' } },
  { id: 'narguile', name: 'Narguilé (Chicha)', position: 4000, translations: { ar: 'أرجيلة (شيشة)', en: 'Hookah (Shisha)' } },
  { id: 'thes', name: 'Thés', position: 5000, translations: { ar: 'شاي', en: 'Tea' } },
  { id: 'boissons', name: 'Boissons', position: 6000, translations: { ar: 'مشروبات', en: 'Drinks' } },
  { id: 'patisseries', name: 'Pâtisseries', position: 7000, translations: { ar: 'حلويات', en: 'Pastries' } },
];
export const seededProducts: Product[] = [
  { id:'eau-plate',categoryId:'eau',name:'Eau minérale',description:'Eau plate fraîche, servie à votre convenance.',price:2.5,available:true,translations:{en:'Still mineral water',ar:'مياه معدنية عادية'},descriptions:{en:'Chilled still water, served just right.',ar:'مياه معدنية عادية باردة.'} },
  { id:'eau-gazeuse',categoryId:'eau',name:'Eau gazeuse',description:'Fine et pétillante, bien fraîche.',price:3.5,available:true,translations:{en:'Sparkling water',ar:'مياه غازية'},descriptions:{en:'Fine bubbles, served chilled.',ar:'فقاعات ناعمة، تقدم باردة.'} },
  { id:'eau-grand-format',categoryId:'eau',name:'Grande eau minérale',description:'Une bouteille à partager autour de la table.',price:4.5,available:true,translations:{en:'Large mineral water',ar:'مياه معدنية كبيرة'},descriptions:{en:'A bottle to share around the table.',ar:'قارورة للمشاركة حول الطاولة.'} },
  { id:'cafe-turc',categoryId:'cafes',name:'Café turc',description:'Moulu finement, préparé à la minute.',price:4.5,available:true,translations:{en:'Turkish coffee',ar:'قهوة تركية'},descriptions:{en:'Finely ground and brewed to order.',ar:'قهوة مطحونة ناعماً وتحضر عند الطلب.'} },
  { id:'espresso',categoryId:'cafes',name:'Espresso',description:'Court, intense, torréfié avec patience.',price:4,available:true,translations:{en:'Espresso',ar:'إسبريسو'},descriptions:{en:'Short, intense, patiently roasted.',ar:'قصير ومركز، محمص بعناية.'} },
  { id:'cappuccino',categoryId:'cafes',name:'Cappuccino',description:'Un espresso rond, lait velouté et cacao.',price:7.5,available:true,translations:{en:'Cappuccino',ar:'كابتشينو'},descriptions:{en:'A round espresso, silky milk and cocoa.',ar:'إسبريسو متوازن مع حليب ناعم ورشة كاكاو.'} },
  { id:'cafe-glace',categoryId:'cafes-froides',name:'Café glacé',description:'Espresso refroidi, glaçons et douceur légère.',price:7,available:true,translations:{en:'Iced coffee',ar:'قهوة مثلجة'},descriptions:{en:'Chilled espresso, ice and a gentle sweetness.',ar:'إسبريسو بارد مع الثلج ولمسة حلاوة.'} },
  { id:'latte-glace',categoryId:'cafes-froides',name:'Latte glacé',description:'Lait frais, espresso et glaçons.',price:8.5,available:true,translations:{en:'Iced latte',ar:'لاتيه مثلج'},descriptions:{en:'Cold milk, espresso and ice.',ar:'حليب بارد وإسبريسو وثلج.'} },
  { id:'frappe',categoryId:'cafes-froides',name:'Frappé café',description:'Café frappé, mousse légère et notes de cacao.',price:9,available:true,translations:{en:'Coffee frappe',ar:'فرابيه بالقهوة'},descriptions:{en:'Blended coffee, light foam and cocoa notes.',ar:'قهوة مخفوقة برغوة خفيفة ونكهة الكاكاو.'} },
  { id:'chicha-classique',categoryId:'narguile',name:'Chicha classique',description:'Préparation classique, parfum au choix.',price:22,available:true,translations:{en:'Classic shisha',ar:'شيشة كلاسيكية'},descriptions:{en:'A classic preparation, choose your flavour.',ar:'تحضير كلاسيكي، اختر النكهة.'} },
  { id:'chicha-pomme',categoryId:'narguile',name:'Double pomme',description:'Un parfum rond aux notes de pomme et d’anis.',price:24,available:true,translations:{en:'Double apple',ar:'تفاحتان'},descriptions:{en:'Round apple notes with a hint of anise.',ar:'نكهة تفاح متوازنة مع لمسة يانسون.'} },
  { id:'chicha-menthe',categoryId:'narguile',name:'Menthe fraîche',description:'Une fraîcheur nette, à savourer lentement.',price:24,available:true,translations:{en:'Fresh mint',ar:'نعناع منعش'},descriptions:{en:'Clear mint freshness, made to linger over.',ar:'انتعاش النعناع، للاستمتاع على مهل.'} },
  { id:'the-menthe',categoryId:'thes',name:'Thé à la menthe',description:'Thé vert, menthe fraîche et pignons de pin.',price:6.5,available:true,translations:{en:'Mint tea',ar:'شاي بالنعناع'},descriptions:{en:'Green tea, fresh mint and pine nuts.',ar:'شاي أخضر ونعناع طازج وصنوبر.'} },
  { id:'the-vert',categoryId:'thes',name:'Thé vert',description:'Thé vert délicat, servi nature.',price:5,available:true,translations:{en:'Green tea',ar:'شاي أخضر'},descriptions:{en:'Delicate green tea, served plain.',ar:'شاي أخضر ناعم يقدم سادة.'} },
  { id:'the-jasmine',categoryId:'thes',name:'Thé au jasmin',description:'Thé délicatement parfumé aux fleurs de jasmin.',price:6,available:true,translations:{en:'Jasmine tea',ar:'شاي بالياسمين'},descriptions:{en:'Tea gently scented with jasmine flowers.',ar:'شاي معطر برفق بأزهار الياسمين.'} },
  { id:'citronnade',categoryId:'boissons',name:'Citronnade fraîche',description:'Citrons pressés, une pointe de fleur d’oranger.',price:8,available:false,translations:{en:'Fresh lemonade',ar:'ليموناضة طازجة'},descriptions:{en:'Freshly squeezed lemons with orange blossom.',ar:'ليمون معصور طازجاً ولمسة من ماء الزهر.'} },
  { id:'jus-orange',categoryId:'boissons',name:'Jus d’orange frais',description:'Oranges pressées à la minute.',price:9,available:true,translations:{en:'Fresh orange juice',ar:'عصير برتقال طازج'},descriptions:{en:'Oranges pressed to order.',ar:'برتقال يعصر عند الطلب.'} },
  { id:'boisson-fraiche',categoryId:'boissons',name:'Boisson fraîche',description:'Une boisson pétillante, servie bien fraîche.',price:5.5,available:true,translations:{en:'Chilled soft drink',ar:'مشروب بارد'},descriptions:{en:'A sparkling soft drink, served chilled.',ar:'مشروب غازي يقدم بارداً.'} },
  { id:'makroud',categoryId:'patisseries',name:'Makroud',description:'Semoule dorée, dattes et filet de miel.',price:4.5,available:true,translations:{en:'Makroud',ar:'مقروض'},descriptions:{en:'Golden semolina, dates and a thread of honey.',ar:'سميد ذهبي، تمر ولمسة من العسل.'} },
  { id:'bambalouni',categoryId:'patisseries',name:'Bambalouni',description:'Beignet chaud, sucre fin, à savourer sans hâte.',price:5,available:true,translations:{en:'Bambalouni',ar:'بمبالوني'},descriptions:{en:'Warm doughnut, fine sugar, made to enjoy slowly.',ar:'دونات ساخنة وسكر ناعم، استمتع بها على مهل.'} },
  { id:'cake-orange',categoryId:'patisseries',name:'Cake à l’orange',description:'Gâteau moelleux et parfumé aux zestes d’orange.',price:6.5,available:true,translations:{en:'Orange cake',ar:'كيك البرتقال'},descriptions:{en:'Soft cake scented with orange zest.',ar:'كيك طري معطر بقشر البرتقال.'} },
];

