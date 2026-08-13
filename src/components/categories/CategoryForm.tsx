"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Image from "next/image";

import * as categoryService from "@/services/categoryService";
import { Category } from "@/services/categoryService";

interface CategoryFormProps {
  categoryToEdit?: Category | null;
}

export default function CategoryForm({ categoryToEdit }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7260";

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setDescription(categoryToEdit.description || "");
      if (categoryToEdit.imageUrl) {
        setPreviewImage(
          categoryToEdit.imageUrl.startsWith("http")
            ? categoryToEdit.imageUrl
            : `${API_BASE_URL}${categoryToEdit.imageUrl}`
        );
      } else {
        setPreviewImage(null);
      }
    }
  }, [categoryToEdit, API_BASE_URL]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    setRemoveImage(true);
    // Reset file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("Name", name);
    if (description) formData.append("Description", description);
    if (imageFile) formData.append("Image", imageFile);
    if (removeImage && categoryToEdit) formData.append("RemoveImage", "true");

    try {
      const result = categoryToEdit
        ? await categoryService.updateCategory(categoryToEdit.id, formData)
        : await categoryService.createCategory(formData);

      if (result.success) {
        router.push("/dashboard/categories");
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          alert(result.message || "An error occurred");
        }
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Network error, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Name <span className="text-error-500">*</span></Label>
          <Input
            id="name"
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            required
            minLength={2}
            maxLength={100}
          />
          {errors.Name && (
            <p className="mt-1 text-sm text-error-500">{errors.Name.join(", ")}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            placeholder="Category Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder-gray-500"
            maxLength={500}
          ></textarea>
        </div>

        <div>
          <Label htmlFor="image">Image</Label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
          {previewImage && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-gray-500">Preview:</p>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs font-medium text-error-500 hover:text-error-600"
                >
                  Remove Image
                </button>
              </div>
              <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : categoryToEdit ? "Update Category" : "Create Category"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/categories")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
