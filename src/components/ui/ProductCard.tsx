"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  mainImage: string;
  isVideo?: boolean;
  sizes?: string[];
}

export const ProductCard = ({ 
  id, 
  name, 
  price, 
  category, 
  mainImage, 
  isVideo = false, 
  sizes = [] 
}: ProductCardProps) => {
  const [isClient, setIsClient] = useState(false);

  // UseEffect only runs on the client, ensuring a safe swap
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Link 
      href={`/product/${id}`} 
      className="group flex flex-col cursor-pointer transition-all duration-700"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-espresso mb-6 border border-taupe/5">
        
        {/* STABLE WRAPPER: Wrapping the condition in a div prevents the parent from losing track of children */}
        <div className="w-full h-full">
          {!isClient ? (
            <div className="w-full h-full bg-espresso animate-pulse" />
          ) : (
            <div className="w-full h-full">
              {isVideo ? (
                <video
                  key={`video-${id}`} // Explicit key prevents node recycling errors
                  src={mainImage}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
              ) : (
                <img 
                  key={`img-${id}`}
                  src={mainImage} 
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 grayscale-[15%] group-hover:grayscale-0"
                />
              )}
            </div>
          )}
        </div>

        {/* Dynamic Size Overlay */}
        {isClient && sizes.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 bg-bone/95 backdrop-blur-md p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-10">
            <p className="text-[8px] uppercase tracking-[0.3em] text-taupe mb-3 text-center opacity-60 font-medium">
              Доступные размеры
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {sizes.map((size) => (
                <span key={size} className="text-[9px] text-espresso font-bold tracking-widest">
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TEXT PROTECTION: translate="no" stops Google Translate from breaking the DOM */}
      <div className="text-center space-y-2 px-2" translate="no">
        <h3 className="text-[12px] md:text-sm font-serif italic text-espresso uppercase tracking-wider group-hover:text-gold transition-colors duration-500">
          {name}
        </h3>
        <p className="text-[11px] text-taupe tracking-[0.2em] font-light">
          {price.toLocaleString()} ₽
        </p>
      </div>
    </Link>
  );
};