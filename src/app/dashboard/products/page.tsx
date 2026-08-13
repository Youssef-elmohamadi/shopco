import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import ProductManager from "@/components/products/ProductManager";

export const metadata: Metadata = {
  title: "Products Management | Admin Dashboard",
  description: "Manage products in the admin dashboard.",
};

export default function ProductsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Products" />
      <ProductManager />
    </div>
  );
}
