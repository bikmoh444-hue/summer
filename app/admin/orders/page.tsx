'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatMad } from '@/lib/pricing';
import type { Order, OrderStatus } from '@/lib/types';

const statuses: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'En attente' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'delivered', label: 'Livree' },
  { value: 'cancelled', label: 'Annulee' }
];

const statusClass: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-200',
  in_progress: 'bg-cyan-500/20 text-cyan-100',
  delivered: 'bg-green-500/20 text-green-100',
  cancelled: 'bg-red-500/20 text-red-100'
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const supabase = useMemo(() => createClient(), []);

  async function load() {
    if (!supabase) return;
    const { data } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    setOrders((data ?? []) as Order[]);
  }

  useEffect(() => {
    load();
    if (!supabase) return;
    const channel = supabase.channel('orders-live').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  const filtered = orders.filter((order) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return order.full_name.toLowerCase().includes(q) || order.phone.includes(q) || order.order_number.toLowerCase().includes(q);
  });

  async function updateStatus(id: string, status: OrderStatus) {
    if (!supabase) return;
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders((prev) => prev.map((order) => order.id === id ? { ...order, status } : order));
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-black">Commandes</h1>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="form-input max-w-sm" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-white/10 text-white/65">
              <tr>
                <th className="px-4 py-3">Numero</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Telephone</th>
                <th className="px-4 py-3">Adresse</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Articles</th>
                <th className="px-4 py-3">Sous-total</th>
                <th className="px-4 py-3">Livraison</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-t border-white/10 align-top">
                  <td className="px-4 py-3 font-mono text-xs">{order.order_number}</td>
                  <td className="px-4 py-3 font-bold">{order.full_name}</td>
                  <td className="px-4 py-3"><a href={`tel:${order.phone}`} className="text-primary">{order.phone}</a></td>
                  <td className="px-4 py-3 max-w-[220px]">{order.address}</td>
                  <td className="px-4 py-3">{order.city}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {(order.order_items ?? []).map((item) => (
                        <p key={item.id}>{item.name_snapshot} x{item.quantity}</p>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatMad(Number(order.subtotal))}</td>
                  <td className="px-4 py-3">{formatMad(Number(order.delivery_fee))}</td>
                  <td className="px-4 py-3 font-black text-primary">{formatMad(Number(order.total))}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(order.created_at).toLocaleDateString('fr-MA')}</td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)} className={`rounded-full border border-white/15 px-3 py-1 text-xs font-black ${statusClass[order.status]}`}>
                      {statuses.map((status) => <option key={status.value} value={status.value} className="text-ink">{status.label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={11} className="px-4 py-12 text-center text-white/60">Aucune commande.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
