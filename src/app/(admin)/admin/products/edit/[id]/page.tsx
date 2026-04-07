"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '../../../../../../lib/supabase/client';

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "70B", "75B", "80B", "75C"];

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        alert("Product not found in archive.");
        router.push('/admin/products');
        return;
      }
      
      setFormData({
        ...data,
        sizes: data.sizes || [],
        is_on_sale: data.is_on_sale || false,
        old_price: data.old_price || ""
      });
      setLoading(false);
    }
    fetchProduct();
  }, [id, supabase, router]);

  // Calculate Discount Percentage for visual feedback
  const discountLabel = useMemo(() => {
    if (!formData) return null;
    const cur = parseFloat(formData.price);
    const old = parseFloat(formData.old_price);
    if (formData.is_on_sale && cur && old && old > cur) {
      const pct = Math.round(((old - cur) / old) * 100);
      return `-${pct}% Discount`;
    }
    return null;
  }, [formData]);

  const toggleSize = (size: string) => {
    const currentSizes = formData.sizes || [];
    const updatedSizes = currentSizes.includes(size)
      ? currentSizes.filter((s: string) => s !== size)
      : [...currentSizes, size];
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      const currentImages = formData.images || [];
      setFormData({ ...formData, images: [...currentImages, publicUrl] });
    } catch (err: any) {
      alert("Asset sync failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = formData.images.filter((_: any, i: number) => i !== indexToRemove);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('products')
      .update({
        name: formData.name,
        price: parseFloat(formData.price),
        old_price: formData.is_on_sale ? parseFloat(formData.old_price) : null,
        is_on_sale: formData.is_on_sale,
        description: formData.description,
        images: formData.images,
        sizes: formData.sizes
      })
      .eq('id', id);

    if (!error) {
      router.push('/admin/products');
      router.refresh();
    } else {
      alert("Archive synchronization error: " + error.message);
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-32 text-center text-gold animate-pulse tracking-[0.6em] font-sans text-[10px] uppercase">
      Accessing Secure Archive...
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-32 px-6">
      <div className="border-b border-gold/10 pb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60">Digital Atelier</span>
          <h1 className="text-3xl md:text-5xl font-serif italic text-bone mt-2 tracking-tighter">Edit Piece</h1>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-16">
        {/* IMAGE SECTION */}
        <div className="space-y-6">
          <label className="text-[9px] uppercase tracking-[0.4em] text-gold/40 font-bold">Visual Assets</label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {formData.images?.map((url: string, index: number) => (
              <div key={`img-${url}-${index}`} className="relative aspect-[3/4] bg-white/[0.02] border border-gold/10 group overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <button 
                  type="button" 
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black/80 text-white w-6 h-6 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-20"
                >✕</button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gold text-black text-[7px] uppercase tracking-[0.3em] text-center py-1.5 font-bold">Primary Visual</div>
                )}
              </div>
            ))}
            <label key="upload-trigger" className={`aspect-[3/4] border border-dashed border-gold/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-all group ${uploading ? 'animate-pulse pointer-events-none' : ''}`}>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              <span className="text-gold/40 text-xl font-light group-hover:text-gold">+</span>
              <span className="text-[8px] uppercase tracking-widest text-gold/30 mt-4 text-center px-2">{uploading ? 'Syncing...' : 'Add Archive Image'}</span>
            </label>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div className="space-y-2 md:col-span-2">
            <label className="text-[9px] uppercase tracking-widest text-gold/40 block">Designation</label>
            <input 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-transparent border-b border-gold/10 w-full py-3 text-bone focus:border-gold outline-none transition-all font-serif italic text-2xl"
            />
          </div>

          {/* SALE & PRICING SECTION */}
          <div className="md:col-span-2 pt-6 border-t border-gold/5 space-y-6">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="editSaleToggle" 
                checked={formData.is_on_sale} 
                onChange={(e) => setFormData({...formData, is_on_sale: e.target.checked})}
                className="w-4 h-4 accent-gold bg-charcoal border-gold/20"
              />
              <label htmlFor="editSaleToggle" className="text-[10px] uppercase tracking-[0.3em] text-gold cursor-pointer font-bold">Активировать скидку</label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-gold/40 block">
                  {formData.is_on_sale ? "Цена со скидкой (₽)" : "Valuation (₽)"}
                </label>
                <input 
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="bg-transparent border-b border-gold/10 w-full py-3 text-bone focus:border-gold outline-none transition-all text-xl font-light"
                />
              </div>

              {formData.is_on_sale && (
                <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                  <label className="text-[9px] uppercase tracking-widest text-taupe block">Старая цена (₽)</label>
                  <input 
                    type="number"
                    value={formData.old_price}
                    onChange={(e) => setFormData({...formData, old_price: e.target.value})}
                    className="bg-transparent border-b border-gold/10 w-full py-3 text-bone/40 focus:border-gold outline-none transition-all text-xl font-light line-through"
                  />
                </div>
              )}
            </div>
            {discountLabel && <p className="text-[10px] text-gold italic tracking-[0.2em] font-medium">{discountLabel}</p>}
          </div>

          {/* SIZING SECTION */}
          <div className="md:col-span-2 space-y-4 pt-6">
            <label className="text-[9px] uppercase tracking-widest text-gold/40 block">Available Sizing</label>
            <div className="flex flex-wrap gap-3">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] border transition-all duration-300 ${
                    formData.sizes?.includes(size)
                      ? "bg-gold text-black border-gold font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                      : "border-gold/10 text-bone/40 hover:border-gold/30"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[9px] uppercase tracking-widest text-gold/40 block">Archive Narrative</label>
            <textarea 
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-white/[0.03] border border-gold/10 w-full p-6 text-bone/70 focus:border-gold/40 outline-none transition-all text-[13px] leading-relaxed font-sans resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-gold/5">
          <button 
            type="submit" 
            disabled={saving || uploading}
            className="flex-[2] bg-gold text-black py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-white transition-all disabled:opacity-30 active:scale-[0.98]"
          >
            {saving ? 'Synchronizing...' : 'Confirm Modifications'}
          </button>
          <button 
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-10 border border-gold/20 text-bone/40 text-[10px] uppercase tracking-[0.4em] hover:text-gold hover:border-gold/40 transition-all py-5 sm:py-0"
          >
            Abort
          </button>
        </div>
      </form>
    </div>
  );
}