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
    brandName: "AETHER STUDIO",
    brandDescription: "High-end digital archive and luxury atelier.",
    column1Heading: "Магазин",
    column2Heading: "Помощь",
    newsletterHeading: "Подписка",
    newsletterText: "Узнавайте о новых коллекциях первыми.",
    instagramUrl: "#",
    telegramUrl: "#",
    copyrightText: "AETHER. ВСЕ ПРАВА ЗАЩИЩЕНЫ."
  };

  // Prevent hydration flicker
  if (!mounted) return <footer className="bg-bone min-h-[400px]" />;

  return (
    <footer className="bg-bone border-t border-taupe/20 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <h3 className="font-serif italic text-2xl text-espresso lowercase">
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
          <Link href="/collections" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest">Коллекции</Link>
          <Link href="/collections/lingerie" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest">Белье</Link>
          <Link href="/collections/silk" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest">Шелк</Link>
        </div>

        {/* Support Column - SIZE CHART ADDED BACK HERE */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-espresso mb-2">
            {footerData.column2Heading}
          </h4>
          <Link href="/shipping" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest">Доставка</Link>
          
          {/* Restored Size Chart Button */}
          <Link href="/size-guide" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest flex items-center gap-2">
            Размерная сетка
          </Link>

          <Link href="/returns" className="text-[11px] text-espresso/80 hover:text-gold transition-colors uppercase tracking-widest">Возврат</Link>
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
              placeholder="EMAIL" 
              className="bg-transparent border-none text-[10px] tracking-[0.2em] focus:outline-none w-full placeholder:text-espresso/40 text-espresso"
            />
            <button className="text-[10px] uppercase tracking-[0.2em] text-espresso hover:text-gold transition-colors">OK</button>
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