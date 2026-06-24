import Image from 'next/image';
import Link from 'next/link';
import { getProduct } from '@/lib/data';
import { activePrice, formatMad, productDescription, productDetails, productName } from '@/lib/pricing';
import { ProductPurchase } from '@/components/ProductPurchase';

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return (
      <main className="summer-site min-h-screen text-white" style={{ '--site-bg': "url('/beach-summer.png')" } as React.CSSProperties}>
        <div className="summer-overlay grid min-h-screen place-items-center px-4">
          <div className="card-glass max-w-md p-8 text-center">
            <h1 className="text-3xl font-black">Produit introuvable</h1>
            <Link href="/#products" className="btn-outline-white mt-6 inline-flex">Voir tous les produits</Link>
          </div>
        </div>
      </main>
    );
  }

  const price = activePrice(product);
  const discount = product.promo_price ? Math.round(((product.price - product.promo_price) / product.price) * 100) : 0;
  const gallery = Array.from(new Set([product.image_url, ...(product.gallery_urls ?? [])].filter(Boolean)));

  return (
    <main className="summer-site min-h-screen text-white" style={{ '--site-bg': "url('/beach-summer.png')" } as React.CSSProperties}>
      <div className="summer-overlay min-h-screen">
        <Header />
        <section className="mx-auto max-w-6xl px-4 py-8">
          <nav className="mb-6 text-sm font-bold text-white/75">
            <Link href="/" className="hover:text-white">Accueil</Link> <span className="mx-2">/</span>
            <Link href="/#products" className="hover:text-white">Produits</Link> <span className="mx-2">/</span>
            <span className="text-primary">{productName(product)}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-3">
              <div className="card-glass p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-square">
                  <Image src={product.image_url || '/beach-summer.png'} alt={productName(product)} fill sizes="(min-width: 1024px) 50vw, 100vw" priority quality={74} className="object-cover" />
                </div>
              </div>
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.slice(0, 4).map((url) => (
                    <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-white/20 bg-white/10">
                      <Image src={url} alt={productName(product)} fill sizes="120px" loading="lazy" quality={60} className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-glass p-5 md:p-8">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-black">Produit</span>
              <h1 className="mt-5 text-4xl font-black md:text-6xl">{productName(product)}</h1>
              <p className="mt-5 text-lg leading-8 text-white/85">{productDescription(product)}</p>
              <p className="mt-4 leading-8 text-white/75">{productDetails(product)}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="price-text text-5xl">{formatMad(price)}</span>
                {product.promo_price && <span className="text-lg font-bold text-white/45 line-through">{formatMad(product.price)}</span>}
                {discount > 0 && <span className="rounded-full bg-coral px-3 py-1 text-sm font-black">-{discount}%</span>}
              </div>
              <p className="mt-4 inline-flex rounded-full bg-white/14 px-4 py-2 text-sm font-bold">Stock: {product.stock}</p>
              <ProductPurchase product={product} />
            </div>
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
