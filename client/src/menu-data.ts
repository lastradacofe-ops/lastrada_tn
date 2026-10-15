export type Locale = 'fr' | 'ar' | 'en';
export type LocalizedText = Partial<Record<Locale, string>>;
export type Category = { id: string; name: string; position: number; available?: boolean; translations?: LocalizedText };
export type Offer = {
  id: string; name: string; position: number;
  validFrom?: string; validTo?: string;
  /** Recurring daily window, `HH:MM`, applied across the whole validity period. */
  dailyFrom?: string; dailyTo?: string;
  /** Precise one-off window, `YYYY-MM-DDTHH:MM`. */
  startsAt?: string; endsAt?: string;
  originalPrice?: number; currentPrice: number;
  image?: string; products: string[];
  translations?: LocalizedText; available?: boolean;
};

/**
 * Sanity ceiling for offer prices. A café bundle is never near this, and an
 * unbounded number field is how "7000 dinars" becomes "7,000,000 DT".
 * Mirrors MAX_OFFER_PRICE in @workspace/api-zod, which enforces it server-side.
 */
export const MAX_OFFER_PRICE = 10_000;

/** `YYYY-MM-DD` for the local day — the format offers store their bounds in. */
export function todayStamp(today = new Date()) {
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

/** `HH:MM` for the current local time. */
function timeStamp(now: Date) {
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/** `YYYY-MM-DDTHH:MM` for the current local moment. */
function dateTimeStamp(now: Date) {
  return `${todayStamp(now)}T${timeStamp(now)}`;
}

/**
 * An offer is live when it is not hidden and the local moment falls inside every
 * window it declares: the date range, the recurring daily hours, and the precise
 * one-off window. Absent a window, that dimension does not restrict.
 */
export function isOfferLive(offer: Offer, now = new Date()) {
  if (offer.available === false) return false;
  const day = todayStamp(now);
  if (offer.validFrom && day < offer.validFrom) return false;
  if (offer.validTo && day > offer.validTo) return false;
  // Daily hours are inclusive at both ends so 07:00–07:00 shows for that hour.
  const time = timeStamp(now);
  if (offer.dailyFrom && time < offer.dailyFrom) return false;
  if (offer.dailyTo && time > offer.dailyTo) return false;
  const stamp = dateTimeStamp(now);
  if (offer.startsAt && stamp < offer.startsAt) return false;
  if (offer.endsAt && stamp > offer.endsAt) return false;
  return true;
}

/** Why the customer cannot see this offer today. `null` means it is visible. */
export type OfferBlockReason = 'hidden' | 'scheduled' | 'expired' | 'not-yet-today' | 'today-done' | 'outside-hours' | 'between-hours' | 'not-started' | 'one-off-ended' | 'no-products' | 'hidden-products';

export function offerBlockReason(
  offer: Offer,
  visibleProductIds: Set<string>,
  now = new Date(),
): OfferBlockReason | null {
  if (offer.available === false) return 'hidden';
  const day = todayStamp(now);
  if (offer.validFrom && day < offer.validFrom) return 'scheduled';
  if (offer.validTo && day > offer.validTo) return 'expired';
  if (offer.dailyFrom && timeStamp(now) < offer.dailyFrom) return 'between-hours';
  if (offer.dailyTo && timeStamp(now) > offer.dailyTo) return 'today-done';
  const stamp = dateTimeStamp(now);
  if (offer.startsAt && stamp < offer.startsAt) return 'not-started';
  if (offer.endsAt && stamp > offer.endsAt) return 'one-off-ended';
  if (offer.products.length === 0) return 'no-products';
  if (offer.products.some(id => !visibleProductIds.has(id))) return 'hidden-products';
  return null;
}

/** Human label for the windows an offer declares, e.g. "18:00 → 23:00". */
export function offerWindowLabel(offer: Offer, locale: Locale) {
  const daily = offer.dailyFrom || offer.dailyTo
    ? `${offer.dailyFrom || '00:00'} → ${offer.dailyTo || '23:59'}`
    : '';
  const oneOff = offer.startsAt && offer.endsAt
    ? `${offer.startsAt.replace('T', ' ')} → ${offer.endsAt.replace('T', ' ')}`
    : offer.startsAt ? `≥ ${offer.startsAt.replace('T', ' ')}` : offer.endsAt ? `≤ ${offer.endsAt.replace('T', ' ')}` : '';
  return [daily, oneOff].filter(Boolean).join(' · ');
}
export type Product = {
  id: string; categoryId: string; name: string; description?: string; price: number;
  image?: string; available: boolean; translations?: LocalizedText;
  descriptions?: LocalizedText;
};
export const copyText = {
  fr: { tagline:'Un café, une parenthèse.', intro:'Une carte de maison, des classiques choisis et le goût de prendre son temps. Retrouvez-nous à Kairouan, en Tunisie.', address:'Kairouan, Tunisie', hours:'Tous les jours · 06:00–01:00', open:'Tous les jours · 06:00–01:00', closed:'Actuellement indisponible', unavailable:'Indisponible pour le moment', search:'Chercher dans la carte', menu:'La carte', all:'Tout', contact:'Nous trouver', follow:'Suivez la maison', hoursTitle:'Horaires', detail:'À propos de ce produit', loading:'La carte arrive…', noResults:'Rien ne correspond à votre recherche.', footer:'La carte LASTRADA Café-Resto.', cached:'Carte consultée hors connexion', adminEntry:'Éditeur de la carte', offers:'Offres', offerTotal:'Total avant offre', offerValid:'Valable', offerUntil:'jusqu’au', offerAddProduct:'Ajouter un produit', offerRemoveProduct:'Retirer le produit', offerProductsCount:'produits', noOffers:'Aucune offre pour le moment.', close:'Fermer', itinerary:'Ouvrir dans Google Maps', phoneTitle:'Téléphone', phonePlaceholder:'+216 51 524 107', socialTitle:'Réseaux sociaux', socialPlaceholder:'Compte à renseigner', addressTitle:'Adresse' },
  ar: { tagline:'قهوة واستراحة.', intro:'قائمة من الدار، أطباق مختارة ومتعة الاستمتاع بالوقت. نستقبلكم في القيروان، تونس.', address:'القيروان، تونس', hours:'يومياً · 06:00–01:00', open:'يومياً · 06:00–01:00', closed:'غير متاح حالياً', unavailable:'غير متوفر الآن', search:'ابحث في القائمة', menu:'القائمة', all:'الكل', contact:'زورونا', follow:'تابعوا الدار', hoursTitle:'أوقات العمل', detail:'عن هذا المنتج', loading:'القائمة قادمة…', noResults:'لا توجد نتائج مطابقة لبحثك.', footer:'قائمة لاستـرادا كافيه ريستو.', cached:'القائمة متاحة دون اتصال', adminEntry:'محرر القائمة', offers:'العروض', offerTotal:'المجموع قبل العرض', offerValid:'صالح', offerUntil:'إلى', offerAddProduct:'أضف منتجاً', offerRemoveProduct:'أزل المنتج', offerProductsCount:'منتجات', noOffers:'لا توجد عروض حالياً.', close:'إغلاق', itinerary:'افتح في خرائط Google', phoneTitle:'الهاتف', phonePlaceholder:'+216 51 524 107', socialTitle:'التواصل الاجتماعي', socialPlaceholder:'الحساب سيُضاف لاحقاً', addressTitle:'العنوان' },
  en: { tagline:'Coffee, then a little pause.', intro:'A house menu, familiar favourites and the pleasure of taking your time. Visit us in Kairouan, Tunisia.', address:'Kairouan, Tunisia', hours:'Daily · 06:00–01:00', open:'Daily · 06:00–01:00', closed:'Temporarily unavailable', unavailable:'Not available right now', search:'Search the menu', menu:'The menu', all:'All', contact:'Find us', follow:'Follow along', hoursTitle:'Opening hours', detail:'About this product', loading:'The menu is on its way…', noResults:'Nothing matches your search.', footer:'The LASTRADA Café-Resto menu.', cached:'Menu available offline', adminEntry:'Menu editor', offers:'Offers', offerTotal:'Total before offer', offerValid:'Valid', offerUntil:'until', offerAddProduct:'Add a product', offerRemoveProduct:'Remove product', offerProductsCount:'products', noOffers:'No offers right now.', close:'Close', itinerary:'Open in Google Maps', phoneTitle:'Phone', phonePlaceholder:'+216 51 524 107', socialTitle:'Social', socialPlaceholder:'Account to be provided', addressTitle:'Address' },
} as const;

export const adminText = {
  fr: { editor:'GESTION DU MENU · LASTRADA', categories:'Les rubriques', products:'Les produits', offers:'Les offres', preview:'Aperçu client', tabCategories:'Catégories', tabProducts:'Produits',
    tabOffers:'Offres', tabPreview:'Aperçu', add:'Ajouter', order:'Utilisez les flèches pour réordonner les rubriques.', productNote:'Prix en dinars tunisiens · carte sans commande.',
    offerNote:'Les offres permettent de regrouper plusieurs produits à un prix spécial.', sections:'Rubriques de la carte', items:'produits', position:'position', available:'Disponible', unavailable:'Masqué', view:'Voir la carte', installTitle:'Votre carte, à portée de pouce.', installBody:'Ajoutez LASTRADA à l’écran d’accueil depuis le menu de votre navigateur.', loginEyebrow:'ESPACE ADMINISTRATEUR', loginTitle:'La carte, à portée de main.', loginBody:'Connectez-vous pour gérer les rubriques et les produits de votre carte.', email:'Adresse e-mail', password:'Mot de passe', loginHint:'', enter:'Ouvrir la gestion', back:'Retour à la carte', addCategory:'Ajouter une catégorie', editCategory:'Modifier la catégorie', newCategory:'Nouvelle catégorie', categoryName:'Nom en français',
    offerName:'Nom de l\'offre', categoryNote:'Les traductions restent conservées pour les catégories déjà présentes. Les nouvelles catégories apparaissent en français dans les autres langues.', emptyCategory:'Aucune catégorie. Ajoutez la première.', deleteCategory:'Supprimer cette catégorie ?', deleteProduct:'Supprimer ce produit ?', removedCategory:'La catégorie et ses produits seront retirés de la carte.', removedProduct:'Le produit sera retiré de la carte.', cancel:'Annuler', save:'Enregistrer', editProduct:'Modifier le produit', newProduct:'Nouveau produit', image:'Ajouter ou remplacer la photo',
    offerImage:'Image de l\'offre', removeImage:'Supprimer la photo', imageNote:'La photo est recadrée en aperçu WebP de 800 px et enregistrée avec le menu.', name:'Nom en français', price:'Prix · TND',
    offerOriginalPrice:'Prix original',
    offerCurrentPrice:'Prix actuel',
    offerValidity:'Durée de validité', category:'Catégorie',
    offerProducts:'Produits de l\'offre', description:'Description', descriptionHint:'Une phrase, quelques saveurs.', availableToggle:'Afficher sur la carte', confirm:'CONFIRMATION', delete:'Supprimer', noProducts:'Aucun produit pour le moment.', createCategoryFirst:'Créez une catégorie avant d’ajouter un produit.', createCategory:'Créer une catégorie', previewTitle:'À quoi ressemble la carte', previewBody:'La vue visiteur, avec vos changements.', moveFirst:'Mettre en premier', quickAdd:'Ajouter un produit', loading:'Chargement…',
    addOffer:'Créer une offre', editOffer:'Modifier l\'offre', deleteOffer:'Supprimer cette offre ?', removedOffer:'L’offre sera retirée de la carte.', emptyOffers:'Aucune offre. Créez la première.', offerNoProducts:'Ajoutez au moins un produit à cette offre.', offerValidFrom:'Valable du', offerValidTo:'jusqu’au', offerNoDates:'Sans dates', offerExpired:'Expirée', offerScheduled:'Programmée', offerLive:'Active', offerTotal:'Total avant offre', offerPriceAuto:'Calculé automatiquement', offerAddProducts:'Ajouter des produits', offerSearchProducts:'Rechercher un produit', offerPeriod:'Période de validité', offerProductsCount:'produits', offerRemoveProduct:'Retirer le produit', dataUrlUnsupported:'Cette image est trop lourde. Utilisez une photo plus légère.',
    offerHidden:'Masquée', offerHiddenHint:'Masquée par vous. Activez l’interrupteur pour la publier.', offerScheduledHint:'Pas encore active : elle apparaîtra à la date de début.', offerExpiredHint:'La date de fin est passée. Changez les dates pour la republier.', offerHiddenProducts:'Produits masqués', offerHiddenProductsHint:'Un produit de cette offre est masqué ou sa catégorie est cachée, donc l’offre n’apparaît pas.', offerNameRequired:'Donnez un nom à l’offre.', offerPriceInvalid:'Prix actuel invalide.', offerPriceTooHigh:'Prix trop élevé. Maximum 10 000 DT.', offerDatesReversed:'La date de fin doit être après la date de début.', offerNotCheaper:'Le prix actuel doit être inférieur au prix original.', offerPeriodHint:'Laissez vide pour une offre sans limite de dates.',
    offerDailyHours:'Chaque jour, de', offerDailyTo:'à', offerDailyHint:'Ces horaires se répètent chaque jour pendant toute la période.', offerOneOff:'Date et heure précises', offerOneOffFrom:'Du', offerOneOffTo:'Au', offerOneOffHint:'Une seule fois, à une heure précise.', offerNoWindow:'Toute la journée', offerHiddenUntil:'Visible à partir de', offerFinishedToday:'Finie pour aujourd’hui. Elle reviendra demain.', offerBeforeHours:'Pas encore l’heure : visible à partir de', offerNotStartedYet:'Pas encore commencée.', offerOneOffEnded:'Cette offre ponctuelle est terminée.', offerHoursReversed:'L’heure de fin doit être après l’heure de début.', offerOneOffReversed:'La fin doit être après le début.', offerHoursPair:'Renseignez les deux horaires.', offerOneOffPair:'Renseignez les deux dates.', offerFix:'Rendre visible', offerFixHint:'Publier dès maintenant et pendant 30 jours',
    offerSchedule:'Disponibilité', modeAll:'Toute la journée', modeDaily:'Horaires chaque jour', modeDates:'Période de dates', modeExact:'Date et heure précises', offerNoWindowHint:'L’offre reste visible en permanence.', dailyHint:'Ces horaires se répètent chaque jour.', datesHint:'L’offre n’apparaît que pendant cette période.', exactHint:'Une seule fois, à la minute près.' },
  en: { editor:'MENU MANAGEMENT · LASTRADA', categories:'Categories', products:'Products', offers:'Offers', preview:'Customer preview', tabCategories:'Categories', tabProducts:'Products',
    tabOffers:'Offers', tabPreview:'Preview', add:'Add', order:'Use the arrows to reorder categories.', productNote:'Prices in Tunisian dinars · browsing only.',
    offerNote:'Offers allow grouping multiple products at a special price.', sections:'Menu categories', items:'products', position:'position', available:'Available', unavailable:'Hidden', view:'View menu', installTitle:'Your menu, close at hand.', installBody:'Add LASTRADA to your home screen from your browser menu.', loginEyebrow:'ADMINISTRATOR ACCESS', loginTitle:'Your menu, close at hand.', loginBody:'Sign in to manage the categories and products on your menu.', email:'Email address', password:'Password', loginHint:'', enter:'Open menu manager', back:'Back to the menu', addCategory:'Add category', editCategory:'Edit category', newCategory:'New category', categoryName:'Name in French',
    offerName:'Offer Name', categoryNote:'Translations remain for existing categories. New categories appear in French in other languages.', emptyCategory:'No categories yet. Add the first one.', deleteCategory:'Delete this category?', deleteProduct:'Delete this product?', removedCategory:'The category and its products will be removed from the menu.', removedProduct:'The product will be removed from the menu.', cancel:'Cancel', save:'Save changes', editProduct:'Edit product', newProduct:'New product', image:'Choose or replace photo',
    offerImage:'Offer Image', removeImage:'Remove photo', imageNote:'The photo is cropped to an 800 px WebP preview and stored with the menu.', name:'Name in French', price:'Price · TND',
    offerOriginalPrice:'Original Price',
    offerCurrentPrice:'Current Price',
    offerValidity:'Validity Duration', category:'Category',
    offerProducts:'Offer Products', description:'Description', descriptionHint:'A line or two about the flavours.', availableToggle:'Show on the menu', confirm:'CONFIRMATION', delete:'Delete', noProducts:'No products here yet.', createCategoryFirst:'Create a category before adding products.', createCategory:'Create a category', previewTitle:'The menu as guests see it', previewBody:'Customer view with your changes.', moveFirst:'Move to first', quickAdd:'Add a product', loading:'Loading…',
    addOffer:'Create an offer', editOffer:'Edit the offer', deleteOffer:'Delete this offer?', removedOffer:'The offer will be removed from the menu.', emptyOffers:'No offers yet. Create the first one.', offerNoProducts:'Add at least one product to this offer.', offerValidFrom:'Valid from', offerValidTo:'until', offerNoDates:'No dates', offerExpired:'Expired', offerScheduled:'Scheduled', offerLive:'Live', offerTotal:'Total before offer', offerPriceAuto:'Calculated automatically', offerAddProducts:'Add products', offerSearchProducts:'Search a product', offerPeriod:'Validity period', offerProductsCount:'products', offerRemoveProduct:'Remove product', dataUrlUnsupported:'This image is too heavy. Try a lighter photo.',
    offerHidden:'Hidden', offerHiddenHint:'Hidden by you. Turn the switch on to publish it.', offerScheduledHint:'Not started yet: it will appear on the start date.', offerExpiredHint:'The end date has passed. Change the dates to publish it again.', offerHiddenProducts:'Hidden products', offerHiddenProductsHint:'One product in this offer is hidden or its category is hidden, so the offer does not appear.', offerNameRequired:'Give the offer a name.', offerPriceInvalid:'Invalid current price.', offerPriceTooHigh:'Price too high. Maximum 10,000 DT.', offerDatesReversed:'The end date must come after the start date.', offerNotCheaper:'The current price must be lower than the original price.', offerPeriodHint:'Leave empty for an offer with no date limits.',
    offerDailyHours:'Every day, from', offerDailyTo:'to', offerDailyHint:'These hours repeat every day for the whole period.', offerOneOff:'Exact date and time', offerOneOffFrom:'From', offerOneOffTo:'To', offerOneOffHint:'A single time, to the minute.', offerNoWindow:'All day', offerHiddenUntil:'Visible from', offerFinishedToday:'Finished for today. It returns tomorrow.', offerBeforeHours:'Not the right time yet: visible from', offerNotStartedYet:'Not started yet.', offerOneOffEnded:'This one-off offer has ended.', offerHoursReversed:'The end time must be after the start time.', offerOneOffReversed:'The end must be after the start.', offerHoursPair:'Fill in both times.', offerOneOffPair:'Fill in both dates.', offerFix:'Make visible', offerFixHint:'Publish from now for 30 days',
    offerSchedule:'Availability', modeAll:'All day', modeDaily:'Daily hours', modeDates:'Date range', modeExact:'Exact date & time', offerNoWindowHint:'The offer stays visible at all times.', dailyHint:'These hours repeat every day.', datesHint:'The offer only appears during this period.', exactHint:'A single time, to the minute.' },
  ar: { editor:'إدارة القائمة · لاستـرادا', categories:'الفئات', products:'المنتجات', offers:'العروض', preview:'معاينة الزائر', tabCategories:'الفئات', tabProducts:'المنتجات', tabOffers:'العروض', tabPreview:'معاينة', add:'إضافة', order:'استخدم الأسهم لإعادة ترتيب الفئات.', productNote:'الأسعار بالدينار التونسي · عرض القائمة فقط.', offerNote:'تتيح العروض تجميع عدة منتجات بسعر خاص.', sections:'فئات القائمة', items:'منتجات', position:'الترتيب', available:'متوفر', unavailable:'مخفي', view:'عرض القائمة', installTitle:'قائمتك دائماً قريبة.', installBody:'أضف لاستـرادا إلى الشاشة الرئيسية من قائمة المتصفح.', loginEyebrow:'دخول المدير', loginTitle:'قائمتك في متناول يدك.', loginBody:'سجّل الدخول لإدارة الفئات والمنتجات في قائمتك.', email:'البريد الإلكتروني', password:'كلمة المرور', loginHint:'', enter:'فتح إدارة القائمة', back:'العودة إلى القائمة', addCategory:'إضافة فئة', editCategory:'تعديل الفئة', newCategory:'فئة جديدة', categoryName:'الاسم بالفرنسية', offerName:'اسم العرض', categoryNote:'تبقى الترجمات للفئات الموجودة. تظهر الفئات الجديدة بالفرنسية في اللغات الأخرى.', emptyCategory:'لا توجد فئات. أضف الأولى.', deleteCategory:'حذف هذه الفئة؟', deleteProduct:'حذف هذا المنتج؟', removedCategory:'ستُحذف الفئة ومنتجاتها من القائمة.', removedProduct:'سيُحذف المنتج من القائمة.', cancel:'إلغاء', save:'حفظ', editProduct:'تعديل المنتج', newProduct:'منتج جديد', image:'اختر صورة من هذا الجهاز', offerImage:'صورة العرض', removeImage:'حذف الصورة', imageNote:'تُقص الصورة إلى معاينة WebP بعرض 800 بكسل وتحفظ مع القائمة.', name:'الاسم بالفرنسية', price:'السعر · دينار', offerOriginalPrice:'السعر الأصلي', offerCurrentPrice:'السعر الحالي', offerValidity:'مدة الصلاحية', offerProducts:'منتجات العرض', category:'الفئة', description:'الوصف', descriptionHint:'جملة عن النكهات.', availableToggle:'إظهار في القائمة', confirm:'تأكيد', delete:'حذف', noProducts:'لا توجد منتجات هنا بعد.', createCategoryFirst:'أنشئ فئة قبل إضافة المنتجات.', createCategory:'إنشاء فئة', previewTitle:'القائمة كما يراها الزوار', previewBody:'عرض الزوار مع تغييراتك.', moveFirst:'نقل إلى البداية', quickAdd:'إضافة منتج', loading:'جارٍ التحميل…',
    addOffer:'إنشاء عرض', editOffer:'تعديل العرض', deleteOffer:'حذف هذا العرض؟', removedOffer:'سيُحذف العرض من القائمة.', emptyOffers:'لا توجد عروض. أنشئ أول عرض.', offerNoProducts:'أضف منتجاً واحداً على الأقل إلى هذا العرض.', offerValidFrom:'صالح من', offerValidTo:'إلى', offerNoDates:'بدون تواريخ', offerExpired:'منتهي', offerScheduled:'مجدول', offerLive:'نشط', offerTotal:'المجموع قبل العرض', offerPriceAuto:'يُحسب تلقائياً', offerAddProducts:'إضافة منتجات', offerSearchProducts:'ابحث عن منتج', offerPeriod:'فترة الصلاحية', offerProductsCount:'منتجات', offerRemoveProduct:'أزل المنتج', dataUrlUnsupported:'هذه الصورة ثقيلة. جرّب صورة أخف.',
    offerHidden:'مخفي', offerHiddenHint:'مخفي منك. فعّل المفتاح لنشره.', offerScheduledHint:'لم يبدأ بعد: سيظهر عند تاريخ البداية.', offerExpiredHint:'انتهى تاريخ النهاية. غيّر التواريخ لنشره من جديد.', offerHiddenProducts:'منتجات مخفية', offerHiddenProductsHint:'أحد منتجات هذا العرض مخفي أو فئته مخفية، لذلك لا يظهر العرض.', offerNameRequired:'أعطِ العرض اسماً.', offerPriceInvalid:'سعر الحالي غير صالح.', offerPriceTooHigh:'السعر مرتفع جداً. الحد الأقصى 10 000 دينار.', offerDatesReversed:'يجب أن يكون تاريخ النهاية بعد تاريخ البداية.', offerNotCheaper:'يجب أن يكون السعر الحالي أقل من السعر الأصلي.', offerPeriodHint:'اتركه فارغاً لعرض بلا حدود زمنية.',
    offerDailyHours:'كل يوم، من', offerDailyTo:'إلى', offerDailyHint:'تتكرر هذه الساعات كل يوم طوال الفترة.', offerOneOff:'تاريخ ووقت محددان', offerOneOffFrom:'من', offerOneOffTo:'إلى', offerOneOffHint:'مرة واحدة، بدقة الدقيقة.', offerNoWindow:'طوال اليوم', offerHiddenUntil:'تظهر ابتداءً من', offerFinishedToday:'انتهت اليوم. ستعود غداً.', offerBeforeHours:'ليس الوقت بعد: تظهر ابتداءً من', offerNotStartedYet:'لم تبدأ بعد.', offerOneOffEnded:'انتهى هذا العرض المؤقت.', offerHoursReversed:'يجب أن يكون وقت النهاية بعد وقت البداية.', offerOneOffReversed:'يجب أن تكون النهاية بعد البداية.', offerHoursPair:'أدخل الوقتين.', offerOneOffPair:'أدخل التاريخين.', offerFix:'اجعلها مرئية', offerFixHint:'انشرها الآن لمدة 30 يوماً',
    offerSchedule:'التوفّر', modeAll:'طوال اليوم', modeDaily:'ساعات يومية', modeDates:'فترة تواريخ', modeExact:'تاريخ ووقت محددان', offerNoWindowHint:'يبقى العرض ظاهراً في كل الأوقات.', dailyHint:'تتكرر هذه الساعات كل يوم.', datesHint:'يظهر العرض خلال هذه الفترة فقط.', exactHint:'مرة واحدة، بدقّة الدقيقة.' },
} as const;

export function translated(text: string, translations: LocalizedText | undefined, locale: Locale) {
  return (translations?.[locale] || text);
}



















