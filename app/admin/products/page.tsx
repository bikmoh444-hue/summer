'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/storage';
import { activePrice, formatMad, productName } from '@/lib/pricing';
import type { Product } from '@/lib/types';

const emptyForm = {
  name_ar: '',
  name_fr: '',
  description_ar: '',
  description_fr: '',
  details_ar: '',
  details_fr: '',
  image_url: '',
  gallery_urls: [] as string[],
  price: '',
  promo_price: '',
  stock: '0',
  active: true
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  async function load() {
    if (!supabase) return;
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts((data ?? []) as Product[]);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name_ar: product.name_ar,
      name_fr: product.name_fr,
      description_ar: product.description_ar,
      description_fr: product.description_fr,
      details_ar: product.details_ar,
      details_fr: product.details_fr,
      image_url: product.image_url,
      gallery_urls: product.gallery_urls ?? [],
      price: String(product.price),
      promo_price: product.promo_price ? String(product.promo_price) : '',
      stock: String(product.stock),
      active: product.active
    });
    setShowModal(true);
  }

  async function uploadMain(file?: File) {
    if (!file || !supabase) return;
    const url = await uploadImage(supabase, 'products', file, 'main');
    setForm((prev) => ({ ...prev, image_url: url }));
  }

  async function uploadGallery(files?: FileList | null) {
    if (!files || !supabase) return;
    const urls = await Promise.all(Array.from(files).map((file) => uploadImage(supabase, 'products', file, 'gallery')));
    setForm((prev) => ({ ...prev, gallery_urls: [...prev.gallery_urls, ...urls] }));
  }

  async function save() {
    if (!supabase) return;
    setSaving(true);
    const payload = {
      name_ar: form.name_ar,
      name_fr: form.name_fr,
      description_ar: form.description_ar,
      description_fr: form.description_fr,
      details_ar: form.details_ar,
      details_fr: form.details_fr,
      image_url: form.image_url,
      gallery_urls: form.gallery_urls,
      price: Number(form.price) || 0,
      promo_price: form.promo_price ? Number(form.promo_price) : null,
      stock: Number(form.stock) || 0,
      active: form.active
    };
    if (editing) await supabase.from('products').update(payload).eq('id', editing.id);
    else await supabase.from('products').insert(payload);
    setSaving(false);
    setShowModal(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce produit ?') || !supabase) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black">Produits</h1>
        <button onClick={openNew} className="btn-coral text-sm">Ajouter</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="overflow-hidden rounded-2xl border border-white/15 bg-white/10">
            <div className="relative h-44">
              <Image src={product.image_url || '/beach-summer.png'} alt={productName(product)} fill sizes="360px" loading="lazy" quality={65} className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-black text-primary">{product.name_fr}</h3>
              <p dir="rtl" className="mt-1 text-sm text-white/70">{product.name_ar}</p>
              <div className="mt-3 flex items-center gap-2">
                <strong>{formatMad(activePrice(product))}</strong>
                {product.promo_price && <span className="text-sm text-white/50 line-through">{formatMad(product.price)}</span>}
              </div>
              <p className="mt-1 text-sm text-white/60">Stock: {product.stock} - {product.active ? 'Actif' : 'Inactif'}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => openEdit(product)} className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold">Modifier</button>
                <button onClick={() => remove(product.id)} className="rounded-full bg-red-500/25 px-4 py-2 text-xs font-bold text-red-100">Supprimer</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? 'Modifier le produit' : 'Ajouter un produit'} onClose={() => setShowModal(false)}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Nom AR" value={form.name_ar} onChange={(value) => setForm({ ...form, name_ar: value })} rtl />
            <Input label="Nom FR" value={form.name_fr} onChange={(value) => setForm({ ...form, name_fr: value })} />
            <Textarea label="Description AR" value={form.description_ar} onChange={(value) => setForm({ ...form, description_ar: value })} rtl />
            <Textarea label="Description FR" value={form.description_fr} onChange={(value) => setForm({ ...form, description_fr: value })} />
            <Textarea label="Details AR" value={form.details_ar} onChange={(value) => setForm({ ...form, details_ar: value })} rtl />
            <Textarea label="Details FR" value={form.details_fr} onChange={(value) => setForm({ ...form, details_fr: value })} />
            <Input label="Prix" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
            <Input label="Prix promo" type="number" value={form.promo_price} onChange={(value) => setForm({ ...form, promo_price: value })} />
            <Input label="Stock" type="number" value={form.stock} onChange={(value) => setForm({ ...form, stock: value })} />
            <label className="flex items-center gap-2 pt-7 text-sm font-bold"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Actif</label>
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
