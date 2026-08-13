import Link from "next/link";
import { Mail } from "lucide-react";
import * as categoryService from "@/services/categoryService";

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

export default async function Footer() {
  let categories: any[] = [];
  try {
    const res = await categoryService.fetchCategories(1, 6);
    categories = res.success ? res.data.items : [];
  } catch (error) {
    console.error("Error fetching categories for footer:", error);
  }

  return (
    <footer className="w-full bg-[#f0f0f0] dark:bg-gray-950 pt-24 pb-8 px-4 sm:px-6 lg:px-8 mt-32 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Newsletter Subscription Box */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-black rounded-3xl py-8 px-6 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 className="text-white text-3xl sm:text-4xl font-black max-w-sm uppercase leading-tight">
              STAY UPTO DATE ABOUT OUR LATEST OFFERS
            </h2>
            <div className="w-full max-w-sm flex flex-col gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="block w-full pl-11 pr-4 py-3 rounded-full text-gray-900 bg-white focus:outline-none"
                />
              </div>
              <button className="w-full bg-white text-black font-medium py-3 rounded-full hover:bg-gray-100 transition">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pb-12 border-b border-gray-300 dark:border-gray-800 pt-16">
          {/* Brand & Description */}
          <div className="col-span-1">
            <Link href="/" className="text-3xl font-black tracking-tighter text-black dark:text-white block mb-6">
              SHOP.CO
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 max-w-sm">
              We have clothes that suits your style and which you're proud to wear. From women to men.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-white dark:bg-gray-800 p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition flex items-center justify-center">
                <TwitterIcon size={18} />
              </a>
              <a href="#" className="bg-black text-white dark:bg-white dark:text-black p-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition flex items-center justify-center">
                <FacebookIcon size={18} />
              </a>
              <a href="#" className="bg-white dark:bg-gray-800 p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition flex items-center justify-center">
                <InstagramIcon size={18} />
              </a>
              <a href="#" className="bg-white dark:bg-gray-800 p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition flex items-center justify-center">
                <GithubIcon size={18} />
              </a>
            </div>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="font-bold text-black dark:text-white tracking-wider text-sm mb-6 uppercase">Categories</h3>
            <ul className="flex flex-col gap-4">
              {categories.map((cat: any) => (
                <li key={cat.id}>
                  <Link 
                    href={`/shop?categoryId=${cat.id}`} 
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm capitalize"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <>
                  <li><Link href="/shop" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm">T-Shirts</Link></li>
                  <li><Link href="/shop" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm">Jeans</Link></li>
                  <li><Link href="/shop" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm">Shirts</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* COMPANY & SUPPORT */}
          <div>
            <h3 className="font-bold text-black dark:text-white tracking-wider text-sm mb-6 uppercase">Company</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm">About Us</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm">Customer Support</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Shop.co © 2000-2026, All Rights Reserved
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
            Developed by <span className="text-black dark:text-white font-extrabold">Youssef El-Mohamady</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
