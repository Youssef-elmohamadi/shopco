import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import RoleForm from "@/components/roles/RoleForm";

export const metadata: Metadata = {
  title: "Create Role | Admin Dashboard",
  description: "Create a new role.",
};

export default function CreateRolePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Role" />
      <RoleForm />
    </div>
  );
}
