// app/LayoutClient.tsx
"use client";

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
  const noLayoutRoutes = ["/lesson"];

  if (noLayoutRoutes.includes(pathname) && pathname === "/lesson") {
    console.log(pathname);
    return <>
      {children}
      <ExitModal/>
    </>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
