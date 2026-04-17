"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavbarProps {
  adminData?: {
    logoMain: string;
    logoAccent: string;
    links: { name: string; href: string }[];
  };
}

export const Navbar = ({ adminData }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Updated defaults with Turkish categories
  const data = adminData || {
    logoMain: "cura",
    logoAccent: "STUDIO",
    links: [
      { name: 'İndirim', href: '/collections/sale' },
      { name: 'T-shirt', href: '/collections/tshirts' },
    ]
  };

  // Symmetrical split logic
  const leftLinks = data.links.slice(0, 1);
  const rightLinks = data.links.slice(1, 2);

  // Prevent hydration mismatch
  if (!mounted) return <nav className="h-20 bg-bone w-full fixed top-0 z-50" />;

  return (
    <nav className="fixed top-0 w-full z-50 bg-bone/90 backdrop-blur-md border-b border-taupe/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        
        {/* Mobile Toggle - Refined Stroke for Luxury Feel */}
        <button 
          className="md:hidden text-espresso z-50 p-2 focus:outline-none" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="w-5 h-5 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
          </svg>
        </button>

        {/* Desktop Left Link - Unique Key Implementation */}
        <div className="hidden md:flex flex-1 justify-start">
          {leftLinks.map((link, idx) => (
            <Link 
              key={`desktop-left-${link.name}-${idx}`} 
              href={link.href} 
              className="text-[10px] uppercase tracking-[0.4em] text-espresso hover:text-gold transition-all duration-500 font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Centered Dynamic Logo - Refined Spacing */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center group">
          <h2 className="text-2xl font-serif italic text-espresso tracking-tighter transition-transform duration-700 group-hover:scale-105">
            {data.logoMain} 
            <span className="font-sans not-italic font-extralight text-[9px] tracking-[0.5em] ml-3 opacity-60 uppercase">
              {data.logoAccent}
            </span>
          </h2>
        </Link>

        {/* Desktop Right Link - Unique Key Implementation */}
        <div className="hidden md:flex flex-1 justify-end">
          {rightLinks.map((link, idx) => (
            <Link 
              key={`desktop-right-${link.name}-${idx}`} 
              href={link.href} 
              className="text-[10px] uppercase tracking-[0.4em] text-espresso hover:text-gold transition-all duration-500 font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Overlay - Smooth Animation and Unique Keys */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-bone border-b border-taupe/10 px-6 py-12 flex flex-col items-center space-y-10 animate-in fade-in slide-in-from-top-2 duration-500 ease-out">
          {data.links.map((link, idx) => (
            <Link 
              key={`mobile-nav-${link.name}-${idx}`} 
              href={link.href} 
              onClick={() => setIsOpen(false)} 
              className="text-[11px] uppercase tracking-[0.5em] text-espresso/80 hover:text-gold transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};