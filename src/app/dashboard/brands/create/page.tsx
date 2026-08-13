import React from "react";
import BrandForm from "@/components/brands/BrandForm";

export default function CreateBrandPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">Add New Brand</h2>
      </div>
      <BrandForm />
    </div>
  );
}
