"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

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
  const { cartCount, toggleCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Updated defaults to AETHER for a high-end feel
  const data = adminData || {
    logoMain: "AETHER",
    logoAccent: "STUDIO",
    links: [
      { name: 'Коллекции', href: '/collections' },
      { name: 'Белье', href: '/collections/lingerie' },
      { name: 'Шелк', href: '/collections/silk' },
      { name: 'Atelier', href: '/collections/atelier' },
    ]
  };

  // Logic to split links evenly around the centered logo
  const middleIndex = Math.ceil(data.links.length / 2);
  const leftLinks = data.links.slice(0, middleIndex);
  const rightLinks = data.links.slice(middleIndex);

  if (!mounted) return <nav className="h-20 bg-bone w-full fixed top-0 z-50" />;

  return (
    <nav className="fixed top-0 w-full z-50 bg-bone/90 backdrop-blur-md border-b border-taupe/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        
        {/* Mobile Toggle */}
        <button className="md:hidden text-espresso z-50" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Desktop Left Links */}
        <div className="hidden md:flex gap-8">
          {leftLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-[11px] uppercase tracking-[0.2em] text-espresso hover:text-gold transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Centered Dynamic Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center">
          <h2 className="text-2xl font-serif italic text-espresso tracking-tighter">
            {data.logoMain} 
            <span className="font-sans not-italic font-light text-sm tracking-[0.3em] ml-2">
              {data.logoAccent}
            </span>
          </h2>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8 mr-6">
            {rightLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-[11px] uppercase tracking-[0.2em] text-espresso hover:text-gold transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex gap-4 items-center text-espresso">
            <button className="hover:text-gold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <button onClick={toggleCart} className="relative hover:text-gold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <span className="absolute -top-1 -right-1 bg-gold text-[9px] text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden bg-bone border-t border-taupe/10 px-6 py-8 space-y-6 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-300">
          {data.links.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-xs uppercase tracking-[0.2em] text-espresso">
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};