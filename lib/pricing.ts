import type { Lang, Pack, Product } from '@/lib/types';

export function activePrice(item: Product | { promo_price: number | null; price: number }) {
  return item.promo_price && item.promo_price > 0 ? Number(item.promo_price) : Number(item.price);
}

export function productName(product: Product, lang: Lang = 'fr') {
  return lang === 'ar' ? product.name_ar : product.name_fr;
}

export function productDescription(product: Product, lang: Lang = 'fr') {
  return lang === 'ar' ? product.description_ar : product.description_fr;
}

export function productDetails(product: Product, lang: Lang = 'fr') {
  return lang === 'ar' ? product.details_ar : product.details_fr;
}

export function packName(pack: Pack, lang: Lang = 'fr') {
  return lang === 'ar' ? pack.title_ar : pack.title_fr;
}

export function packDescription(pack: Pack, lang: Lang = 'fr') {
  return lang === 'ar' ? pack.description_ar : pack.description_fr;
}

export function packDetails(pack: Pack, lang: Lang = 'fr') {
  return lang === 'ar' ? pack.details_ar : pack.details_fr;
}

export function packOriginalPrice(pack: Pack) {
  return (pack.pack_products ?? []).reduce((sum, entry) => {
    const product = entry.product;
    return sum + (product ? activePrice(product) * entry.quantity : 0);
  }, 0);
}

export function packActivePrice(pack: Pack) {
  return pack.promo_price && pack.promo_price > 0 ? Number(pack.promo_price) : packOriginalPrice(pack);
}

export function formatMad(value: number) {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}
