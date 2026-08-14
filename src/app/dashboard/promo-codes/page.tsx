import React from "react";
import PromoCodeManager from "@/components/promo-codes/PromoCodeManager";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";


export const metadata = {
  title: "Promo Codes Dashboard",
};


export default function PromoCodesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Promo Codes" />
      <div className="mt-4">
        <PromoCodeManager />
      </div>
    </div>
  );
}
