'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart, DELIVERY_FEE_CONST } from '@/lib/cart';
import { formatMad } from '@/lib/pricing';

export default function CartPage() {
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = DELIVERY_FEE_CONST;

  if (items.length === 0) {
    return (
      <main className="summer-site min-h-screen px-4 py-20 text-white" style={{ '--site-bg': "url('/beach-summer.png')" } as React.CSSProperties}>
        <div className="summer-overlay grid min-h-[60vh] place-items-center">
          <div className="card-glass max-w-md p-10 text-center">
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
    <main className="summer-site min-h-screen px-4 py-8 text-white" style={{ '--site-bg': "url('/beach-summer.png')" } as React.CSSProperties}>
      <div className="summer-overlay min-h-screen">
        <div className="mx-auto max-w-6xl py-8">
          <h1 className="font-cocktail text-4xl mb-8">Mon Panier</h1>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white/10 rounded-2xl p-4 border border-white/20 flex gap-4 items-center">
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                    <Image src={item.image || '/beach-summer.png'} alt={item.name} fill sizes="80px" loading="lazy" quality={60} className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{item.name}</p>
                    <span className="inline-flex rounded-full bg-coral/20 text-coral px-2.5 py-0.5 text-xs font-semibold mt-1">
                      {item.type === 'pack' ? 'Pack' : 'Produit'}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-cocktail text-primary text-lg">{formatMad(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2 justify-end">
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
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20 sticky top-8">
                <h2 className="font-cocktail text-2xl text-primary mb-4">Résumé</h2>
                <div className="space-y-3 text-sm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-white/70 truncate">{item.name} x{item.quantity}</span>
                      <span className="text-white font-semibold">{formatMad(item.price * item.quantity)}</span>
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
                  <div className="flex items-end justify-between pt-2">
                    <span className="font-black text-white">TOTAL</span>
                    <span className="font-cocktail text-3xl text-primary">{formatMad(total + delivery)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 text-green-400 px-3 py-1.5 text-xs font-semibold">
                    💳 Paiement à la livraison
                  </span>
                </div>
                <Link href="/checkout" className="btn-coral mt-5 flex w-full justify-center text-lg font-semibold">
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
