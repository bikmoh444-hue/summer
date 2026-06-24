export type Lang = 'fr' | 'ar';

export type SiteContent = Record<string, string>;

export interface LandingSettings {
  id: string;
  logo_text_ar: string;
  logo_text_fr: string;
  logo_image_url: string | null;
  hero_title_ar: string;
  hero_title_fr: string;
  hero_subtitle_ar: string;
  hero_subtitle_fr: string;
  background_image_url: string;
  primary_color: string;
  secondary_color: string;
  promo_text_ar: string;
  promo_text_fr: string;
  footer_text_ar: string;
  footer_text_fr: string;
  whatsapp_number: string;
  content_ar: SiteContent;
  content_fr: SiteContent;
  updated_at?: string;
}

export interface Product {
  id: string;
  name_ar: string;
  name_fr: string;
  description_ar: string;
  description_fr: string;
  details_ar: string;
  details_fr: string;
  image_url: string;
  gallery_urls: string[];
  price: number;
  promo_price: number | null;
  stock: number;
  active: boolean;
  created_at?: string;
}

export interface PackProduct {
  id: string;
  pack_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface Pack {
  id: string;
  title_ar: string;
  title_fr: string;
  description_ar: string;
  description_fr: string;
  details_ar: string;
  details_fr: string;
  image_url: string;
  gallery_urls: string[];
  promo_price: number | null;
  active: boolean;
  created_at?: string;
  pack_products?: PackProduct[];
}

export type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'cancelled';
export type OrderItemType = 'product' | 'pack';

export interface OrderItem {
  id: string;
  order_id: string;
  item_type: OrderItemType;
  product_id: string | null;
  pack_id: string | null;
  name_snapshot: string;
  image_snapshot: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items?: OrderItem[];
}

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: OrderItemType;
};
