import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { ToastContainer } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Colombo Gold Covering — Premium Gold-Plated Jewellery Sri Lanka",
  description:
    "Discover exquisite 24K and 22K micro gold-covered necklaces, bridal jewellery sets, bangles, and earrings in Sri Lanka. High quality finish with lifetime re-polishing warranty.",
  keywords: [
    "gold covered jewellery sri lanka",
    "gold plated jewellery colombo",
    "gold covering necklace",
    "bridal jewellery set sri lanka",
    "kotte jewellery",
    "colombo gold covering",
  ],
  openGraph: {
    title: "Colombo Gold Covering — Sri Lanka's Premier Gold-Covered Jewellery",
    description:
      "Handcrafted bridal sets, traditional necklaces, and bangles with micro gold plating and re-polishing warranty.",
    url: "https://colombogoldcovering.lk",
    siteName: "Colombo Gold Covering",
    locale: "en_LK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-luxury-obsidian text-luxury-ivory antialiased selection:bg-gold-500 selection:text-black">
        <QueryProvider>
          {children}
          <QuickViewModal />
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}

