import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/ui/PageTransition";
import LayoutClient from "./LayoutClient";
import { AuthContextProvider } from "@/components/Context/AuthContext";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tâm Lạc Center",
  description: "Không gian chăm sóc tinh thần cho người cao tuổi",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.className} antialiased`}>
        <AuthContextProvider>
            <LayoutClient>
              <PageTransition>{children}</PageTransition>
            </LayoutClient>
        </AuthContextProvider>
      </body>
    </html>
  );
}
