import React from "react";
import PromoCodeForm from "@/components/promo-codes/PromoCodeForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import * as promoCodeService from "@/services/promoCodeService";
import { notFound } from "next/navigation";


export const metadata = {
  title: "Edit Promo Codes Dashboard",
};


export default async function EditPromoCodePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let promoCode = null;
  
  try {
    const result = await promoCodeService.getPromoCodeById(params.id);
    const isSuccess = Boolean(result && (result.success || result.Success));
    const promoData = result?.data || result?.Data;

    if (isSuccess && promoData) {
      promoCode = promoData;
    } else {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching promo code", error);
    notFound();
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Promo Code" />
      <div className="mt-4">
        <PromoCodeForm promoCodeToEdit={promoCode} />
      </div>
    </div>
  );
}
