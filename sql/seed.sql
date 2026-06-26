insert into public.landing_settings (
  id, logo_text_ar, logo_text_fr, logo_image_url, hero_title_ar, hero_title_fr,
  hero_subtitle_ar, hero_subtitle_fr, background_image_url, primary_color, secondary_color,
  promo_text_ar, promo_text_fr, footer_text_ar, footer_text_fr, whatsapp_number, content_ar, content_fr
) values (
  '00000000-0000-0000-0000-000000000001',
  ' صيف',
  ' Summer',
  '',
  'لمسة صيف فاخرة لكل خرجات البحر',
  'Votre routine plage, plus belle et plus simple',
  'منتجات صيفية مختارة بعناية، عروض باكات، وتوصيل سريع داخل المغرب.',
  'Des essentiels solaires, sacs, serviettes et packs premium avec livraison rapide.',
  '/beach-summer.png',
  '#0e9fb8',
  '#ff6f61',
  'عرض محدود على باك الصيف الكامل',
  'Offre limitee sur le pack ete complet',
  'كوزميتيك صيف - طلبات بسيطة وتوصيل 45 درهم.',
  'Cosmitiq Summer - commandes simples, livraison 45 MAD.',
  '+212600000000',
  '{
    "nav_packs": "الباكات",
    "nav_products": "المنتجات",
    "nav_contact": "تواصل معنا",
    "shop_now": "تسوق الآن",
    "view_packs": "شاهد الباكات",
    "view_details": "عرض التفاصيل",
    "add_to_cart": "أضف للسلة",
    "order_now": "اطلب الآن",
    "products_title": "منتجات مختارة بعناية",
    "packs_title": "باكات صيفية جاهزة",
    "subtotal": "المجموع الفرعي",
    "delivery": "التوصيل",
    "total": "المجموع النهائي",
    "checkout_title": "إتمام الطلب",
    "full_name": "الاسم الكامل",
    "phone": "الهاتف",
    "address": "العنوان",
    "city": "المدينة",
    "confirm_order": "تأكيد الطلب"
  }'::jsonb,
  '{
    "nav_packs": "Packs",
    "nav_products": "Produits",
    "nav_contact": "Contact",
    "shop_now": "Acheter maintenant",
    "view_packs": "Voir les packs",
    "view_details": "Voir details",
    "add_to_cart": "Ajouter au panier",
    "order_now": "Commander",
    "products_title": "Produits soigneusement choisis",
    "packs_title": "Packs prets pour la plage",
    "subtotal": "Sous-total",
    "delivery": "Livraison",
    "total": "Total final",
    "checkout_title": "Finaliser la commande",
    "full_name": "Nom complet",
    "phone": "Telephone",
    "address": "Adresse",
    "city": "Ville",
    "confirm_order": "Confirmer la commande"
  }'::jsonb
) on conflict (id) do update set
  logo_text_ar = excluded.logo_text_ar,
  logo_text_fr = excluded.logo_text_fr,
  logo_image_url = excluded.logo_image_url,
  hero_title_ar = excluded.hero_title_ar,
  hero_title_fr = excluded.hero_title_fr,
  hero_subtitle_ar = excluded.hero_subtitle_ar,
  hero_subtitle_fr = excluded.hero_subtitle_fr,
  background_image_url = excluded.background_image_url,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  promo_text_ar = excluded.promo_text_ar,
  promo_text_fr = excluded.promo_text_fr,
  footer_text_ar = excluded.footer_text_ar,
  footer_text_fr = excluded.footer_text_fr,
  whatsapp_number = excluded.whatsapp_number,
  content_ar = excluded.content_ar,
  content_fr = excluded.content_fr;

insert into public.products (
  id, name_ar, name_fr, description_ar, description_fr, details_ar, details_fr,
  image_url, gallery_urls, price, promo_price, stock, active
) values
  ('10000000-0000-0000-0000-000000000001', 'واقي الشمس SPF50', 'Creme solaire SPF50', 'حماية قوية للبشرة في البحر والشمس.', 'Protection haute pour les journees plage.', 'تركيبة خفيفة مناسبة للاستعمال اليومي، مقاومة للحرارة ومريحة فوق البشرة.', 'Texture legere, ideale pour la plage et les sorties en plein soleil.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85', array['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85'], 149, 119, 24, true),
  ('10000000-0000-0000-0000-000000000002', 'فوطة شاطئ كبيرة', 'Serviette de plage', 'ناعمة، خفيفة، وسريعة النشفان.', 'Grand format doux et sechage rapide.', 'فوطة مريحة بحجم كبير، مناسبة للبحر والمسبح والسفر.', 'Grand format confortable, facile a transporter et agreable au toucher.', 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=85', array['https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=85'], 199, 159, 18, true),
  ('10000000-0000-0000-0000-000000000003', 'حقيبة صيفية', 'Sac d''ete', 'عملية للبحر والسفر والخروجات.', 'Pratique pour plage, voyage et sorties.', 'حجم مناسب، ستايل صيفي، ومكان كاف للمنتجات اليومية.', 'Un sac pratique avec une allure estivale premium.', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85', array['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85'], 249, null, 12, true)
on conflict (id) do update set
  name_ar = excluded.name_ar,
  name_fr = excluded.name_fr,
  description_ar = excluded.description_ar,
  description_fr = excluded.description_fr,
  details_ar = excluded.details_ar,
  details_fr = excluded.details_fr,
  image_url = excluded.image_url,
  gallery_urls = excluded.gallery_urls,
  price = excluded.price,
  promo_price = excluded.promo_price,
  stock = excluded.stock,
  active = excluded.active;

insert into public.packs (
  id, title_ar, title_fr, description_ar, description_fr, details_ar, details_fr,
  image_url, gallery_urls, promo_price, active
) values (
  '20000000-0000-0000-0000-000000000001',
  'الباك الصيفي الكامل',
  'Pack ete complet',
  'كل ما تحتاجه للصيف: واقي شمس، فوطة، وحقيبة.',
  'Le kit essentiel: creme solaire, serviette et sac.',
  'باك مختار لنهار كامل في الشاطئ، بسعر ترويجي واضح وتجربة شراء سريعة.',
  'Un pack premium pour preparer la plage sans achats disperses.',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1100&q=85',
  array['https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1100&q=85'],
  399,
  true
) on conflict (id) do update set
  title_ar = excluded.title_ar,
  title_fr = excluded.title_fr,
  description_ar = excluded.description_ar,
  description_fr = excluded.description_fr,
  details_ar = excluded.details_ar,
  details_fr = excluded.details_fr,
  image_url = excluded.image_url,
  gallery_urls = excluded.gallery_urls,
  promo_price = excluded.promo_price,
  active = excluded.active;

insert into public.pack_products (pack_id, product_id, quantity) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 1),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 1),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 1)
on conflict (pack_id, product_id) do update set quantity = excluded.quantity;
