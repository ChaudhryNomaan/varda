"use client";
import React, { useState, useRef } from 'react';
import { createClient } from '../../../../../lib/supabase/client';
import { useRouter } from 'next/navigation';

const CATEGORY_MAP = {
  silk: ["Бюстгальтеры", "Трусики", "Комплекты", "Ночные сорочки"],
  lingerie: ["Бюстгальтеры", "Трусики", "Пары", "Боди"],
  atelier: ["Корсеты", "Эксклюзив"]
};

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "70B", "75B", "80B", "75C"];

export default function NewProductPage() {
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<keyof typeof CATEGORY_MAP>("silk");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  // Multi-asset state
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
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const uploadedUrls: string[] = [];
      const bucketName = 'products'; 

      // 1. MULTI-ASSET UPLOAD
      for (const file of assetFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file);

        if (uploadError) throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
        
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);
        
        uploadedUrls.push(urlData.publicUrl);
      }

      // 2. Insert into Database
      const { error: dbError } = await supabase.from('products').insert([{
        name: formData.get('name'),
        price: parseFloat(formData.get('price') as string),
        description: formData.get('description'),
        category: category,
        subcategory: formData.get('subcategory'),
        sizes: selectedSizes,
        images: uploadedUrls, // Array of URLs
        stock: 1
      }]);

      if (dbError) throw dbError;

      alert("Архив успешно обновлен!");
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      console.error("Critical Error:", err);
      alert(`Ошибка: ${err.message || "Internal Server Error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl p-4 md:p-10">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60">Inventory Archive</span>
        <h1 className="text-4xl font-serif italic text-bone mt-2">Новое Изделие</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white/5 p-10 border border-gold/10">
        <div className="space-y-6">
          {/* Category, Name, Price, Description fields remain the same */}
          <div className="flex flex-col space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Основная Коллекция</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold appearance-none">
              <option value="silk">Silk</option>
              <option value="lingerie">Lingerie</option>
              <option value="atelier">Atelier</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Подкатегория</label>
            <select name="subcategory" className="bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold appearance-none">
              {CATEGORY_MAP[category].map(sub => (<option key={sub} value={sub}>{sub}</option>))}
            </select>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Название</label>
            <input required name="name" type="text" placeholder="AETHER Piece Name" className="bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold" />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Цена (₽)</label>
            <input required name="price" type="number" placeholder="0.00" className="bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold" />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60">Описание</label>
            <textarea name="description" rows={5} placeholder="Describe the material and fit..." className="bg-charcoal border border-gold/20 p-3 text-bone text-[11px] leading-relaxed focus:outline-none focus:border-gold resize-none" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60 block">Доступные размеры</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map(size => (
                <button key={size} type="button" onClick={() => toggleSize(size)} className={`px-3 py-2 text-[10px] border transition-all ${selectedSizes.includes(size) ? "bg-gold text-charcoal border-gold" : "border-gold/20 text-bone/60 hover:border-gold/50"}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] uppercase tracking-[0.3em] text-gold/60 block">Медиа-активы (Фото/Видео)</label>
            
            {/* Asset Gallery */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {previews.map((preview, index) => (
                <div key={index} className="aspect-[3/4] relative bg-charcoal border border-gold/10 group">
                  {preview.type.startsWith('video') ? (
                    <video src={preview.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                  )}
                  <button 
                    type="button" 
                    onClick={() => removeAsset(index)}
                    className="absolute top-1 right-1 bg-black/50 text-white w-5 h-5 text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {/* Add More Button */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] bg-charcoal border-2 border-dashed border-gold/20 flex flex-col items-center justify-center cursor-pointer hover:border-gold/40 transition-all group"
              >
                <span className="text-2xl text-gold/20 font-light">+</span>
                <p className="text-[8px] uppercase tracking-widest text-bone/40 group-hover:text-gold">Add Media</p>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,video/*" 
              multiple 
            />
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-8">
          <div className="bg-gold/5 border border-gold/10 p-8 space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-gold">Archive Standards</h3>
            <ul className="text-[10px] text-bone/60 space-y-4 leading-relaxed">
              <li className="flex gap-3"><span className="text-gold">•</span><span>Multiple assets allowed.</span></li>
              <li className="flex gap-3"><span className="text-gold">•</span><span>Videos supported (MP4/MOV).</span></li>
              <li className="flex gap-3"><span className="text-gold">•</span><span>First asset will be the cover.</span></li>
            </ul>
          </div>

          <div className="space-y-4">
            <button disabled={loading || assetFiles.length === 0} type="submit" className="w-full bg-gold text-charcoal py-5 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white transition-all shadow-xl disabled:opacity-50">
              {loading ? "Archiving Assets..." : "Сохранить в Архив"}
            </button>
            <button type="button" onClick={() => router.back()} className="w-full border border-gold/20 text-bone/40 py-4 text-[9px] uppercase tracking-[0.4em] hover:text-red-400 hover:border-red-400/20 transition-all">Отмена</button>
          </div>
        </div>
      </form>
    </div>
  );
}