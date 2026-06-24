import { createClient } from '@/lib/supabase/server';
import { fallbackPacks, fallbackProducts, fallbackSettings } from '@/lib/fallback-data';
import type { LandingSettings, Pack, Product } from '@/lib/types';

const packSelect = '*, pack_products(*, product:products(*))';

export async function getLandingSettings() {
  const supabase = await createClient();
  if (!supabase) return fallbackSettings;
  const { data } = await supabase.from('landing_settings').select('*').limit(1).maybeSingle();
  return (data ?? fallbackSettings) as LandingSettings;
}

export async function getProducts(includeInactive = false) {
  const supabase = await createClient();
  if (!supabase) return fallbackProducts as Product[];
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });
  if (!includeInactive) query = query.eq('active', true);
  const { data } = await query;
  return (data?.length ? data : fallbackProducts) as Product[];
}

export async function getProduct(id: string) {
  const supabase = await createClient();
  if (!supabase) return fallbackProducts.find((product) => product.id === id) ?? null;
  const { data } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  return data as Product | null;
}

export async function getPacks(includeInactive = false) {
  const supabase = await createClient();
  if (!supabase) return fallbackPacks as Pack[];
  let query = supabase.from('packs').select(packSelect).order('created_at', { ascending: false });
  if (!includeInactive) query = query.eq('active', true);
  const { data } = await query;
  return (data?.length ? data : fallbackPacks) as Pack[];
}

export async function getPackWithProducts(id: string) {
  const supabase = await createClient();
  if (!supabase) return (fallbackPacks as Pack[]).find((pack) => pack.id === id) ?? null;
  const { data } = await supabase.from('packs').select(packSelect).eq('id', id).maybeSingle();
  return data as Pack | null;
}

export async function getStoreData() {
  const [settings, products, packs] = await Promise.all([
    getLandingSettings(),
    getProducts(false),
    getPacks(false)
  ]);
  return { settings, products, packs };
}
