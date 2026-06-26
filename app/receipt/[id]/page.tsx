import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatMad } from '@/lib/pricing';
import type { Order } from '@/lib/types';

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  let order: Order | null = null;

  if (supabase) {
    const { data } = await supabase.from('orders').select('*, order_items(*)').eq('id', id).maybeSingle();
    order = data as Order | null;
  }

  return (
    <main className="summer-site min-h-screen text-white" style={{ '--site-bg': "url('/beach-summer.png')" } as React.CSSProperties}>
      <div className="summer-overlay mobile-page-pad grid min-h-screen place-items-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-2xl overflow-hidden py-10">
          {order ? (
            <div className="space-y-5">
              <div className="text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-green-500">
                  <Check className="h-9 w-9" />
                </div>
                <h1 className="text-3xl font-black">Commande confirmee</h1>
                <p className="mt-2 font-mono text-primary">#{order.order_number}</p>
              </div>

              <section className="card-glass max-w-full overflow-hidden p-5">
                <p className="text-center text-white/80">On vous contactera au <strong>{order.phone}</strong> pour confirmer.</p>
                <p className="mt-1 text-center text-white/70">Paiement a la livraison</p>
              </section>

              <section className="card-glass max-w-full overflow-hidden p-5">
                <h2 className="mb-4 text-2xl font-black">Resume de la commande</h2>
                <div className="space-y-3">
                  {(order.order_items ?? []).map((item) => (
                    <div key={item.id} className="flex min-w-0 flex-wrap items-center gap-3 sm:flex-nowrap">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        <Image src={item.image_snapshot || '/beach-summer.png'} alt={item.name_snapshot} fill sizes="48px" loading="lazy" quality={60} className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-semibold">{item.name_snapshot}</p>
                        <p className="text-sm text-white/60">x{item.quantity}</p>
                      </div>
                      <span className="shrink-0 font-bold text-primary">{formatMad(Number(item.total_price))}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-2 border-t border-white/15 pt-4 text-sm">
                  <Row label="Sous-total" value={formatMad(Number(order.subtotal))} />
                  <Row label="Livraison" value={formatMad(Number(order.delivery_fee))} />
                  <div className="flex flex-wrap items-end justify-between gap-2 pt-2">
                    <span className="font-black">Total</span>
                    <span className="price-text text-[30px] leading-none">{formatMad(Number(order.total))}</span>
                  </div>
                </div>
              </section>

              <section className="card-glass max-w-full overflow-hidden p-5">
                <h2 className="mb-3 text-2xl font-black">Informations client</h2>
                <div className="space-y-1 text-sm text-white/80">
                  <p>{order.full_name}</p>
                  <p>{order.address}, {order.city}</p>
                  <p>{order.phone}</p>
                </div>
              </section>

              <div className="text-center">
                <Link href="/" className="btn-coral inline-flex">Retour boutique</Link>
              </div>
            </div>
          ) : (
            <div className="card-glass p-8 text-center">
              <h1 className="mb-4 text-3xl font-black">Commande introuvable</h1>
              <Link href="/" className="btn-coral inline-flex">Retour boutique</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/70">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
