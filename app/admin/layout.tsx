'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Boxes, LogOut, Menu, Package, Settings, ShoppingBag, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/admin', label: 'Tableau de bord', icon: BarChart3 },
  { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/products', label: 'Produits', icon: Package },
  { href: '/admin/packs', label: 'Packs', icon: Boxes },
  { href: '/admin/settings', label: 'Parametres', icon: Settings }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<{ user: { email?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/admin/login');
        return;
      }
      setSession({ user: { email: data.session.user.email ?? '' } });
      setLoading(false);
    });
  }, [pathname, router]);

  async function logout() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push('/admin/login');
  }

  if (pathname === '/admin/login') return <>{children}</>;
  if (loading) return <main className="grid min-h-screen place-items-center bg-ocean text-white">Chargement...</main>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-ocean text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#14323f] lg:block">
        <div className="flex h-full flex-col p-4">
          <Link href="/" className="mb-6 flex items-center gap-3 px-2 py-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-primary">C</span>
            <span className="font-cocktail text-xl text-primary">Cosmitiq</span>
          </Link>
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => <NavLink key={item.href} item={item} active={pathname === item.href} />)}
          </nav>
          <div className="border-t border-white/10 pt-4">
            <p className="truncate text-sm text-white/55">{session.user.email}</p>
            <button onClick={logout} className="mt-3 flex items-center gap-2 text-sm font-bold text-red-200"><LogOut className="h-4 w-4" /> Deconnexion</button>
          </div>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#14323f] px-4 py-3 lg:hidden">
        <span className="font-cocktail text-lg text-primary">Cosmitiq</span>
        <button onClick={() => setMobileOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="fixed bottom-0 left-0 top-16 w-72 bg-[#14323f] p-4" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-1">
              {navItems.map((item) => <NavLink key={item.href} item={item} active={pathname === item.href} onClick={() => setMobileOpen(false)} />)}
            </nav>
          </div>
        </div>
      )}

      <main className="pt-16 lg:pl-64 lg:pt-0">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

function NavLink({ item, active, onClick }: { item: (typeof navItems)[number]; active: boolean; onClick?: () => void }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} onClick={onClick} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${active ? 'bg-white/15 text-primary' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}
