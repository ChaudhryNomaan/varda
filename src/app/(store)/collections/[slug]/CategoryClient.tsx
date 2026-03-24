"use client";
import React, { useState } from 'react';
import { ProductCard, type ProductCardProps } from '../../../../components/ui/ProductCard';

const PAGE_CONFIG = {
  silk: { title: "Шелковая Коллекция", sections: ["Все", "Бюстгальтеры", "Трусики", "Комплекты", "Ночные сорочки"] },
  lingerie: { title: "Нижнее Белье", sections: ["Все", "Бюстгальтеры", "Трусики", "Пары", "Боди"] },
  atelier: { title: "Кружевное Atelier", sections: ["Все", "корсеты", "эксклюзив"] }
};

export default function CategoryClient({ 
  slug, 
  initialProducts 
}: { 
  slug: string; 
  initialProducts: any[]; 
}) {
  const [activeSection, setActiveSection] = useState("Все");
  const config = PAGE_CONFIG[slug as keyof typeof PAGE_CONFIG] || PAGE_CONFIG.silk;

  // Filter products based on subcategory
  const filteredProducts = activeSection === "Все" 
    ? initialProducts 
    : initialProducts.filter(p => p.subcategory?.toLowerCase() === activeSection.toLowerCase());

  const checkIsVideo = (url: string | null) => {
    if (!url) return false;
    return !!url.match(/\.(mp4|webm|ogg|mov|quicktime)/i);
  };

  return (
    <div className="bg-bone min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] uppercase tracking-[0.5em] text-taupe font-sans">AETHER Archive</span>
          <h1 className="text-4xl md:text-6xl font-serif italic text-espresso tracking-tight">{config.title}</h1>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-8 border-b border-taupe/10 pb-6 mb-12">
          {config.sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`text-[10px] uppercase tracking-[0.3em] transition-all pb-2 border-b font-sans ${
                activeSection.toLowerCase() === section.toLowerCase()
                ? "text-espresso border-gold font-medium" 
                : "text-taupe border-transparent hover:text-espresso"
              }`}
            >
              {section === "корсеты" ? "Корсеты" : section === "эксклюзив" ? "Эксклюзив" : section}
            </button>
          ))}
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
              />
            );
          })}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-taupe/40 italic text-sm tracking-widest font-serif">
            The archive for "{activeSection}" is currently being updated...
          </div>
        )}
      </div>
    </div>
  );
}