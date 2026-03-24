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

  // Prevents hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default values used if Supabase is empty
  const defaults = {
    subtitle: "Digital Archive",
    titleMain: "AETHER",
    titleAccent: "Atelier",
    buttonText: "Explore Archive",
    videoUrl: "",
    fallbackImageUrl: ""
  };

  const content = data || defaults;

  // Render a clean skeleton background during hydration
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
      {/* Editorial Background Media */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10" />
        
        {/* Only render video if the URL is not empty */}
        {content.videoUrl ? (
          <video
            key={content.videoUrl} // Forces re-render when admin updates the link
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source src={content.videoUrl} type="video/mp4" />
            {/* Fallback image inside video tag only if URL exists */}
            {content.fallbackImageUrl && (
              <img 
                src={content.fallbackImageUrl} 
                className="w-full h-full object-cover" 
                alt={content.titleMain} 
              />
            )}
          </video>
        ) : content.fallbackImageUrl ? (
          // Show fallback image if no video is provided
          <img 
            src={content.fallbackImageUrl} 
            className="w-full h-full object-cover" 
            alt={content.titleMain} 
          />
        ) : (
          // Solid background if both are empty
          <div className="w-full h-full bg-[#0F0F0F]" />
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 text-center space-y-6 px-4">
        <span className="text-white/90 tracking-[0.4em] uppercase text-[10px] md:text-xs font-light block transform animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {content.subtitle}
        </span>
        
        <h1 className="text-6xl md:text-9xl text-white font-serif italic tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {content.titleMain} 
          <span className="font-sans not-italic font-extralight tracking-[0.2em] ml-4 text-5xl md:text-7xl block md:inline mt-2 md:mt-0">
            {content.titleAccent}
          </span>
        </h1>
        
        <div className="pt-10 animate-in fade-in zoom-in-95 duration-1000 delay-500">
          <Link href="/collections">
            <button className="group relative px-12 py-4 bg-transparent border border-white/30 text-white text-[10px] uppercase tracking-[0.5em] overflow-hidden transition-all duration-500 hover:border-white">
              <span className="relative z-10">{content.buttonText}</span>
              <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="absolute inset-0 flex items-center justify-center text-[#0A0A0A] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                {content.buttonText}
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Elegant Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 opacity-40">
        <span className="text-[8px] uppercase tracking-[0.6em] text-white">Discover</span>
        <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white animate-hero-line" />
        </div>
      </div>

      <style jsx>{`
        @keyframes hero-line {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .animate-hero-line {
          animation: hero-line 3s cubic-bezier(0.7, 0, 0.3, 1) infinite;
        }
      `}</style>
    </section>
  );
};