"use client";
import React, { useState } from 'react';

export default function ProductDetailsClient({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);

  // We use the 'product' prop directly now
  const activeAsset = product.images?.[activeAssetIndex];
  
  const isVideo = (url: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov|quicktime)/i);
  };

  return (
    <div className="bg-bone min-h-screen pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          
          {/* LEFT: PRODUCT MEDIA */}
          <div className="space-y-6">
            <div className="relative aspect-[3/4] bg-white/[0.03] overflow-hidden border border-taupe/10 shadow-2xl">
              {isVideo(activeAsset) ? (
                <video 
                  key={activeAsset} 
                  src={activeAsset} 
                  className="w-full h-full object-cover" 
                  autoPlay muted loop playsInline
                />
              ) : (
                <img 
                  src={activeAsset || '/placeholder.jpg'} 
                  className="w-full h-full object-cover transition-opacity duration-700" 
                  alt={product.name} 
                />
              )}
            </div>

            {/* THUMBNAIL NAVIGATION */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {product.images.map((asset: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveAssetIndex(index)}
                    className={`relative flex-shrink-0 w-20 aspect-[3/4] border transition-all duration-500 overflow-hidden ${
                      activeAssetIndex === index 
                      ? "border-gold scale-95" 
                      : "border-taupe/10 opacity-40 hover:opacity-100"
                    }`}
                  >
                    {isVideo(asset) ? (
                      <div className="w-full h-full bg-espresso flex flex-col items-center justify-center">
                        <div className="w-6 h-6 rounded-full border border-bone/20 flex items-center justify-center mb-1">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-bone border-b-[4px] border-b-transparent ml-0.5" />
                        </div>
                        <span className="text-[7px] text-bone/60 uppercase tracking-tighter">Motion</span>
                      </div>
                    ) : (
                      <img src={asset} className="w-full h-full object-cover" alt="" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col justify-center space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-sans font-bold">
                {product.category} Collection
              </span>
              <h1 className="text-5xl md:text-6xl font-serif italic text-espresso tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-2xl text-espresso/80 font-serif italic">{product.price?.toLocaleString()} ₽</p>
                <div className="h-[1px] flex-1 bg-gold/20" />
              </div>
            </div>

            <div className="max-w-md">
              <p className="text-[14px] leading-relaxed text-taupe/90 font-sans font-light">
                {product.description}
              </p>
            </div>

            {/* SIZES */}
            <div className="space-y-6">
              <div className="flex justify-between items-center max-w-xs">
                 <span className="text-[10px] uppercase tracking-[0.3em] text-espresso font-bold">Select Dimension</span>
                 <span className="text-[9px] text-gold uppercase underline cursor-pointer">Size Guide</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size: string) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-8 py-3 text-[10px] uppercase tracking-[0.2em] border transition-all duration-300 ${
                      selectedSize === size 
                      ? "bg-espresso text-bone border-espresso shadow-xl scale-105" 
                      : "border-taupe/20 text-taupe hover:border-gold hover:text-gold"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="pt-6 space-y-4">
              <button className="w-full md:w-96 bg-espresso text-bone py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gold hover:text-espresso transition-all duration-500 shadow-2xl active:scale-95">
                Add to Atelier Bag
              </button>
              <p className="text-[9px] text-taupe/40 uppercase tracking-widest text-center md:text-left">
                Complimentary Worldwide Shipping on all Archive pieces
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}