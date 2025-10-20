// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "E-Commerce Storefront",
  description: "An e-commerce storefront built with Next.js and TypeScript.",
  icons: {
    icon: "/logo.png", // or an array of sizes if you want

  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
