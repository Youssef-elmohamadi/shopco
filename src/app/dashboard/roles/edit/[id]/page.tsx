"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RoleForm from "@/components/roles/RoleForm";

import { getRoleById, Role } from "@/services/roleService";

export default function EditRolePage() {
  const params = useParams();
  const id = params?.id;
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchRole = async () => {
        try {
          const result = await getRoleById(id as string);
          if (result.success && result.data) {
            setRole(result.data);
          } else {
            setError("Role not found.");
          }
        } catch (err) {
          console.error("Error fetching role:", err);
          setError("Failed to fetch role details.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchRole();
    }
  }, [id]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Role" />
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          Loading role...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-500">
          {error}
        </div>
      ) : (
        <RoleForm roleToEdit={role} />
      )}
    </div>
  );
}
