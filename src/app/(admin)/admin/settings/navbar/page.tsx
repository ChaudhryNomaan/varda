"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../../lib/supabase/client';

export default function NavbarSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [navbarData, setNavbarData] = useState({
    logoMain: "varda",
    logoAccent: "STUDIO",
    links: [
      { name: 'Sale', href: '/collections/sale' },
      { name: 'Футболки', href: '/collections/tshirts' },
    ]
  });

  useEffect(() => {
    async function loadNavbar() {
      try {
        const { data } = await supabase
          .from('site_config')
          .select('content')
          .eq('key', 'navbar')
          .single();

        if (data && data.content) {
          setNavbarData(data.content);
        }
      } catch (err) {
        console.error("Failed to load navbar config:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNavbar();
  }, [supabase]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNavbarData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index: number, field: 'name' | 'href', value: string) => {
    const newLinks = [...navbarData.links];
    newLinks[index][field] = value;
    setNavbarData(prev => ({ ...prev, links: newLinks }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('site_config')
      .upsert({ 
        key: 'navbar', 
        content: navbarData,
        updated_at: new Date().toISOString() 
      }, { onConflict: 'key' });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("varda Navigation successfully synchronized.");
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="p-20 bg-[#0A0A0A] min-h-screen flex items-center justify-center text-gold animate-pulse text-[10px] tracking-[0.8em] uppercase">
      Initialising Interface...
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 bg-[#0A0A0A] min-h-screen text-bone pb-40">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60 font-bold">Studio Interface</span>
        <h1 className="text-4xl font-serif italic text-gold mt-2">Navigation Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* LOGO SETTINGS */}
        <div className="bg-white/5 p-8 border border-gold/10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-6 pb-2 border-b border-gold/10">Brand Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gold/60">Primary Brand (Serif)</label>
              <input 
                name="logoMain"
                value={navbarData.logoMain}
                onChange={handleLogoChange}
                className="w-full bg-[#0F0F0F] border border-gold/20 p-3 text-gold text-xs focus:outline-none focus:border-gold font-serif italic"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gold/60">Accent Tag (Sans)</label>
              <input 
                name="logoAccent"
                value={navbarData.logoAccent}
                onChange={handleLogoChange}
                className="w-full bg-[#0F0F0F] border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold tracking-[0.3em]"
              />
            </div>
          </div>
        </div>

        {/* MENU LINKS */}
        <div className="bg-white/5 p-8 border border-gold/10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-6 pb-2 border-b border-gold/10">Core Editorial Links</h2>
          <div className="space-y-6">
            {navbarData.links.map((link, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border-b border-white/5 pb-6 last:border-0">
                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-widest text-gold/40">Link Label {index + 1}</label>
                  <input 
                    value={link.name}
                    onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-gold/10 p-3 text-bone text-[10px] focus:outline-none focus:border-gold transition-colors font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-widest text-gold/40">Destination Path (URL)</label>
                  <input 
                    value={link.href}
                    onChange={(e) => handleLinkChange(index, 'href', e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-gold/10 p-3 text-gold/60 font-mono text-[10px] focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={saving}
          className="w-full bg-gold text-black py-5 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white transition-all shadow-2xl disabled:opacity-50"
        >
          {saving ? "Syncing Vault..." : "Confirm & Synchronize Navigation"}
        </button>
      </form>
    </div>
  );
}