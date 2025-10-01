import ProtectedLayout from "@/components/Private/ProtectedLayout";
import React from "react";

export default function DuongTamTriPage() {
  return (
    <ProtectedLayout>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Trang Dưỡng Tâm Trí</h1>
      </div>
    </ProtectedLayout>
  );
}
