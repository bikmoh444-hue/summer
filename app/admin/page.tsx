'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { formatMad } from '@/lib/pricing';
import type { Order } from '@/lib/types';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [packCount, setPackCount] = useState(0);
  const supabase = useMemo(() => createClient(), []);

  async function load() {
    if (!supabase) return;
    const [ordersResult, productsResult, packsResult] = await Promise.all([
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(8),
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('packs').select('id', { count: 'exact', head: true })
    ]);
    setOrders((ordersResult.data ?? []) as Order[]);
    setProductCount(productsResult.count ?? 0);
    setPackCount(packsResult.count ?? 0);
  }

  useEffect(() => { load(); }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const pending = orders.filter((order) => order.status === 'pending').length;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-black">Tableau de bord</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="En attente" value={String(pending)} />
        <Stat label="Commandes recentes" value={String(orders.length)} />
        <Stat label="Produits" value={String(productCount)} />
        <Stat label="Packs" value={String(packCount)} />
      </div>
      <section className="rounded-2xl border border-white/15 bg-white/10">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <h2 className="text-xl font-black text-primary">Commandes recentes</h2>
            <p className="text-sm text-white/60">Total visible: {formatMad(totalRevenue)}</p>
          </div>
          <Link href="/admin/orders" className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">Voir tout</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-white/60"><tr><th className="px-4 py-3">Numero</th><th className="px-4 py-3">Client</th><th className="px-4 py-3">Ville</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Statut</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-white/10">
                  <td className="px-4 py-3 font-mono text-xs">{order.order_number}</td>
                  <td className="px-4 py-3 font-bold">{order.full_name}</td>
                  <td className="px-4 py-3">{order.city}</td>
                  <td className="px-4 py-3 text-primary">{formatMad(Number(order.total))}</td>
                  <td className="px-4 py-3">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/15 bg-white/10 p-5"><p className="text-sm font-bold text-white/60">{label}</p><p className="mt-2 text-3xl font-black text-primary">{value}</p></div>;
}
