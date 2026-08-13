"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";

import { getUserById, User } from "@/services/userService";

export default function ShowUserPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const result = await getUserById(id as string);
          if (result.success && result.data) {
            setUser(result.data);
          } else {
            setError("User not found.");
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("Failed to fetch user details.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    }
  }, [id]);

  return (
    <div>
      <PageBreadcrumb pageTitle="User Details" />
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          Loading user...
        </div>
      ) : error || !user ? (
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-500">
          {error || "User not found."}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Details Section */}
            <div className="flex w-full flex-col gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                  {user.firstName} {user.lastName}
                </h3>
                <span className="mt-2 inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-sm font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                  ID: {user.id}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </h4>
                <p className="mt-1 text-base text-gray-800 dark:text-gray-200">
                  {user.email}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Roles ({user.roles?.length || 0})
                </h4>
                {user.roles && user.roles.length > 0 ? (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {user.roles.map(r => (
                      <li key={r.id} className="inline-flex items-center rounded bg-brand-50 px-2.5 py-1 text-sm font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                        {r.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">No roles assigned.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created At
                  </h4>
                  <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Updated
                  </h4>
                  <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                    {new Date(user.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-3 border-t border-gray-100 pt-6 dark:border-white/[0.05]">
            <Button onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}>
              Edit User
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/users")}>
              Back to Users
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
