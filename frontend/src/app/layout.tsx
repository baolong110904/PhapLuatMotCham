import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ExitModal } from "@/components/lesson/exit-modal";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tâm Lạc Center",
  description: "Không gian chăm sóc tinh thần cho người cao tuổi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.className} antialiased`}>
        <Header />
        {children}
        <Footer />
        <ExitModal/>
      </body>
    </html>
  );
}
