import type { Metadata } from "next";
import { Cairo, Pacifico, Poppins } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-arabic" });
const pacifico = Pacifico({ subsets: ["latin"], weight: "400", variable: "--font-cocktail" });

export const metadata: Metadata = {
  title: " Summer",
  description: "Boutique marocaine premium pour essentiels de plage."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} ${cairo.variable} ${pacifico.variable}`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
