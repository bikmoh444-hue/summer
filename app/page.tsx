import { LandingStore } from "@/components/LandingStore";
import { getStoreData } from "@/lib/data";

export default async function Home() {
  const { settings, products, packs } = await getStoreData();
  return <LandingStore settings={settings} products={products} packs={packs} />;
}
