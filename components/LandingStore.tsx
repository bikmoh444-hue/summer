'use client';

import { useState } from 'react';
import { article as MotionArticle } from 'framer-motion/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Languages, ShoppingBag, Waves } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { activePrice, formatMad, packActivePrice, packName, packOriginalPrice, productDescription, productName } from '@/lib/pricing';
import type { LandingSettings, Lang, Pack, Product } from '@/lib/types';

export function LandingStore({ settings, products, packs }: { settings: LandingSettings; products: Product[]; packs: Pack[] }) {
  const [lang, setLang] = useState<Lang>('fr');
  const content = lang === 'ar' ? settings.content_ar : settings.content_fr;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const bg = settings.background_image_url || '/beach-summer.png';
  const featuredPack = packs[0];
  const visiblePacks = featuredPack ? packs.filter((pack) => pack.id !== featuredPack.id) : packs;

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
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-hidden px-4 py-3 sm:gap-3 sm:px-6">
            <Link href="/" className="flex min-w-0 items-center gap-2 font-black sm:gap-3">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white/20 ring-1 ring-white/25 sm:h-11 sm:w-11">
                {settings.logo_image_url ? <Image src={settings.logo_image_url} alt="Logo" fill sizes="44px" quality={60} className="object-cover" /> : <Waves className="h-6 w-6 text-sun" />}
              </span>
              <span className="truncate text-sm sm:text-base">{lang === 'ar' ? settings.logo_text_ar : settings.logo_text_fr}</span>
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

        <section className="mx-auto grid min-h-[86vh] max-w-7xl items-center gap-8 overflow-hidden px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-3xl overflow-hidden">
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
          {featuredPack && <FeaturedPack pack={featuredPack} lang={lang} content={content} />}
        </section>

        <section id="packs" className="mx-auto max-w-7xl overflow-hidden px-4 py-10 sm:px-6">
          <SectionTitle title={content.packs_title} />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visiblePacks.map((pack, index) => <PackCard key={pack.id} pack={pack} lang={lang} content={content} index={index} />)}
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl overflow-hidden px-4 py-10 sm:px-6">
          <SectionTitle title={content.products_title} />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => <ProductCard key={product.id} product={product} lang={lang} content={content} index={index} />)}
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
    <button type="button" onClick={() => router.push('/cart')} className="focus-ring relative inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-white/90 px-3 text-xs font-black text-ocean shadow-sm sm:h-11 sm:gap-2 sm:px-4 sm:text-sm">
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
    <article className="glass-panel max-w-full overflow-hidden">
      <div className="relative h-60 overflow-hidden sm:h-72">
        <Image src={pack.image_url || '/beach-summer.png'} alt={packName(pack, lang)} fill sizes="(min-width: 1024px) 540px, 100vw" priority quality={72} className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
      </div>
      <div className="p-[18px] sm:p-6">
        <h3 className="premium-title text-[28px] font-black leading-[1.1] sm:text-3xl">{packName(pack, lang)}</h3>
        <p className="mt-3 text-[15px] leading-6 text-white/82 sm:text-base sm:leading-7">{lang === 'ar' ? pack.description_ar : pack.description_fr}</p>
        <PriceLine price={price} original={original} />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/packs/${pack.id}`} className="inline-flex h-[54px] items-center rounded-full bg-white px-5 font-black text-ink">{content.view_details}</Link>
          <CartPackButton pack={pack} lang={lang} label={content.add_to_cart} />
        </div>
      </div>
    </article>
  );
}

function PackCard({ pack, lang, content, index }: { pack: Pack; lang: Lang; content: Record<string, string>; index: number }) {
  const price = packActivePrice(pack);
  const original = packOriginalPrice(pack);
  return (
    <StoreCard
      href={`/packs/${pack.id}`}
      image={pack.image_url || '/beach-summer.png'}
      title={packName(pack, lang)}
      description={lang === 'ar' ? pack.description_ar : pack.description_fr}
      price={price}
      original={original}
      detailsLabel={content.view_details}
      action={<CartPackButton pack={pack} lang={lang} label={content.add_to_cart} />}
      imageSizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      index={index}
    />
  );
}

function ProductCard({ product, lang, content, index }: { product: Product; lang: Lang; content: Record<string, string>; index: number }) {
  const price = activePrice(product);
  const original = Number(product.price);
  return (
    <StoreCard
      href={`/products/${product.id}`}
      image={product.image_url || '/beach-summer.png'}
      title={productName(product, lang)}
      description={productDescription(product, lang)}
      price={price}
      original={original}
      detailsLabel={content.view_details}
      action={<CartProductButton product={product} lang={lang} label={content.add_to_cart} />}
      imageSizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      index={index}
    />
  );
}

function StoreCard({
  href,
  image,
  title,
  description,
  price,
  original,
  detailsLabel,
  action,
  imageSizes,
  index
}: {
  href: string;
  image: string;
  title: string;
  description: string;
  price: number;
  original: number;
  detailsLabel: string;
  action: React.ReactNode;
  imageSizes: string;
  index: number;
}) {
  return (
    <MotionArticle
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.24), ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="group max-w-full overflow-hidden rounded-[24px] border border-white/15 bg-[rgba(96,150,175,0.65)] shadow-[0_18px_48px_rgba(18,70,92,0.18)] backdrop-blur-[10px] transition-shadow duration-300 ease-out hover:shadow-[0_26px_70px_rgba(18,70,92,0.26)]"
    >
      <Link href={href} className="block">
        <div className="relative h-[220px] w-full overflow-hidden rounded-t-[24px] bg-ocean md:h-[320px]">
          <Image src={image} alt={title} fill sizes={imageSizes} loading="lazy" quality={82} className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/28 to-transparent" />
        </div>
      </Link>
      <div className="flex min-h-[238px] flex-col p-[18px] sm:p-6">
        <h3 className="text-[28px] font-black leading-[1.1] text-[#F5A623] md:text-[34px]">{title}</h3>
        <p className="mt-3 line-clamp-3 min-h-[4.2rem] text-[15px] leading-6 text-white sm:text-base">{description}</p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <span className="price-text text-[30px] font-black leading-none text-[#F5A623] md:text-[34px]">{formatMad(price)}</span>
          {original > price && <span className="pb-1 text-sm font-bold text-white/55 line-through">{formatMad(original)}</span>}
        </div>
        <div className="mt-auto grid gap-3 pt-5 sm:grid-cols-2">
          <Link href={href} className="inline-flex h-[54px] items-center justify-center rounded-full bg-white px-5 text-sm font-black text-ink shadow-sm transition duration-300 ease-out hover:scale-[1.03]">
            {detailsLabel}
          </Link>
          {action}
        </div>
      </div>
    </MotionArticle>
  );
}

function CartProductButton({ product, lang, label }: { product: Product; lang: Lang; label: string }) {
  const addItem = useCart((s) => s.addItem);
  return <button type="button" onClick={() => addItem({ id: product.id, type: 'product', name: productName(product, lang), image: product.image_url, price: activePrice(product) })} className="inline-flex h-[54px] items-center justify-center rounded-full bg-[#FF6B6B] px-5 text-sm font-black text-white shadow-sm transition duration-300 ease-out hover:scale-[1.03] hover:bg-[#ff5252]">{label}</button>;
}

function CartPackButton({ pack, lang, label }: { pack: Pack; lang: Lang; label: string }) {
  const addItem = useCart((s) => s.addItem);
  return <button type="button" onClick={() => addItem({ id: pack.id, type: 'pack', name: packName(pack, lang), image: pack.image_url, price: packActivePrice(pack) })} className="inline-flex h-[54px] items-center justify-center rounded-full bg-[#FF6B6B] px-5 text-sm font-black text-white shadow-sm transition duration-300 ease-out hover:scale-[1.03] hover:bg-[#ff5252]">{label}</button>;
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
