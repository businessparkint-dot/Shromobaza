import type { Metadata } from "next";
import "./globals.css";

import SiteHeader from "@/components/site-header";
import { LanguageProvider } from "@/lib/language-context";

export const metadata: Metadata = {
  title: "Shromobazar",
  description: "বাংলাদেশের শ্রম ও দক্ষ জনশক্তি প্ল্যাটফর্ম",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>
        <LanguageProvider>
          <SiteHeader />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}