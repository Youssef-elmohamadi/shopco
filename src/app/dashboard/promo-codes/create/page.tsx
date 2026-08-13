import React from "react";
import PromoCodeForm from "@/components/promo-codes/PromoCodeForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function CreatePromoCodePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Promo Code" />
      <div className="mt-4">
        <PromoCodeForm />
      </div>
    </div>
  );
}
