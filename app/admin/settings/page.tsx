'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/storage';
import { fallbackSettings } from '@/lib/fallback-data';
import type { LandingSettings, SiteContent } from '@/lib/types';

const contentKeys = [
  ['nav_packs', 'Navbar packs'],
  ['nav_products', 'Navbar produits'],
  ['nav_contact', 'Navbar contact'],
  ['shop_now', 'Bouton acheter'],
  ['view_packs', 'Bouton packs'],
  ['view_details', 'Bouton details'],
  ['add_to_cart', 'Bouton panier'],
  ['order_now', 'Bouton commander'],
  ['products_title', 'Titre produits'],
  ['packs_title', 'Titre packs'],
  ['subtotal', 'Checkout sous-total'],
  ['delivery', 'Checkout livraison'],
  ['total', 'Checkout total'],
  ['checkout_title', 'Checkout titre'],
  ['full_name', 'Checkout nom'],
  ['phone', 'Checkout telephone'],
  ['address', 'Checkout adresse'],
  ['city', 'Checkout ville'],
  ['confirm_order', 'Checkout confirmation']
] as const;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<LandingSettings>(fallbackSettings);
  const [saved, setSaved] = useState('');
  const [saving, setSaving] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('landing_settings').select('*').limit(1).maybeSingle().then(({ data }) => {
      if (data) setSettings({ ...fallbackSettings, ...(data as LandingSettings) });
    });
  }, [supabase]);

  function update<K extends keyof LandingSettings>(key: K, value: LandingSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function updateContent(lang: 'content_ar' | 'content_fr', key: string, value: string) {
    setSettings((prev) => ({ ...prev, [lang]: { ...prev[lang], [key]: value } as SiteContent }));
  }

  async function uploadAsset(kind: 'logo_image_url' | 'background_image_url', file?: File) {
    if (!file || !supabase) return;
    const url = await uploadImage(supabase, 'site-assets', file, kind === 'logo_image_url' ? 'logo' : 'backgrounds');
    update(kind, url);
  }

  async function save() {
    if (!supabase) return;
    setSaving(true);
    await supabase.from('landing_settings').upsert(settings).eq('id', settings.id);
    setSaving(false);
    setSaved('Parametres enregistres.');
    setTimeout(() => setSaved(''), 2500);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black">Parametres</h1>
        <button onClick={save} disabled={saving} className="btn-coral">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
      </div>
      {saved && <p className="mb-4 rounded-xl bg-green-500/15 p-3 text-sm text-green-200">{saved}</p>}

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <Panel title="Identite et hero">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Logo texte AR" value={settings.logo_text_ar} onChange={(value) => update('logo_text_ar', value)} rtl />
              <Input label="Logo texte FR" value={settings.logo_text_fr} onChange={(value) => update('logo_text_fr', value)} />
              <Input label="Titre hero AR" value={settings.hero_title_ar} onChange={(value) => update('hero_title_ar', value)} rtl />
              <Input label="Titre hero FR" value={settings.hero_title_fr} onChange={(value) => update('hero_title_fr', value)} />
              <Textarea label="Sous-titre AR" value={settings.hero_subtitle_ar} onChange={(value) => update('hero_subtitle_ar', value)} rtl />
              <Textarea label="Sous-titre FR" value={settings.hero_subtitle_fr} onChange={(value) => update('hero_subtitle_fr', value)} />
              <Input label="Promo AR" value={settings.promo_text_ar} onChange={(value) => update('promo_text_ar', value)} rtl />
              <Input label="Promo FR" value={settings.promo_text_fr} onChange={(value) => update('promo_text_fr', value)} />
              <Textarea label="Footer AR" value={settings.footer_text_ar} onChange={(value) => update('footer_text_ar', value)} rtl />
              <Textarea label="Footer FR" value={settings.footer_text_fr} onChange={(value) => update('footer_text_fr', value)} />
              <Input label="WhatsApp" value={settings.whatsapp_number} onChange={(value) => update('whatsapp_number', value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Couleur primaire" type="color" value={settings.primary_color} onChange={(value) => update('primary_color', value)} />
                <Input label="Couleur secondaire" type="color" value={settings.secondary_color} onChange={(value) => update('secondary_color', value)} />
              </div>
            </div>
          </Panel>

          <Panel title="Textes interface AR/FR">
            <div className="grid gap-4 md:grid-cols-2">
              {contentKeys.map(([key, label]) => (
                <div key={key} className="grid gap-2 rounded-xl bg-white/5 p-3">
                  <p className="text-sm font-black text-white/70">{label}</p>
                  <input dir="rtl" value={settings.content_ar[key] ?? ''} onChange={(e) => updateContent('content_ar', key, e.target.value)} className="form-input" placeholder="AR" />
                  <input value={settings.content_fr[key] ?? ''} onChange={(e) => updateContent('content_fr', key, e.target.value)} className="form-input" placeholder="FR" />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Images">
            <label className="block text-sm font-bold text-white/75">Logo image<input type="file" accept="image/*" onChange={(e) => uploadAsset('logo_image_url', e.target.files?.[0])} className="form-input mt-2" /></label>
            {settings.logo_image_url && <Preview src={settings.logo_image_url} />}
            <label className="mt-4 block text-sm font-bold text-white/75">Background principal<input type="file" accept="image/*" onChange={(e) => uploadAsset('background_image_url', e.target.files?.[0])} className="form-input mt-2" /></label>
            {settings.background_image_url && <Preview src={settings.background_image_url} large />}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-white/15 bg-white/10 p-5"><h2 className="mb-4 text-xl font-black text-primary">{title}</h2>{children}</section>;
}

function Input({ label, value, onChange, type = 'text', rtl = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; rtl?: boolean }) {
  return <label className="block text-sm font-bold text-white/75">{label}<input dir={rtl ? 'rtl' : 'ltr'} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="form-input mt-2 h-12" /></label>;
}

function Textarea({ label, value, onChange, rtl = false }: { label: string; value: string; onChange: (value: string) => void; rtl?: boolean }) {
  return <label className="block text-sm font-bold text-white/75">{label}<textarea dir={rtl ? 'rtl' : 'ltr'} value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="form-input mt-2 resize-none" /></label>;
}

function Preview({ src, large = false }: { src: string; large?: boolean }) {
  return <div className={`relative mt-3 overflow-hidden rounded-xl ${large ? 'h-48' : 'h-24'}`}><Image src={src} alt="Preview" fill sizes="420px" loading="lazy" quality={65} className="object-cover" /></div>;
}
