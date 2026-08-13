"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserForm from "@/components/users/UserForm";

import { getUserById, User } from "@/services/userService";

export default function EditUserPage() {
  const params = useParams();
  const id = params?.id;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!id) return;
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
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit User" />
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          Loading user...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-500">
          {error}
        </div>
      ) : (
        <UserForm userToEdit={user} onUserUpdated={fetchUser} />
      )}
    </div>
  );
}
