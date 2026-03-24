"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CollectionsClient({ initialCollections }: { initialCollections: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isVideo = (url: string) => url && /\.(mp4|webm|ogg|mov)$/i.test(url);

  // Prevent hydration mismatch by waiting for mount
  if (!mounted) return <div className="bg-bone min-h-screen" />;

  return (
    <div className="bg-bone min-h-screen pt-32 pb-20 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.5em] text-taupe font-bold">Выбор AETHER</span>
          <h1 className="text-5xl md:text-7xl font-serif italic text-espresso">Коллекции</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialCollections.map((item) => {
            const hasVideo = isVideo(item.image);
            return (
              <Link 
                key={item.id} 
                href={item.href || '#'} 
                className="group relative overflow-hidden aspect-[3/4] bg-espresso block"
              >
                {hasVideo ? (
                  <video 
                    src={item.image}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale-[40%] group-hover:grayscale-0"
                  />
                ) : (
                  <img 
                    src={item.image || 'https://via.placeholder.com/600x800?text=AETHER+Editorial'} 
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale-[30%] group-hover:grayscale-0"
                  />
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-bone">
                  <div className="bg-charcoal/40 backdrop-blur-sm p-8 text-center border border-bone/10 transition-transform duration-700 group-hover:-translate-y-2">
                    <h3 className="text-3xl font-serif italic tracking-wider mb-2">{item.title}</h3>
                    <p className="text-[9px] uppercase tracking-[0.4em] opacity-80">{item.subtitle}</p>
                  </div>
                  <span className="mt-6 text-[10px] uppercase tracking-[0.3em] border-b border-gold/0 group-hover:border-gold/100 transition-all duration-700 pb-1">
                    Исследовать
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}