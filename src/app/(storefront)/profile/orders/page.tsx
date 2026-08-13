"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getMyOrders, Order } from "@/services/orderService";
import { Package, ChevronRight } from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders(false);
        setOrders(res.data || []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center text-gray-500 dark:bg-gray-800 dark:border-gray-700">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center text-red-500 dark:bg-gray-800 dark:border-gray-700">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 dark:bg-gray-700">
            <Package size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't made any purchases yet.</p>
          <Link href="/shop" className="inline-block px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-100">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors dark:border-gray-700 dark:hover:border-gray-600">
              <Link href={`/profile/orders/${order.id}`} className="block p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">Order #{order.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                    <div className="text-left sm:text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Amount</div>
                      <div className="font-semibold text-gray-900 dark:text-white">EGP {order.totalAmount}</div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
