import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CollectionBanner } from "@/components/home/CollectionBanner";
import { TikTokGallery } from "@/components/home/TikTokGallery";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { api } from "@/services/api";

export const dynamic = "force-dynamic";
export const revalidate = 60; // ISR cache 60 seconds

async function getHomeData() {
  try {
    const [categoriesRes, featuredRes, galleryRes] = await Promise.all([
      categoryService.getCategories().catch(() => []),
      productService.getProducts({ featured: true, limit: 8 }).catch(() => ({ products: [] })),
      api.get("/gallery?type=tiktok").then((r) => r.data.data).catch(() => []),
    ]);

    return {
      categories: categoriesRes || [],
      featuredProducts: featuredRes.products || [],
      galleryVideos: galleryRes || [],
    };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    return {
      categories: [],
      featuredProducts: [],
      galleryVideos: [],
    };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts, galleryVideos } = await getHomeData();

  return (
    <div className="flex flex-col space-y-0">
      <HeroSection />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts
        products={featuredProducts}
        title="Featured Masterpieces"
        subtitle="Handcrafted 24K and 22K micro gold-covered bridal sets and festive necklaces"
      />
      <CollectionBanner />
      <TikTokGallery items={galleryVideos} />
      <Testimonials />
      <NewsletterSection />
    </div>
  );
}
