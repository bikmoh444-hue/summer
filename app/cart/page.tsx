'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart, DELIVERY_FEE_CONST } from '@/lib/cart';
import { formatMad } from '@/lib/pricing';

export default function CartPage() {
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = DELIVERY_FEE_CONST;

  if (items.length === 0) {
    return (
      <main className="summer-site min-h-screen text-white" style={{ '--site-bg': "url('/beach-summer.png')" } as React.CSSProperties}>
        <div className="summer-overlay mobile-page-pad grid min-h-screen place-items-center px-4 py-20">
          <div className="card-glass w-full max-w-md p-8 text-center sm:p-10">
            <p className="text-5xl mb-4">🛒</p>
            <h1 className="font-cocktail text-3xl mb-2">Panier vide</h1>
            <p className="text-white/60 mb-6">Votre panier est vide. Commencez vos achats !</p>
            <Link href="/" className="btn-coral inline-flex">Continuer les achats</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="summer-site min-h-screen text-white" style={{ '--site-bg': "url('/beach-summer.png')" } as React.CSSProperties}>
      <div className="summer-overlay mobile-page-pad min-h-screen px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden py-8">
          <h1 className="font-cocktail mb-8 text-4xl">Mon Panier</h1>
          <div className="grid max-w-full grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div key={item.id} className="flex max-w-full flex-wrap items-center gap-3 overflow-hidden rounded-2xl border border-white/20 bg-white/18 p-3 shadow-glass backdrop-blur-md sm:flex-nowrap sm:gap-4 sm:p-4">
                  <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-xl">
                    <Image src={item.image || '/beach-summer.png'} alt={item.name} fill sizes="70px" loading="lazy" quality={60} className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 basis-[calc(100%-86px)] sm:basis-auto">
                    <p className="line-clamp-2 max-w-full font-semibold leading-tight text-white">{item.name}</p>
                    <span className="inline-flex rounded-full bg-coral/20 text-coral px-2.5 py-0.5 text-xs font-semibold mt-1">
                      {item.type === 'pack' ? 'Pack' : 'Produit'}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 basis-full items-center justify-between gap-3 sm:basis-auto sm:flex-col sm:items-end sm:text-right">
                    <p className="font-cocktail shrink-0 text-lg text-primary">{formatMad(item.price)}</p>
                    <div className="mt-0 flex shrink-0 items-center justify-end gap-2 sm:mt-2">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-full bg-coral text-white">
                        {item.quantity === 1 ? <Trash2 className="h-4 w-4 text-red-300" /> : <Minus className="h-4 w-4" />}
                      </button>
                      <span className="w-6 text-center text-sm font-black">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-coral text-white">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-8 max-w-full overflow-hidden rounded-2xl border border-white/20 bg-white/18 p-5 shadow-glass backdrop-blur-md sm:p-6">
                <h2 className="font-cocktail text-2xl text-primary mb-4">Résumé</h2>
                <div className="space-y-3 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex min-w-0 justify-between gap-3">
                      <span className="min-w-0 truncate text-white/70">{item.name} x{item.quantity}</span>
                      <span className="shrink-0 font-semibold text-white">{formatMad(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <hr className="border-white/15 my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Sous-total</span>
                    <strong>{formatMad(total)}</strong>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Livraison</span>
                    <strong>{formatMad(delivery)}</strong>
                  </div>
                  <div className="flex flex-wrap items-end justify-between gap-2 pt-2">
                    <span className="font-black text-white">TOTAL</span>
                    <span className="font-cocktail text-[30px] leading-none text-primary">{formatMad(total + delivery)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 text-green-400 px-3 py-1.5 text-xs font-semibold">
                    💳 Paiement à la livraison
                  </span>
                </div>
                <Link href="/checkout" className="btn-coral mt-5 flex w-full justify-center text-base font-semibold sm:text-lg">
                  Confirmer la commande →
                </Link>
                <Link href="/" className="mt-4 block text-center text-sm text-white/70 hover:text-white">
                  Continuer les achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
