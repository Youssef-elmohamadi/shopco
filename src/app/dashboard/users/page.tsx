import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import UserManager from "@/components/users/UserManager";

export const metadata: Metadata = {
  title: "Users Management | Admin Dashboard",
  description: "Manage users in the admin dashboard.",
};

export default function UsersPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <UserManager />
    </div>
  );
}
