import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/shared/layout/Footer";
import { Header } from "@/shared/layout/Header";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "next/image POC — Before vs After",
  description: "Measure how the Next.js Image component improves LCP, layout shift and download size.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
