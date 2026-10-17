import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productService } from "@/services/productService";
import ProductDetailsClient from "./ProductDetailsClient";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await productService.getProductBySlug(slug);
    const product = data.product;
    return {
      title: `${product.name} | Colombo Gold Covering`,
      description: product.shortDescription || product.description.slice(0, 160),
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description.slice(0, 160),
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch {
    return {
      title: "Jewellery Piece | Colombo Gold Covering",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  try {
    const data = await productService.getProductBySlug(slug);
    return <ProductDetailsClient product={data.product} relatedProducts={data.relatedProducts || []} />;
  } catch {
    notFound();
  }
}

