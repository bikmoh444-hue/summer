import Image from 'next/image';
import Link from 'next/link';
import { getPackWithProducts } from '@/lib/data';
import { activePrice, formatMad, packActivePrice, packDetails, packName, packOriginalPrice, productName } from '@/lib/pricing';
import { PackPurchase } from '@/components/PackPurchase';
import { DetailImageGallery } from '@/components/DetailImageGallery';

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
      <div className="summer-overlay mobile-page-pad min-h-screen">
        <Header />
        <DetailImageGallery images={gallery} alt={packName(pack)} hero />

        <section className="mx-auto max-w-6xl overflow-hidden px-4 py-8 sm:px-6">
          <nav className="mb-6 max-w-full overflow-hidden text-sm font-bold text-white/75">
            <Link href="/" className="hover:text-white">Accueil</Link> <span className="mx-2">/</span>
            <Link href="/#packs" className="hover:text-white">Packs</Link> <span className="mx-2">/</span>
            <span className="break-words text-primary">{packName(pack)}</span>
          </nav>

          <div className="grid max-w-full gap-8 lg:grid-cols-[1fr_420px]">
            <div className="card-glass max-w-full overflow-hidden p-5 md:p-7">
              <h1 className="break-words text-[34px] font-black leading-[1.1] md:text-6xl">{packName(pack)}</h1>
              <p className="mt-5 text-base leading-7 text-white/85 md:text-lg md:leading-8">{packDetails(pack)}</p>
              {gallery.length > 1 && (
                <div className="mt-6">
                  <DetailImageGallery images={gallery} alt={packName(pack)} />
                </div>
              )}

              <h2 className="mt-8 text-2xl font-black text-white">Produits inclus</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {(pack.pack_products ?? []).map((entry) => entry.product && (
                  <div key={entry.id} className="flex max-w-full gap-3 overflow-hidden rounded-2xl bg-white/10 p-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image src={entry.product.image_url || '/beach-summer.png'} alt={productName(entry.product)} fill sizes="80px" loading="lazy" quality={60} className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-black">{productName(entry.product)}</p>
                      <p className="text-sm text-white/70">x{entry.quantity} - {formatMad(activePrice(entry.product))}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="card-glass h-fit max-w-full overflow-hidden p-5 md:p-6">
              {discount > 0 && <span className="rounded-full bg-coral px-4 py-2 text-sm font-black">-{discount}%</span>}
              <div className="mt-5 flex flex-wrap items-end gap-3">
                <span className="price-text text-[38px] leading-none md:text-5xl">{formatMad(price)}</span>
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
    <header className="sticky top-0 z-40 border-b border-white/15 bg-ocean/35 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-hidden px-4 py-3 sm:px-6">
        <Link href="/" className="truncate font-cocktail text-xl text-primary sm:text-2xl">Cosmitiq Summer</Link>
        <Link href="/cart" className="btn-coral shrink-0 px-4 py-2 text-sm">Panier</Link>
      </div>
    </header>
  );
}
