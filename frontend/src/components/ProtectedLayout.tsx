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
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("auth");

    if (pathname === "/login") {
      setAuthChecked(true);
      setIsAuth(true);
      return;
    }
    
    if (auth) {
      setIsAuth(true);
    } else {
      router.replace("/login");
    }

    setAuthChecked(true);
  }, [pathname, router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}