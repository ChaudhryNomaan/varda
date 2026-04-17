"use client";
import React, { useState, useEffect } from 'react';
import { ProductCard } from '../../../components/ui/ProductCard';

export default function CollectionsClient({ initialProducts }: { initialProducts: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const checkIsVideo = (url: string | null) => {
    if (!url) return false;
    return !!url.match(/\.(mp4|webm|ogg|mov|quicktime)/i);
  };

  if (!mounted) return <div className="bg-bone min-h-screen" />;

  return (
    <div className="bg-bone min-h-screen pt-32 pb-20 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-24">
          <span className="text-[10px] uppercase tracking-[0.5em] text-taupe font-sans font-bold">varda Studio</span>
          <h1 className="text-4xl md:text-6xl font-serif italic text-espresso tracking-tight">İndirim Seçkisi</h1>
          <div className="h-px w-12 bg-gold/30 mx-auto mt-8" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
          {initialProducts.map((product) => {
            const mainAsset = product.images?.[0] || null;
            return (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                price={Number(product.price)}
                category={product.category}
                mainImage={mainAsset}
                isVideo={checkIsVideo(mainAsset)}
                sizes={product.sizes || []}
                isOnSale={true}
                oldPrice={product.old_price ? Number(product.old_price) : null}
              />
            );
          })}
        </div>
        
        {/* Empty State */}
        {initialProducts.length === 0 && (
          <div className="text-center py-40 text-taupe/60 italic text-sm tracking-[0.2em] font-serif">
            İndirim Arşivi şu anda boş...
          </div>
        )}
      </div>
    </div>
  );
}