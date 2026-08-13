"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

import * as promoCodeService from "@/services/promoCodeService";
import { PromoCode } from "@/services/promoCodeService";

interface PromoCodeFormProps {
  promoCodeToEdit?: PromoCode | null;
}

export default function PromoCodeForm({ promoCodeToEdit }: PromoCodeFormProps) {
  const router = useRouter();
  
  const [code, setCode] = useState("");
  const [type, setType] = useState<number>(0);
  const [value, setValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [maxUsagePerUser, setMaxUsagePerUser] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (promoCodeToEdit) {
      const p = promoCodeToEdit as any;

      setCode(p.code ?? p.Code ?? "");

      // Parse type whether backend returned "Percentage"/"FixedAmount" string or 0/1 number
      const rawType = p.type ?? p.Type;
      let parsedType = 0;
      if (typeof rawType === "number") {
        parsedType = rawType;
      } else if (typeof rawType === "string") {
        if (rawType.toLowerCase().includes("percentage") || rawType === "0") {
          parsedType = 0;
        } else if (rawType.toLowerCase().includes("fixed") || rawType === "1") {
          parsedType = 1;
        }
      }
      setType(parsedType);

      const val = p.value ?? p.Value;
      setValue(val !== undefined && val !== null ? val.toString() : "");

      const minOrder = p.minOrderAmount ?? p.MinOrderAmount;
      setMinOrderAmount(minOrder !== undefined && minOrder !== null ? minOrder.toString() : "");

      const maxDisc = p.maxDiscountAmount ?? p.MaxDiscountAmount;
      setMaxDiscountAmount(maxDisc !== undefined && maxDisc !== null ? maxDisc.toString() : "");
      
      // Format dates for datetime-local input
      const formatForInput = (dateString?: string) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return "";
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      };
      
      const startD = p.startDate ?? p.StartDate;
      const endD = p.endDate ?? p.EndDate;
      setStartDate(formatForInput(startD));
      setEndDate(formatForInput(endD));

      const limit = p.usageLimit ?? p.UsageLimit;
      setUsageLimit(limit !== undefined && limit !== null ? limit.toString() : "");

      const maxPerUser = p.maxUsagePerUser ?? p.MaxUsagePerUser;
      setMaxUsagePerUser(maxPerUser !== undefined && maxPerUser !== null ? maxPerUser.toString() : "");

      const active = p.isActive ?? p.IsActive;
      setIsActive(active !== undefined && active !== null ? Boolean(active) : true);
    }
  }, [promoCodeToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const data = {
      code,
      type: Number(type),
      value: parseFloat(value),
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
      maxDiscountAmount: type === 0 && maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      maxUsagePerUser: maxUsagePerUser ? parseInt(maxUsagePerUser) : null,
      isActive
    };

    try {
      const result = promoCodeToEdit
        ? await promoCodeService.updatePromoCode(promoCodeToEdit.id, data)
        : await promoCodeService.createPromoCode(data);

      const isSuccess = Boolean(result && (result.success || result.Success));

      if (isSuccess) {
        router.push("/dashboard/promo-codes");
        router.refresh();
      } else {
        const errs = result?.errors || result?.Errors;
        if (errs) {
          setErrors(errs);
        } else {
          alert(result?.message || result?.Message || "An error occurred while saving the promo code.");
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="code">Promo Code <span className="text-error-500">*</span></Label>
            <Input
              id="code"
              type="text"
              placeholder="e.g. SUMMER50"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full uppercase"
              required
              minLength={3}
              maxLength={50}
            />
            {errors.Code && <p className="mt-1 text-sm text-error-500">{errors.Code.join(", ")}</p>}
          </div>

          <div>
            <Label htmlFor="type">Discount Type <span className="text-error-500">*</span></Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(parseInt(e.target.value))}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              required
            >
              <option value={0}>Percentage (%)</option>
              <option value={1}>Fixed Amount (EGP)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="value">Discount Value <span className="text-error-500">*</span></Label>
            <Input
              id="value"
              type="number"
              placeholder={type === 0 ? "e.g. 20" : "e.g. 150"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
              required
              min="0"
              step="0.01"
            />
            {errors.Value && <p className="mt-1 text-sm text-error-500">{errors.Value.join(", ")}</p>}
          </div>

          <div>
            <Label htmlFor="minOrderAmount">Min Order Amount (Optional)</Label>
            <Input
              id="minOrderAmount"
              type="number"
              placeholder="e.g. 500"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              className="w-full"
              min="0"
              step="0.01"
            />
          </div>

          {type === 0 && (
            <div>
              <Label htmlFor="maxDiscountAmount">Max Discount Amount (Optional)</Label>
              <Input
                id="maxDiscountAmount"
                type="number"
                placeholder="e.g. 200"
                value={maxDiscountAmount}
                onChange={(e) => setMaxDiscountAmount(e.target.value)}
                className="w-full"
                min="0"
                step="0.01"
              />
            </div>
          )}

          <div>
            <Label htmlFor="startDate">Start Date <span className="text-error-500">*</span></Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
              required
            />
            {errors.StartDate && <p className="mt-1 text-sm text-error-500">{errors.StartDate.join(", ")}</p>}
          </div>

          <div>
            <Label htmlFor="endDate">End Date <span className="text-error-500">*</span></Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
              required
            />
            {errors.EndDate && <p className="mt-1 text-sm text-error-500">{errors.EndDate.join(", ")}</p>}
          </div>

          <div>
            <Label htmlFor="usageLimit">Total Usage Limit (Optional)</Label>
            <Input
              id="usageLimit"
              type="number"
              placeholder="e.g. 100"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="w-full"
              min="1"
            />
          </div>

          <div>
            <Label htmlFor="maxUsagePerUser">Max Usage Per User (Optional)</Label>
            <Input
              id="maxUsagePerUser"
              type="number"
              placeholder="e.g. 1"
              value={maxUsagePerUser}
              onChange={(e) => setMaxUsagePerUser(e.target.value)}
              className="w-full"
              min="1"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
          />
          <Label htmlFor="isActive" className="mb-0">Active</Label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : promoCodeToEdit ? "Update Promo Code" : "Create Promo Code"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/promo-codes")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
