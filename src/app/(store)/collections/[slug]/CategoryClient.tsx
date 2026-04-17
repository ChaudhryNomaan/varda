"use client";
import React, { useState, useEffect } from 'react';
import { ProductCard } from '../../../../components/ui/ProductCard';

const PAGE_CONFIG = {
  sale: { title: "İndirim Seçkisi" },
  tshirts: { title: "T-shirt & Temel Parçalar" }
};

export default function CategoryClient({ 
  slug, 
  initialProducts 
}: { 
  slug: string; 
  initialProducts: any[]; 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const config = PAGE_CONFIG[slug as keyof typeof PAGE_CONFIG] || { title: "Arşiv" };

  // --- LOGIC: SEGREGATE SALE FROM REGULAR CATEGORIES ---
  const filteredProducts = initialProducts.filter(product => {
    const isItemOnSale = product.is_on_sale === true;
    const productCategory = product.category?.toLowerCase().replace(/[\s-]/g, '') || '';
    const currentSlug = slug.toLowerCase().replace(/[\s-]/g, '') || '';

    // Situation A: User is on the /sale page
    if (slug === 'sale') {
      return isItemOnSale; 
    }

    // Situation B: User is on /tshirts (or any other category)
    // Show items matching the category BUT exclude those on sale
    return productCategory === currentSlug && !isItemOnSale;
  });

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
          <h1 className="text-4xl md:text-6xl font-serif italic text-espresso tracking-tight">{config.title}</h1>
          <div className="h-px w-12 bg-gold/30 mx-auto mt-8" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => {
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
                isOnSale={product.is_on_sale}
                oldPrice={product.old_price ? Number(product.old_price) : null}
              />
            );
          })}
        </div>
        
        {/* Empty State localized */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-40 text-taupe/60 italic text-sm tracking-[0.2em] font-serif">
            {config.title} şu anda güncelleniyor...
          </div>
        )}
      </div>
    </div>
  );
}