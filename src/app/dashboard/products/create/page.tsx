import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductForm from "@/components/products/ProductForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Product | Admin Dashboard",
  description: "Create a new product",
};

export default function CreateProductPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Product" />
      <ProductForm />
    </div>
  );
}
