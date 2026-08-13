import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { fetchDashboardStatistics } from "@/services/dashboardService";

export const metadata: Metadata = {
  title: "Admin Dashboard Home",
  description: "Overview of system statistics and metrics.",
};

export default async function Ecommerce() {
  
  let stats = null;
  let error = null;

  try {
    const result = await fetchDashboardStatistics();
    if (result.success) {
      stats = result.data;
    } else {
      error = result.message || "Failed to load statistics.";
    }
  } catch (e) {
    console.error("Error fetching dashboard statistics", e);
    error = "Network error loading statistics.";
  }

  if (error || !stats) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Dashboard" />
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-500">
          {error || "No data available."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="flex flex-col gap-6 mt-6">
        <EcommerceMetrics 
          totalProducts={stats.totalProducts}
          totalCategories={stats.totalCategories}
          totalUsers={stats.totalUsers}
          totalOrders={stats.totalOrders}
          totalRevenue={stats.totalRevenue}
        />

        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          <MonthlySalesChart monthlyOrders={stats.monthlyOrders} />
          <RecentOrders recentOrders={stats.recentOrders} />
        </div>
      </div>
    </div>
  );
}
