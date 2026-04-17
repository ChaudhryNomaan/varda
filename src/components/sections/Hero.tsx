"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeroProps {
  data?: {
    subtitle: string;
    titleMain: string;
    titleAccent: string;
    buttonText: string;
    videoUrl: string;
    fallbackImageUrl: string;
  };
}

export const Hero = ({ data }: HeroProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaults = {
    subtitle: "Yeni Koleksiyon Şimdi Yayında",
    titleMain: "varda",
    titleAccent: "STUDIO",
    buttonText: "Koleksiyonu İncele",
    videoUrl: "", // Öneri: Kumaş dokusunu gösteren yüksek kaliteli video
    fallbackImageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80"
  };

  const content = data || defaults;

  if (!mounted) {
    return (
      <section className="h-screen w-full bg-[#0F0F0F] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-4 w-32 bg-white/5 rounded" />
          <div className="h-12 w-64 bg-white/5 rounded" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Editoryal Arka Plan Medyası */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {content.videoUrl ? (
          <video
            key={content.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source src={content.videoUrl} type="video/mp4" />
            {content.fallbackImageUrl && (
              <img 
                src={content.fallbackImageUrl} 
                className="w-full h-full object-cover" 
                alt={content.titleMain} 
              />
            )}
          </video>
        ) : content.fallbackImageUrl ? (
          <img 
            src={content.fallbackImageUrl} 
            className="w-full h-full object-cover" 
            alt={content.titleMain} 
          />
        ) : (
          <div className="w-full h-full bg-[#0F0F0F]" />
        )}
      </div>

      {/* İçerik Katmanı */}
      <div className="relative z-20 text-center space-y-6 px-4">
        <span className="text-gold tracking-[0.6em] uppercase text-[10px] md:text-xs font-bold block transform animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {content.subtitle}
        </span>
        
        <h1 className="text-7xl md:text-[10rem] text-white font-serif italic tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {content.titleMain} 
          <span className="font-sans not-italic font-extralight tracking-[0.3em] ml-4 text-4xl md:text-6xl block md:inline mt-4 md:mt-0 opacity-80">
            {content.titleAccent}
          </span>
        </h1>

        <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] max-w-xs mx-auto animate-in fade-in duration-1000 delay-300">
          Birinci sınıf ağır gramaj pamuk ve minimalist silüetler.
        </p>
        
        <div className="pt-8 animate-in fade-in zoom-in-95 duration-1000 delay-500">
          <Link href="/collections/tshirts">
            <button className="group relative px-14 py-5 bg-transparent border border-white/20 text-white text-[10px] uppercase tracking-[0.5em] overflow-hidden transition-all duration-500 hover:border-gold">
              <span className="relative z-10">{content.buttonText}</span>
              <div className="absolute inset-0 bg-gold translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="absolute inset-0 flex items-center justify-center text-[#0A0A0A] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                {content.buttonText}
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Kaydırma Göstergesi */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 opacity-50">
        <span className="text-[8px] uppercase tracking-[0.6em] text-white font-sans font-bold">Koleksiyonu Görmek İçin Kaydırın</span>
        <div className="w-[1px] h-20 bg-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gold animate-hero-line" />
        </div>
      </div>
    </section>
  );
};