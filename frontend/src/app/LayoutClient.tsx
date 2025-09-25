// app/LayoutClient.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExitModal } from "@/components/lesson/exit-modal";
import AudioWidget from '@/components/AudioWidget'

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noLayoutRoutes = useMemo(() => ["/quiz/cic", "/quiz/pension", "/meeting", "/meeting/mascot", "/meeting/people"], []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Treat excluded routes as prefixes so /quiz/pension/... also hides the widget
    const isExcluded = noLayoutRoutes.some((r) => pathname?.startsWith(r));

    // If route is excluded, try to hide/remove any previously injected Tawk widget
    if (isExcluded) {
      try {
        const Tawk = (window as any).Tawk_API
        if (Tawk && typeof Tawk.hideWidget === 'function') {
          Tawk.hideWidget()
        }
      } catch (e) {}

      // Remove our inline marker script if present
      const inlineEl = document.getElementById('tawk-script')
      if (inlineEl) inlineEl.remove()

      // Remove any loaded tawk script tags
      document.querySelectorAll('script[src*="embed.tawk.to"]').forEach(s => s.remove())

      // Try to remove elements inserted by Tawk (best-effort)
      document.querySelectorAll('[id^="tawk"], [class*="tawk"]').forEach(el => el.remove())

      // don't inject when excluded
      return
    }

    // If not excluded, and script not yet added, inject the loader as before
    if (document.getElementById("tawk-script")) return;

    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const inline = document.createElement("script");
    inline.id = "tawk-script";
    inline.type = "text/javascript";
    inline.text = `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/68c81999066d11192585b5c5/1j56r5ue5';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`;

    document.head.appendChild(inline);
  }, [pathname]);

  if (noLayoutRoutes.includes(pathname)) {
    return (
      <>
        {children}
        <ExitModal />
        <AudioWidget />
      </>
    );
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <AudioWidget />
    </>
  );
}
