import { Outfit } from 'next/font/google';
import './globals.css';

export const dynamic = 'force-dynamic';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';

import { Metadata } from "next";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Shop.co",
    default: "Shop.co - Modern Clothing Store",
  },
  description: "Shop.co is your ultimate destination for stylish and modern clothing. Explore our latest collections today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <CartProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
