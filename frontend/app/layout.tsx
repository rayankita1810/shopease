import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShopEase - Premium Ecommerce Store",
  description:
    "Buy premium fashion, mobiles, laptops, watches and lifestyle products online.",

  keywords: [
    "ecommerce",
    "online shopping",
    "mobiles",
    "fashion",
    "laptops",
    "watches",
  ],

  openGraph: {
    title: "ShopEase - Premium Ecommerce Store",
    description:
      "Discover premium products with modern ecommerce experience.",
    url: "https://yourdomain.com",
    siteName: "ShopEase",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShopEase",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ShopEase",
    description: "Premium Ecommerce Store",
    images: ["/og-image.png"],
  },

  metadataBase: new URL("https://yourdomain.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />

        <main className="grow">
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            {children}
          </GoogleOAuthProvider>
        </main>
        <Toaster position="top-right" />

        <Footer />
      </body>
    </html>
  );
}
