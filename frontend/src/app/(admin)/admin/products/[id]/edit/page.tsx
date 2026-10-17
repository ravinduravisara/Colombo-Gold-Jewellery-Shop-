"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { productService } from "@/services/productService";
import { IProduct } from "@/types/product";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product for edit:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-zinc-500 text-xs">
        Loading product specifications for edit...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-red-400 text-sm">
        Product not found or has been removed.
      </div>
    );
  }

  return <ProductForm initialData={product} isEditing={true} />;
}

