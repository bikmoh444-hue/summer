'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/storage';
import { activePrice, formatMad, packActivePrice, packName, packOriginalPrice, productName } from '@/lib/pricing';
import type { Pack, Product } from '@/lib/types';

type PackLine = { product_id: string; quantity: number };

const emptyForm = {
  title_ar: '',
  title_fr: '',
  description_ar: '',
  description_fr: '',
  details_ar: '',
  details_fr: '',
  image_url: '',
  gallery_urls: [] as string[],
  promo_price: '',
  active: true,
  products: [] as PackLine[]
};

export default function AdminPacksPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Pack | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  async function load() {
    if (!supabase) return;
    const [packResult, productResult] = await Promise.all([
      supabase.from('packs').select('*, pack_products(*, product:products(*))').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('created_at', { ascending: false })
    ]);
    setPacks((packResult.data ?? []) as Pack[]);
    setProducts((productResult.data ?? []) as Product[]);
  }

  useEffect(() => { load(); }, []);

  const calculatedOriginal = form.products.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.product_id);
    return sum + (product ? activePrice(product) * line.quantity : 0);
  }, 0);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(pack: Pack) {
    setEditing(pack);
    setForm({
      title_ar: pack.title_ar,
      title_fr: pack.title_fr,
      description_ar: pack.description_ar,
      description_fr: pack.description_fr,
      details_ar: pack.details_ar,
      details_fr: pack.details_fr,
      image_url: pack.image_url,
      gallery_urls: pack.gallery_urls ?? [],
      promo_price: pack.promo_price ? String(pack.promo_price) : '',
      active: pack.active,
      products: (pack.pack_products ?? []).map((entry) => ({ product_id: entry.product_id, quantity: entry.quantity }))
    });
    setShowModal(true);
  }

  function setLine(product_id: string, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      products: checked
        ? [...prev.products, { product_id, quantity: 1 }]
        : prev.products.filter((entry) => entry.product_id !== product_id)
    }));
  }

  function setQuantity(product_id: string, quantity: number) {
    setForm((prev) => ({ ...prev, products: prev.products.map((entry) => entry.product_id === product_id ? { ...entry, quantity: Math.max(1, quantity) } : entry) }));
  }

  async function uploadMain(file?: File) {
    if (!file || !supabase) return;
    const url = await uploadImage(supabase, 'packs', file, 'main');
    setForm((prev) => ({ ...prev, image_url: url }));
  }

  async function uploadGallery(files?: FileList | null) {
    if (!files || !supabase) return;
    const urls = await Promise.all(Array.from(files).map((file) => uploadImage(supabase, 'packs', file, 'gallery')));
    setForm((prev) => ({ ...prev, gallery_urls: [...prev.gallery_urls, ...urls] }));
  }

  async function save() {
    if (!supabase) return;
    setSaving(true);
    const payload = {
      title_ar: form.title_ar,
      title_fr: form.title_fr,
      description_ar: form.description_ar,
      description_fr: form.description_fr,
      details_ar: form.details_ar,
      details_fr: form.details_fr,
      image_url: form.image_url,
      gallery_urls: form.gallery_urls,
      promo_price: form.promo_price ? Number(form.promo_price) : null,
      active: form.active
    };
    const { data: savedPack } = editing
      ? await supabase.from('packs').update(payload).eq('id', editing.id).select('id').single()
      : await supabase.from('packs').insert(payload).select('id').single();

    if (savedPack) {
      await supabase.from('pack_products').delete().eq('pack_id', savedPack.id);
      if (form.products.length) {
        await supabase.from('pack_products').insert(form.products.map((entry) => ({ pack_id: savedPack.id, product_id: entry.product_id, quantity: entry.quantity })));
      }
    }
    setSaving(false);
    setShowModal(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce pack ?') || !supabase) return;
    await supabase.from('packs').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black">Packs</h1>
        <button onClick={openNew} className="btn-coral text-sm">Ajouter</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {packs.map((pack) => (
          <article key={pack.id} className="overflow-hidden rounded-2xl border border-white/15 bg-white/10">
            <div className="relative h-44">
              <Image src={pack.image_url || '/beach-summer.png'} alt={packName(pack)} fill sizes="360px" loading="lazy" quality={65} className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-black text-primary">{pack.title_fr}</h3>
              <p dir="rtl" className="mt-1 text-sm text-white/70">{pack.title_ar}</p>
              <div className="mt-3 flex items-center gap-2">
                <strong>{formatMad(packActivePrice(pack))}</strong>
                <span className="text-sm text-white/50 line-through">{formatMad(packOriginalPrice(pack))}</span>
              </div>
              <p className="mt-1 text-sm text-white/60">{pack.pack_products?.length ?? 0} produits - {pack.active ? 'Actif' : 'Inactif'}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => openEdit(pack)} className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold">Modifier</button>
                <button onClick={() => remove(pack.id)} className="rounded-full bg-red-500/25 px-4 py-2 text-xs font-bold text-red-100">Supprimer</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? 'Modifier le pack' : 'Ajouter un pack'} onClose={() => setShowModal(false)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Titre AR" value={form.title_ar} onChange={(value) => setForm({ ...form, title_ar: value })} rtl />
            <Input label="Titre FR" value={form.title_fr} onChange={(value) => setForm({ ...form, title_fr: value })} />
            <Textarea label="Description AR" value={form.description_ar} onChange={(value) => setForm({ ...form, description_ar: value })} rtl />
            <Textarea label="Description FR" value={form.description_fr} onChange={(value) => setForm({ ...form, description_fr: value })} />
            <Textarea label="Details AR" value={form.details_ar} onChange={(value) => setForm({ ...form, details_ar: value })} rtl />
            <Textarea label="Details FR" value={form.details_fr} onChange={(value) => setForm({ ...form, details_fr: value })} />
            <Input label="Prix promo" type="number" value={form.promo_price} onChange={(value) => setForm({ ...form, promo_price: value })} />
            <label className="flex items-center gap-2 pt-7 text-sm font-bold"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Actif</label>
          </div>

          <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-black">Produits inclus</h3>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm">Original: {formatMad(calculatedOriginal)}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {products.map((product) => {
                const line = form.products.find((entry) => entry.product_id === product.id);
                return (
                  <div key={product.id} className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                    <input type="checkbox" checked={Boolean(line)} onChange={(e) => setLine(product.id, e.target.checked)} />
                    <span className="min-w-0 flex-1 truncate text-sm font-bold">{productName(product)} - {formatMad(activePrice(product))}</span>
                    <input type="number" min={1} value={line?.quantity ?? 1} onChange={(e) => setQuantity(product.id, Number(e.target.value))} disabled={!line} className="w-16 rounded-lg bg-white/15 px-2 py-1 text-sm" />
                  </div>
                );
              })}
            </div>
          </div>

          <UploadBlock image={form.image_url} onMain={uploadMain} onGallery={uploadGallery} gallery={form.gallery_urls} onRemoveGallery={(url) => setForm({ ...form, gallery_urls: form.gallery_urls.filter((item) => item !== url) })} />
          <div className="mt-6 flex gap-3">
            <button onClick={() => setShowModal(false)} className="flex-1 rounded-full bg-white/10 py-3 font-bold">Annuler</button>
            <button onClick={save} disabled={saving} className="btn-coral flex-1">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}><div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#1a3a4a] p-6" onClick={(e) => e.stopPropagation()}><h2 className="mb-5 text-2xl font-black text-primary">{title}</h2>{children}</div></div>;
}

function Input({ label, value, onChange, type = 'text', rtl = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; rtl?: boolean }) {
  return <label className="block text-sm font-bold text-white/75">{label}<input dir={rtl ? 'rtl' : 'ltr'} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="form-input mt-2" /></label>;
}

function Textarea({ label, value, onChange, rtl = false }: { label: string; value: string; onChange: (value: string) => void; rtl?: boolean }) {
  return <label className="block text-sm font-bold text-white/75">{label}<textarea dir={rtl ? 'rtl' : 'ltr'} value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="form-input mt-2 resize-none" /></label>;
}

function UploadBlock({ image, gallery, onMain, onGallery, onRemoveGallery }: { image: string; gallery: string[]; onMain: (file?: File) => void; onGallery: (files?: FileList | null) => void; onRemoveGallery: (url: string) => void }) {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <label className="block text-sm font-bold text-white/75">Image principale<input type="file" accept="image/*" onChange={(e) => onMain(e.target.files?.[0])} className="form-input mt-2" /></label>
      <label className="block text-sm font-bold text-white/75">Galerie<input type="file" accept="image/*" multiple onChange={(e) => onGallery(e.target.files)} className="form-input mt-2" /></label>
      {image && <div className="relative h-36 overflow-hidden rounded-xl"><Image src={image} alt="Preview" fill sizes="320px" loading="lazy" quality={65} className="object-cover" /></div>}
      <div className="grid grid-cols-4 gap-2">{gallery.map((url) => <button key={url} onClick={() => onRemoveGallery(url)} className="relative aspect-square overflow-hidden rounded-lg"><Image src={url} alt="Gallery" fill sizes="80px" loading="lazy" quality={55} className="object-cover" /></button>)}</div>
    </div>
  );
}
