import { MetadataRoute } from "next";

async function getProducts() {
  const res = await fetch("http://localhost:5000/api/products");
  return res.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const productUrls = products.map((product: any) => ({
    url: `https://yourdomain.com/product/${product._id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: "https://yourdomain.com",
      lastModified: new Date(),
    },
    {
      url: "https://yourdomain.com/products",
      lastModified: new Date(),
    },
    {
      url: "https://yourdomain.com/search",
      lastModified: new Date(),
    },

    ...productUrls,
  ];
}