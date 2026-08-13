"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { getOrderById, Order } from "@/services/orderService";
import { ArrowLeft, Package, MapPin, CreditCard, Calendar } from "lucide-react";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(resolvedParams.id, false);
        setOrder(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center text-gray-500 dark:bg-gray-800 dark:border-gray-700">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center text-red-500 dark:bg-gray-800 dark:border-gray-700">
        {error || "Order not found."}
        <div className="mt-4">
          <Link href="/profile/orders" className="text-black underline dark:text-white">Back to Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link & Header */}
      <div className="flex items-center gap-4">
        <Link href="/profile/orders" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        
        {/* Order Header Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-700 mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-1 dark:text-gray-400">Order ID</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">#{order.id}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1 dark:text-gray-400">Date Placed</div>
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Calendar size={16} className="text-gray-400" />
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1 dark:text-gray-400">Total Amount</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">EGP {order.totalAmount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1 dark:text-gray-400">Status</div>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              order.status === "Pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
              order.status === "Processing" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
              order.status === "Shipped" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" :
              order.status === "Delivered" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
              order.status === "Cancelled" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
              "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 dark:text-white">
              <MapPin size={20} className="text-gray-400" /> Shipping Address
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl text-gray-700 dark:bg-gray-900/50 dark:text-gray-300">
              <p className="mb-1">{order.shippingStreetAddress}</p>
              <p className="mb-1">{order.shippingCity}, {order.shippingState} {order.shippingZipCode}</p>
              <p>{order.shippingCountry}</p>
              <p className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">Phone: {order.phoneNumber}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 dark:text-white">
              <CreditCard size={20} className="text-gray-400" /> Payment Method
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl text-gray-700 dark:bg-gray-900/50 dark:text-gray-300">
              <p className="font-medium">{order.paymentMethod === "CashOnDelivery" ? "Cash on Delivery" : order.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 dark:text-white">
            <Package size={20} className="text-gray-400" /> Order Items
          </h3>
          <div className="border border-gray-200 rounded-xl overflow-hidden dark:border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium text-center">Price</th>
                  <th className="p-4 font-medium text-center">Qty</th>
                  <th className="p-4 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.map((item) => (
                  <tr key={item.id} className="text-gray-800 dark:text-gray-200">
                    <td className="p-4 font-medium">
                      <Link href={`/product/${item.productId}`} className="hover:underline">
                        {item.productName}
                      </Link>
                    </td>
                    <td className="p-4 text-center">EGP {item.unitPrice}</td>
                    <td className="p-4 text-center">{item.quantity}</td>
                    <td className="p-4 text-right font-medium">EGP {item.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <td colSpan={3} className="p-4 text-right font-medium text-gray-900 dark:text-white">
                    Grand Total
                  </td>
                  <td className="p-4 text-right font-bold text-gray-900 dark:text-white">
                    EGP {order.totalAmount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
