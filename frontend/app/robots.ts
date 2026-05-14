import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/orders",
        "/admin/products",
        "/admin/revenue",
        "/admin/users",
        "/checkout",
        "/cart",
      ],
    },
    sitemap: "https://yourdomain.com/sitemap.xml",
  };
}