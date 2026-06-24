'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BadgePercent, ChevronRight, Languages, ShoppingBag, Waves } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { activePrice, formatMad, packActivePrice, packName, packOriginalPrice, productName } from '@/lib/pricing';
import type { LandingSettings, Lang, Pack, Product } from '@/lib/types';

export function LandingStore({ settings, products, packs }: { settings: LandingSettings; products: Product[]; packs: Pack[] }) {
  const [lang, setLang] = useState<Lang>('fr');
  const content = lang === 'ar' ? settings.content_ar : settings.content_fr;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const bg = settings.background_image_url || '/beach-summer.png';

  return (
    <main
      dir={dir}
      className={`summer-site min-h-screen text-white ${lang === 'ar' ? 'font-arabic' : 'font-french'}`}
      style={{
        '--site-bg': `url("${bg}")`,
        '--primary': settings.primary_color,
        '--secondary': settings.secondary_color
      } as React.CSSProperties}
    >
      <div className="summer-overlay min-h-screen">
        <header className="sticky top-0 z-40 border-b border-white/15 bg-ink/35 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-3 font-black">
              <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white/20 ring-1 ring-white/25">
                {settings.logo_image_url ? <Image src={settings.logo_image_url} alt="Logo" fill sizes="44px" quality={60} className="object-cover" /> : <Waves className="h-6 w-6 text-sun" />}
              </span>
              <span>{lang === 'ar' ? settings.logo_text_ar : settings.logo_text_fr}</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-black md:flex">
              <a href="#packs">{content.nav_packs}</a>
              <a href="#products">{content.nav_products}</a>
              <a href="#contact">{content.nav_contact}</a>
            </nav>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white">
                <Languages className="h-5 w-5" />
              </button>
              <CartNavButton />
            </div>
          </div>
        </header>

        <section className="mx-auto grid min-h-[86vh] max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-black shadow-glass backdrop-blur-sm">
              {lang === 'ar' ? settings.promo_text_ar : settings.promo_text_fr}
            </p>
            <h1 className="premium-title text-4xl font-black leading-tight md:text-7xl">
              {lang === 'ar' ? settings.hero_title_ar : settings.hero_title_fr}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-white/90 md:text-xl">
              {lang === 'ar' ? settings.hero_subtitle_ar : settings.hero_subtitle_fr}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#products" className="focus-ring rounded-full bg-sun px-7 py-3 font-black text-ink shadow-xl transition hover:-translate-y-1">
                {content.shop_now}
              </a>
              <a href="#packs" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/15 px-7 py-3 font-black text-white backdrop-blur-sm transition hover:-translate-y-1">
                {content.view_packs}
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          {packs[0] && <FeaturedPack pack={packs[0]} lang={lang} content={content} />}
        </section>

        <section id="packs" className="mx-auto max-w-7xl px-4 py-12">
          <SectionTitle title={content.packs_title} />
          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {packs.map((pack) => <PackCard key={pack.id} pack={pack} lang={lang} content={content} />)}
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-4 py-12">
          <SectionTitle title={content.products_title} />
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={product.id} product={product} lang={lang} content={content} />)}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-14">
          <div className="card-glass mx-auto max-w-2xl p-8 text-center md:p-10">
            <h2 className="text-3xl font-black">{content.nav_contact}</h2>
            <p className="mt-4 text-white/75">{settings.whatsapp_number}</p>
            <a href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`} className="btn-coral mt-6 inline-flex">
              WhatsApp
            </a>
          </div>
        </section>

        <footer className="border-t border-white/15 bg-ink/45 px-4 py-8 text-center text-sm text-white/80 backdrop-blur-sm">
          {lang === 'ar' ? settings.footer_text_ar : settings.footer_text_fr}
        </footer>
      </div>
    </main>
  );
}

function CartNavButton() {
  const count = useCart((s) => s.getCount());
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.push('/cart')} className="focus-ring relative inline-flex h-11 items-center gap-2 rounded-full bg-white/90 px-4 text-sm font-black text-ocean shadow-sm">
      <ShoppingBag className="h-5 w-5" />
      Panier
      {count > 0 && <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-coral px-1 text-xs text-white">{count}</span>}
    </button>
  );
}

function FeaturedPack({ pack, lang, content }: { pack: Pack; lang: Lang; content: Record<string, string> }) {
  const price = packActivePrice(pack);
  const original = packOriginalPrice(pack);
  return (
    <article className="glass-panel overflow-hidden">
      <div className="relative h-72 overflow-hidden">
        <Image src={pack.image_url || '/beach-summer.png'} alt={packName(pack, lang)} fill sizes="(min-width: 1024px) 540px, 100vw" priority quality={72} className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="premium-title text-3xl font-black">{packName(pack, lang)}</h3>
        <p className="mt-3 leading-7 text-white/82">{lang === 'ar' ? pack.description_ar : pack.description_fr}</p>
        <PriceLine price={price} original={original} />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/packs/${pack.id}`} className="rounded-full bg-white px-5 py-3 font-black text-ink">{content.view_details}</Link>
          <CartPackButton pack={pack} lang={lang} label={content.add_to_cart} />
        </div>
      </div>
    </article>
  );
}

function PackCard({ pack, lang, content }: { pack: Pack; lang: Lang; content: Record<string, string> }) {
  const router = useRouter();
  const price = packActivePrice(pack);
  const original = packOriginalPrice(pack);
  return (
    <article onClick={() => router.push(`/packs/${pack.id}`)} className="card-product group shadow-lg">
      <Image src={pack.image_url || '/beach-summer.png'} alt={packName(pack, lang)} fill sizes="(min-width: 1024px) 50vw, 100vw" loading="lazy" quality={70} className="object-cover transition duration-300 group-hover:scale-[1.03]" />
      <div className="overlay-bottom">
        <h3 className="text-2xl font-black">{packName(pack, lang)}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/80">{lang === 'ar' ? pack.description_ar : pack.description_fr}</p>
        <PriceLine price={price} original={original} compact />
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/packs/${pack.id}`} onClick={(event) => event.stopPropagation()} className="btn-outline-white px-4 py-2 text-sm">{content.view_details}</Link>
          <CartPackButton pack={pack} lang={lang} label={content.add_to_cart} />
        </div>
      </div>
    </article>
  );
}

function ProductCard({ product, lang, content }: { product: Product; lang: Lang; content: Record<string, string> }) {
  const router = useRouter();
  const price = activePrice(product);
  const discount = product.promo_price ? Math.round(((product.price - product.promo_price) / product.price) * 100) : 0;
  return (
    <article onClick={() => router.push(`/products/${product.id}`)} className="card-product group">
      <Image src={product.image_url || '/beach-summer.png'} alt={productName(product, lang)} fill sizes="(min-width: 1024px) 33vw, 100vw" loading="lazy" quality={70} className="object-cover transition duration-300 group-hover:scale-[1.03]" />
      {discount > 0 && <span className="absolute start-4 top-4 inline-flex items-center gap-1 rounded-full bg-coral px-3 py-1 text-xs font-black text-white"><BadgePercent className="h-3.5 w-3.5" />-{discount}%</span>}
      <div className="overlay-bottom">
        <h3 className="text-xl font-black">{productName(product, lang)}</h3>
        <p className="price-text text-2xl">{formatMad(price)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={`/products/${product.id}`} onClick={(event) => event.stopPropagation()} className="btn-outline-white px-4 py-2 text-sm">{content.view_details}</Link>
          <CartProductButton product={product} lang={lang} label={content.add_to_cart} />
        </div>
      </div>
    </article>
  );
}

function CartProductButton({ product, lang, label }: { product: Product; lang: Lang; label: string }) {
  const addItem = useCart((s) => s.addItem);
  return <button type="button" onClick={(event) => { event.stopPropagation(); addItem({ id: product.id, type: 'product', name: productName(product, lang), image: product.image_url, price: activePrice(product) }); }} className="btn-coral px-4 py-2 text-sm">{label}</button>;
}

function CartPackButton({ pack, lang, label }: { pack: Pack; lang: Lang; label: string }) {
  const addItem = useCart((s) => s.addItem);
  return <button type="button" onClick={(event) => { event.stopPropagation(); addItem({ id: pack.id, type: 'pack', name: packName(pack, lang), image: pack.image_url, price: packActivePrice(pack) }); }} className="btn-coral px-4 py-2 text-sm">{label}</button>;
}

function PriceLine({ price, original, compact = false }: { price: number; original: number; compact?: boolean }) {
  return (
    <div className={`mt-4 flex items-end gap-3 ${compact ? 'text-sm' : ''}`}>
      <span className="price-text text-3xl">{formatMad(price)}</span>
      {original > price && <span className="pb-1 font-bold text-white/55 line-through">{formatMad(original)}</span>}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="premium-title max-w-3xl text-3xl font-black md:text-5xl">{title}</h2>;
}
