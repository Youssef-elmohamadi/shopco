"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBrands, deleteBrand, Brand } from "@/services/brandService";
import Button from "@/components/ui/button/Button";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const response = await fetchBrands();
      if (response.success) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch brands", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteBrand(id);
        loadBrands();
      } catch (error) {
        console.error("Failed to delete brand", error);
        alert("Failed to delete brand");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">Brands</h2>
        <Link href="/dashboard/brands/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Brand
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-white/[0.02] dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">Loading...</td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">No brands found.</td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white/90">
                      {brand.name}
                    </td>
                    <td className="px-6 py-4">{brand.description}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/dashboard/brands/edit/${brand.id}`}>
                          <button className="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500">
                            <Edit className="h-5 w-5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
