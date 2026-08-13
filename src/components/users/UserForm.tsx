"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import { createUser, updateUser, assignRoleToUser, removeRoleFromUser, User } from "@/services/userService";
import { fetchRoles, Role } from "@/services/roleService";

interface UserFormProps {
  userToEdit?: User | null;
  onUserUpdated?: () => void; // Callback to refresh user if roles are changed
}

export default function UserForm({ userToEdit, onUserUpdated }: UserFormProps) {
  const router = useRouter();
  
  // Basic Info State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  // Creation Only State
  const [password, setPassword] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  
  // Common State
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  
  // Role Management State (Edit Mode)
  const [roleToAssign, setRoleToAssign] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await fetchRoles();
        if (res.success && Array.isArray(res.data)) {
          setAvailableRoles(res.data);
        }
      } catch (error) {
        console.error("Failed to load roles", error);
      }
    };
    loadRoles();
  }, []);

  useEffect(() => {
    if (userToEdit) {
      setFirstName(userToEdit.firstName);
      setLastName(userToEdit.lastName);
      setEmail(userToEdit.email);
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (userToEdit) {
        // Update User
        const payload = { firstName, lastName, email };
        const result = await updateUser(userToEdit.id, payload);
        
        if (result.success) {
          router.push("/dashboard/users");
        } else {
          setErrors(result.errors || {});
          if (!result.errors) alert(result.message || "An error occurred");
        }
      } else {
        // Create User
        if (!selectedRoleId) {
          alert("Please select an initial role.");
          setIsLoading(false);
          return;
        }

        const payload = { 
          firstName, 
          lastName, 
          email, 
          password, 
          roleId: parseInt(selectedRoleId) 
        };
        const result = await createUser(payload);

        if (result.success) {
          router.push("/dashboard/users");
        } else {
          setErrors(result.errors || {});
          if (!result.errors) alert(result.message || "An error occurred");
        }
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Network error, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!userToEdit || !roleToAssign) return;
    setIsAssigning(true);
    try {
      const result = await assignRoleToUser(userToEdit.id, parseInt(roleToAssign));
      if (result.success) {
        alert("Role assigned successfully");
        setRoleToAssign("");
        if (onUserUpdated) onUserUpdated();
      } else {
        alert(result.message || "Failed to assign role");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveRole = async (roleId: number) => {
    if (!userToEdit) return;
    if (window.confirm("Are you sure you want to remove this role from the user?")) {
      try {
        const result = await removeRoleFromUser(userToEdit.id, roleId);
        if (result.success) {
          alert("Role removed successfully");
          if (onUserUpdated) onUserUpdated();
        } else {
          alert(result.message || "Failed to remove role");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred");
      }
    }
  };

  // Determine which roles the user does NOT have yet for the dropdown
  const unassignedRoles = availableRoles.filter(
    role => !userToEdit?.roles?.some(ur => ur.id === role.id)
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {userToEdit ? "Update User Details" : "Create New User"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name <span className="text-error-500">*</span></Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                minLength={2}
                maxLength={50}
              />
              {errors.FirstName && (
                <p className="mt-1 text-sm text-error-500">{errors.FirstName.join(", ")}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name <span className="text-error-500">*</span></Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                minLength={2}
                maxLength={50}
              />
              {errors.LastName && (
                <p className="mt-1 text-sm text-error-500">{errors.LastName.join(", ")}</p>
              )}
            </div>

            <div className={!userToEdit ? "sm:col-span-2" : "sm:col-span-2"}>
              <Label htmlFor="email">Email <span className="text-error-500">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.Email && (
                <p className="mt-1 text-sm text-error-500">{errors.Email.join(", ")}</p>
              )}
            </div>

            {/* Creation Only Fields */}
            {!userToEdit && (
              <>
                <div className="sm:col-span-2">
                  <Label htmlFor="password">Password <span className="text-error-500">*</span></Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Strong Password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  {errors.Password && (
                    <p className="mt-1 text-sm text-error-500">{errors.Password.join(", ")}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="roleId">Initial Role <span className="text-error-500">*</span></Label>
                  <select
                    id="roleId"
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder-gray-500"
                  >
                    <option value="" disabled>Select a role</option>
                    {availableRoles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                  {errors.RoleId && (
                    <p className="mt-1 text-sm text-error-500">{errors.RoleId.join(", ")}</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : userToEdit ? "Update Basic Details" : "Create User"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/users")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Role Management Section (Only in Edit Mode) */}
      {userToEdit && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Manage User Roles
          </h3>
          
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Roles
            </h4>
            {userToEdit.roles && userToEdit.roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userToEdit.roles.map(role => (
                  <div key={role.id} className="flex items-center gap-2 rounded bg-brand-50 px-3 py-1.5 dark:bg-brand-500/10">
                    <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                      {role.name}
                    </span>
                    <button
                      onClick={() => handleRemoveRole(role.id)}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-brand-500 hover:bg-brand-100 hover:text-brand-800 dark:hover:bg-brand-500/20"
                      title={`Remove ${role.name}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No roles assigned to this user.</p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6 dark:border-white/[0.05]">
            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Assign New Role
            </h4>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={roleToAssign}
                onChange={(e) => setRoleToAssign(e.target.value)}
                className="w-full max-w-sm rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="" disabled>Select a role to assign</option>
                {unassignedRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <Button 
                onClick={handleAssignRole} 
                disabled={!roleToAssign || isAssigning}
              >
                {isAssigning ? "Assigning..." : "Assign Role"}
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
