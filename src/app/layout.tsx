import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "শ্রমবাজার",
  description: "বাংলাদেশের Labour & Skilled Workforce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-white text-slate-900">
        <SiteHeader />

        {children}

        <Footer />
      </body>
    </html>
  );
}