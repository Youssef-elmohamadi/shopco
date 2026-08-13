import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import RoleManager from "@/components/roles/RoleManager";

export const metadata: Metadata = {
  title: "Roles Management | Admin Dashboard",
  description: "Manage roles and permissions in the admin dashboard.",
};

export default function RolesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Roles" />
      <RoleManager />
    </div>
  );
}
