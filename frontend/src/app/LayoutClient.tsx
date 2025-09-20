// app/LayoutClient.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExitModal } from "@/components/lesson/exit-modal";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noLayoutRoutes = useMemo(() => ["/quiz/cic", "/quiz/pension", "/meeting", "/meeting/agent", "/meeting/people"], []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (noLayoutRoutes.includes(pathname)) return;

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
      </>
    );
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
