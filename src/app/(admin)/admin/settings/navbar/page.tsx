"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../../lib/supabase/client';

export default function NavbarSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [navbarData, setNavbarData] = useState({
    logoMain: "AETHER",
    logoAccent: "STUDIO",
    links: [
      { name: 'Коллекции', href: '/collections' },
      { name: 'Белье', href: '/collections/lingerie' },
      { name: 'Шелк', href: '/collections/silk' },
      { name: 'Atelier', href: '/collections/atelier' },
    ]
  });

  // 1. Fetch current settings on load
  useEffect(() => {
    async function loadNavbar() {
      const { data } = await supabase
        .from('site_config')
        .select('content')
        .eq('key', 'navbar')
        .single();

      if (data) setNavbarData(data.content);
      setLoading(false);
    }
    loadNavbar();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNavbarData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index: number, field: 'name' | 'href', value: string) => {
    const newLinks = [...navbarData.links];
    newLinks[index][field] = value;
    setNavbarData(prev => ({ ...prev, links: newLinks }));
  };

  // 2. Save/Upsert to Supabase
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
      alert("Ошибка: " + error.message);
    } else {
      alert("Навигация успешно синхронизирована");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-gold animate-pulse text-[10px] tracking-widest uppercase">Загрузка интерфейса...</div>;

  return (
    <div className="max-w-5xl">
      <div className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.5em] text-gold/60">Интерфейс</span>
        <h1 className="text-4xl font-serif italic text-bone mt-2">Настройки Навигации</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* LOGO SETTINGS */}
        <div className="bg-white/5 p-8 border border-gold/10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-6 pb-2 border-b border-gold/10">Логотип</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gold/60">Основное имя (Serif)</label>
              <input 
                name="logoMain"
                value={navbarData.logoMain}
                onChange={handleLogoChange}
                className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold font-serif italic"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-gold/60">Акцент (Sans)</label>
              <input 
                name="logoAccent"
                value={navbarData.logoAccent}
                onChange={handleLogoChange}
                className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-xs focus:outline-none focus:border-gold tracking-[0.3em]"
              />
            </div>
          </div>
        </div>

        {/* MENU LINKS */}
        <div className="bg-white/5 p-8 border border-gold/10">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-6 pb-2 border-b border-gold/10">Ссылки меню</h2>
          <div className="space-y-4">
            {navbarData.links.map((link, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-widest text-gold/40">Название {index + 1}</label>
                  <input 
                    value={link.name}
                    onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                    className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-[10px] focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-widest text-gold/40">Путь (URL)</label>
                  <input 
                    value={link.href}
                    onChange={(e) => handleLinkChange(index, 'href', e.target.value)}
                    className="w-full bg-charcoal border border-gold/20 p-3 text-bone text-[10px] focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={saving}
          className="w-full bg-gold text-charcoal py-5 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-white transition-all shadow-xl disabled:opacity-50"
        >
          {saving ? "Синхронизация..." : "Сохранить изменения"}
        </button>
      </form>
    </div>
  );
}