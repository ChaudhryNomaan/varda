"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '../../../../lib/supabase/client';

const CATEGORY_MAP: Record<string, string[]> = {
  silk: ["Все", "Бюстгальтеры", "Трусики", "Комплекты", "Ночные сорочки"],
  lingerie: ["Все", "Бюстгальтеры", "Трусики", "Пары", "Боди"],
  atelier: ["Все", "Корсеты", "Эксклюзив"]
};

export default function InventoryPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSub, setActiveSub] = useState<string>("Все");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
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
    if (!confirm("Вы уверены, что хотите окончательно удалить это изделие из архива?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchProducts();
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = activeCategory === "all" || product.category === activeCategory;
    const subMatch = activeSub === "Все" || product.subcategory === activeSub;
    const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && subMatch && searchMatch;
  });

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gold/10 pb-6 md:pb-8 gap-4">
        <div>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-gold/60">AETHER Archive</span>
          <h1 className="text-2xl md:text-4xl font-serif italic text-bone mt-2">Inventory Management</h1>
          <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-bone/30 mt-2">
            Total Items in Vault: {filteredProducts.length}
          </p>
        </div>
        <Link href="/admin/products/new" className="w-full sm:w-auto text-center bg-gold text-black px-8 py-3 md:py-4 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all shadow-lg active:scale-95">
          + Add New Piece
        </Link>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white/5 border border-gold/10 p-4 md:p-8 space-y-6 md:space-y-8">
        <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8">
          {/* Main Categories - Scrollable on mobile */}
          <div className="flex gap-6 md:gap-10 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {["all", "silk", "lingerie", "atelier"].map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setActiveSub("Все"); }}
                className={`text-[9px] md:text-[10px] uppercase tracking-[0.4em] transition-all relative pb-2 whitespace-nowrap ${
                  activeCategory === cat ? "text-gold" : "text-bone/30 hover:text-bone/60"
                }`}
              >
                {cat === "all" ? "All Collections" : cat}
                {activeCategory === cat && (
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gold animate-in slide-in-from-left duration-500" />
                )}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative group w-full lg:w-64">
            <input 
              type="text" 
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b border-gold/20 py-2 pl-2 pr-10 text-[10px] uppercase tracking-widest text-bone focus:outline-none focus:border-gold transition-colors w-full"
            />
            <span className="absolute right-2 top-2 opacity-30 group-hover:opacity-100 transition-opacity pointer-events-none">🔍</span>
          </div>
        </div>

        {/* Sub-categories */}
        {activeCategory !== "all" && (
          <div className="flex flex-wrap gap-2 md:gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
            {CATEGORY_MAP[activeCategory].map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSub(sub)}
                className={`px-3 md:px-5 py-2 text-[8px] md:text-[9px] uppercase tracking-widest border transition-all ${
                  activeSub === sub ? "bg-gold text-black border-gold" : "border-gold/10 text-bone/40 hover:border-gold/30"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DATA VIEW */}
      <div className="bg-white/5 border border-gold/10">
        {/* DESKTOP TABLE (Hidden on Mobile) */}
        <div className="hidden md:block overflow-hidden">
          <table className="w-full text-left text-[11px] uppercase tracking-widest">
            <thead>
              <tr className="border-b border-gold/10 bg-white/[0.02] text-gold/60">
                <th className="p-6 font-medium">Visual</th>
                <th className="p-6 font-medium">Designation</th>
                <th className="p-6 font-medium">Category</th>
                <th className="p-6 font-medium text-right">Valuation</th>
                <th className="p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5 font-light">
              {loading ? (
                <tr><td colSpan={5} className="p-32 text-center text-gold animate-pulse tracking-[0.5em]">Syncing Archive...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={5} className="p-32 text-center text-bone/20 italic tracking-widest font-sans uppercase">No pieces found.</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="p-6">
                    <div className="w-14 h-20 bg-black border border-gold/10 overflow-hidden relative group-hover:border-gold/40 transition-colors">
                      <img src={product.images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-bone tracking-widest group-hover:text-gold transition-colors block">{product.name}</span>
                    <span className="text-[8px] text-bone/20 mt-1 block tracking-tighter">ID: {product.id.substring(0,8)}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-gold/80 font-medium">{product.category}</span>
                      <span className="text-[9px] text-bone/40 lowercase italic font-serif">{product.subcategory}</span>
                    </div>
                  </td>
                  <td className="p-6 text-bone text-right font-medium">{product.price.toLocaleString()} ₽</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-6">
                      <Link href={`/admin/products/edit/${product.id}`} className="text-bone/40 hover:text-gold transition-colors text-[10px]">Edit</Link>
                      <button onClick={() => handleDelete(product.id)} className="text-bone/40 hover:text-red-500 transition-colors text-[10px]">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE LIST (Hidden on Desktop) */}
        <div className="md:hidden divide-y divide-gold/10">
          {loading ? (
            <div className="p-20 text-center text-gold animate-pulse text-[10px] tracking-widest uppercase">Syncing...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-20 text-center text-bone/20 text-[10px] tracking-widest uppercase">No pieces found.</div>
          ) : filteredProducts.map((product) => (
            <div key={product.id} className="p-4 flex gap-4 items-center">
              <div className="w-16 h-20 flex-shrink-0 bg-black border border-gold/10 overflow-hidden">
                <img src={product.images?.[0] || 'https://via.placeholder.com/300x400?text=No+Image'} alt="" className="w-full h-full object-cover grayscale" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-gold text-[11px] tracking-widest truncate">{product.name}</h3>
                <p className="text-bone/40 text-[9px] uppercase tracking-tighter mt-1">{product.category} / {product.subcategory}</p>
                <p className="text-bone text-[10px] mt-1 font-bold">{product.price.toLocaleString()} ₽</p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href={`/admin/products/edit/${product.id}`} className="text-gold border border-gold/20 px-3 py-1 text-[8px] uppercase tracking-widest">Edit</Link>
                <button onClick={() => handleDelete(product.id)} className="text-red-500/60 text-[8px] uppercase tracking-widest">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}