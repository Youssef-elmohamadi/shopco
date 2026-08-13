import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import OrderManager from "@/components/orders/OrderManager";

export const metadata: Metadata = {
  title: "Orders Management | Admin Dashboard",
  description: "Manage orders in the admin dashboard.",
};

export default function OrdersPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Orders" />
      <OrderManager />
    </div>
  );
}
