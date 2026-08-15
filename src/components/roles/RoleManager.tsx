"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Input from "@/components/form/input/InputField";
import Link from "next/link";
import { fetchRoles, deleteRole, Role } from "@/services/roleService";
import { getPaginationRange } from "@/utils/pagination";

export default function RoleManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchRoles();
      if (result.success) {
        setRoles(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  // Local filtering and pagination
  const filteredRoles = useMemo(() => {
    if (!searchName.trim()) return roles;
    const lowerSearch = searchName.toLowerCase();
    return roles.filter(role => role.name.toLowerCase().includes(lowerSearch));
  }, [roles, searchName]);

  const totalItems = filteredRoles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Reset to page 1 if search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchName]);

  const paginatedRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRoles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRoles, currentPage, itemsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        const result = await deleteRole(id);
        const isSuccess = Boolean(result && (result.success || result.Success));
        if (isSuccess) {
          const targetPage = roles.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
          if (targetPage !== currentPage) {
            setCurrentPage(targetPage);
          } else {
            loadRoles();
          }
        } else {
          alert(result?.message || result?.Message || "Failed to delete role");
        }
      } catch (error) {
        console.error("Error deleting role:", error);
        alert("An error occurred");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Search
        </h3>
        <div className="flex max-w-sm flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Roles
          </h3>
          <Link href="/dashboard/roles/create">
            <Button startIcon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3.75V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}>
              Add New Role
            </Button>
          </Link>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 bg-brand-50 dark:border-white/[0.05] dark:bg-brand-500/10">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    ID
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Description
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Permissions Count
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-center font-medium text-gray-800 dark:text-gray-200">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                      Loading roles...
                    </TableCell>
                  </TableRow>
                ) : paginatedRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                      No roles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="px-5 py-4 text-start">
                        {role.id}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                        {role.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                        <div className="max-w-[300px] truncate" title={role.description}>
                          {role.description || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                          {role.permissions?.length || 0} permissions
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/dashboard/roles/show/${role.id}`}
                            className="flex items-center gap-1 rounded bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            View
                          </Link>
                          <Link
                            href={`/dashboard/roles/edit/${role.id}`}
                            className="flex items-center gap-1 rounded bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-500 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="flex items-center gap-1 rounded bg-error-50 px-3 py-1.5 text-xs font-medium text-error-500 hover:bg-error-100 dark:bg-error-500/10 dark:hover:bg-error-500/20"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-gray-100 p-5 dark:border-white/[0.05]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="flex items-center gap-1">
              {getPaginationRange(currentPage, totalPages).map((page, idx) => {
                if (page === "...") {
                  return (
                    <span key={`ellipsis-${idx}`} className="flex h-8 w-8 items-center justify-center text-sm text-gray-400">
                      ...
                    </span>
                  );
                }
                const pageNum = Number(page);
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-brand-500 text-white"
                        : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.75 4.5L11.25 9L6.75 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
