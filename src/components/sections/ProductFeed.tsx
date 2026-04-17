"use client";
import React from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string; // Optional because it might be in 'images'
  images?: string[];  // Checking for the array format
  slug: string;
  is_on_sale: boolean;
  category: string;
  old_price?: number;
}

interface ProductFeedProps {
  initialProducts: Product[];
}

export const ProductFeed = ({ initialProducts }: ProductFeedProps) => {
  const allProducts = initialProducts || [];

  return (
    <section className="py-32 px-6 md:px-12 bg-bone">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-16 border-l border-gold/30 pl-6">
          <span className="text-taupe tracking-[0.5em] uppercase text-[10px] font-bold block mb-2">
            vardated Selection
          </span>
          <h2 className="text-4xl md:text-6xl text-espresso font-serif italic tracking-tighter">
            Studio Essentials
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {allProducts.map((product) => {
            // LOGIC FIX: Check for image_url OR the first item in images array
            const displayImage = product.image_url || (product.images && product.images[0]) || null;

            return (
                  <Link key={product.id} href={`/product/${product.slug || product.id}`} className="group block">                <div className="relative aspect-[3/4] bg-espresso overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  
                  {product.is_on_sale && (
                    <div className="absolute top-0 right-0 z-10 bg-gold text-black text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 shadow-xl">
                      Archive Sale
                    </div>
                  )}

                  {/* Main Product Image */}
                  {displayImage ? (
                    <img 
                      src={displayImage} 
                      alt={product.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out"
                    />
                  ) : (
                    /* Fallback if image is still missing - helps with debugging */
                    <div className="w-full h-full flex items-center justify-center bg-espresso border border-white/5">
                        <span className="text-[8px] uppercase tracking-widest text-taupe/40 italic">Asset Loading...</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                     <span className="text-[9px] uppercase tracking-[0.4em] text-bone font-bold border-b border-gold/50 pb-1">
                       View Garment
                     </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-start pt-4 border-t border-taupe/10">
                  <div className="space-y-1">
                    <h3 className="text-espresso text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-medium group-hover:text-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-taupe/60 text-[9px] uppercase tracking-widest italic font-serif">
                      {product.category?.toLowerCase().includes('tshirt') ? 'Signature Tee' : 'Archive Piece'}
                    </p>
                  </div>
                  
                  <div className="text-right flex flex-col items-end">
                    {product.is_on_sale && product.old_price && (
                      <span className="text-taupe/40 text-[9px] line-through mb-1 tracking-tighter">
                        ${product.old_price}
                      </span>
                    )}
                    <span className={`text-[11px] font-mono tracking-tight ${product.is_on_sale ? 'text-gold font-bold' : 'text-espresso'}`}>
                      ${product.price}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-32 flex justify-center">
          <Link href="/collections" className="group flex flex-col items-center">
             <div className="h-px w-20 bg-gold/20 group-hover:w-40 transition-all duration-700 mb-4" />
             <span className="text-[9px] uppercase tracking-[0.6em] text-taupe group-hover:text-gold transition-colors">
               Explore Full Archive
             </span>
          </Link>
        </div>
      </div>
    </section>
  );
};