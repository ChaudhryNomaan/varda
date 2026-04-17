"use client";
import React, { useState, useRef, useMemo } from 'react';
import { createClient } from '../../../../../lib/supabase/client';
import { useRouter } from 'next/navigation';

// These values MUST match the 'slug' and filter in CategoryClient
const CLASSIFICATION_OPTIONS = [
  { label: "T-shirts & Basics", value: "tshirts" },
  { label: "Archive / Other", value: "archive" }
];

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "OS"];

export default function NewProductPage() {
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("tshirts");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  // Pricing & Sale States
  const [isOnSale, setIsOnSale] = useState(false);
  const [currentPrice, setCurrentPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");

  const [assetFiles, setAssetFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAssetFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeAsset = (index: number) => {
    setAssetFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (assetFiles.length === 0) return alert("Please upload at least one image.");
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const uploadedUrls: string[] = [];
      const bucketName = 'products'; 

      // 1. Upload Media
      for (const file of assetFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file);
        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
        uploadedUrls.push(urlData.publicUrl);
      }

      // 2. Database Insertion
      const { error: dbError } = await supabase.from('products').insert([{
        name: formData.get('name'),
        price: parseFloat(currentPrice),
        old_price: isOnSale ? parseFloat(originalPrice) : null,
        is_on_sale: isOnSale, // Critical for 'sale' page filter
        description: formData.get('description'),
        category: selectedCategory, // Sends 'tshirts' to match CategoryClient filter
        subcategory: "General",
        sizes: selectedSizes,
        images: uploadedUrls,
        stock: 1
      }]);

      if (dbError) throw dbError;

      alert("Product successfully added to the archive.");
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl p-4 md:p-10 mx-auto bg-black min-screen text-bone">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60">Inventory Manager</span>
        <h1 className="text-4xl font-serif italic mt-2">Add New Piece</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white/5 p-8 border border-gold/10">
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Category</label>
            <div className="grid grid-cols-1 gap-2">
              {CLASSIFICATION_OPTIONS.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-3 text-[10px] uppercase tracking-widest border transition-all text-left ${
                    selectedCategory === cat.value 
                      ? "bg-gold text-black border-gold font-bold" 
                      : "border-gold/10 text-bone/40 hover:border-gold/30"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Product Title</label>
            <input required name="name" type="text" placeholder="Name of piece" className="bg-[#111] border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold" />
          </div>

          <div className="pt-4 border-t border-gold/5 space-y-4">
             <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="saleToggle" 
                  checked={isOnSale} 
                  onChange={(e) => setIsOnSale(e.target.checked)}
                  className="w-3 h-3 accent-gold"
                />
                <label htmlFor="saleToggle" className="text-[9px] uppercase tracking-[0.3em] text-gold cursor-pointer">Enable Sale Logic</label>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60">{isOnSale ? "Sale Price" : "Price"}</label>
                  <input required value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} type="number" className="bg-[#111] border border-gold/20 p-3 text-bone text-xs" />
                </div>
                {isOnSale && (
                  <div className="flex flex-col space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-taupe">Regular Price</label>
                    <input required value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} type="number" className="bg-[#111] border border-gold/20 p-3 text-bone/40 text-xs line-through" />
                  </div>
                )}
             </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Description</label>
            <textarea name="description" rows={4} className="bg-[#111] border border-gold/20 p-3 text-bone text-[11px] resize-none" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60 block">Sizing</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map(size => (
                <button key={size} type="button" onClick={() => toggleSize(size)} className={`px-3 py-2 text-[10px] border transition-all ${selectedSizes.includes(size) ? "bg-gold text-black border-gold" : "border-gold/20 text-bone/60"}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60 block">Media Upload</label>
            <div className="grid grid-cols-2 gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="aspect-[3/4] relative bg-[#111] border border-gold/10">
                  <img src={preview.url} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeAsset(index)} className="absolute top-1 right-1 bg-black text-white w-5 h-5 text-[10px]">✕</button>
                </div>
              ))}
              <div onClick={() => fileInputRef.current?.click()} className="aspect-[3/4] bg-[#111] border-2 border-dashed border-gold/20 flex flex-col items-center justify-center cursor-pointer hover:border-gold/40 transition-all">
                <span className="text-xl text-gold/40">+</span>
                <p className="text-[8px] uppercase tracking-widest text-bone/40">Media</p>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
          </div>
        </div>

        <div className="flex flex-col justify-end space-y-4">
          <button disabled={loading} type="submit" className="w-full bg-gold text-black py-5 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white transition-all">
            {loading ? "Saving..." : "Archive Product"}
          </button>
          <button type="button" onClick={() => router.back()} className="w-full border border-gold/20 text-bone/40 py-4 text-[9px] uppercase tracking-[0.4em]">Cancel</button>
        </div>
      </form>
    </div>
  );
}