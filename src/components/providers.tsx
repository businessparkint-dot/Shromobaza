"use client";

import type { ReactNode } from "react";

import { LanguageProvider } from "@/lib/language-context";
import SiteHeader from "@/components/site-header";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LanguageProvider>
      <SiteHeader />
      {children}
    </LanguageProvider>
  );
}