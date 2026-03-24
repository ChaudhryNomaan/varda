"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '../../../../lib/supabase/client';

export default function HeroSettingsPage() {
  // 1. Stabilize the Supabase client
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [heroData, setHeroData] = useState({
    subtitle: "Digital Archive",
    titleMain: "AETHER",
    titleAccent: "Atelier",
    buttonText: "Explore Archive",
    videoUrl: "",
    fallbackImageUrl: ""
  });

  // 2. Load Hero Data - Dependency array is now stable
  useEffect(() => {
    async function loadHero() {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('content')
          .eq('key', 'hero')
          .single();
        
        if (data) setHeroData(data.content);
      } catch (err) {
        console.error("Error loading archive settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHero();
  }, [supabase]);

  // 3. Optimized Upload Logic (Using existing 'site-assets' bucket)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'videoUrl' | 'fallbackImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const bucketName = 'site-assets'; // Using your existing confirmed bucket

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${field}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setHeroData(prev => ({ ...prev, [field]: urlData.publicUrl }));
      
    } catch (err: any) {
      alert("Upload Error: " + err.message + "\n\nTip: Ensure 'site-assets' bucket has an INSERT policy in Supabase Dashboard.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHeroData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('site_config')
      .upsert({ 
        key: 'hero', 
        content: heroData,
        updated_at: new Date().toISOString() 
      }, { onConflict: 'key' });

    if (!error) {
      alert("AETHER Hero Interface Synchronised.");
    } else {
      alert("Sync Error: " + error.message);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="p-12 text-gold animate-pulse uppercase text-[10px] tracking-widest font-medium">
      Initialising Archive Interface...
    </div>
  );

  return (
    <div className="max-w-5xl animate-in fade-in duration-700">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60">Visual Identity</span>
        <h1 className="text-4xl font-serif italic text-bone mt-2">Hero Interface</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* MEDIA ASSETS */}
        <div className="bg-white/5 p-8 border border-gold/10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-8 pb-2 border-b border-gold/10">Media Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gold/60">Background Video (.mp4)</label>
              <input type="file" accept="video/mp4" onChange={(e) => handleFileUpload(e, 'videoUrl')} className="hidden" id="video-upload" />
              <label htmlFor="video-upload" className="block w-full bg-[#0F0F0F] border border-dashed border-gold/20 p-8 text-gold/40 text-[10px] text-center cursor-pointer hover:border-gold hover:text-gold hover:bg-gold/5 transition-all">
                {uploading ? "Uploading..." : heroData.videoUrl ? "✓ Video Linked" : "Upload MP4 Asset"}
              </label>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gold/60">Fallback Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'fallbackImageUrl')} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="block w-full bg-[#0F0F0F] border border-dashed border-gold/20 p-8 text-gold/40 text-[10px] text-center cursor-pointer hover:border-gold hover:text-gold hover:bg-gold/5 transition-all">
                {uploading ? "Uploading..." : heroData.fallbackImageUrl ? "✓ Image Linked" : "Upload Fallback Asset"}
              </label>
            </div>
          </div>
        </div>

        {/* TYPOGRAPHY */}
        <div className="bg-white/5 p-8 border border-gold/10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Subtitle</label>
            <input name="subtitle" value={heroData.subtitle} onChange={handleChange} className="w-full bg-[#0F0F0F] border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold font-light transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Button Text</label>
            <input name="buttonText" value={heroData.buttonText} onChange={handleChange} className="w-full bg-[#0F0F0F] border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold uppercase tracking-widest" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Main Title (Serif)</label>
            <input name="titleMain" value={heroData.titleMain} onChange={handleChange} className="w-full bg-[#0F0F0F] border border-gold/20 p-3 text-bone text-xl focus:outline-none focus:border-gold font-serif italic" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gold/60">Accent (Sans)</label>
            <input name="titleAccent" value={heroData.titleAccent} onChange={handleChange} className="w-full bg-[#0F0F0F] border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold tracking-[0.3em] uppercase" />
          </div>
        </div>

        <button 
          disabled={saving || uploading}
          type="submit"
          className="w-full bg-gold text-charcoal py-5 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {saving ? 'Syncing Archive...' : 'Save Interface Changes'}
        </button>
      </form>
    </div>
  );
}