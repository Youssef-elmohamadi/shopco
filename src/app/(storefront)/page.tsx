import Image from "next/image";
import Link from "next/link";
import { fetchHomeData } from "@/services/homeService";
import { fetchBrands } from "@/services/brandService";
import ProductSlider from "@/components/storefront/ProductSlider";
import { getImageUrl } from "@/utils/apiConfig";


export const metadata = {
  title: "Home",
};


export default async function StorefrontHomePage() {
  let homeData = null;
  try {
    const response = await fetchHomeData();
    if (response.success) {
      homeData = response.data;
    }
  } catch (error) {
    console.error("Error loading home data:", error);
  }

  // Fetch real brands from database
  let brands: string[] = [];
  try {
    const brandsRes = await fetchBrands();
    if (brandsRes.success && brandsRes.data?.length > 0) {
      brands = brandsRes.data.map(b => b.name);
    }
  } catch (error) {
    console.error("Error fetching brands for home page:", error);
  }

  if (brands.length < 3) {
    brands = [...brands, "Versace", "Zara", "Gucci", "Prada", "Calvin Klein"];
  }

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Hero Section */}
      <section className="w-full bg-[#F2F0F1] relative overflow-hidden lg:h-[calc(100vh-130px)] flex flex-col justify-end lg:justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
          <div className="flex flex-col lg:flex-row items-center justify-between h-full pt-10 lg:pt-0">
            {/* Left Content */}
            <div className="w-full lg:w-[55%] flex flex-col items-start z-10 pt-4 lg:pt-0 pb-10 lg:pb-0">
              <h1 className="text-[26px] sm:text-[38px] lg:text-[50px] font-black leading-[1.1] tracking-tight text-black mb-4 uppercase">
                Find clothes <br className="hidden lg:block"/> that matches <br className="hidden lg:block"/> your style
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-8 max-w-[450px]">
                Browse through our diverse range of meticulously crafted garments, designed
                to bring out your individuality and cater to your sense of style.
              </p>
              <Link
                href="#"
                className="inline-block bg-black text-white px-14 py-4 rounded-full font-medium hover:bg-gray-900 transition-colors w-full sm:w-auto text-center"
              >
                Shop Now
              </Link>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-8 gap-y-6 mt-12 mb-2 lg:mb-0 w-full">
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[32px] sm:text-[40px] font-bold text-black leading-none">200+</span>
                  <span className="text-sm text-gray-500 mt-1">International Brands</span>
                </div>
                <div className="w-[1px] h-[50px] bg-gray-300 hidden sm:block"></div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[32px] sm:text-[40px] font-bold text-black leading-none">2,000+</span>
                  <span className="text-sm text-gray-500 mt-1">High-Quality Products</span>
                </div>
                <div className="w-[1px] h-[50px] bg-gray-300 hidden sm:block"></div>
                <div className="flex flex-col items-center sm:items-start w-full sm:w-auto mt-4 sm:mt-0">
                  <span className="text-[32px] sm:text-[40px] font-bold text-black leading-none">30,000+</span>
                  <span className="text-sm text-gray-500 mt-1">Happy Customers</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden lg:flex w-full lg:w-[45%] relative justify-center items-end mt-8 lg:mt-0 h-[400px] lg:h-full">
              <div className="relative w-full h-full max-w-[500px]">
                <Image
                  src="/hero_banner_transparent.png"
                  alt="Stylish models"
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Banner (Infinite Moving Marquee) */}
      <section className="w-full bg-black py-7 md:py-9 overflow-hidden relative">
        <div className="flex items-center gap-16 md:gap-24 animate-marquee whitespace-nowrap">
          {/* First loop */}
          {brands.map((brand, idx) => (
            <span 
              key={`b1-${brand}-${idx}`} 
              className="text-white text-2xl md:text-4xl font-extrabold uppercase tracking-widest select-none"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {brand}
            </span>
          ))}
          {/* Second loop to ensure continuous scroll */}
          {brands.map((brand, idx) => (
            <span 
              key={`b2-${brand}-${idx}`} 
              className="text-white text-2xl md:text-4xl font-extrabold uppercase tracking-widest select-none"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {brand}
            </span>
          ))}
          {/* Third loop for extra safety on wide screens */}
          {brands.map((brand, idx) => (
            <span 
              key={`b3-${brand}-${idx}`} 
              className="text-white text-2xl md:text-4xl font-extrabold uppercase tracking-widest select-none"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="w-full pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl font-black text-center uppercase mb-10">New Arrivals</h2>
          <ProductSlider products={homeData?.latestProducts || []} />
          
          <div className="flex justify-center mt-10 border-b border-gray-200 pb-16">
            <Link 
              href="/shop?sortBy=date&sortDescending=true" 
              className="inline-block px-14 py-3 rounded-full border border-gray-200 text-black font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Browse By Category Section */}
      <section className="w-full pt-4 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F0F0F0] rounded-[40px] p-8 md:p-16">
            <h2 className="text-2xl md:text-4xl font-black text-center uppercase mb-10">BROWSE BY category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {homeData?.categories?.slice(0, 4).map((category, index) => (
                <Link 
                  key={category.id} 
                  href={`/shop?categoryId=${category.id}`}
                  className={`relative h-[289px] rounded-[20px] overflow-hidden group ${
                    index === 0 || index === 3 ? "md:col-span-1" : "md:col-span-2"
                  }`}
                >
                  <div className="absolute inset-0 bg-white z-0">
                    {category.imageUrl && (
                      <Image 
                        src={getImageUrl(category.imageUrl)} 
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10"></div>
                  <div className="absolute top-6 left-8 z-20">
                    <span className="text-2xl font-bold bg-white px-4 py-1 rounded text-black">{category.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Selling Section */}
      <section className="w-full pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl font-black text-center uppercase mb-10">Top Selling</h2>
          <ProductSlider products={homeData?.popularProducts || []} />
          
          <div className="flex justify-center mt-10">
            <Link 
              href="/shop?sortBy=popular" 
              className="inline-block px-14 py-3 rounded-full border border-gray-200 text-black font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
            >
              View All
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

