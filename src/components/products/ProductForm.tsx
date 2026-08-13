"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";

import { createProduct, updateProduct, Product, ProductVariant } from "@/services/productService";
import * as categoryService from "@/services/categoryService";
import { Category } from "@/services/categoryService";
import { fetchBrands, Brand } from "@/services/brandService";

interface ProductFormProps {
  productToEdit?: Product | null;
}

export default function ProductForm({ productToEdit }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("0");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  
  const [variants, setVariants] = useState<Partial<ProductVariant>[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";

  useEffect(() => {
    // Fetch categories for dropdown
    const loadCategories = async () => {
      try {
        const result = await categoryService.fetchCategories(1, 100);
        if (result.success) {
          setCategories(result.data.items || []);
        }
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };
    const loadBrands = async () => {
      try {
        const result = await fetchBrands();
        if (result.success) {
          setBrands(result.data || []);
        }
      } catch (err) {
        console.error("Error loading brands", err);
      }
    };
    loadCategories();
    loadBrands();
  }, []);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description || "");
      setPrice(productToEdit.price.toString());
      setDiscountPrice(productToEdit.discountPrice.toString());
      setStock(productToEdit.stock.toString());
      setCategoryId(productToEdit.categoryId.toString());
      if (productToEdit.brandId) {
        setBrandId(productToEdit.brandId.toString());
      }
      
      if (productToEdit.images && productToEdit.images.length > 0) {
        setExistingImages(
          productToEdit.images.map(img => ({
            id: img.id,
            url: img.url.startsWith("http") ? img.url : `${API_BASE_URL}${img.url}`
          }))
        );
      }

      if (productToEdit.variants && productToEdit.variants.length > 0) {
        setVariants(productToEdit.variants);
      }
    }
  }, [productToEdit, API_BASE_URL]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...filesArray]);
      
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...previews]);
    }
    // Reset file input
    if (e.target) e.target.value = '';
  };

  const handleRemoveNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (id: number) => {
    setExistingImages(prev => prev.filter(img => img.id !== id));
    setDeletedImageIds(prev => [...prev, id]);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: "", colorName: "", colorHex: "#000000", price: 0, discountPrice: 0, stock: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("Price", price);
    formData.append("DiscountPrice", discountPrice);
    formData.append("Stock", stock);
    formData.append("CategoryId", categoryId);
    if (brandId) formData.append("BrandId", brandId);

    // Append multiple images
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append("Images", imageFiles[i]);
      }
    }

    // Append deleted image IDs
    if (deletedImageIds.length > 0) {
      deletedImageIds.forEach(id => formData.append("DeletedImageIds", id.toString()));
    }

    // Append Variants
    variants.forEach((variant, index) => {
      formData.append(`Variants[${index}].Size`, variant.size || "");
      formData.append(`Variants[${index}].ColorName`, variant.colorName || "");
      formData.append(`Variants[${index}].ColorHex`, variant.colorHex || "#000000");
      formData.append(`Variants[${index}].Price`, variant.price?.toString() || "0");
      formData.append(`Variants[${index}].DiscountPrice`, variant.discountPrice?.toString() || "0");
      formData.append(`Variants[${index}].Stock`, variant.stock?.toString() || "0");
    });

    try {
      const result = productToEdit
        ? await updateProduct(productToEdit.id, formData)
        : await createProduct(formData);

      if (result.success) {
        router.push("/dashboard/products");
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Name <span className="text-error-500">*</span></Label>
            <Input
              id="name"
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              required
              minLength={2}
              maxLength={200}
            />
            {errors.Name && (
              <p className="mt-1 text-sm text-error-500">{errors.Name.join(", ")}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="description">Description <span className="text-error-500">*</span></Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder-gray-500"
              required
            ></textarea>
            {errors.Description && (
              <p className="mt-1 text-sm text-error-500">{errors.Description.join(", ")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Price <span className="text-error-500">*</span></Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="99.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full"
              required
              min="0.01"
            />
            {errors.Price && (
              <p className="mt-1 text-sm text-error-500">{errors.Price.join(", ")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="discountPrice">Discount Price</Label>
            <Input
              id="discountPrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full"
              min="0"
            />
            {errors.DiscountPrice && (
              <p className="mt-1 text-sm text-error-500">{errors.DiscountPrice.join(", ")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="stock">Stock <span className="text-error-500">*</span></Label>
            <Input
              id="stock"
              type="number"
              placeholder="100"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full"
              required
              min="0"
            />
            {errors.Stock && (
              <p className="mt-1 text-sm text-error-500">{errors.Stock.join(", ")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="categoryId">Category <span className="text-error-500">*</span></Label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.CategoryId && (
              <p className="mt-1 text-sm text-error-500">{errors.CategoryId.join(", ")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="brandId">Brand</Label>
            <select
              id="brandId"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="">No Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.BrandId && (
              <p className="mt-1 text-sm text-error-500">{errors.BrandId.join(", ")}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="images">Product Images</Label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
            
            {/* Show Previews of Newly Selected Images */}
            {previewImages.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-gray-500">Selected Images:</p>
                <div className="flex flex-wrap gap-4">
                  {previewImages.map((src, idx) => (
                    <div key={idx} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <Image src={src} alt={`Preview ${idx}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(idx)}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-red-600"
                        title="Remove image"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show Existing Images if Editing */}
            {productToEdit && existingImages.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-gray-500">Current Images:</p>
                <div className="flex flex-wrap gap-4">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <Image src={img.url} alt={`Existing ${idx}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(img.id)}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-red-600"
                        title="Remove image"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Variants Section */}
          <div className="sm:col-span-2 border-t border-gray-200 pt-6 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Variants</h3>
              <Button type="button" onClick={handleAddVariant} variant="outline" size="sm" className="flex items-center gap-2">
                <Plus size={16} /> Add Variant
              </Button>
            </div>
            
            {variants.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No variants added. Product will be treated as a single item.</p>
            ) : (
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-start bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl relative border border-gray-200 dark:border-gray-700">
                    <button 
                      type="button" 
                      onClick={() => handleRemoveVariant(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                      title="Remove Variant"
                    >
                      <Trash2 size={14} />
                    </button>
                    
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Size</Label>
                      <Input 
                        value={variant.size} 
                        onChange={(e) => handleVariantChange(index, "size", e.target.value)} 
                        placeholder="e.g. S, M, L, XL"
                        className="w-full mt-1"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Color Name</Label>
                      <Input 
                        value={variant.colorName} 
                        onChange={(e) => handleVariantChange(index, "colorName", e.target.value)} 
                        placeholder="e.g. Red, Blue"
                        className="w-full mt-1"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <Label className="text-xs">Color</Label>
                      <div className="flex items-center gap-2 mt-1 h-11">
                        <input 
                          type="color" 
                          value={variant.colorHex} 
                          onChange={(e) => handleVariantChange(index, "colorHex", e.target.value)} 
                          className="h-8 w-10 cursor-pointer rounded border border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Price</Label>
                        <Input 
                          type="number" step="0.01" 
                          value={variant.price} 
                          onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value))} 
                          className="w-full mt-1 px-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Disc.</Label>
                        <Input 
                          type="number" step="0.01" 
                          value={variant.discountPrice} 
                          onChange={(e) => handleVariantChange(index, "discountPrice", parseFloat(e.target.value))} 
                          className="w-full mt-1 px-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Stock</Label>
                        <Input 
                          type="number" 
                          value={variant.stock} 
                          onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value))} 
                          className="w-full mt-1 px-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : productToEdit ? "Update Product" : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/products")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

