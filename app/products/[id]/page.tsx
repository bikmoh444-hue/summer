import Link from 'next/link';
import { getProduct } from '@/lib/data';
import { activePrice, formatMad, productDescription, productDetails, productName } from '@/lib/pricing';
import { ProductPurchase } from '@/components/ProductPurchase';
import { DetailImageGallery } from '@/components/DetailImageGallery';

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
      <div className="summer-overlay mobile-page-pad min-h-screen">
        <Header />
        <section className="mx-auto max-w-6xl overflow-hidden px-4 py-8 sm:px-6">
          <nav className="mb-6 max-w-full overflow-hidden text-sm font-bold text-white/75">
            <Link href="/" className="hover:text-white">Accueil</Link> <span className="mx-2">/</span>
            <Link href="/#products" className="hover:text-white">Produits</Link> <span className="mx-2">/</span>
            <span className="break-words text-primary">{productName(product)}</span>
          </nav>

          <div className="grid max-w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <DetailImageGallery images={gallery} alt={productName(product)} />

            <div className="card-glass max-w-full overflow-hidden p-5 md:p-8">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-black">Produit</span>
              <h1 className="mt-5 break-words text-[34px] font-black leading-[1.1] md:text-6xl">{productName(product)}</h1>
              <p className="mt-5 text-base leading-7 text-white/85 md:text-lg md:leading-8">{productDescription(product)}</p>
              <p className="mt-4 text-[15px] leading-7 text-white/75 md:text-base md:leading-8">{productDetails(product)}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="price-text text-[38px] leading-none md:text-5xl">{formatMad(price)}</span>
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
    <header className="sticky top-0 z-40 border-b border-white/15 bg-ocean/35 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-hidden px-4 py-3 sm:px-6">
        <Link href="/" className="truncate font-cocktail text-xl text-primary sm:text-2xl">summer </Link>
        <Link href="/cart" className="btn-coral shrink-0 px-4 py-2 text-sm">Panier</Link>
      </div>
    </header>
  );
}
