"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("auth"); // or read cookie if needed
    console.log("ProtectedLayout auth:", auth);

    if (!auth) {
      router.replace("/login"); // redirect to login
    } else {
      setLoading(false); // show children
    }
  }, [router]);

  if (loading) return <p>Redirecting...</p>;

  return <>{children}</>;
}