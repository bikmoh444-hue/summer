import Image from 'next/image';
import Link from 'next/link';
import { getPackWithProducts } from '@/lib/data';
import { activePrice, formatMad, packActivePrice, packDetails, packName, packOriginalPrice, productName } from '@/lib/pricing';
import { PackPurchase } from '@/components/PackPurchase';

export default async function PackDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pack = await getPackWithProducts(id);
  if (!pack) {
    return (
      <main className="summer-site min-h-screen text-white" style={{ '--site-bg': "url('/beach-summer.png')" } as React.CSSProperties}>
        <div className="summer-overlay grid min-h-screen place-items-center px-4">
          <div className="card-glass max-w-md p-8 text-center">
            <h1 className="text-3xl font-black">Pack introuvable</h1>
            <Link href="/#packs" className="btn-outline-white mt-6 inline-flex">Voir tous les packs</Link>
          </div>
        </div>
      </main>
    );
  }

  const price = packActivePrice(pack);
  const original = packOriginalPrice(pack);
  const discount = original > price ? Math.round(((original - price) / original) * 100) : 0;
  const gallery = Array.from(new Set([pack.image_url, ...(pack.gallery_urls ?? [])].filter(Boolean)));

  return (
    <main className="summer-site min-h-screen text-white" style={{ '--site-bg': "url('/beach-summer.png')" } as React.CSSProperties}>
      <div className="summer-overlay min-h-screen">
        <Header />
        <section className="relative h-64 w-full overflow-hidden">
          <Image src={pack.image_url || '/beach-summer.png'} alt={packName(pack)} fill sizes="100vw" priority quality={74} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean via-ocean/40 to-transparent" />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8">
          <nav className="mb-6 text-sm font-bold text-white/75">
            <Link href="/" className="hover:text-white">Accueil</Link> <span className="mx-2">/</span>
            <Link href="/#packs" className="hover:text-white">Packs</Link> <span className="mx-2">/</span>
            <span className="text-primary">{packName(pack)}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div className="card-glass p-5 md:p-7">
              <h1 className="text-4xl font-black md:text-6xl">{packName(pack)}</h1>
              <p className="mt-5 text-lg leading-8 text-white/85">{packDetails(pack)}</p>
              {gallery.length > 1 && (
                <div className="mt-6 grid grid-cols-4 gap-3">
                  {gallery.slice(0, 4).map((url) => (
                    <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-white/20 bg-white/10">
                      <Image src={url} alt={packName(pack)} fill sizes="120px" loading="lazy" quality={60} className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <h2 className="mt-8 text-2xl font-black text-white">Produits inclus</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {(pack.pack_products ?? []).map((entry) => entry.product && (
                  <div key={entry.id} className="flex gap-3 rounded-2xl bg-white/10 p-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image src={entry.product.image_url || '/beach-summer.png'} alt={productName(entry.product)} fill sizes="80px" loading="lazy" quality={60} className="object-cover" />
                    </div>
                    <div>
                      <p className="font-black">{productName(entry.product)}</p>
                      <p className="text-sm text-white/70">x{entry.quantity} - {formatMad(activePrice(entry.product))}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="card-glass h-fit p-5 md:p-6">
              {discount > 0 && <span className="rounded-full bg-coral px-4 py-2 text-sm font-black">-{discount}%</span>}
              <div className="mt-5 flex items-end gap-3">
                <span className="price-text text-5xl">{formatMad(price)}</span>
                {original > price && <span className="pb-2 text-lg font-bold text-white/45 line-through">{formatMad(original)}</span>}
              </div>
              <p className="mt-2 text-sm text-white/70">Prix original calcule depuis les produits: {formatMad(original)}</p>
              <PackPurchase pack={pack} />
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-white/15 bg-ocean/35 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-cocktail text-2xl text-primary">Cosmitiq Summer</Link>
        <Link href="/cart" className="btn-coral text-sm">Panier</Link>
      </div>
    </header>
  );
}
