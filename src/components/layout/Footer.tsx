"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FooterProps {
  data?: {
    brandName: string;
    brandDescription: string;
    column1Heading: string;
    column2Heading: string;
    newsletterHeading: string;
    newsletterText: string;
    instagramUrl: string;
    telegramUrl: string;
    copyrightText: string;
  };
}

export const Footer = ({ data }: FooterProps) => {
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  const footerData = data || {
    brandName: "varda STUDIO",
    brandDescription: "Özel giysi arşivi ve modern silüetler.",
    column1Heading: "Mağaza",
    column2Heading: "Yardım",
    newsletterHeading: "Bülten",
    newsletterText: "Yeni koleksiyonlardan ilk siz haberdar olun.",
    instagramUrl: "#",
    telegramUrl: "#",
    copyrightText: "varda STUDIO. TÜM HAKLARI SAKLIDIR."
  };

  // Prevent hydration flicker
  if (!mounted) return <footer className="bg-bone min-h-[400px]" />;

  return (
    <footer className="bg-bone border-t border-taupe/20 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <h3 className="font-serif italic text-2xl text-espresso lowercase tracking-tighter">
            {footerData.brandName}
          </h3>
          <p className="text-[11px] leading-relaxed tracking-wider text-espresso/70 uppercase">
            {footerData.brandDescription}
          </p>
        </div>

        {/* Shop Column */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-espresso mb-2">
            {footerData.column1Heading}
          </h4>
          <Link href="/collections/tshirts" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest">T-shirt</Link>
          <Link href="/collections/sale" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest">İndirim</Link>
          <Link href="/archive" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest opacity-40 cursor-not-allowed">Arşiv</Link>
        </div>

        {/* Support Column */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-espresso mb-2">
            {footerData.column2Heading}
          </h4>
          <Link href="/shipping" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest">Teslimat</Link>
          <Link href="/size-guide" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest">
            Beden Rehberi
          </Link>
          <Link href="/returns" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest">İade</Link>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-espresso mb-2">
            {footerData.newsletterHeading}
          </h4>
          <p className="text-[11px] text-espresso/70 uppercase tracking-widest">
            {footerData.newsletterText}
          </p>
          <div className="flex border-b border-espresso/30 pb-1 group focus-within:border-gold transition-colors">
            <input 
              type="email" 
              placeholder="E-POSTA" 
              className="bg-transparent border-none text-[10px] tracking-[0.2em] focus:outline-none w-full placeholder:text-espresso/40 text-espresso"
            />
            <button className="text-[10px] uppercase tracking-[0.2em] text-espresso hover:text-gold transition-colors">Tamam</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-taupe/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[9px] uppercase tracking-[0.3em] text-espresso/50">
          © {currentYear} {footerData.copyrightText}
        </p>
        <div className="flex gap-6">
          <a href={footerData.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase tracking-[0.3em] text-espresso/50 hover:text-gold transition-colors">Instagram</a>
          <a href={footerData.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase tracking-[0.3em] text-espresso/50 hover:text-gold transition-colors">Telegram</a>
        </div>
      </div>
    </footer>
  );
};