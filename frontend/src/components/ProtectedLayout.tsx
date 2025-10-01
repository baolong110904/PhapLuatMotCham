"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("auth");

    if (pathname === "/login") {
      setAuthChecked(true);
      return;
    }

    if (auth) { 
    } else {
      router.replace("/login");
    }

    setAuthChecked(true);
  }, [pathname, router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}