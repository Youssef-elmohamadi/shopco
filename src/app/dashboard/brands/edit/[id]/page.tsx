"use client";

import React, { useEffect, useState } from "react";
import BrandForm from "@/components/brands/BrandForm";
import { getBrandById, Brand } from "@/services/brandService";
import { useParams } from "next/navigation";

export default function EditBrandPage() {
  const params = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadBrand(params.id as string);
    }
  }, [params.id]);

  const loadBrand = async (id: string) => {
    try {
      const response = await getBrandById(id);
      if (response.success) {
        setBrand(response.data);
      }
    } catch (error) {
      console.error("Failed to load brand", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Brand</h2>
      </div>
      <BrandForm brandToEdit={brand} />
    </div>
  );
}
