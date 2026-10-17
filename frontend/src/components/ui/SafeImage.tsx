"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/images/placeholders/necklace.jpg";

export function SafeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<any>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={hasError || !imgSrc ? fallbackSrc : imgSrc}
      alt={alt || "Colombo Gold Covering Jewellery"}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}

