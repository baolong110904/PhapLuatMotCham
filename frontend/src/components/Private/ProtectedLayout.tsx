"use client";
import { ReactNode, useEffect } from "react";
import { UserAuth } from "../Context/AuthContext";
import { useRouter } from "next/navigation";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const router = useRouter();
  const { session } = UserAuth();

  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [session, router]);

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return <>{session && children}</>;
};

export default ProtectedLayout;
