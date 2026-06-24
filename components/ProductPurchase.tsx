'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { AddProductButton } from '@/components/AddToCartButton';
import type { Product } from '@/lib/types';

export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="mt-7">
      <div className="mb-4 inline-flex items-center rounded-full border border-white/25 bg-white/10 p-1">
        <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center font-black">{quantity}</span>
        <button type="button" onClick={() => setQuantity((value) => value + 1)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row [&>button]:justify-center">
        <AddProductButton product={product} quantity={quantity} />
        <AddProductButton product={product} quantity={quantity} orderNow />
      </div>
    </div>
  );
}
