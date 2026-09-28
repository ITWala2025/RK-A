import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteProviders } from "@/components/site/SiteProviders";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SiteProviders>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </SiteProviders>
  );
}
