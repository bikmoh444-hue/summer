'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { AddProductButton } from '@/components/AddToCartButton';
import { activePrice, formatMad, productDescription } from '@/lib/pricing';
import type { Lang, Product } from '@/lib/types';

export function ProductPurchase({
  product,
  description = productDescription(product),
  price = activePrice(product),
  original = Number(product.price),
  lang = 'fr',
  showSummary = false
}: {
  product: Product;
  description?: string;
  price?: number;
  original?: number;
  lang?: Lang;
  showSummary?: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="mt-6 max-w-full overflow-hidden" onClick={(event) => event.stopPropagation()}>
      {showSummary && (
        <>
          <p className="mt-2 line-clamp-2 text-sm text-white/80">{description}</p>
          <div className="mt-4 flex flex-wrap items-end gap-3 text-sm">
            <span className="price-text text-[30px] leading-none">{formatMad(price)}</span>
            {original > price && <span className="pb-1 font-bold text-white/55 line-through">{formatMad(original)}</span>}
          </div>
        </>
      )}
      <div className="mb-4 inline-flex items-center rounded-full border border-white/25 bg-white/10 p-1">
        <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-10 w-10 place-items-center rounded-full bg-coral">
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center font-black">{quantity}</span>
        <button type="button" onClick={() => setQuantity((value) => value + 1)} className="grid h-10 w-10 place-items-center rounded-full bg-coral">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="grid max-w-full grid-cols-1 gap-3 sm:grid-cols-2 [&>button]:w-full [&>button]:justify-center">
        <AddProductButton product={product} quantity={quantity} lang={lang} />
        <AddProductButton product={product} quantity={quantity} lang={lang} orderNow />
      </div>
    </div>
  );
}
