'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { AddPackButton } from '@/components/AddToCartButton';
import type { Pack } from '@/lib/types';

export function PackPurchase({ pack }: { pack: Pack }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="mt-6 max-w-full overflow-hidden">
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
        <AddPackButton pack={pack} quantity={quantity} />
        <AddPackButton pack={pack} quantity={quantity} orderNow />
      </div>
    </div>
  );
}
