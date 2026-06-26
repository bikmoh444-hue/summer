'use client';

import { useState } from 'react';
import { ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { activePrice, packActivePrice, packName, productName } from '@/lib/pricing';
import type { Lang, Pack, Product } from '@/lib/types';

export function AddProductButton({ product, quantity = 1, orderNow = false, lang = 'fr' }: { product: Product; quantity?: number; orderNow?: boolean; lang?: Lang }) {
  const [done, setDone] = useState(false);
  const addItem = useCart((s) => s.addItem);
  return (
    <button
      type="button"
      onClick={() => {
        for (let i = 0; i < quantity; i++) addItem({ id: product.id, type: 'product', name: productName(product, lang), image: product.image_url, price: activePrice(product) });
        setDone(true);
        if (orderNow) window.location.href = '/checkout';
      }}
      className="focus-ring inline-flex min-h-[48px] max-h-[54px] items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
    >
      {orderNow ? <Zap className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
      {done ? 'Ajoute' : orderNow ? 'Commander' : 'Ajouter au panier'}
    </button>
  );
}

export function AddPackButton({ pack, quantity = 1, orderNow = false, lang = 'fr' }: { pack: Pack; quantity?: number; orderNow?: boolean; lang?: Lang }) {
  const [done, setDone] = useState(false);
  const addItem = useCart((s) => s.addItem);
  return (
    <button
      type="button"
      onClick={() => {
        for (let i = 0; i < quantity; i++) addItem({ id: pack.id, type: 'pack', name: packName(pack, lang), image: pack.image_url, price: packActivePrice(pack) });
        setDone(true);
        if (orderNow) window.location.href = '/checkout';
      }}
      className="focus-ring inline-flex min-h-[48px] max-h-[54px] items-center justify-center gap-2 rounded-full bg-[var(--secondary)] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
    >
      {orderNow ? <Zap className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
      {done ? 'Ajoute' : orderNow ? 'Commander' : 'Ajouter au panier'}
    </button>
  );
}
