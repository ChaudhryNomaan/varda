"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/client';

// Refined for cura STUDIO product lines
const CATEGORY_MAP: Record<string, string[]> = {
  "t-shirts": ["All", "Oversized", "Signature", "Graphic", "Essential"],
  "outerwear": ["All", "Hoodies", "Jackets"],
  "accessories": ["All", "Hats", "Objects"]
};

export default function InventoryPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSub, setActiveSub] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently remove this garment from the cura archive?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== id));
      router.refresh();
    } else {
      alert("Archive error: " + error.message);
    }
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = activeCategory === "all" || product.category === activeCategory;
    const subMatch = activeSub === "All" || product.subcategory === activeSub;
    const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && subMatch && searchMatch;
  });

  if (!isMounted) return null;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gold/10 pb-6 md:pb-8 gap-4">
        <div>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-gold/60 font-sans font-bold">cura Studio</span>
          <h1 className="text-2xl md:text-4xl font-serif italic text-bone mt-2">Inventory Management</h1>
          <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-bone/30 mt-2 font-sans">
            Total Studio Assets: <span className="text-gold">{filteredProducts.length}</span>
          </p>
        </div>
        <Link href="/admin/products/new" className="w-full sm:w-auto text-center bg-gold text-black px-8 py-3 md:py-4 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all active:scale-95">
          + Add New Garment
        </Link>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white/[0.02] border border-gold/10 p-4 md:p-8 space-y-6 md:space-y-8">
        <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8">
          <div className="flex gap-6 md:gap-10 overflow-x-auto pb-2 no-scrollbar">
            {["all", "t-shirts", "outerwear", "accessories"].map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setActiveSub("All"); }}
                className={`text-[9px] md:text-[10px] uppercase tracking-[0.4em] transition-all relative pb-2 whitespace-nowrap font-sans font-bold ${
                  activeCategory === cat ? "text-gold" : "text-bone/30 hover:text-bone/60"
                }`}
              >
                {cat === "all" ? "Full Collection" : cat}
                {activeCategory === cat && (
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gold animate-in slide-in-from-left duration-500" />
                )}
              </button>
            ))}
          </div>

          <div className="relative group w-full lg:w-64">
            <input 
              type="text" 
              placeholder="Search Garments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b border-gold/20 py-2 pl-2 pr-10 text-[10px] uppercase tracking-widest text-bone focus:outline-none focus:border-gold transition-colors w-full font-sans"
            />
            <span className="absolute right-2 top-2 opacity-30 group-hover:opacity-100 transition-opacity pointer-events-none">🔍</span>
          </div>
        </div>

        {activeCategory !== "all" && CATEGORY_MAP[activeCategory] && (
          <div className="flex flex-wrap gap-2 md:gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
            {CATEGORY_MAP[activeCategory].map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSub(sub)}
                className={`px-3 md:px-5 py-2 text-[8px] md:text-[9px] uppercase tracking-widest border transition-all font-sans ${
                  activeSub === sub ? "bg-gold text-black border-gold font-bold" : "border-gold/10 text-bone/40 hover:border-gold/30"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DATA VIEW */}
      <div className="bg-white/[0.01] border border-gold/10">
        <div className="hidden md:block overflow-hidden">
          <table className="w-full text-left text-[11px] uppercase tracking-widest font-sans">
            <thead>
              <tr className="border-b border-gold/10 bg-white/[0.03] text-gold/60">
                <th className="p-6 font-bold">Visual</th>
                <th className="p-6 font-bold">Garment Designation</th>
                <th className="p-6 font-bold">Category</th>
                <th className="p-6 font-bold text-right">Retail Value</th>
                <th className="p-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {loading ? (
                <tr><td colSpan={5} className="p-32 text-center text-gold animate-pulse tracking-[0.5em] font-sans text-[10px]">Accessing Secure Vault...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={5} className="p-32 text-center text-bone/20 italic tracking-widest font-sans uppercase">No assets found in this sector.</td></tr>
              ) : filteredProducts.map((product) => {
                const discount = product.is_on_sale && product.old_price 
                  ? Math.round(((product.old_price - product.price) / product.old_price) * 100) 
                  : 0;

                return (
                  <tr key={product.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-6">
                      <div className="w-14 h-20 bg-black border border-gold/10 overflow-hidden relative group-hover:border-gold/40 transition-all duration-500">
                        <img 
                          src={product.image_url || 'https://via.placeholder.com/300x400'} 
                          alt="" 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        />
                        {product.is_on_sale && (
                          <div className="absolute top-0 left-0 bg-gold text-black text-[7px] font-bold px-1.5 py-0.5">SALE</div>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-bone tracking-widest group-hover:text-gold transition-colors block font-serif italic text-lg">{product.name}</span>
                      <span className="text-[8px] text-bone/20 mt-1 block tracking-tighter">SKU: {product.id.substring(0,8).toUpperCase()}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-gold/80 font-bold text-[9px] uppercase">{product.category}</span>
                        <span className="text-[9px] text-bone/40 lowercase italic font-serif tracking-normal">{product.subcategory}</span>
                      </div>
                    </td>
                    <td className="p-6 text-right font-sans">
                      {product.is_on_sale ? (
                        <div className="flex flex-col items-end">
                          <span className="text-bone/30 text-[9px] line-through decoration-gold/40">${product.old_price}</span>
                          <span className="text-gold font-bold tracking-widest">${product.price}</span>
                          <span className="text-[8px] text-gold/60 mt-1">-{discount}%</span>
                        </div>
                      ) : (
                        <span className="text-bone font-light tracking-widest">${product.price}</span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-6">
                        <Link href={`/admin/products/edit/${product.id}`} className="text-bone/40 hover:text-gold transition-colors text-[9px] font-bold">MODIFY</Link>
                        <button onClick={() => handleDelete(product.id)} className="text-bone/20 hover:text-red-500 transition-colors text-[9px] font-bold">PURGE</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Mobile View Omitted for Brevity - follows same logic as table */}
      </div>
    </div>
  );
}