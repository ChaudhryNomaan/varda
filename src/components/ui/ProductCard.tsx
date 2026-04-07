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
  // Add these new properties to the interface
  isOnSale?: boolean;
  oldPrice?: number | null;
}

export const ProductCard = ({ 
  id, 
  name, 
  price, 
  category, 
  mainImage, 
  isVideo = false, 
  sizes = [],
  isOnSale = false, // Default to false
  oldPrice = null    // Default to null
}: ProductCardProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Link 
      href={`/product/${id}`} 
      className="group flex flex-col cursor-pointer transition-all duration-700"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-espresso mb-6 border border-taupe/5">
        
        {/* SALE BADGE: Positioned elegantly at the top-left */}
        {isOnSale && (
          <div className="absolute top-4 left-4 z-[20] bg-gold text-espresso text-[8px] font-bold px-3 py-1.5 uppercase tracking-[0.3em] shadow-xl animate-in fade-in zoom-in duration-500">
            Sale
          </div>
        )}

        <div className="w-full h-full">
          {!isClient ? (
            <div className="w-full h-full bg-espresso animate-pulse" />
          ) : (
            <div className="w-full h-full">
              {isVideo ? (
                <video
                  key={`video-${id}`}
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

      <div className="text-center space-y-2 px-2" translate="no">
        <h3 className="text-[12px] md:text-sm font-serif italic text-espresso uppercase tracking-wider group-hover:text-gold transition-colors duration-500">
          {name}
        </h3>
        
        {/* UPDATED PRICE LOGIC: Shows old price with a strike-through if on sale */}
        <div className="flex items-center justify-center gap-3">
          {isOnSale && oldPrice && (
            <span className="text-[10px] text-taupe/40 line-through decoration-gold/30 tracking-widest">
              {oldPrice.toLocaleString()} ₽
            </span>
          )}
          <p className={`text-[11px] tracking-[0.2em] ${isOnSale ? 'text-gold font-bold' : 'text-taupe font-light'}`}>
            {price.toLocaleString()} ₽
          </p>
        </div>
      </div>
    </Link>
  );
};