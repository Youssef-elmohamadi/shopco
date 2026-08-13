import Image from "next/image";
import Link from "next/link";
import { getProductById, fetchProducts } from "@/services/productService";
import ReviewSection from "@/components/storefront/ReviewSection";
import ProductVariantSelector from "@/components/storefront/ProductVariantSelector";
import ProductSlider from "@/components/storefront/ProductSlider";
import ProductImageGallery from "@/components/storefront/ProductImageGallery";
import WishlistButton from "@/components/storefront/WishlistButton";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let product = null;
  let similarProducts = [];
  
  try {
    const response = await getProductById(resolvedParams.id);
    if (response.success) {
      product = response.data;
      
      // Fetch similar products
      if (product.categoryId) {
        const similarRes = await fetchProducts(1, 4, "", product.categoryId);
        if (similarRes.success) {
          similarProducts = similarRes.data.items.filter(p => p.id !== product.id);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>&gt;</span>
          <Link href="/shop" className="hover:text-black">Shop</Link>
          <span>&gt;</span>
          {product.category && (
            <>
              <Link href={`/shop?category=${product.category.id}`} className="hover:text-black">
                {product.category.name}
              </Link>
              <span>&gt;</span>
            </>
          )}
          <span className="text-black font-medium">{product.name}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Product Images (Left side) */}
          <div className="w-full md:w-1/2">
            <ProductImageGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Product Info (Right side) */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex justify-between items-start gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{product.name}</h1>
              <WishlistButton productId={product.id} size={28} className="flex-shrink-0" />
            </div>
            
            {/* Pass rating and details to the client component so it handles the rest of the layout smoothly */}
            <ProductVariantSelector 
              productId={product.id}
              productName={product.name}
              productImage={product.images && product.images.length > 0 ? product.images[0].url : "/images/placeholder.png"}
              variants={product.variants || []} 
              basePrice={product.price} 
              baseDiscountPrice={product.discountPrice} 
              baseStock={product.stock} 
              averageRating={product.averageRating || 0}
              description={product.description}
            />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-16">
          <ReviewSection productId={product.id} />
        </div>

        {/* You Might Also Like Section */}
        {similarProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-gray-200">
            <h2 className="text-3xl md:text-5xl font-black text-center uppercase mb-12">You Might Also Like</h2>
            <ProductSlider products={similarProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
