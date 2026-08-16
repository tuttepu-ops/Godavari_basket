import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Godavari Basket — Experience the Godavari",
  description: "A curated gateway to authentic foods, natural products, handicrafts, traditions, spiritual goods and gifts from the Godavari region.",
  openGraph: { title: "Godavari Basket — Experience the Godavari", description: "Discover authentic products rooted in the Godavari region.", images: ["/og-image.jpg"], locale: "en_IN", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
