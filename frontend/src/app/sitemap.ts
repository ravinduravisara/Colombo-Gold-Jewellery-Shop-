import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colombogoldcovering.lk";

  const staticRoutes = [
    "",
    "/shop",
    "/new-arrivals",
    "/best-sellers",
    "/offers",
    "/collections",
    "/about",
    "/gallery",
    "/contact",
    "/faq",
    "/warranty",
    "/privacy-policy",
    "/terms",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/shop" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/shop" ? 0.9 : 0.7,
  }));
}

