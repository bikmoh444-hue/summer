"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useCart } from "@/lib/cart";

export function CartProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  return children;
}
