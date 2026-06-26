'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    if (!supabase) { setError('Erreur de configuration'); setLoading(false); return; }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) { setError('Email ou mot de passe incorrect'); return; }
    router.push('/admin');
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ocean p-4">
      <form onSubmit={handleSubmit} className="bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm w-full max-w-sm p-6 text-white">
        <h1 className="font-cocktail text-3xl text-primary">🌊 summer</h1>
        <p className="mt-2 text-sm text-white/60">Administration sécurisée</p>
        <div className="mt-5 space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-11 rounded-xl border border-white/20 bg-white/10 px-3 text-white placeholder:text-white/40 focus:border-[#F5A623] focus:outline-none" required />
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-11 rounded-xl border border-white/20 bg-white/10 px-3 text-white placeholder:text-white/40 focus:border-[#F5A623] focus:outline-none" required />
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-500/15 p-3 text-sm text-red-400">{error}</p>}
        <button disabled={loading} className="btn-coral mt-5 w-full font-black disabled:opacity-60">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </main>
  );
}
