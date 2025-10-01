import ProtectedLayout from "@/components/Private/ProtectedLayout";
import React from "react";

export default function ChamSocThanThePage() {
  return (
    <ProtectedLayout>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Trang Chăm Sóc Thân Thể</h1>
      </div>
    </ProtectedLayout>
  );
}
