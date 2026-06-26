import type { LandingSettings, Pack, Product } from '@/lib/types';

export const fallbackSettings: LandingSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  logo_text_ar: 'كوزميتيك صيف',
  logo_text_fr: 'itiq Summer',
  logo_image_url: '',
  hero_title_ar: 'لمسة صيف فاخرة لكل خرجات البحر',
  hero_title_fr: 'Votre routine plage, plus belle et plus simple',
  hero_subtitle_ar: 'منتجات صيفية مختارة بعناية، عروض باكات، وتوصيل سريع داخل المغرب.',
  hero_subtitle_fr: 'Des essentiels solaires, sacs, serviettes et packs premium avec livraison rapide.',
  background_image_url: '/beach-summer.png',
  primary_color: '#0e9fb8',
  secondary_color: '#ff6f61',
  promo_text_ar: 'عرض محدود على باك الصيف الكامل',
  promo_text_fr: 'Offre limitee sur le pack ete complet',
  footer_text_ar: 'كوزميتيك صيف - طلبات بسيطة وتوصيل 45 درهم.',
  footer_text_fr: 'Summer - commandes simples, livraison 45 MAD.',
  whatsapp_number: '+212600000000',
  content_ar: {
    nav_packs: 'الباكات',
    nav_products: 'المنتجات',
    nav_contact: 'تواصل معنا',
    shop_now: 'تسوق الآن',
    view_packs: 'شاهد الباكات',
    view_details: 'عرض التفاصيل',
    add_to_cart: 'أضف للسلة',
    order_now: 'اطلب الآن',
    products_title: 'منتجات مختارة بعناية',
    packs_title: 'باكات صيفية جاهزة',
    subtotal: 'المجموع الفرعي',
    delivery: 'التوصيل',
    total: 'المجموع النهائي',
    checkout_title: 'إتمام الطلب',
    full_name: 'الاسم الكامل',
    phone: 'الهاتف',
    address: 'العنوان',
    city: 'المدينة',
    confirm_order: 'تأكيد الطلب'
  },
  content_fr: {
    nav_packs: 'Packs',
    nav_products: 'Produits',
    nav_contact: 'Contact',
    shop_now: 'Acheter maintenant',
    view_packs: 'Voir les packs',
    view_details: 'Voir details',
    add_to_cart: 'Ajouter au panier',
    order_now: 'Commander',
    products_title: 'Produits soigneusement choisis',
    packs_title: 'Packs prets pour la plage',
    subtotal: 'Sous-total',
    delivery: 'Livraison',
    total: 'Total final',
    checkout_title: 'Finaliser la commande',
    full_name: 'Nom complet',
    phone: 'Telephone',
    address: 'Adresse',
    city: 'Ville',
    confirm_order: 'Confirmer la commande'
  }
};

export const fallbackProducts: Product[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    name_ar: 'واقي الشمس SPF50',
    name_fr: 'Creme solaire SPF50',
    description_ar: 'حماية قوية للبشرة في البحر والشمس.',
    description_fr: 'Protection haute pour les journees plage.',
    details_ar: 'تركيبة خفيفة مناسبة للاستعمال اليومي، مقاومة للحرارة ومريحة فوق البشرة.',
    details_fr: 'Texture legere, ideale pour la plage et les sorties en plein soleil.',
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85',
    gallery_urls: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85'],
    price: 149,
    promo_price: 119,
    stock: 24,
    active: true
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    name_ar: 'فوطة شاطئ كبيرة',
    name_fr: 'Serviette de plage',
    description_ar: 'ناعمة، خفيفة، وسريعة النشفان.',
    description_fr: 'Grand format doux et sechage rapide.',
    details_ar: 'فوطة مريحة بحجم كبير، مناسبة للبحر والمسبح والسفر.',
    details_fr: 'Grand format confortable, facile a transporter et agreable au toucher.',
    image_url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=85',
    gallery_urls: ['https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=85'],
    price: 199,
    promo_price: 159,
    stock: 18,
    active: true
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    name_ar: 'حقيبة صيفية',
    name_fr: "Sac d'ete",
    description_ar: 'عملية للبحر والسفر والخروجات.',
    description_fr: 'Pratique pour plage, voyage et sorties.',
    details_ar: 'حجم مناسب، ستايل صيفي، ومكان كاف للمنتجات اليومية.',
    details_fr: 'Un sac pratique avec une allure estivale premium.',
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85',
    gallery_urls: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85'],
    price: 249,
    promo_price: null,
    stock: 12,
    active: true
  }
];

export const fallbackPacks: Pack[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    title_ar: 'الباك الصيفي الكامل',
    title_fr: 'Pack ete complet',
    description_ar: 'كل ما تحتاجه للصيف: واقي شمس، فوطة، وحقيبة.',
    description_fr: 'Le kit essentiel: creme solaire, serviette et sac.',
    details_ar: 'باك مختار لنهار كامل في الشاطئ، بسعر ترويجي واضح وتجربة شراء سريعة.',
    details_fr: 'Un pack premium pour preparer la plage sans achats disperses.',
    image_url: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1100&q=85',
    gallery_urls: ['https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1100&q=85'],
    promo_price: 399,
    active: true,
    pack_products: [
      { id: '30000000-0000-0000-0000-000000000001', pack_id: '20000000-0000-0000-0000-000000000001', product_id: '10000000-0000-0000-0000-000000000001', quantity: 1, product: fallbackProducts[0] },
      { id: '30000000-0000-0000-0000-000000000002', pack_id: '20000000-0000-0000-0000-000000000001', product_id: '10000000-0000-0000-0000-000000000002', quantity: 1, product: fallbackProducts[1] },
      { id: '30000000-0000-0000-0000-000000000003', pack_id: '20000000-0000-0000-0000-000000000001', product_id: '10000000-0000-0000-0000-000000000003', quantity: 1, product: fallbackProducts[2] }
    ]
  }
];
