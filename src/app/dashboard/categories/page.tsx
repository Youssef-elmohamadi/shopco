import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import CategoryManager from "@/components/categories/CategoryManager";

export const metadata: Metadata = {
  title: "Categories Management | Admin Dashboard",
  description: "Manage categories in the admin dashboard.",
};

export default function CategoriesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Categories" />
      <CategoryManager />
    </div>
  );
}
