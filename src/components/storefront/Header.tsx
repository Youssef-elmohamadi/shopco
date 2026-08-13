import Link from "next/link";
import { getUserProfile } from "@/actions/user";
import { cookies } from "next/headers";
import Navbar from "./Navbar";
import TopBanner from "./TopBanner";
import * as categoryService from "@/services/categoryService";

export default async function Header() {
  const cookieStore = await cookies();
  let isLoggedIn = cookieStore.has("token") || cookieStore.has("admin_token");

  let userName = null;
  let isProfileError = false;

  if (isLoggedIn) {
    const userProfile = await getUserProfile();
    if (userProfile) {
      // Determine the name based on the API response structure
      const profileData = userProfile.data || userProfile;
      userName = profileData.firstName ? `${profileData.firstName} ${profileData.lastName || ''}`.trim() : (profileData.name || profileData.email || "Profile");
    } else {
      // API failed or token is invalid from the server's perspective
      isLoggedIn = false;
      isProfileError = true;
    }
  }

  // Fetch top 5 categories for the navbar
  let topCategories: any[] = [];
  try {
    const categoriesRes = await categoryService.fetchCategories(1, 5);
    topCategories = categoriesRes.success ? categoriesRes.data.items : [];
  } catch (error) {
    console.error("Error fetching categories for header:", error);
  }

  return (
    <>
      {/* Dynamic Animated Top Banner */}
      <TopBanner isLoggedIn={isLoggedIn} userName={userName} />
      
      {/* Interactive Main Navbar with Sticky Header Wrapper */}
      <header className="sticky top-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 shadow-xs">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          userName={userName} 
          isProfileError={isProfileError} 
          topCategories={topCategories}
        />
      </header>
    </>
  );
}
