"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";

import { getOrderById, changeOrderStatus, Order } from "@/services/orderService";

export default function ShowOrderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [statusInput, setStatusInput] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const result = await getOrderById(id as string);
          if (result.success && result.data) {
            setOrder(result.data);
            setStatusInput(result.data.status);
          } else {
            setError("Order not found.");
          }
        } catch (err) {
          console.error("Error fetching order:", err);
          setError("Failed to fetch order details.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrder();
    }
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!order || !statusInput) return;
    setIsUpdatingStatus(true);
    try {
      const result = await changeOrderStatus(order.id, statusInput);
      if (result.success && result.data) {
        setOrder(result.data);
        setStatusInput(result.data.status);
        alert("Order status updated successfully!");
      } else {
        alert(result.message || "Failed to update status.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400";
      case "shipped":
        return "bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-400";
      case "delivered":
        return "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400";
      case "cancelled":
        return "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Order Details" />
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          Loading order...
        </div>
      ) : error || !order ? (
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-500">
          {error || "Order not found."}
        </div>
      ) : (
        <div className="flex flex-col gap-6 xl:flex-row">
          
          {/* Main Details Section */}
          <div className="flex w-full flex-col gap-6 xl:w-2/3">
            {/* Order Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-5 dark:border-white/[0.05]">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    Order #{order.id}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Customer Info
                  </h4>
                  <p className="text-base text-gray-800 dark:text-gray-200">User ID: {order.userId}</p>
                  <p className="text-base text-gray-800 dark:text-gray-200">Phone: {order.phoneNumber}</p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment & Shipping
                  </h4>
                  <p className="text-base text-gray-800 dark:text-gray-200">Payment: {order.paymentMethod}</p>
                  <p className="text-base text-gray-800 dark:text-gray-200">
                    {order.shippingStreetAddress}, {order.shippingCity}
                    <br />
                    {order.shippingState}, {order.shippingZipCode}
                    <br />
                    {order.shippingCountry}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Ordered Items
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-3">Product Name</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 dark:border-white/[0.05]">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            {item.productName} (ID: {item.productId})
                          </td>
                          <td className="px-4 py-3">${item.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            ${item.totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-center">No items found.</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold text-gray-900 dark:text-white">
                      <td colSpan={3} className="px-4 py-3 text-right">Total Amount</td>
                      <td className="px-4 py-3 text-brand-600 dark:text-brand-400 text-lg">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Status Editor */}
          <div className="flex w-full flex-col gap-6 xl:w-1/3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                Update Status
              </h3>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Change the order status to reflect its current progress.
              </p>
              
              <div className="space-y-4">
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                
                <Button 
                  onClick={handleUpdateStatus} 
                  disabled={isUpdatingStatus || statusInput === order.status}
                  className="w-full justify-center"
                >
                  {isUpdatingStatus ? "Updating..." : "Save Status"}
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                Actions
              </h3>
              <Button 
                variant="outline" 
                onClick={() => router.push("/dashboard/orders")}
                className="w-full justify-center"
              >
                Back to Orders List
              </Button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
