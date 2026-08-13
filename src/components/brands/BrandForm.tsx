"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { createBrand, updateBrand, Brand } from "@/services/brandService";

interface BrandFormProps {
  brandToEdit?: Brand | null;
}

export default function BrandForm({ brandToEdit }: BrandFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (brandToEdit) {
      setName(brandToEdit.name);
      setDescription(brandToEdit.description || "");
      setExistingImageUrl(brandToEdit.imageUrl || "");
    }
  }, [brandToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("Description", description);
      if (imageFile) {
        formData.append("Image", imageFile);
      }

      if (brandToEdit) {
        await updateBrand(brandToEdit.id, formData);
      } else {
        await createBrand(formData);
      }
      router.push("/dashboard/brands");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-800 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        <div>
          <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            type="text"
            placeholder="Brand Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            placeholder="Brand Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          ></textarea>
        </div>

        <div>
          <Label htmlFor="image">Image {brandToEdit ? "" : <span className="text-red-500">*</span>}</Label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            required={!brandToEdit}
          />
          {existingImageUrl && !imageFile && (
            <div className="mt-2 text-sm text-gray-500">
              Current image: <a href={`http://localhost:5267${existingImageUrl}`} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline">View Image</a>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : brandToEdit ? "Update Brand" : "Create Brand"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/brands")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
