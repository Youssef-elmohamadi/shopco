import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import UserForm from "@/components/users/UserForm";

export const metadata: Metadata = {
  title: "Create User | Admin Dashboard",
  description: "Create a new user.",
};

export default function CreateUserPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create User" />
      <UserForm />
    </div>
  );
}
