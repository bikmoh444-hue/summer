'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, MapPin, Phone, UserRound } from 'lucide-react';
import { useCart, DELIVERY_FEE_CONST } from '@/lib/cart';
import { formatMad } from '@/lib/pricing';
import { createClient } from '@/lib/supabase/client';

type FormData = {
  full_name: string;
  phone: string;
  address: string;
  city: string;
};

type FormErrors = Partial<FormData> & { submit?: string };

export function CheckoutClient() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clearCart);
  const [form, setForm] = useState<FormData>({ full_name: '', phone: '', address: '', city: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const delivery = DELIVERY_FEE_CONST;
  const total = subtotal + delivery;

  function validate() {
    const nextErrors: FormErrors = {};
    if (form.full_name.trim().length < 3) nextErrors.full_name = 'Nom complet requis';
    if (!/^(0|\+212)[5-7][0-9]{8}$/.test(form.phone.trim())) nextErrors.phone = 'Telephone invalide';
    if (form.address.trim().length < 5) nextErrors.address = 'Adresse requise';
    if (form.city.trim().length < 2) nextErrors.city = 'Ville requise';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) {
      router.push('/');
      return;
    }
    if (!validate()) return;
    if (loading) return;
    setLoading(true);

    if (!supabase) {
      setErrors({ submit: 'Connexion Supabase manquante.' });
      setLoading(false);
      return;
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        subtotal,
        delivery_fee: delivery,
        total,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error || !order) {
      setErrors({ submit: 'Erreur lors de la commande. Reessayez.' });
      setLoading(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      item_type: item.type,
      product_id: item.type === 'product' ? item.id : null,
      pack_id: item.type === 'pack' ? item.id : null,
      name_snapshot: item.name,
      image_snapshot: item.image,
      unit_price: item.price,
      quantity: item.quantity,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    setLoading(false);

    if (itemsError) {
      setErrors({ submit: 'Commande creee, mais les articles ne sont pas enregistres.' });
      return;
    }

    clearCart();
    router.push(`/receipt/${order.id}`);
  }

  if (!items.length) {
    return (
      <main className="summer-site min-h-screen text-white" style={{ '--site-bg': "url('/beach-summer.png')" } as React.CSSProperties}>
        <div className="summer-overlay grid min-h-screen place-items-center px-4">
          <div className="card-glass max-w-md p-8 text-center">
            <h1 className="text-3xl font-black">Votre panier est vide</h1>
            <Link href="/" className="btn-coral mt-5 inline-flex">Retour boutique</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="summer-site min-h-screen text-white" style={{ '--site-bg': "url('/beach-summer.png')" } as React.CSSProperties}>
      <div className="summer-overlay min-h-screen px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link href="/" className="font-cocktail text-2xl text-primary"> Summer</Link>
            <Link href="/cart" className="btn-outline-white px-4 py-2 text-sm">Panier</Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
            <form onSubmit={handleSubmit} className="card-glass p-5 md:p-7">
              <h1 className="mb-6 text-3xl font-black">Finaliser la commande</h1>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field icon={<UserRound className="h-4 w-4" />} error={errors.full_name}>
                  <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Nom complet" className="form-input" />
                </Field>
                <Field icon={<Phone className="h-4 w-4" />} error={errors.phone}>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telephone" className="form-input" />
                </Field>
                <Field icon={<MapPin className="h-4 w-4" />} error={errors.address}>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Adresse" className="form-input" />
                </Field>
                <Field icon={<MapPin className="h-4 w-4" />} error={errors.city}>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Ville" className="form-input" />
                </Field>
              </div>

              <div className="mt-6 rounded-2xl border border-white/20 bg-white/12 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-sun text-ink"><CreditCard className="h-5 w-5" /></span>
                  <div>
                    <p className="font-black">Paiement a la livraison</p>
                    <p className="text-sm text-white/70">Vous payez uniquement apres reception.</p>
                  </div>
                </div>
              </div>

              {errors.submit && <p className="mt-4 rounded-xl bg-red-500/20 p-3 text-sm text-red-100">{errors.submit}</p>}
              <button type="submit" disabled={loading} className="btn-coral mt-6 w-full py-4 text-base disabled:opacity-60">
                {loading ? 'Traitement...' : 'Confirmer la commande'}
              </button>
            </form>

            <aside className="card-glass h-fit p-5">
              <h2 className="mb-4 text-2xl font-black">Resume</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <Image src={item.image || '/beach-summer.png'} alt={item.name} fill sizes="56px" loading="lazy" quality={60} className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{item.name}</p>
                      <p className="text-sm text-white/65">x{item.quantity}</p>
                    </div>
                    <strong>{formatMad(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 border-t border-white/15 pt-5 text-sm">
                <Row label="Sous-total" value={formatMad(subtotal)} />
                <Row label="Livraison" value={formatMad(delivery)} />
                <Row label="Paiement" value="Paiement a la livraison" />
                <div className="flex items-end justify-between pt-3 text-lg">
                  <span className="font-black">Total</span>
                  <span className="price-text text-3xl">{formatMad(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ children, icon, error }: { children: React.ReactNode; icon: React.ReactNode; error?: string }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-white/80">{icon}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-coral">{error}</span>}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-white/70">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}
