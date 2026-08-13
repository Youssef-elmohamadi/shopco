import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CategoryForm from "@/components/categories/CategoryForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Category | Admin Dashboard",
  description: "Create a new category",
};

export default function CreateCategoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Category" />
      <CategoryForm />
    </div>
  );
}
