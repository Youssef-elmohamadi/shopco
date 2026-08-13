"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { createRole, updateRole, fetchPermissions, Role, Permission } from "@/services/roleService";

interface RoleFormProps {
  roleToEdit?: Role | null;
}

export default function RoleForm({ roleToEdit }: RoleFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const loadPermissions = async () => {
      const res = await fetchPermissions();
      if (res.success && Array.isArray(res.data)) {
        setAvailablePermissions(res.data);
      }
    };
    loadPermissions();
  }, []);

  useEffect(() => {
    if (roleToEdit) {
      setName(roleToEdit.name);
      setDescription(roleToEdit.description || "");
      if (roleToEdit.permissions) {
        setSelectedPermissionIds(roleToEdit.permissions.map(p => p.id));
      }
    }
  }, [roleToEdit]);

  const handlePermissionToggle = (id: number) => {
    setSelectedPermissionIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const payload = {
      name,
      description,
      permissionIds: selectedPermissionIds
    };

    try {
      const result = roleToEdit
        ? await updateRole(roleToEdit.id, payload)
        : await createRole(payload);

      if (result.success) {
        router.push("/dashboard/roles");
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          alert(result.message || "An error occurred");
        }
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Network error, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Role Name <span className="text-error-500">*</span></Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Admin, Editor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              required
              minLength={2}
              maxLength={50}
            />
            {errors.Name && (
              <p className="mt-1 text-sm text-error-500">{errors.Name.join(", ")}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Brief description of the role's access level"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder-gray-500"
              maxLength={200}
            ></textarea>
            {errors.Description && (
              <p className="mt-1 text-sm text-error-500">{errors.Description.join(", ")}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Label>Permissions</Label>
            {availablePermissions.length > 0 ? (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                {availablePermissions.map(permission => (
                  <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPermissionIds.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {permission.name}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No permissions loaded or available. If the API is missing, you cannot assign permissions yet.
              </p>
            )}
            {errors.PermissionIds && (
              <p className="mt-1 text-sm text-error-500">{errors.PermissionIds.join(", ")}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : roleToEdit ? "Update Role" : "Create Role"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/roles")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
