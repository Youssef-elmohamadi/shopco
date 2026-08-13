"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useCallback } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";

import * as promoCodeService from "@/services/promoCodeService";
import { PromoCode } from "@/services/promoCodeService";

export default function PromoCodeManager() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promoCodeToDelete, setPromoCodeToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPromoCodes = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await promoCodeService.fetchPromoCodes();
      const isSuccess = Boolean(result && (result.success || result.Success));
      const listData = result?.data || result?.Data;

      if (isSuccess) {
        setPromoCodes(listData || []);
      }
    } catch (error) {
      console.error("Failed to fetch promo codes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromoCodes();
  }, [fetchPromoCodes]);

  const confirmDelete = (id: number) => {
    setPromoCodeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!promoCodeToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await promoCodeService.deletePromoCode(promoCodeToDelete);
      const isSuccess = Boolean(result && (result.success || result.Success));
      if (isSuccess) {
        setIsDeleteModalOpen(false);
        fetchPromoCodes();
      } else {
        alert(result?.message || result?.Message || "Failed to delete promo code");
      }
    } catch (error) {
      console.error("Error deleting promo code:", error);
      alert("An error occurred");
    } finally {
      setIsDeleting(false);
      setPromoCodeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Promo Codes
          </h3>
          <Link href="/dashboard/promo-codes/create">
            <Button startIcon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3.75V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}>
              Add New Promo Code
            </Button>
          </Link>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 bg-brand-50 dark:border-white/[0.05] dark:bg-brand-500/10">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Code
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Type
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Value
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Validity
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Usage
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-center font-medium text-gray-800 dark:text-gray-200">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                      Loading promo codes...
                    </TableCell>
                  </TableRow>
                ) : promoCodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                      No promo codes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  promoCodes.map((promo) => {
                    const isPercentage =
                      promo.type === 0 ||
                      promo.type === "0" ||
                      (typeof promo.type === "string" && promo.type.toLowerCase().includes("percentage"));

                    return (
                      <TableRow key={promo.id}>
                        <TableCell className="px-5 py-4 text-start font-bold text-gray-800 dark:text-white/90 uppercase">
                          {promo.code}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                          {isPercentage ? "Percentage (%)" : "Fixed Amount (EGP)"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                          {isPercentage ? `${promo.value}%` : `${promo.value} EGP`}
                        </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400 text-sm">
                        {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                        {promo.timesUsed} {promo.usageLimit ? `/ ${promo.usageLimit}` : ""}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge 
                          color={promo.isActive && new Date(promo.endDate) >= new Date() ? "success" : "error"}
                        >
                          {promo.isActive && new Date(promo.endDate) >= new Date() ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/dashboard/promo-codes/edit/${promo.id}`}
                            className="flex items-center gap-1 rounded bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-500 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => confirmDelete(promo.id)}
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
                  );
                })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Awesome Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)} 
        className="max-w-[400px] p-6 text-center"
      >
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16.01L12.01 15.9989" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Delete Promo Code</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you absolutely sure you want to delete this promo code? This action cannot be undone.
          </p>
        </div>
        <div className="flex w-full gap-3">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            className="w-full bg-error-500 text-white hover:bg-error-600 focus:ring-error-500" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete it"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
