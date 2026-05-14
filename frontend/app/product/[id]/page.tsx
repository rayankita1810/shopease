import type { Metadata } from "next";
import ProductClient from "./ProductClient";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        cache: "no-store",
      },
    );

    const product = await res.json();

    return {
      title: `${product.name} | ShopEase`,
      description: product.description,

      openGraph: {
        title: product.name,
        description: product.description,
        images: [product.image],
      },

      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description,
        images: [product.image],
      },
    };
  } catch {
    return {
      title: "Product | ShopEase",
      description: "Premium product from ShopEase",
    };
  }
}

export default async function Page({
  params,
}: Props) {
  const { id } = await params;

  return <ProductClient id={id} />;
}