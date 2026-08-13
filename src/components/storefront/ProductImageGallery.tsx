"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface ProductImage {
  id: number;
  url: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  
  const imgRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[350px] md:h-full bg-[#F0EEED] rounded-[20px] overflow-hidden flex-grow flex items-center justify-center text-gray-400">
        No Image Available
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };

  const activeImage = images[activeImageIndex];

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";
  const getImageUrl = (url?: string) => {
    if (!url) return "/images/placeholder.png";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}/${url}`;
  };

  return (
    <div className="w-full flex flex-col-reverse md:flex-row gap-4 h-[500px]">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-32 flex-shrink-0 hide-scrollbar pb-2 md:pb-0">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-[100px] h-[100px] md:w-full md:aspect-[3/4] md:h-auto rounded-[20px] overflow-hidden bg-[#F0EEED] cursor-pointer border-2 transition-colors ${idx === activeImageIndex ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
            >
              <Image src={getImageUrl(img.url)} alt={`${productName} thumbnail`} fill style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
      
      {/* Main Image with Zoom */}
      <div 
        ref={imgRef}
        className="relative w-full h-[350px] md:h-full bg-[#F0EEED] rounded-[20px] overflow-hidden flex-grow cursor-crosshair"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={getImageUrl(activeImage?.url)}
          alt={productName}
          fill
          style={{ 
            objectFit: 'cover',
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
            transform: isZooming ? 'scale(2)' : 'scale(1)',
            transition: 'transform 0.1s ease-out'
          }}
          priority
        />
      </div>
    </div>
  );
}
