"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, LogOut, Heart } from "lucide-react";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  };

  const menuItems = [
    {
      name: "Personal Information",
      href: "/profile",
      icon: <User size={20} />,
      isActive: pathname === "/profile" || pathname === "/profile/edit",
    },
    {
      name: "My Orders",
      href: "/profile/orders",
      icon: <Package size={20} />,
      isActive: pathname.startsWith("/profile/orders"),
    },
    {
      name: "Favorites",
      href: "/profile/wishlist",
      icon: <Heart size={20} />,
      isActive: pathname.startsWith("/profile/wishlist"),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-20 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-black dark:text-white">
            My Account
          </h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">
            Manage your profile, orders, and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
              <ul className="flex flex-col">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-6 py-4 font-medium transition-colors border-l-4 ${
                        item.isActive
                          ? "border-black bg-gray-50 text-black dark:border-white dark:bg-gray-700 dark:text-white"
                          : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-black dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      }`}
                    >
                      <span className={`${item.isActive ? "text-black dark:text-white" : "text-gray-400"}`}>
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-6 py-4 font-medium text-red-600 transition-colors border-l-4 border-transparent hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 text-left"
                  >
                    <span className="text-red-500 dark:text-red-400">
                      <LogOut size={20} />
                    </span>
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
