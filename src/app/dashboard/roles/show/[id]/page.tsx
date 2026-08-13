"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";

import { getRoleById, Role } from "@/services/roleService";

export default function ShowRolePage() {
  const params = useParams();
  const router = useRouter();
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
      <PageBreadcrumb pageTitle="Role Details" />
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          Loading role...
        </div>
      ) : error || !role ? (
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-500">
          {error || "Role not found."}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Details Section */}
            <div className="flex w-full flex-col gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                  {role.name}
                </h3>
                <span className="mt-2 inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-sm font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                  ID: {role.id}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description
                </h4>
                <p className="mt-1 text-base text-gray-800 dark:text-gray-200">
                  {role.description || "No description provided."}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Permissions ({role.permissions?.length || 0})
                </h4>
                {role.permissions && role.permissions.length > 0 ? (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {role.permissions.map(p => (
                      <li key={p.id} className="inline-flex items-center rounded bg-gray-100 px-2.5 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {p.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">No permissions assigned.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created At
                  </h4>
                  <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                    {new Date(role.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Updated
                  </h4>
                  <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                    {new Date(role.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-3 border-t border-gray-100 pt-6 dark:border-white/[0.05]">
            <Button onClick={() => router.push(`/dashboard/roles/edit/${role.id}`)}>
              Edit Role
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/roles")}>
              Back to Roles
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
